import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  ColdOutreachClassificationSchema,
  ProspectStatusSchema,
  OutreachScoreSchema,
  type ColdOutreachClassificationResult,
  type ProspectStatusResult,
  type OutreachScoreResult,
} from "./schemas";

const COLD_OUTREACH_CLASSIFICATION_PROMPT = `You are an expert at analyzing LinkedIn conversations.
Determine if this conversation represents a COLD OUTREACH attempt by the user (marked as [ME]).

CRITICAL: Look at the FIRST message in the conversation to determine who initiated contact.

A conversation IS cold outreach ONLY if ALL of these are true:
1. [ME] sent the FIRST message (I initiated the conversation)
2. The purpose is sales, business development, partnership, or pitching a product/service
3. I'm reaching out to someone I don't appear to know personally

A conversation is NOT cold outreach if ANY of these are true:
- [PROSPECT] sent the first message (they reached out to me - this is INBOUND, not cold outreach)
- It's a personal conversation with friends or family
- It's networking with people I already know
- It's about job applications, recruiting, or hiring (either direction)
- It's casual social chatting, congratulations, or catching up
- It's about events, webinars, or content sharing without sales intent
- Someone is selling TO me (I'm the prospect, not them)

IMPORTANT: If [PROSPECT] sent the first message, return is_cold_outreach: false regardless of content.
Be strict: only classify as cold outreach if I clearly initiated a sales/business development conversation.`;

const PROSPECT_STATUS_PROMPT = `You are an expert at analyzing LinkedIn sales conversations from the SELLER's perspective.
[ME] is the seller doing cold outreach. [PROSPECT] is the person I'm reaching out to.

Your task: Determine how the PROSPECT has responded to MY outreach.

CRITICAL RULES:
- Only analyze [PROSPECT]'s messages and behavior, NOT [ME]'s messages
- "Interested" means the PROSPECT showed interest in what I'm offering
- If the PROSPECT never sent any message, that's "no_response"
- If the PROSPECT replied once then stopped responding to my follow-ups, that's "ghosted"

Status definitions (based on PROSPECT's behavior):
- no_response: I sent messages but [PROSPECT] never replied at all (0 messages from them)
- engaged: Active back-and-forth - [PROSPECT] is responding and conversation is ongoing
- interested: [PROSPECT] showed positive signals about MY offer - asking questions, wanting to learn more
- meeting_scheduled: [PROSPECT] agreed to a meeting, demo, or call
- not_interested: [PROSPECT] explicitly declined or said they're not interested
- wrong_person: [PROSPECT] said they're not the right contact or redirected me
- ghosted: [PROSPECT] replied at least once before, but stopped responding (I sent 2+ messages with no reply after they had engaged)
- closed: Conversation reached a natural end (deal done, or definitively concluded)

Look at the LAST few messages: if I ([ME]) sent multiple messages and [PROSPECT] hasn't replied, that's likely "ghosted" or "no_response".
Be precise. Base your decision ONLY on [PROSPECT]'s actual messages and responses.`;

const OUTREACH_QUALITY_PROMPT = `You are an expert at analyzing LinkedIn cold outreach messages.
Score the outreach quality based on industry best practices for LinkedIn prospecting.

Scoring criteria (0-100 for each):
- Personalization: Did they research the prospect? Mention specific details about them or their company?
- Value Proposition: Is it clear what value they're offering? Why should the prospect care?
- Call to Action: Is there a clear, low-friction next step? Is it easy to say yes to?
- Tone: Is it professional but human? Not too salesy or robotic?
- Brevity: Is it concise and respectful of their time? (Ideal: 50-150 words for first message)
- Originality: Does it feel genuine or like a mass template? Any creative hooks?

Be critical but fair. Most cold outreach scores 40-60. Only exceptional outreach gets 80+.
Provide specific, actionable improvement suggestions.`;

/**
 * Creates an OpenAI model instance
 */
function getModel() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  return new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
    openAIApiKey: apiKey,
  });
}

/**
 * Formats conversation messages for LLM analysis
 */
function formatConversation(
  messages: Array<{ sender: string; content: string }>,
  userName: string
): string {
  return messages
    .map((m) => {
      const isUser = m.sender.toLowerCase() === userName.toLowerCase();
      return `[${isUser ? "ME" : "PROSPECT"}] ${m.content}`;
    })
    .join("\n\n");
}

/**
 * Classifies if a conversation is cold outreach
 */
