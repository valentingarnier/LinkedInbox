import { NextRequest, NextResponse } from "next/server";
import { Effect } from "effect";
import {
  SupabaseServiceLive,
  getAuthenticatedUser,
  query,
} from "@/server/effect";
import { DatabaseError, UnauthorizedError } from "@/server/effect/errors";
import type { Profile } from "@/lib/supabase/types";

/**
 * GET /api/users
 * Returns the current user's profile
 */
const getUserProgram = Effect.gen(function* () {
  const user = yield* getAuthenticatedUser;

  const profile = yield* query<Profile | null>((client) =>
    client.from("profiles").select("*").eq("id", user.id).single()
  );

  return {
    id: user.id,
    email: user.email,
    ...profile,
  };
});

export async function GET(request: NextRequest) {
  const program = getUserProgram.pipe(Effect.provide(SupabaseServiceLive));

  const result = await Effect.runPromise(program).catch((error) => {
    if (error instanceof UnauthorizedError) {
      return { _error: true, message: error.message, status: 401 };
    }
    if (error instanceof DatabaseError) {
      return { _error: true, message: error.message, status: 500 };
    }
    return { _error: true, message: "Failed to fetch user", status: 500 };
  });

  if ("_error" in result) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json(result);
}
