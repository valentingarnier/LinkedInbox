import { Effect, Array as Arr } from "effect";
import { SupabaseService, query, mutate } from "@/server/effect";
import { DatabaseError, AnalysisError } from "@/server/effect/errors";
import { LLMService } from "./llm.effect";
import { computeBasicMetrics, computeGlobalAnalytics, getHotProspects } from "./metrics.service";
import type { Message, Profile } from "@/lib/supabase/types";
import type { ProspectStatusResult, OutreachScoreResult } from "./schemas";

// ============================================================================
// Types
// ============================================================================

interface ConversationToAnalyze {
  id: string;
  messages: Array<{ sender: string; content: string; date: string }>;
  userName: string;
}

interface AnalysisResult {
  id: string;
  isColdOutreach: boolean;
  coldOutreachReasoning: string;
  prospectStatus: ProspectStatusResult | null;
  outreachScore: OutreachScoreResult | null;
}

type AnalysisStage = 
  | "preparing" 
  | "computing_metrics" 
  | "classifying_outreach" 
  | "analyzing_prospects" 
  | "computing_global"
  | "analyzing_templates"
  | "complete";

// ============================================================================
// Progress Tracking
// ============================================================================

export const updateProgress = (
  userId: string,
  stage: AnalysisStage,
  progress?: number,
  total?: number
) =>
  mutate((client) =>
    client.from("analytics_summary").upsert(
      {
        user_id: userId,
        analysis_stage: stage,
        analysis_progress: progress ?? null,
        analysis_total: total ?? null,
      },
      { onConflict: "user_id" }
    )
  );

// ============================================================================
// User Profile
// ============================================================================

