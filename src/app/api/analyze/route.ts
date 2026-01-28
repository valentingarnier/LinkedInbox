import { NextRequest, NextResponse } from "next/server";
import { Effect, Layer, pipe } from "effect";
import {
  SupabaseService,
  SupabaseServiceLive,
  getAuthenticatedUser,
} from "@/server/effect";
import { LLMService, LLMServiceLive } from "@/server/services/analysis/llm.effect";
import {
  getUserName,
  getPendingConversations,
  markConversationsAnalyzing,
  getConversationMessages,
  computeAndSaveBasicMetrics,
  analyzeConversation,
  saveAnalysisResult,
  computeAndSaveGlobalAnalytics,
  updateProgress,
  markConversationsFailed,
  markConversationFailed,
} from "@/server/services/analysis/analysis.effect";
import { analyzeTemplates } from "@/server/services/analysis/templates.effect";
import { LLMConfigError } from "@/server/effect/errors";

/**
 * Main analysis program using Effect
 */
const analyzeProgram = Effect.gen(function* () {
  console.log("[Analyze API] Starting analysis program");
  
  // Get authenticated user
  const user = yield* getAuthenticatedUser;
  console.log("[Analyze API] User:", user.id);

  // Get user name for message matching
  const userName = yield* getUserName(user.id, user.user_metadata, user.email);
  console.log("[Analyze API] User name:", userName);

  // Get pending conversations
  const conversations = yield* getPendingConversations(user.id);
  console.log("[Analyze API] Pending conversations found:", conversations?.length ?? 0);

  if (!conversations || conversations.length === 0) {
    console.log("[Analyze API] No conversations to analyze, returning early");
    return { message: "No conversations to analyze", analyzed: 0 };
  }

  // Stage: Preparing
  yield* updateProgress(user.id, "preparing", 0, conversations.length);

  // Mark conversations as analyzing
  yield* markConversationsAnalyzing(user.id);

  // Stage: Computing metrics (parallelized)
  yield* updateProgress(user.id, "computing_metrics", 0, conversations.length);

  // Process metrics in parallel batches
  const METRICS_BATCH_SIZE = 20;
  const conversationsToAnalyze: Array<{
    id: string;
    messages: Array<{ sender: string; content: string; date: string }>;
    userName: string;
  }> = [];

  for (let i = 0; i < conversations.length; i += METRICS_BATCH_SIZE) {
    const batch = conversations.slice(i, i + METRICS_BATCH_SIZE);

    // Fetch messages for batch in parallel
    const messagesResults = yield* Effect.all(
      batch.map((conv) => getConversationMessages(conv.id)),
      { concurrency: METRICS_BATCH_SIZE }
    );

    // Compute and save metrics in parallel for conversations with messages
    const validConvs: Array<{ conv: typeof batch[0]; messages: NonNullable<typeof messagesResults[0]> }> = [];
    for (let j = 0; j < batch.length; j++) {
      const messages = messagesResults[j];
      if (messages && messages.length > 0) {
        validConvs.push({ conv: batch[j], messages });
      }
    }

    yield* Effect.all(
      validConvs.map(({ conv, messages }) => computeAndSaveBasicMetrics(conv.id, messages, userName)),
      { concurrency: METRICS_BATCH_SIZE }
    );

    // Add to analysis queue
    for (const { conv, messages } of validConvs) {
      conversationsToAnalyze.push({
        id: conv.id,
        messages: messages.map((m) => ({
          sender: m.sender,
          content: m.content,
          date: m.sent_at,
        })),
        userName,
      });
    }

    yield* updateProgress(user.id, "computing_metrics", Math.min(i + METRICS_BATCH_SIZE, conversations.length), conversations.length);
  }

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    yield* markConversationsFailed(user.id, "OPENAI_API_KEY not configured");
    yield* updateProgress(user.id, "complete");
    return yield* Effect.fail(new LLMConfigError({ message: "OPENAI_API_KEY not configured" }));
  }

  // Stage: Classifying and analyzing with parallelization
  yield* updateProgress(user.id, "classifying_outreach", 0, conversationsToAnalyze.length);

  // Process in parallel batches for speed
  // With combined LLM calls (1 instead of 3), we can safely increase concurrency
  const PARALLEL_BATCH_SIZE = 15; // Increased from 5 - now doing 1 call per conv instead of 3
  let completed = 0;
  let failed = 0;

  for (let i = 0; i < conversationsToAnalyze.length; i += PARALLEL_BATCH_SIZE) {
    const batch = conversationsToAnalyze.slice(i, i + PARALLEL_BATCH_SIZE);

    // Analyze and save each conversation with individual error handling
    const batchResults = yield* Effect.all(
      batch.map((conv) =>
        pipe(
          analyzeConversation(conv),
          Effect.flatMap((result) => saveAnalysisResult(result)),
          Effect.map(() => ({ success: true as const, id: conv.id })),
          Effect.catchAll((error) =>
            // Mark individual conversation as failed, but continue with others
            pipe(
              markConversationFailed(conv.id, String(error)),
              Effect.map(() => ({ success: false as const, id: conv.id, error: String(error) }))
            )
          )
        )
      ),
      { concurrency: PARALLEL_BATCH_SIZE }
    );

    // Count successes and failures
    for (const result of batchResults) {
      if (result.success) {
        completed++;
      } else {
        failed++;
        console.error(`Failed to analyze conversation ${result.id}:`, result.error);
      }
    }

    yield* updateProgress(user.id, "analyzing_prospects", completed + failed, conversationsToAnalyze.length);
  }

  // Stage: Computing global analytics
  yield* updateProgress(user.id, "computing_global");

  yield* computeAndSaveGlobalAnalytics(user.id);

  // Stage: Analyzing message templates
  yield* updateProgress(user.id, "analyzing_templates");
  
  // Run template analysis (errors are non-fatal)
  yield* Effect.catchAll(
    analyzeTemplates(user.id, userName),
    (error) => {
      console.error("Template analysis failed (non-fatal):", error);
      return Effect.succeed([]);
    }
  );

  // Mark as complete
  yield* updateProgress(user.id, "complete");

  return { success: true, analyzed: conversationsToAnalyze.length };
});

