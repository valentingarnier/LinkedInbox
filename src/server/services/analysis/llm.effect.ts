import { Context, Effect, Layer } from "effect";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import {
  type ColdOutreachClassificationResult,
  type ProspectStatusResult,
  type OutreachScoreResult,
} from "./schemas";
import { CONVERSATION_ANALYSIS_PROMPT as COMBINED_ANALYSIS_PROMPT } from "./prompts";
import { LLMError, LLMConfigError } from "@/server/effect/errors";

// ============================================================================
// Combined Analysis Schema (ONE call does everything)
// ============================================================================

const CombinedAnalysisSchema = z.object({
  is_cold_outreach: z.boolean(),
  cold_outreach_reasoning: z.string(),
  // Only filled if is_cold_outreach is true
  prospect_status: z.enum([
    "no_response", "engaged", "interested", "meeting_scheduled",
    "not_interested", "wrong_person", "ghosted", "closed"
  ]).nullable(),
  prospect_status_confidence: z.number().min(0).max(1).nullable(),
  prospect_status_reasoning: z.string().nullable(),
  outreach_score: z.number().min(0).max(100).nullable(),
  outreach_personalization: z.number().min(0).max(100).nullable(),
  outreach_value_proposition: z.number().min(0).max(100).nullable(),
  outreach_call_to_action: z.number().min(0).max(100).nullable(),
  outreach_tone: z.number().min(0).max(100).nullable(),
  outreach_brevity: z.number().min(0).max(100).nullable(),
  outreach_originality: z.number().min(0).max(100).nullable(),
  outreach_feedback: z.string().nullable(),
  improvement_suggestions: z.array(z.string()).nullable(),
});

type CombinedAnalysisResult = z.infer<typeof CombinedAnalysisSchema>;

// ============================================================================
// Service Definition
// ============================================================================

type LLMServiceError = LLMError | LLMConfigError;

export interface LLMServiceInterface {
  readonly analyzeConversationFull: (
    messages: Array<{ sender: string; content: string }>,
    userName: string
  ) => Effect.Effect<CombinedAnalysisResult, LLMServiceError>;

  // Legacy methods (kept for compatibility)
  readonly classifyColdOutreach: (
    messages: Array<{ sender: string; content: string }>,
    userName: string
  ) => Effect.Effect<ColdOutreachClassificationResult, LLMServiceError>;

  readonly analyzeProspectStatus: (
    messages: Array<{ sender: string; content: string; date: string }>,
    userName: string
  ) => Effect.Effect<ProspectStatusResult, LLMServiceError>;

  readonly analyzeOutreachQuality: (
    messages: Array<{ sender: string; content: string }>,
    userName: string
  ) => Effect.Effect<OutreachScoreResult, LLMServiceError>;
}

export class LLMService extends Context.Tag("LLMService")<
  LLMService,
  LLMServiceInterface
>() {}

// ============================================================================
// Helpers
// ============================================================================

const formatConversation = (
  messages: Array<{ sender: string; content: string }>,
  userName: string
): string => {
  const normalizedUserName = userName.toLowerCase().trim();
  return messages
    .slice(0, 15) // Limit to first 15 messages for speed
    .map((m) => {
      const senderLower = m.sender.toLowerCase().trim();
      const isUser = senderLower.includes(normalizedUserName) || normalizedUserName.includes(senderLower);
      // Truncate very long messages
      const content = m.content.length > 500 ? m.content.slice(0, 500) + "..." : m.content;
      return `[${isUser ? "ME" : "PROSPECT"}] ${content}`;
    })
    .join("\n\n");
};

const getModel = Effect.gen(function* () {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return yield* Effect.fail(new LLMConfigError({ message: "OPENAI_API_KEY is not set" }));
  }

  return new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
    openAIApiKey: apiKey,
  });
});

// ============================================================================
// Service Implementation
// ============================================================================

