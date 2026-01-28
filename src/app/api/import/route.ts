import { NextRequest, NextResponse } from "next/server";
import { Effect } from "effect";
import {
  SupabaseServiceLive,
  getAuthenticatedUser,
  query,
  mutate,
} from "@/server/effect";
import { DatabaseError, UnauthorizedError } from "@/server/effect/errors";
import type { Import } from "@/lib/supabase/types";

/**
 * POST /api/import
 * Creates an import record (tracking purposes)
 */
const createImportProgram = (
  fileName: string,
  totalMessages: number,
  totalConversations: number
) =>
  Effect.gen(function* () {
    const user = yield* getAuthenticatedUser;

    const importRecord = yield* mutate<Import>((client) =>
      client
        .from("imports")
        .insert({
          user_id: user.id,
          file_name: fileName,
          total_messages: totalMessages,
          total_conversations: totalConversations,
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .select()
        .single()
    );

    return importRecord;
  });

/**
 * GET /api/import
 * Returns import history for the user
 */
const getImportsProgram = Effect.gen(function* () {
  const user = yield* getAuthenticatedUser;

  const imports = yield* query<Import[]>((client) =>
    client
      .from("imports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
  );

  return imports ?? [];
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { fileName, totalMessages, totalConversations } = body;

  const program = createImportProgram(fileName, totalMessages, totalConversations).pipe(
    Effect.provide(SupabaseServiceLive)
  );

  const result = await Effect.runPromise(program).catch((error) => {
    if (error instanceof UnauthorizedError) {
      return { _error: true, message: error.message, status: 401 };
    }
    if (error instanceof DatabaseError) {
      return { _error: true, message: error.message, status: 500 };
    }
    return { _error: true, message: "Failed to create import record", status: 500 };
  });

  if ("_error" in result) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json(result);
}

export async function GET(request: NextRequest) {
  const program = getImportsProgram.pipe(Effect.provide(SupabaseServiceLive));

  const result = await Effect.runPromise(program).catch((error) => {
    if (error instanceof UnauthorizedError) {
      return { _error: true, message: error.message, status: 401 };
    }
    if (error instanceof DatabaseError) {
      return { _error: true, message: error.message, status: 500 };
    }
    return { _error: true, message: "Failed to fetch imports", status: 500 };
  });

  if ("_error" in result) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json(result);
}
