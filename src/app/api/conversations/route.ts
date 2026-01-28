import { NextRequest, NextResponse } from "next/server";
import { Effect } from "effect";
import {
  SupabaseServiceLive,
  getAuthenticatedUser,
  query,
} from "@/server/effect";
import { DatabaseError, UnauthorizedError } from "@/server/effect/errors";
import type { Conversation } from "@/lib/supabase/types";

/**
 * GET /api/conversations
 * Returns all conversations for the authenticated user
 */
const getConversationsProgram = Effect.gen(function* () {
  const user = yield* getAuthenticatedUser;

  const conversations = yield* query<Conversation[]>((client) =>
    client
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("last_message_date", { ascending: false })
      .limit(10000)
  );

  return conversations ?? [];
});

export async function GET(request: NextRequest) {
  const program = getConversationsProgram.pipe(Effect.provide(SupabaseServiceLive));

  const result = await Effect.runPromise(program).catch((error) => {
    if (error instanceof UnauthorizedError) {
      return { _error: true, message: error.message, status: 401 };
    }
    if (error instanceof DatabaseError) {
      return { _error: true, message: error.message, status: 500 };
    }
    return { _error: true, message: "Failed to fetch conversations", status: 500 };
  });

  if ("_error" in result) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json(result);
}
