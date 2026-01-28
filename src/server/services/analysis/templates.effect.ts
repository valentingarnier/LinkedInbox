/**
 * Template Analysis Service
 * 
 * Identifies opener message patterns, clusters similar messages,
 * and calculates performance metrics per template.
 */

import { Effect } from "effect";
import OpenAI from "openai";
import { mutate, query } from "@/server/effect";
import { LLMError, LLMConfigError, DatabaseError } from "@/server/effect/errors";
import { getTemplateLabelingPrompt } from "./prompts";
import type { Conversation, Message, MessageTemplate } from "@/lib/supabase/types";

// Types
interface OpenerData {
  conversationId: string;
  content: string;
  embedding?: number[];
  prospectStatus: string | null;
  engagementRate: number | null;
  hasResponse: boolean;
}

interface Cluster {
  id: string;
  openers: OpenerData[];
  label?: string;
  description?: string;
  patternExample?: string;
}

interface TemplateMetrics {
  clusterId: string;
  label: string;
  description: string | null;
  patternExample: string | null;
  conversationCount: number;
  responseRate: number;
  interestRate: number;
  ghostRate: number;
  avgEngagement: number;
}

// Constants
const SIMILARITY_THRESHOLD = 0.82; // Cosine similarity threshold for clustering
const MIN_CLUSTER_SIZE = 3; // Minimum conversations per template

/**
 * Get OpenAI client
 */
const getOpenAIClient = () =>
  Effect.gen(function* () {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return yield* Effect.fail(
        new LLMConfigError({ message: "OPENAI_API_KEY not configured" })
      );
    }
    return new OpenAI({ apiKey });
  });

/**
 * Generate embeddings for a batch of texts
 */
const generateEmbeddings = (texts: string[]) =>
  Effect.gen(function* () {
    const client = yield* getOpenAIClient();
    
    // Process in batches of 100 (OpenAI limit)
    const batchSize = 100;
    const allEmbeddings: number[][] = [];
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const response = yield* Effect.tryPromise({
        try: () =>
          client.embeddings.create({
            model: "text-embedding-3-small",
            input: batch,
          }),
        catch: (error) =>
          new LLMError({ message: "Failed to generate embeddings", cause: error }),
      });
      
      allEmbeddings.push(...response.data.map((d) => d.embedding));
    }
    
    return allEmbeddings;
  });

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Cluster openers using greedy clustering based on cosine similarity
 */
function clusterOpeners(openers: OpenerData[]): Cluster[] {
  const clusters: Cluster[] = [];
  const assigned = new Set<number>();
  
  for (let i = 0; i < openers.length; i++) {
    if (assigned.has(i)) continue;
    if (!openers[i].embedding) continue;
    
    // Start a new cluster
    const cluster: Cluster = {
      id: `cluster_${clusters.length}`,
      openers: [openers[i]],
    };
    assigned.add(i);
    
    // Find similar openers
    for (let j = i + 1; j < openers.length; j++) {
      if (assigned.has(j)) continue;
      if (!openers[j].embedding) continue;
      
      const similarity = cosineSimilarity(
        openers[i].embedding!,
        openers[j].embedding!
      );
      
      if (similarity >= SIMILARITY_THRESHOLD) {
        cluster.openers.push(openers[j]);
        assigned.add(j);
      }
    }
    
    clusters.push(cluster);
  }
  
  return clusters;
}

/**
 * Use LLM to label a cluster of similar openers
 */
const labelCluster = (cluster: Cluster) =>
  Effect.gen(function* () {
    const client = yield* getOpenAIClient();
    
    // Take up to 5 examples for the prompt
    const examples = cluster.openers.slice(0, 5).map((o) => o.content);
    const prompt = getTemplateLabelingPrompt(examples);

    const response = yield* Effect.tryPromise({
      try: () =>
        client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.3,
        }),
      catch: (error) =>
        new LLMError({ message: "Failed to label cluster", cause: error }),
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { label: "Unknown Pattern", description: null, pattern: null };
    }

    try {
      const parsed = JSON.parse(content);
      return {
        label: parsed.label || "Unknown Pattern",
        description: parsed.description || null,
        pattern: parsed.pattern || null,
      };
    } catch {
      return { label: "Unknown Pattern", description: null, pattern: null };
    }
  });

/**
 * Calculate metrics for a cluster
 */