export const getUserName = (userId: string, userMetadata?: { full_name?: string }, email?: string) =>
  Effect.gen(function* () {
    const profile = yield* query<Pick<Profile, "first_name" | "last_name"> | null>((client) =>
      client.from("profiles").select("first_name, last_name").eq("id", userId).single()
    );

    const userName =
      `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
      userMetadata?.full_name ||
      email?.split("@")[0] ||
      "User";

    return userName;
  });

// ============================================================================
// Conversation Queries
// ============================================================================

export const getPendingConversations = (userId: string) =>
  Effect.gen(function* () {
    // Use pagination to fetch ALL pending conversations (Supabase caps at 1000/request)
    const PAGE_SIZE = 1000;
    let allRows: Array<{ id: string; linkedin_conversation_id: string }> = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const pageData = yield* query<Array<{ id: string; linkedin_conversation_id: string }>>((client) =>
        client
          .from("conversations")
          .select("id, linkedin_conversation_id")
          .eq("user_id", userId)
          .in("analysis_status", ["pending", "analyzing"])
          .range(from, to)
      );

      const pageRows = pageData || [];
      allRows = [...allRows, ...pageRows];

      hasMore = pageRows.length === PAGE_SIZE;
      page++;
    }

    return allRows;
  });

export const markConversationsAnalyzing = (userId: string) =>
  mutate((client) =>
    client
      .from("conversations")
      .update({ analysis_status: "analyzing" })
      .match({ user_id: userId, analysis_status: "pending" })
  );

export const getConversationMessages = (conversationId: string) =>
  query<Message[]>((client) =>
    client
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("sent_at", { ascending: true })
  );

// ============================================================================
// Basic Metrics
// ============================================================================

export const computeAndSaveBasicMetrics = (conversationId: string, messages: Message[], userName: string) =>
  Effect.gen(function* () {
    const basicMetrics = computeBasicMetrics(messages, userName);

    yield* mutate((client) =>
      client
        .from("conversations")
        .update({
          engagement_rate: basicMetrics.engagementRate,
          avg_response_time_minutes: basicMetrics.avgResponseTimeMinutes,
          follow_up_pressure_score: basicMetrics.followUpPressureScore,
          total_messages_sent: basicMetrics.totalMessagesSent,
          total_messages_received: basicMetrics.totalMessagesReceived,
          consecutive_follow_ups: basicMetrics.consecutiveFollowUps,
        })
        .eq("id", conversationId)
    );

    return basicMetrics;
  });

// ============================================================================
// LLM Analysis (Optimized: 1 call instead of 3)
// ============================================================================

export const analyzeConversation = (conv: ConversationToAnalyze) =>
  Effect.gen(function* () {
    const llm = yield* LLMService;

    // Single combined LLM call (3x faster)
    const analysis = yield* llm.analyzeConversationFull(conv.messages, conv.userName);

    if (!analysis.is_cold_outreach) {
      return {
        id: conv.id,
        isColdOutreach: false,
        coldOutreachReasoning: analysis.cold_outreach_reasoning,
        prospectStatus: null,
        outreachScore: null,
      } satisfies AnalysisResult;
    }

    // Transform combined result into expected format
    const prospectStatus = analysis.prospect_status ? {
      status: analysis.prospect_status,
      confidence: analysis.prospect_status_confidence || 0.8,
      reasoning: analysis.prospect_status_reasoning || "",
    } : null;

    const outreachScore = analysis.outreach_score != null ? {
      overall_score: analysis.outreach_score,
      dimensions: {
        personalization: analysis.outreach_personalization || 0,
        value_proposition: analysis.outreach_value_proposition || 0,
        call_to_action: analysis.outreach_call_to_action || 0,
        tone: analysis.outreach_tone || 0,
        brevity: analysis.outreach_brevity || 0,
        originality: analysis.outreach_originality || 0,
      },
      feedback: analysis.outreach_feedback || "",
      improvement_suggestions: analysis.improvement_suggestions || [],
    } : null;

    return {
      id: conv.id,
      isColdOutreach: true,
      coldOutreachReasoning: analysis.cold_outreach_reasoning,
      prospectStatus,
      outreachScore,
    } satisfies AnalysisResult;
  });

// ============================================================================
// Save Analysis Results
// ============================================================================

export const saveAnalysisResult = (result: AnalysisResult) =>
  Effect.gen(function* () {
    const updateData: Record<string, unknown> = {
      analysis_status: "completed",
      analyzed_at: new Date().toISOString(),
      is_cold_outreach: result.isColdOutreach,
      cold_outreach_reasoning: result.coldOutreachReasoning,
    };

    if (result.isColdOutreach && result.prospectStatus && result.outreachScore) {
      updateData.prospect_status = result.prospectStatus.status;
      // Convert confidence from 0-1 decimal to 0-100 integer percentage
      updateData.prospect_status_confidence = Math.round(result.prospectStatus.confidence * 100);
      updateData.prospect_status_reasoning = result.prospectStatus.reasoning;
      // Ensure all scores are integers (0-100)
      updateData.outreach_score_overall = Math.round(result.outreachScore.overall_score);
      updateData.outreach_score_personalization = Math.round(result.outreachScore.dimensions.personalization);
      updateData.outreach_score_value_proposition = Math.round(result.outreachScore.dimensions.value_proposition);
      updateData.outreach_score_call_to_action = Math.round(result.outreachScore.dimensions.call_to_action);
      updateData.outreach_score_tone = Math.round(result.outreachScore.dimensions.tone);
      updateData.outreach_score_brevity = Math.round(result.outreachScore.dimensions.brevity);
      updateData.outreach_score_originality = Math.round(result.outreachScore.dimensions.originality);
      updateData.outreach_feedback = result.outreachScore.feedback;
      updateData.outreach_suggestions = result.outreachScore.improvement_suggestions;
    }

    yield* mutate((client) => client.from("conversations").update(updateData).eq("id", result.id));
  });

// ============================================================================
// Global Analytics
// ============================================================================

export const computeAndSaveGlobalAnalytics = (userId: string) =>
  Effect.gen(function* () {
    const allConvos = yield* query<Array<{
      id: string;
      engagement_rate: number | null;
      avg_response_time_minutes: number | null;
      consecutive_follow_ups: number;
      total_messages_received: number;
      outreach_score_overall: number | null;
      prospect_status: string;
      last_message_date: string;
    }>>((client) =>
      client
        .from("conversations")
        .select(
          "id, engagement_rate, avg_response_time_minutes, consecutive_follow_ups, total_messages_received, outreach_score_overall, prospect_status, last_message_date"
        )
        .eq("user_id", userId)
        .eq("is_cold_outreach", true)
        .limit(10000)
    );

    if (!allConvos || allConvos.length === 0) {
      yield* updateProgress(userId, "complete");
      return;
    }

    const globalStats = computeGlobalAnalytics(
      allConvos.map((c) => ({
        engagementRate: c.engagement_rate,
        avgResponseTimeMinutes: c.avg_response_time_minutes,
        consecutiveFollowUps: c.consecutive_follow_ups,
        totalMessagesReceived: c.total_messages_received,
        outreachScoreOverall: c.outreach_score_overall,
        prospectStatus: c.prospect_status,
      }))
    );

    const hotProspects = getHotProspects(
      allConvos.map((c) => ({
        id: c.id,
        engagementRate: c.engagement_rate,
        prospectStatus: c.prospect_status,
        lastMessageDate: c.last_message_date,
      }))
    );

    yield* mutate((client) =>
      client.from("analytics_summary").upsert(
        {
          user_id: userId,
          avg_engagement_rate: globalStats.avgEngagementRate,
          response_rate: globalStats.responseRate,
          avg_response_time_minutes: globalStats.avgResponseTimeMinutes,
          total_follow_ups: globalStats.totalFollowUps,
          avg_outreach_score: globalStats.avgOutreachScore,
          total_conversations: globalStats.totalConversations,
          market_pull_score: globalStats.marketPullScore,
          hot_prospects: hotProspects,
          computed_at: new Date().toISOString(),
          analysis_stage: "complete",
          analysis_progress: null,
          analysis_total: null,
        },
        { onConflict: "user_id" }
      )
    );
  });

// ============================================================================
// Mark Failed
// ============================================================================

export const markConversationsFailed = (userId: string, error: string) =>
  mutate((client) =>
    client
      .from("conversations")
      .update({ analysis_status: "failed", analysis_error: error })
      .match({ user_id: userId, analysis_status: "analyzing" })
  );

export const markConversationFailed = (conversationId: string, error: string) =>
  mutate((client) =>
    client
      .from("conversations")
      .update({ analysis_status: "failed", analysis_error: error })
      .eq("id", conversationId)
  );
