import { z } from "zod";

// Prospect Status Schema - forces LLM to output valid enum
export const ProspectStatusSchema = z.object({
  status: z.enum([
    "no_response",
    "engaged",
    "interested",
    "meeting_scheduled",
    "not_interested",
    "wrong_person",
    "ghosted",
    "closed",
  ]),
  confidence: z.number().min(0).max(100).describe("Confidence level 0-100"),
  reasoning: z.string().describe("Brief explanation for the status determination"),
});

export type ProspectStatusResult = z.infer<typeof ProspectStatusSchema>;

// Cold Outreach Score Schema - detailed dimensions
export const OutreachScoreSchema = z.object({
  overall_score: z.number().min(0).max(100).describe("Overall outreach quality score"),
  dimensions: z.object({
    personalization: z
      .number()
      .min(0)
      .max(100)
      .describe("How personalized is the message to the recipient"),
    value_proposition: z
      .number()
      .min(0)
      .max(100)
      .describe("Clarity of what value is being offered"),
    call_to_action: z
      .number()
      .min(0)
      .max(100)
      .describe("Clarity and effectiveness of the call to action"),
    tone: z
      .number()
      .min(0)
      .max(100)
      .describe("Professional yet human tone"),
    brevity: z
      .number()
      .min(0)
      .max(100)
      .describe("Conciseness - not too long, not too short"),
    originality: z
      .number()
      .min(0)
      .max(100)
      .describe("How original vs template-like the message feels"),
  }),
  feedback: z.string().describe("Overall feedback on the outreach quality"),
  improvement_suggestions: z
    .array(z.string())
    .describe("Specific actionable suggestions to improve"),
});

export type OutreachScoreResult = z.infer<typeof OutreachScoreSchema>;

// Combined analysis result
export interface ConversationAnalysis {
  prospectStatus: ProspectStatusResult;
  outreachScore: OutreachScoreResult;
}
