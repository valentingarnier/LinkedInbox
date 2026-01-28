import { NextRequest, NextResponse } from "next/server";
import { Effect, pipe } from "effect";
import {
  SupabaseServiceLive,
  getAuthenticatedUser,
  mutate,
} from "@/server/effect";

/**
 * Stop program - marks analyzing conversations back to pending
 */
const stopProgram = Effect.gen(function* () {
  const user = yield* getAuthenticatedUser;

  // Mark all "analyzing" conversations back to "pending" so they can be resumed
  yield* mutate((client) =>
    client
      .from("conversations")
      .update({ analysis_status: "pending" })
      .eq("user_id", user.id)
      .eq("analysis_status", "analyzing")
  );

  // Clear analysis progress
  yield* mutate((client) =>
    client
      .from("analytics_summary")
      .update({
        analysis_stage: null,
        analysis_progress: null,
        analysis_total: null,
      })
      .eq("user_id", user.id)
  );

  return { success: true, message: "Analysis stopped. You can resume anytime." };
});

type SuccessResult = { success: true; message: string };
type ErrorResult = { error: string; details?: string; status: number };

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

const runStop = async (): Promise<SuccessResult | ErrorResult> => {
  const program = pipe(stopProgram, Effect.provide(SupabaseServiceLive));

  return Effect.runPromise(program)
    .then((result) => result as SuccessResult)
    .catch((error) => mapErrorToResponse(error));
};

/**
 * POST /api/analyze/stop
 * Stops the current analysis and allows resuming later
 */
export async function POST(_request: NextRequest) {
  const result = await runStop();

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error, details: (result as ErrorResult).details },
      { status: (result as ErrorResult).status }
    );
  }

  return NextResponse.json(result);
}