function calculateClusterMetrics(cluster: Cluster): Omit<TemplateMetrics, "label" | "description" | "patternExample"> {
  const openers = cluster.openers;
  const count = openers.length;
  
  // Response rate: % that got any reply
  const responseCount = openers.filter((o) => o.hasResponse).length;
  const responseRate = count > 0 ? (responseCount / count) * 100 : 0;
  
  // Interest rate: % interested or meeting_scheduled
  const interestStatuses = ["interested", "meeting_scheduled"];
  const interestCount = openers.filter(
    (o) => o.prospectStatus && interestStatuses.includes(o.prospectStatus)
  ).length;
  const interestRate = count > 0 ? (interestCount / count) * 100 : 0;
  
  // Ghost rate: % that were ghosted
  const ghostCount = openers.filter((o) => o.prospectStatus === "ghosted").length;
  const ghostRate = count > 0 ? (ghostCount / count) * 100 : 0;
  
  // Average engagement
  const engagementRates = openers
    .filter((o) => o.engagementRate != null)
    .map((o) => o.engagementRate!);
  const avgEngagement =
    engagementRates.length > 0
      ? engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length
      : 0;
  
  return {
    clusterId: cluster.id,
    conversationCount: count,
    responseRate,
    interestRate,
    ghostRate,
    avgEngagement,
  };
}

/**
 * Main function: Analyze message templates
 */
