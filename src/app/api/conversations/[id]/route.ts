import { NextRequest, NextResponse } from "next/server";
import { Effect } from "effect";
import {
  SupabaseServiceLive,
  getAuthenticatedUser,
  querySingle,
  query,
} from "@/server/effect";
import { DatabaseError, UnauthorizedError, NotFoundError } from "@/server/effect/errors";
import type { Conversation, Message } from "@/lib/supabase/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/conversations/[id]
 * Returns a single conversation with its messages
 */
const getConversationProgram = (conversationId: string) =>
  Effect.gen(function* () {
    const user = yield* getAuthenticatedUser;

    // Get conversation
    const conversation = yield* querySingle<Conversation>("conversation", (client) =>
      client
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .eq("user_id", user.id)
        .single()
    );

    // Get messages
    const messages = yield* query<Message[]>((client) =>
      client
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("sent_at", { ascending: true })
    );

    return {
      ...conversation,
      messages: messages ?? [],
    };
  });

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const program = getConversationProgram(id).pipe(Effect.provide(SupabaseServiceLive));

  const result = await Effect.runPromise(program).catch((error) => {
    if (error instanceof UnauthorizedError) {
      return { _error: true, message: error.message, status: 401 };
    }
    if (error instanceof NotFoundError) {
      return { _error: true, message: "Conversation not found", status: 404 };
    }
    if (error instanceof DatabaseError) {
      return { _error: true, message: error.message, status: 500 };
    }
    return { _error: true, message: "Failed to fetch conversation", status: 500 };
  });

  if ("_error" in result) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json(result);
}