export async function classifyColdOutreach(
  messages: Array<{ sender: string; content: string }>,
  userName: string
): Promise<ColdOutreachClassificationResult> {
  const model = getModel().withStructuredOutput(ColdOutreachClassificationSchema);
  const conversationText = formatConversation(messages, userName);

  const response = await model.invoke([
    new SystemMessage(COLD_OUTREACH_CLASSIFICATION_PROMPT),
    new HumanMessage(`Classify this LinkedIn conversation:\n\n${conversationText}`),
  ]);

  return response;
}

/**
 * Analyzes prospect status using LLM with structured output
 */
export async function analyzeProspectStatus(
  messages: Array<{ sender: string; content: string; date: string }>,
  userName: string
): Promise<ProspectStatusResult> {
  const model = getModel().withStructuredOutput(ProspectStatusSchema);
  const conversationText = formatConversation(messages, userName);

  const response = await model.invoke([
    new SystemMessage(PROSPECT_STATUS_PROMPT),
    new HumanMessage(`Analyze this LinkedIn conversation:\n\n${conversationText}`),
  ]);

  return response;
}

/**
 * Analyzes cold outreach quality using LLM with structured output
 */
export async function analyzeOutreachQuality(
  messages: Array<{ sender: string; content: string }>,
  userName: string
): Promise<OutreachScoreResult> {
  const outreachMessages = messages
    .filter((m) => m.sender.toLowerCase() === userName.toLowerCase())
    .slice(0, 3);

  if (outreachMessages.length === 0) {
    return {
      overall_score: 0,
      dimensions: {
        personalization: 0,
        value_proposition: 0,
        call_to_action: 0,
        tone: 0,
        brevity: 0,
        originality: 0,
      },
      feedback: "No outreach messages from user found in this conversation.",
      improvement_suggestions: [],
    };
  }

  const model = getModel().withStructuredOutput(OutreachScoreSchema);
  const outreachText = outreachMessages.map((m) => m.content).join("\n\n---\n\n");

  const response = await model.invoke([
    new SystemMessage(OUTREACH_QUALITY_PROMPT),
    new HumanMessage(`Analyze this LinkedIn cold outreach:\n\n${outreachText}`),
  ]);

  return response;
}

export type ProgressCallback = (
  processed: number,
  total: number,
  stage: "classifying" | "analyzing"
) => Promise<void>;

/**
 * Batch analyzes multiple conversations in parallel
 * First classifies cold outreach, then only fully analyzes cold outreach conversations
 */
export async function batchAnalyzeConversations(
  conversations: Array<{
    id: string;
    messages: Array<{ sender: string; content: string; date: string }>;
    userName: string;
  }>,
  batchSize: number = 10,
  onProgress?: ProgressCallback
): Promise<Array<{
  id: string;
  isColdOutreach: boolean;
  coldOutreachReasoning: string;
  prospectStatus: ProspectStatusResult | null;
  outreachScore: OutreachScoreResult | null;
}>> {
  const results: Array<{
    id: string;
    isColdOutreach: boolean;
    coldOutreachReasoning: string;
    prospectStatus: ProspectStatusResult | null;
    outreachScore: OutreachScoreResult | null;
  }> = [];

  let processedCount = 0;
  const total = conversations.length;

  for (let i = 0; i < conversations.length; i += batchSize) {
    const batch = conversations.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (conv) => {
        // Report classifying progress
        processedCount++;
        if (onProgress) {
          await onProgress(processedCount, total, "classifying");
        }

        // First, classify if it's cold outreach
        const classification = await classifyColdOutreach(conv.messages, conv.userName);

        // Only do full analysis if it's cold outreach
        if (!classification.is_cold_outreach) {
          return {
            id: conv.id,
            isColdOutreach: false,
            coldOutreachReasoning: classification.reasoning,
            prospectStatus: null,
            outreachScore: null,
          };
        }

        // Report analyzing progress for cold outreach
        if (onProgress) {
          await onProgress(processedCount, total, "analyzing");
        }

        // Full analysis for cold outreach
        const [prospectStatus, outreachScore] = await Promise.all([
          analyzeProspectStatus(conv.messages, conv.userName),
          analyzeOutreachQuality(conv.messages, conv.userName),
        ]);

        return {
          id: conv.id,
          isColdOutreach: true,
          coldOutreachReasoning: classification.reasoning,
          prospectStatus,
          outreachScore,
        };
      })
    );

    results.push(...batchResults);
  }

  return results;
}
