import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  computeBasicMetrics,
  computeGlobalAnalytics,
  getHotProspects,
} from "@/server/services/analysis/metrics.service";
import { batchAnalyzeConversations } from "@/server/services/analysis/llm.service";
import type { Profile, Message } from "@/lib/supabase/types";

/**
 * POST /api/analyze
 * Triggers analysis for all pending conversations
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    // Use any to bypass strict Supabase type inference issues
    const db = supabase as any;

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile for name matching
    const { data: profileData } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single();

    const profile = profileData as Pick<Profile, "first_name" | "last_name"> | null;

    const userName = `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim()
      || user.user_metadata?.full_name
      || user.email?.split("@")[0]
      || "User";

    // Get pending conversations
    const { data: conversations, error: convError } = await db
      .from("conversations")
      .select("id, linkedin_conversation_id")
      .match({ user_id: user.id, analysis_status: "pending" });

    if (convError) {
      return NextResponse.json({ error: "DB error", details: convError.message }, { status: 500 });
    }

    if (!conversations?.length) {
      return NextResponse.json({ message: "No conversations to analyze", analyzed: 0 });
    }

    // Mark as analyzing
    await db
      .from("conversations")
      .update({ analysis_status: "analyzing" })
      .match({ user_id: user.id, analysis_status: "pending" });

    // Process each conversation
    const conversationsToAnalyze: Array<{
      id: string;
      messages: Array<{ sender: string; content: string; date: string }>;
      userName: string;
    }> = [];

    for (const conv of conversations) {
      const { data: messagesData } = await db
        .from("messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("sent_at", { ascending: true });

      const messages = messagesData as Message[] | null;
      if (!messages?.length) continue;

      // Compute basic metrics
      const basicMetrics = computeBasicMetrics(messages, userName);

      await db
        .from("conversations")
        .update({
          engagement_rate: basicMetrics.engagementRate,
          avg_response_time_minutes: basicMetrics.avgResponseTimeMinutes,
          follow_up_pressure_score: basicMetrics.followUpPressureScore,
          total_messages_sent: basicMetrics.totalMessagesSent,
          total_messages_received: basicMetrics.totalMessagesReceived,
          consecutive_follow_ups: basicMetrics.consecutiveFollowUps,
        })
        .eq("id", conv.id);

      conversationsToAnalyze.push({
        id: conv.id,
        messages: messages.map((m) => ({
          sender: m.sender,
          content: m.content,
          date: m.sent_at,
        })),
        userName,
      });
    }

    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      await db
        .from("conversations")
        .update({ analysis_status: "failed", analysis_error: "OPENAI_API_KEY not configured" })
        .match({ user_id: user.id, analysis_status: "analyzing" });

      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
    }

    // Run LLM analysis
    try {
      const llmResults = await batchAnalyzeConversations(conversationsToAnalyze, 10);

      for (const result of llmResults) {
        await db
          .from("conversations")
          .update({
            analysis_status: "completed",
            analyzed_at: new Date().toISOString(),
            prospect_status: result.prospectStatus.status,
            prospect_status_confidence: result.prospectStatus.confidence,
            prospect_status_reasoning: result.prospectStatus.reasoning,
            outreach_score_overall: result.outreachScore.overall_score,
            outreach_score_personalization: result.outreachScore.dimensions.personalization,
            outreach_score_value_proposition: result.outreachScore.dimensions.value_proposition,
            outreach_score_call_to_action: result.outreachScore.dimensions.call_to_action,
            outreach_score_tone: result.outreachScore.dimensions.tone,
            outreach_score_brevity: result.outreachScore.dimensions.brevity,
            outreach_score_originality: result.outreachScore.dimensions.originality,
            outreach_feedback: result.outreachScore.feedback,
            outreach_suggestions: result.outreachScore.improvement_suggestions,
          })
          .eq("id", result.id);
      }
    } catch (llmError) {
      await db
        .from("conversations")
        .update({ analysis_status: "failed", analysis_error: String(llmError) })
        .match({ user_id: user.id, analysis_status: "analyzing" });

      return NextResponse.json({ error: "LLM analysis failed", details: String(llmError) }, { status: 500 });
    }

    // Compute global analytics
    const { data: allConvosData } = await db
      .from("conversations")
      .select("id, engagement_rate, avg_response_time_minutes, consecutive_follow_ups, total_messages_received, outreach_score_overall, prospect_status, last_message_date")
      .eq("user_id", user.id);

    const allConvos = allConvosData as Array<{
      id: string;
      engagement_rate: number | null;
      avg_response_time_minutes: number | null;
      consecutive_follow_ups: number;
      total_messages_received: number;
      outreach_score_overall: number | null;
      prospect_status: string;
      last_message_date: string;
    }> | null;

    if (allConvos) {
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

      await db.from("analytics_summary").upsert(
        {
          user_id: user.id,
          avg_engagement_rate: globalStats.avgEngagementRate,
          response_rate: globalStats.responseRate,
          avg_response_time_minutes: globalStats.avgResponseTimeMinutes,
          total_follow_ups: globalStats.totalFollowUps,
          avg_outreach_score: globalStats.avgOutreachScore,
          total_conversations: globalStats.totalConversations,
          market_pull_score: globalStats.marketPullScore,
          hot_prospects: hotProspects,
          computed_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    return NextResponse.json({ success: true, analyzed: conversationsToAnalyze.length });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze conversations", details: String(error) },
      { status: 500 }
    );
  }
}
