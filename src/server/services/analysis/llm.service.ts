import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  ProspectStatusSchema,
  OutreachScoreSchema,
  type ProspectStatusResult,
  type OutreachScoreResult,
} from "./schemas";

const PROSPECT_STATUS_PROMPT = `You are an expert at analyzing LinkedIn sales conversations.
Analyze the conversation and determine the prospect's current status.

Status definitions:
- no_response: I reached out but they never replied
- engaged: Active back-and-forth conversation happening
- interested: They showed positive signals, asking questions, showing curiosity
- meeting_scheduled: A meeting, demo, or call has been explicitly scheduled or agreed upon
- not_interested: They explicitly declined or showed clear disinterest
- wrong_person: They indicated they're not the right contact or redirected to someone else
- ghosted: They were engaged before but stopped responding (at least 2+ messages with no reply after they had replied)
- closed: The conversation reached a natural conclusion (deal done, or definitively ended)

Be precise. Look for explicit signals in the messages.`;

const OUTREACH_QUALITY_PROMPT = `You are an expert at analyzing LinkedIn cold outreach messages.
Score the outreach quality based on industry best practices for LinkedIn prospecting.

Scoring criteria (0-100 for each):
- Personalization: Did they research the prospect? Mention specific details about them or their company?
- Value Proposition: Is it clear what value they're offering? Why should the prospect care?
- Call to Action: Is there a clear, low-friction next step? Is it easy to say yes to?
- Tone: Is it professional but human? Not too salesy or robotic?
- Brevity: Is it concise and respectful of their time? (Ideal: 50-150 words for first message)
- Originality: Does it feel genuine or like a mass template? Any creative hooks?

Be critical but fair. Most cold outreach scores 40-60. Only exceptional outreach gets 80+.
Provide specific, actionable improvement suggestions.`;

/**
 * Creates an OpenAI model instance
 */
function getModel() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  return new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
    openAIApiKey: apiKey,
  });
}

/**
 * Formats conversation messages for LLM analysis
 */
function formatConversation(
  messages: Array<{ sender: string; content: string }>,
  userName: string
): string {
  return messages
    .map((m) => {
      const isUser = m.sender.toLowerCase() === userName.toLowerCase();
      return `[${isUser ? "ME" : "PROSPECT"}] ${m.content}`;
    })
    .join("\n\n");
}

/**
 * Analyzes prospect status using LLM with structured output
 */
export async function analyzeProspectStatus(
  messages: Array<{ sender: string; content: string; date: string }>,
  userName: string
): Promise<ProspectStatusResult> {
  const model = getModel().withStructuredOutput(ProspectStatusSchema);
  const conversationText = formatConversation(messages, userName);

  const response = await model.invoke([
    new SystemMessage(PROSPECT_STATUS_PROMPT),
    new HumanMessage(`Analyze this LinkedIn conversation:\n\n${conversationText}`),
  ]);

  return response;
}

/**
 * Analyzes cold outreach quality using LLM with structured output
 */
export async function analyzeOutreachQuality(
  messages: Array<{ sender: string; content: string }>,
  userName: string
): Promise<OutreachScoreResult> {
  const outreachMessages = messages
    .filter((m) => m.sender.toLowerCase() === userName.toLowerCase())
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
      feedback: "No outreach messages from user found in this conversation.",
      improvement_suggestions: [],
    };
  }

  const model = getModel().withStructuredOutput(OutreachScoreSchema);
  const outreachText = outreachMessages.map((m) => m.content).join("\n\n---\n\n");

  const response = await model.invoke([
    new SystemMessage(OUTREACH_QUALITY_PROMPT),
    new HumanMessage(`Analyze this LinkedIn cold outreach:\n\n${outreachText}`),
  ]);

  return response;
}

/**
 * Batch analyzes multiple conversations in parallel
 */
export async function batchAnalyzeConversations(
  conversations: Array<{
    id: string;
    messages: Array<{ sender: string; content: string; date: string }>;
    userName: string;
  }>,
  batchSize: number = 10
): Promise<Array<{
  id: string;
  prospectStatus: ProspectStatusResult;
  outreachScore: OutreachScoreResult;
}>> {
  const results: Array<{
    id: string;
    prospectStatus: ProspectStatusResult;
    outreachScore: OutreachScoreResult;
  }> = [];

  for (let i = 0; i < conversations.length; i += batchSize) {
    const batch = conversations.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (conv) => {
        const [prospectStatus, outreachScore] = await Promise.all([
          analyzeProspectStatus(conv.messages, conv.userName),
          analyzeOutreachQuality(conv.messages, conv.userName),
        ]);

        return { id: conv.id, prospectStatus, outreachScore };
      })
    );

    results.push(...batchResults);
  }

  return results;
}
