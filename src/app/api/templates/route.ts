import { NextRequest, NextResponse } from "next/server";
import { Effect, pipe } from "effect";
import {
  SupabaseServiceLive,
  getAuthenticatedUser,
} from "@/server/effect";
import { getTemplateAnalytics } from "@/server/services/analysis/templates.effect";
import { DatabaseError, UnauthorizedError } from "@/server/effect/errors";

/**
 * GET /api/templates
 * Returns message template analytics for the authenticated user
 */
const getTemplatesProgram = Effect.gen(function* () {
  const user = yield* getAuthenticatedUser;
  const templates = yield* getTemplateAnalytics(user.id);
  return templates;
}).pipe(Effect.provide(SupabaseServiceLive));

export async function GET(_request: NextRequest) {
  const result = await Effect.runPromise(getTemplatesProgram).catch((error) => {
    if (error instanceof UnauthorizedError) {
      return { error: error.message, status: 401 };
    }
    if (error instanceof DatabaseError) {
      return { error: "Database error", details: error.message, status: 500 };
    }
    return { error: "Failed to fetch templates", details: String(error), status: 500 };
  });

  if ("error" in result && "status" in result) {
    const { error, details, status } = result as { error: string; details?: string; status: number };
    return NextResponse.json({ error, details }, { status });
  }

  return NextResponse.json(result);
}