export const analyzeTemplates = (userId: string, userName: string) =>
  Effect.gen(function* () {
    console.log("[Templates] Starting template analysis for user:", userId);
    
    // Step 1: Get all cold outreach conversations
    console.log("[Templates] Step 1: Fetching cold outreach conversations...");
    const conversations = yield* query<Conversation[]>((client) =>
      client
        .from("conversations")
        .select("*")
        .eq("user_id", userId)
        .eq("is_cold_outreach", true)
        .eq("analysis_status", "completed")
        .range(0, 9999)
    );

    console.log("[Templates] Found conversations:", conversations?.length ?? 0);

    if (!conversations || conversations.length === 0) {
      console.log("[Templates] No conversations found, exiting");
      return [];
    }

    // Step 2: Get first message for each conversation (batch to avoid query limits)
    console.log("[Templates] Step 2: Fetching messages for", conversations.length, "conversations...");
    const conversationIds = conversations.map((c) => c.id);
    
    // Fetch messages in batches of 100 to avoid .in() query size limits
    const BATCH_SIZE = 100;
    const allMessages: Message[] = [];
    
    for (let i = 0; i < conversationIds.length; i += BATCH_SIZE) {
      const batchIds = conversationIds.slice(i, i + BATCH_SIZE);
      console.log("[Templates] Fetching messages batch", Math.floor(i / BATCH_SIZE) + 1, "of", Math.ceil(conversationIds.length / BATCH_SIZE));
      const batchMessages = yield* Effect.catchAll(
        query<Message[]>((client) =>
          client
            .from("messages")
            .select("*")
            .in("conversation_id", batchIds)
            .order("sent_at", { ascending: true })
        ),
        (error) => {
          console.error("[Templates] Failed to fetch messages batch:", error);
          return Effect.succeed([] as Message[]);
        }
      );
      allMessages.push(...(batchMessages || []));
    }
    console.log("[Templates] Total messages fetched:", allMessages.length);

    // Group messages by conversation and get first message
    const messagesByConv = new Map<string, Message[]>();
    for (const msg of allMessages || []) {
      const existing = messagesByConv.get(msg.conversation_id) || [];
      existing.push(msg);
      messagesByConv.set(msg.conversation_id, existing);
    }

    // Extract openers (first message sent by user)
    const normalizedUserName = userName.toLowerCase().trim();
    const openers: OpenerData[] = [];

    for (const conv of conversations) {
      const messages = messagesByConv.get(conv.id) || [];
      if (messages.length === 0) continue;
      
      // Sort by date and get first
      messages.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
      const firstMessage = messages[0];
      
      // Check if user sent the first message
      const senderNormalized = firstMessage.sender.toLowerCase().trim();
      const isUserMessage = 
        senderNormalized.includes(normalizedUserName) ||
        normalizedUserName.includes(senderNormalized);
      
      if (!isUserMessage) continue;
      
      // Skip very short messages (likely not real openers)
      if (firstMessage.content.length < 50) continue;

      openers.push({
        conversationId: conv.id,
        content: firstMessage.content,
        prospectStatus: conv.prospect_status,
        engagementRate: conv.engagement_rate,
        hasResponse: conv.total_messages_received > 0,
      });
    }

    console.log("[Templates] Extracted openers:", openers.length);

    if (openers.length < MIN_CLUSTER_SIZE) {
      console.log("[Templates] Not enough openers (need", MIN_CLUSTER_SIZE, "), exiting");
      return [];
    }

    // Step 3: Generate embeddings for all openers
    console.log("[Templates] Step 3: Generating embeddings for", openers.length, "openers...");
    const texts = openers.map((o) => o.content.substring(0, 1000)); // Limit length
    const embeddings = yield* generateEmbeddings(texts);
    console.log("[Templates] Embeddings generated:", embeddings.length);
    
    // Attach embeddings to openers
    for (let i = 0; i < openers.length; i++) {
      openers[i].embedding = embeddings[i];
    }

    // Step 4: Cluster openers
    console.log("[Templates] Step 4: Clustering openers...");
    const clusters = clusterOpeners(openers);
    console.log("[Templates] Total clusters found:", clusters.length);
    
    // Filter to clusters with at least MIN_CLUSTER_SIZE conversations
    const significantClusters = clusters.filter(
      (c) => c.openers.length >= MIN_CLUSTER_SIZE
    );
    console.log("[Templates] Significant clusters (>=", MIN_CLUSTER_SIZE, "openers):", significantClusters.length);

    if (significantClusters.length === 0) {
      console.log("[Templates] No significant clusters found, exiting");
      return [];
    }

    // Step 5: Label clusters with LLM
    console.log("[Templates] Step 5: Labeling", significantClusters.length, "clusters with LLM...");
    const templateMetrics: TemplateMetrics[] = [];
    
    for (let i = 0; i < significantClusters.length; i++) {
      const cluster = significantClusters[i];
      console.log("[Templates] Labeling cluster", i + 1, "of", significantClusters.length, "(", cluster.openers.length, "openers)");
      const labelResult = yield* labelCluster(cluster);
      const metrics = calculateClusterMetrics(cluster);
      
      templateMetrics.push({
        ...metrics,
        label: labelResult.label,
        description: labelResult.description,
        patternExample: labelResult.pattern,
      });
      console.log("[Templates] Cluster labeled:", labelResult.label);
    }

    // Step 6: Save to database
    console.log("[Templates] Step 6: Saving", templateMetrics.length, "templates to database...");
    
    // First, delete existing templates for this user
    console.log("[Templates] Deleting existing templates...");
    const deleteResult = yield* Effect.catchAll(
      mutate((client) =>
        client
          .from("message_templates")
          .delete()
          .eq("user_id", userId)
      ),
      (error) => {
        console.error("[Templates] Failed to delete existing templates:", JSON.stringify(error));
        return Effect.succeed(null);
      }
    );
    console.log("[Templates] Delete result:", deleteResult);

    // Insert new templates
    for (let i = 0; i < templateMetrics.length; i++) {
      const template = templateMetrics[i];
      console.log("[Templates] Inserting template", i + 1, ":", template.label);
      console.log("[Templates] Template data:", JSON.stringify({
        user_id: userId,
        cluster_id: template.clusterId,
        label: template.label,
        conversation_count: template.conversationCount,
        response_rate: Math.round(template.responseRate * 100) / 100,
        interest_rate: Math.round(template.interestRate * 100) / 100,
        ghost_rate: Math.round(template.ghostRate * 100) / 100,
        avg_engagement: Math.round(template.avgEngagement * 100) / 100,
      }));
      
      const insertResult = yield* Effect.catchAll(
        mutate((client) =>
          client.from("message_templates").insert({
            user_id: userId,
            cluster_id: template.clusterId,
            label: template.label,
            description: template.description,
            pattern_example: template.patternExample,
            conversation_count: template.conversationCount,
            response_rate: Math.round(template.responseRate * 100) / 100,
            interest_rate: Math.round(template.interestRate * 100) / 100,
            ghost_rate: Math.round(template.ghostRate * 100) / 100,
            avg_engagement: Math.round(template.avgEngagement * 100) / 100,
          })
        ),
        (error) => {
          console.error("[Templates] Failed to insert template:", template.label, JSON.stringify(error));
          return Effect.succeed(null);
        }
      );
      console.log("[Templates] Insert result:", insertResult);
    }

    // Step 7: Update conversations with cluster IDs (batch to avoid query limits)
    for (const cluster of significantClusters) {
      const convIds = cluster.openers.map((o) => o.conversationId);
      
      // Batch updates in groups of 100 to avoid query size limits
      const batchSize = 100;
      for (let i = 0; i < convIds.length; i += batchSize) {
        const batch = convIds.slice(i, i + batchSize);
        yield* Effect.catchAll(
          mutate((client) =>
            client
              .from("conversations")
              .update({ template_cluster_id: cluster.id })
              .in("id", batch)
          ),
          (error) => {
            console.error("[Templates] Failed to update conversations with cluster:", cluster.id, error);
            return Effect.succeed(null);
          }
        );
      }
    }

    // Sort by interest rate descending
    templateMetrics.sort((a, b) => b.interestRate - a.interestRate);

    return templateMetrics;
  });

/**
 * Get saved template analytics for a user
 */
export const getTemplateAnalytics = (userId: string) =>
  Effect.gen(function* () {
    const templates = yield* query<MessageTemplate[]>((client) =>
      client
        .from("message_templates")
        .select("*")
        .eq("user_id", userId)
        .order("interest_rate", { ascending: false })
    );

    return templates || [];
  });