export const LLMServiceLive = Layer.succeed(LLMService, {
  // NEW: Single combined call (3x faster)
  analyzeConversationFull: (messages, userName) =>
    Effect.gen(function* () {
      const model = yield* getModel;
      const conversationText = formatConversation(messages, userName);

      const structuredModel = model.withStructuredOutput(CombinedAnalysisSchema);

      const response = yield* Effect.tryPromise({
        try: () =>
          structuredModel.invoke([
            new SystemMessage(COMBINED_ANALYSIS_PROMPT),
            new HumanMessage(`Conversation:\n\n${conversationText}`),
          ]),
        catch: (error) => new LLMError({ message: "Combined analysis failed", cause: error }),
      });

      return response;
    }),

  // Legacy: kept for compatibility but use analyzeConversationFull instead
  classifyColdOutreach: (messages, userName) =>
    Effect.gen(function* () {
      const model = yield* getModel;
      const conversationText = formatConversation(messages, userName);

      const schema = z.object({
        is_cold_outreach: z.boolean(),
        reasoning: z.string(),
      });

      const structuredModel = model.withStructuredOutput(schema);

      const response = yield* Effect.tryPromise({
        try: () =>
          structuredModel.invoke([
            new SystemMessage("Determine if [ME] initiated cold outreach. TRUE only if [ME] sent first AND it's sales/business purpose."),
            new HumanMessage(`Classify:\n\n${conversationText}`),
          ]),
        catch: (error) => new LLMError({ message: "Classification failed", cause: error }),
      });

      return response;
    }),

  analyzeProspectStatus: (messages, userName) =>
    Effect.gen(function* () {
      const model = yield* getModel;
      const conversationText = formatConversation(messages, userName);

      const schema = z.object({
        status: z.enum([
          "no_response", "engaged", "interested", "meeting_scheduled",
          "not_interested", "wrong_person", "ghosted", "closed"
        ]),
        confidence: z.number().min(0).max(1),
        reasoning: z.string(),
      });

      const structuredModel = model.withStructuredOutput(schema);

      const response = yield* Effect.tryPromise({
        try: () =>
          structuredModel.invoke([
            new SystemMessage("Analyze [PROSPECT]'s response to [ME]'s outreach."),
            new HumanMessage(`Analyze:\n\n${conversationText}`),
          ]),
        catch: (error) => new LLMError({ message: "Status analysis failed", cause: error }),
      });

      return response;
    }),

  analyzeOutreachQuality: (messages, userName) =>
    Effect.gen(function* () {
      const normalizedUserName = userName.toLowerCase().trim();
      const outreachMessages = messages
        .filter((m) => {
          const senderLower = m.sender.toLowerCase().trim();
          return senderLower.includes(normalizedUserName) || normalizedUserName.includes(senderLower);
        })
        .slice(0, 3);

      if (outreachMessages.length === 0) {
        return {
          overall_score: 0,
          dimensions: {
            personalization: 0,
            value_proposition: 0,
            call_to_action: 0,
            tone: 0,
            brevity: 0,
            originality: 0,
          },
          feedback: "No outreach messages found.",
          improvement_suggestions: [],
        };
      }

      const model = yield* getModel;
      const outreachText = outreachMessages.map((m) => m.content.slice(0, 500)).join("\n---\n");

      const schema = z.object({
        overall_score: z.number().min(0).max(100),
        dimensions: z.object({
          personalization: z.number().min(0).max(100),
          value_proposition: z.number().min(0).max(100),
          call_to_action: z.number().min(0).max(100),
          tone: z.number().min(0).max(100),
          brevity: z.number().min(0).max(100),
          originality: z.number().min(0).max(100),
        }),
        feedback: z.string(),
        improvement_suggestions: z.array(z.string()),
      });

      const structuredModel = model.withStructuredOutput(schema);

      const response = yield* Effect.tryPromise({
        try: () =>
          structuredModel.invoke([
            new SystemMessage("Score outreach quality (0-100). Most score 40-60."),
            new HumanMessage(`Score:\n\n${outreachText}`),
          ]),
        catch: (error) => new LLMError({ message: "Quality analysis failed", cause: error }),
      });

      return response;
    }),
});
