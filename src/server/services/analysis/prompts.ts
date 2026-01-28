/**
 * Centralized LLM Prompts
 * 
 * All prompts used for AI analysis are defined here for easy review and iteration.
 * These prompts are used by the analysis services to classify conversations,
 * determine prospect status, score outreach quality, and label templates.
 */

// ============================================================================
// CONVERSATION ANALYSIS PROMPT
// ============================================================================

/**
 * Combined prompt for analyzing a LinkedIn conversation.
 * This single prompt handles:
 * 1. Cold outreach classification
 * 2. Prospect status determination
 * 3. Outreach quality scoring
 * 
 * Used in: llm.effect.ts → analyzeConversationFull()
 */
export const CONVERSATION_ANALYSIS_PROMPT = `Analyze this LinkedIn conversation. [ME] is the user, [PROSPECT] is the other person.

TASK 1 - COLD OUTREACH CHECK:
Is this cold outreach by [ME]? TRUE only if: [ME] sent first message AND it's sales/business dev purpose.
FALSE if: [PROSPECT] messaged first, OR it's personal/job-related/casual.

TASK 2 - If cold outreach, analyze:
A) PROSPECT STATUS (based on [PROSPECT]'s behavior only):
- no_response: [PROSPECT] never replied
- engaged: Active back-and-forth ongoing
- interested: [PROSPECT] shows positive interest in offer
- meeting_scheduled: [PROSPECT] agreed to meeting/call
- not_interested: [PROSPECT] explicitly declined
- wrong_person: [PROSPECT] redirected to someone else
- ghosted: [PROSPECT] replied before, then stopped (I sent 2+ unanswered follow-ups)
- closed: Conversation concluded naturally

B) OUTREACH QUALITY (score 0-100, most score 40-60):
- Personalization: Research shown?
- Value Proposition: Clear benefit?
- Call to Action: Low-friction ask?
- Tone: Professional but human?
- Brevity: Concise? (50-150 words ideal)
- Originality: Genuine or template-y?

If NOT cold outreach, set all prospect/outreach fields to null.`;

// ============================================================================
// TEMPLATE LABELING PROMPT
// ============================================================================

/**
 * Prompt for labeling a cluster of similar opener messages.
 * Analyzes multiple examples to identify the common pattern/approach.
 * 
 * Used in: templates.effect.ts → labelCluster()
 * 
 * @param examples - Array of opener message examples (up to 5)
 */
export function getTemplateLabelingPrompt(examples: string[]): string {
  const formattedExamples = examples
    .map((e, i) => `${i + 1}. "${e.substring(0, 300)}${e.length > 300 ? "..." : ""}"`)
    .join("\n");

  return `Analyze these cold outreach opener messages and identify their common pattern/approach.

MESSAGES:
${formattedExamples}

Respond in JSON format:
{
  "label": "Short 2-4 word label for this opener style (e.g., 'Compliment + Hook', 'Mutual Connection', 'Direct Value Prop')",
  "description": "One sentence describing the approach and what makes it distinctive",
  "pattern": "The template pattern with [PLACEHOLDER] for personalized parts"
}`;
}

// ============================================================================
// PROMPT GUIDELINES (for future reference)
// ============================================================================

/**
 * Guidelines for writing effective prompts:
 * 
 * 1. BE SPECIFIC: Use concrete criteria and examples
 * 2. USE CLEAR MARKERS: [ME], [PROSPECT] to identify roles
 * 3. DEFINE CATEGORIES: List all possible outputs with clear definitions
 * 4. SET EXPECTATIONS: "most score 40-60" prevents inflated scores
 * 5. HANDLE EDGE CASES: "If NOT cold outreach, set all fields to null"
 * 6. REQUEST STRUCTURED OUTPUT: JSON format for reliable parsing
 * 
 * Testing prompts:
 * - Test with edge cases (very short convos, foreign languages, etc.)
 * - Verify classification accuracy with labeled samples
 * - Check for consistency across similar conversations
 */
