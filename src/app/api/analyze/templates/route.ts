import { NextRequest, NextResponse } from "next/server";
import { Effect, Layer, pipe } from "effect";
import {
  SupabaseService,
  SupabaseServiceLive,
  getAuthenticatedUser,
} from "@/server/effect";
import { getUserName } from "@/server/services/analysis/analysis.effect";
import { analyzeTemplates } from "@/server/services/analysis/templates.effect";

/**
 * POST /api/analyze/templates
 * Run only the template analysis (for debugging)
 */
export async function POST(_request: NextRequest) {
  console.log("[Templates API] Starting template analysis endpoint");

  const program = Effect.gen(function* () {
    const user = yield* getAuthenticatedUser;
    console.log("[Templates API] User:", user.id);

    const userName = yield* getUserName(user.id, user.user_metadata, user.email);
    console.log("[Templates API] UserName:", userName);

    const templates = yield* analyzeTemplates(user.id, userName);
    console.log("[Templates API] Templates result:", templates.length);

    return { success: true, templates };
  });

  const result = await Effect.runPromise(
    pipe(program, Effect.provide(SupabaseServiceLive))
  ).catch((error) => {
    console.error("[Templates API] Error:", error);
    return { error: String(error), details: error };
  });

  if ("error" in result) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
