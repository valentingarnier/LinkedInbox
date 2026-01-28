import { NextRequest, NextResponse } from "next/server";
import { Effect, pipe } from "effect";
import {
  SupabaseServiceLive,
  getAuthenticatedUser,
} from "@/server/effect";
import type { AnalysisStatus, AnalyticsSummary } from "@/lib/supabase/types";

interface ConversationStatus {
  id: string;
  analysis_status: AnalysisStatus;
}

// Free tier limit
const FREE_TIER_CONVERSATION_LIMIT = 50;

const STAGE_LABELS: Record<string, string> = {
  preparing: "Preparing conversations...",
  computing_metrics: "Computing engagement metrics...",
  classifying_outreach: "Identifying cold outreach...",
  analyzing_prospects: "Analyzing prospects...",
  computing_global: "Computing global analytics...",
  analyzing_templates: "Analyzing message templates...",
  complete: "Analysis complete",
};

interface StatusResult {
  total: number;
  pending: number;
  pendingLimited: number; // Limited to free tier
  analyzing: number;
  completed: number;
  failed: number;
  isComplete: boolean;
  stage: string | null;
  stageLabel: string | null;
  progress: number | null;
  progressTotal: number | null;
  isOverLimit: boolean;
}

/**
 * Fetch all conversations with pagination (Supabase caps at 1000 per request)
 */
async function fetchAllConversationStatuses(
  client: { from: (table: string) => any },
  userId: string
): Promise<ConversationStatus[]> {
  const PAGE_SIZE = 1000;
  let allRows: ConversationStatus[] = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await client
      .from("conversations")
      .select("id, analysis_status")
      .eq("user_id", userId)
      .range(from, to);

    if (error) break;

    const pageRows = (data as ConversationStatus[] | null) || [];
    allRows = [...allRows, ...pageRows];

    hasMore = pageRows.length === PAGE_SIZE;
    page++;
  }

  return allRows;
}

/**
 * Status program using Effect
 */
const statusProgram = Effect.gen(function* () {
  const user = yield* getAuthenticatedUser;

  // Get ALL conversation counts using pagination
  const conversations = yield* Effect.tryPromise({
    try: async () => {
      const { createClient } = await import("@/lib/supabase/server");
      const client = await createClient();
      return fetchAllConversationStatuses(client, user.id);
    },
    catch: () => [] as ConversationStatus[],
  });

  // Get analysis progress from analytics_summary (may not exist)
  const analyticsResult = yield* Effect.tryPromise({
    try: async () => {
      const { createClient } = await import("@/lib/supabase/server");
      const client = await createClient();
      const { data } = await client
        .from("analytics_summary")
        .select("analysis_stage, analysis_progress, analysis_total")
        .eq("user_id", user.id)
        .single();
      return data as Pick<AnalyticsSummary, "analysis_stage" | "analysis_progress" | "analysis_total"> | null;
    },
    catch: () => null,
  });
  const analytics = analyticsResult;

  if (!conversations?.length) {
    return {
      total: 0,
      pending: 0,
      pendingLimited: 0,
      analyzing: 0,
      completed: 0,
      failed: 0,
      isComplete: true,
      stage: null,
      stageLabel: null,
      progress: null,
      progressTotal: null,
      isOverLimit: false,
    } satisfies StatusResult;
  }

  const statusCounts = {
    pending: 0,
    analyzing: 0,
    completed: 0,
    failed: 0,
  };

  conversations.forEach((c) => {
    const status = c.analysis_status as keyof typeof statusCounts;
    if (status in statusCounts) {
      statusCounts[status]++;
    }
  });

  const isComplete = statusCounts.pending === 0 && statusCounts.analyzing === 0;
  const stage = analytics?.analysis_stage || null;
  const isOverLimit = statusCounts.pending > FREE_TIER_CONVERSATION_LIMIT;
  const pendingLimited = Math.min(statusCounts.pending, FREE_TIER_CONVERSATION_LIMIT);

  return {
    total: conversations.length,
    ...statusCounts,
    pendingLimited,
    isComplete,
    stage,
    stageLabel: stage ? STAGE_LABELS[stage] || stage : null,
    progress: analytics?.analysis_progress || null,
    progressTotal: analytics?.analysis_total || null,
    isOverLimit,
  } satisfies StatusResult;
});

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

const runStatus = async (): Promise<StatusResult | ErrorResult> => {
  const program = pipe(statusProgram, Effect.provide(SupabaseServiceLive));

  return Effect.runPromise(program)
    .then((result) => result as StatusResult)
    .catch((error) => mapErrorToResponse(error));
};

/**
 * GET /api/analyze/status
 * Returns analysis status counts for the current user
 */
export async function GET(_request: NextRequest) {
  const result = await runStatus();

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error, details: (result as ErrorResult).details },
      { status: (result as ErrorResult).status }
    );
  }

  return NextResponse.json(result);
}