/**
 * Create the full service layer
 */
const MainLayer = Layer.mergeAll(SupabaseServiceLive, LLMServiceLive);

type SuccessResult = { success: true; analyzed: number } | { message: string; analyzed: number };
type ErrorResult = { error: string; details?: string; status: number };
type AnalysisResult = SuccessResult | ErrorResult;

/**
 * Map errors to HTTP responses
 */
const mapErrorToResponse = (error: unknown): ErrorResult => {
  if (error && typeof error === "object" && "_tag" in error) {
    const tagged = error as { _tag: string; message?: string; entity?: string };
    switch (tagged._tag) {
      case "UnauthorizedError":
        return { error: tagged.message || "Unauthorized", status: 401 };
      case "DatabaseError":
        return { error: "Database error", details: tagged.message, status: 500 };
      case "LLMConfigError":
        return { error: tagged.message || "LLM configuration error", status: 500 };
      case "LLMError":
        return { error: "LLM analysis failed", details: tagged.message, status: 500 };
      case "NotFoundError":
        return { error: `${tagged.entity || "Resource"} not found`, status: 404 };
      case "AnalysisError":
        return { error: tagged.message || "Analysis failed", status: 500 };
    }
  }
  return { error: "Unexpected error", details: String(error), status: 500 };
};

/**
 * Run the analysis with full error handling
 */
const runAnalysis = async (): Promise<AnalysisResult> => {
  const program = pipe(analyzeProgram, Effect.provide(MainLayer));

  return Effect.runPromise(program)
    .then((result) => result as SuccessResult)
    .catch((error) => mapErrorToResponse(error));
};

/**
 * POST /api/analyze
 * Triggers analysis for all pending conversations
 */
export async function POST(_request: NextRequest) {
  const result = await runAnalysis();

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status }
    );
  }

  return NextResponse.json(result);
}
