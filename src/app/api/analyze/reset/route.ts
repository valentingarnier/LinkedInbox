import { NextRequest, NextResponse } from "next/server";
import { Effect, pipe, Layer } from "effect";
import {
  SupabaseService,
  SupabaseServiceLive,
  getAuthenticatedUser,
  mutate,
} from "@/server/effect";

/**
 * Reset program using Effect
 */
const resetProgram = Effect.gen(function* () {
  const user = yield* getAuthenticatedUser;

  // Reset all conversations to pending
  yield* mutate((client) =>
    client
      .from("conversations")
      .update({
        analysis_status: "pending",
        analyzed_at: null,
        analysis_error: null,
        is_cold_outreach: null,
        cold_outreach_reasoning: null,
        prospect_status: "no_response",
        prospect_status_confidence: null,
        prospect_status_reasoning: null,
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
      .eq("user_id", user.id)
  );

  // Clear analytics summary
  yield* mutate((client) =>
    client
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
      .eq("user_id", user.id)
  );

  return { success: true, message: "All conversations reset to pending" };
});

type SuccessResult = { success: true; message: string };
type ErrorResult = { error: string; details?: string; status: number };
type ResetResult = SuccessResult | ErrorResult;

const mapErrorToResponse = (error: unknown): ErrorResult => {
  if (error && typeof error === "object" && "_tag" in error) {
    const tagged = error as { _tag: string; message?: string };
    switch (tagged._tag) {
      case "UnauthorizedError":
        return { error: tagged.message || "Unauthorized", status: 401 };
      case "DatabaseError":
        return { error: "Database error", details: tagged.message, status: 500 };
    }
  }
  return { error: "Unexpected error", details: String(error), status: 500 };
};

const runReset = async (): Promise<ResetResult> => {
  const program = pipe(resetProgram, Effect.provide(SupabaseServiceLive));

  return Effect.runPromise(program)
    .then((result) => result as SuccessResult)
    .catch((error) => mapErrorToResponse(error));
};

/**
 * POST /api/analyze/reset
 * Resets all conversations to pending status for re-analysis
 */
export async function POST(_request: NextRequest) {
  const result = await runReset();

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status }
    );
  }

  return NextResponse.json(result);
}
