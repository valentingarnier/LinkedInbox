import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/analyze/reset
 * Resets all conversations to pending status for re-analysis
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const db = supabase as any;

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reset all conversations to pending
    const { error: resetError } = await db
      .from("conversations")
      .update({
        analysis_status: "pending",
        analyzed_at: null,
        analysis_error: null,
        // Reset cold outreach classification
        is_cold_outreach: null,
        cold_outreach_reasoning: null,
        // Reset prospect status
        prospect_status: "no_response",
        prospect_status_confidence: null,
        prospect_status_reasoning: null,
        // Reset outreach scores
        outreach_score_overall: null,
        outreach_score_personalization: null,
        outreach_score_value_proposition: null,
        outreach_score_call_to_action: null,
        outreach_score_tone: null,
        outreach_score_brevity: null,
        outreach_score_originality: null,
        outreach_feedback: null,
        outreach_suggestions: null,
      })
      .eq("user_id", user.id);

    if (resetError) {
      return NextResponse.json({ error: "Failed to reset", details: resetError.message }, { status: 500 });
    }

    // Clear analytics summary
    await db
      .from("analytics_summary")
      .update({
        avg_engagement_rate: null,
        response_rate: null,
        avg_response_time_minutes: null,
        total_follow_ups: null,
        avg_outreach_score: null,
        total_conversations: null,
        market_pull_score: null,
        hot_prospects: null,
        analysis_stage: null,
        analysis_progress: null,
        analysis_total: null,
      })
      .eq("user_id", user.id);

    return NextResponse.json({ success: true, message: "All conversations reset to pending" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reset analysis", details: String(error) },
      { status: 500 }
    );
  }
}
