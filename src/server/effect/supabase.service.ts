import { Context, Effect, Layer } from "effect";
import { createClient } from "@/lib/supabase/server";
import { DatabaseError, UnauthorizedError, NotFoundError } from "./errors";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client service
 */
export class SupabaseService extends Context.Tag("SupabaseService")<
  SupabaseService,
  {
    readonly client: SupabaseClient;
  }
>() {}

/**
 * Create Supabase service layer
 */
export const SupabaseServiceLive = Layer.effect(
  SupabaseService,
  Effect.gen(function* () {
    const client = yield* Effect.tryPromise({
      try: () => createClient(),
      catch: (error) => new DatabaseError({ message: "Failed to create Supabase client", cause: error }),
    });
    return { client: client as SupabaseClient };
  })
);

/**
 * Get authenticated user from Supabase
 */
export const getAuthenticatedUser = Effect.gen(function* () {
  const { client } = yield* SupabaseService;

  const { data, error } = yield* Effect.tryPromise({
    try: () => client.auth.getUser(),
    catch: (error) => new DatabaseError({ message: "Failed to get user", cause: error }),
  });

  if (error || !data.user) {
    return yield* Effect.fail(new UnauthorizedError({ message: "Not authenticated" }));
  }

  return data.user;
});

/**
 * Query helper with typed error handling
 * Note: Supabase query builders are PromiseLike, so we need to explicitly await them
 */
export const query = <T>(
  queryFn: (client: SupabaseClient) => PromiseLike<{ data: T | null; error: any }>
) =>
  Effect.gen(function* () {
    const { client } = yield* SupabaseService;

    const { data, error } = yield* Effect.tryPromise({
      try: async () => await queryFn(client),
      catch: (error) => new DatabaseError({ message: "Query failed", cause: error }),
    });

    if (error) {
      return yield* Effect.fail(new DatabaseError({ message: error.message, cause: error }));
    }

    return data as T;
  });

/**
 * Query single record with not found handling
 */
export const querySingle = <T>(
  entity: string,
  queryFn: (client: SupabaseClient) => PromiseLike<{ data: T | null; error: any }>
) =>
  Effect.gen(function* () {
    const { client } = yield* SupabaseService;

    const { data, error } = yield* Effect.tryPromise({
      try: async () => await queryFn(client),
      catch: (error) => new DatabaseError({ message: "Query failed", cause: error }),
    });

    if (error) {
      return yield* Effect.fail(new DatabaseError({ message: error.message, cause: error }));
    }

    if (!data) {
      return yield* Effect.fail(new NotFoundError({ entity }));
    }

    return data;
  });

/**
 * Mutation helper (insert/update/delete)
 * Note: Supabase query builders are PromiseLike, so we need to explicitly await them
 */
export const mutate = <T>(
  mutationFn: (client: SupabaseClient) => PromiseLike<{ data: T | null; error: any }>
) =>
  Effect.gen(function* () {
    const { client } = yield* SupabaseService;

    const { data, error } = yield* Effect.tryPromise({
      try: async () => await mutationFn(client),
      catch: (error) => new DatabaseError({ message: "Mutation failed", cause: error }),
    });

    if (error) {
      return yield* Effect.fail(new DatabaseError({ message: error.message, cause: error }));
    }

    return data as T;
  });
