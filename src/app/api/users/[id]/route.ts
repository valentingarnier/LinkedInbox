import { NextRequest, NextResponse } from "next/server";
import { Effect, Data } from "effect";
import {
  SupabaseServiceLive,
  getAuthenticatedUser,
  query,
  mutate,
} from "@/server/effect";
import { DatabaseError, UnauthorizedError } from "@/server/effect/errors";
import type { Profile } from "@/lib/supabase/types";

// Custom error for forbidden access
class ForbiddenError extends Data.TaggedError("ForbiddenError")<{
  readonly message: string;
}> {}

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/users/[id]
 * Returns a specific user's profile (only own profile allowed)
 */
const getUserByIdProgram = (userId: string) =>
  Effect.gen(function* () {
    const user = yield* getAuthenticatedUser;

    // Only allow fetching own profile
    if (user.id !== userId) {
      return yield* Effect.fail(new ForbiddenError({ message: "Forbidden" }));
    }

    const profile = yield* query<Profile | null>((client) =>
      client.from("profiles").select("*").eq("id", userId).single()
    );

    return {
      id: user.id,
      email: user.email,
      ...profile,
    };
  });

/**
 * PATCH /api/users/[id]
 * Updates a user's profile
 */
const updateUserProgram = (userId: string, firstName: string, lastName: string) =>
  Effect.gen(function* () {
    const user = yield* getAuthenticatedUser;

    if (user.id !== userId) {
      return yield* Effect.fail(new ForbiddenError({ message: "Forbidden" }));
    }

    const profile = yield* mutate<Profile>((client) =>
      client
        .from("profiles")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", userId)
        .select()
        .single()
    );

    return profile;
  });

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const program = getUserByIdProgram(id).pipe(Effect.provide(SupabaseServiceLive));

  const result = await Effect.runPromise(program).catch((error) => {
    if (error instanceof UnauthorizedError) {
      return { _error: true, message: error.message, status: 401 };
    }
    if (error instanceof ForbiddenError) {
      return { _error: true, message: error.message, status: 403 };
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

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const { first_name, last_name } = body;

  const program = updateUserProgram(id, first_name, last_name).pipe(
    Effect.provide(SupabaseServiceLive)
  );

  const result = await Effect.runPromise(program).catch((error) => {
    if (error instanceof UnauthorizedError) {
      return { _error: true, message: error.message, status: 401 };
    }
    if (error instanceof ForbiddenError) {
      return { _error: true, message: error.message, status: 403 };
    }
    if (error instanceof DatabaseError) {
      return { _error: true, message: error.message, status: 500 };
    }
    return { _error: true, message: "Failed to update user", status: 500 };
  });

  if ("_error" in result) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json(result);
}
