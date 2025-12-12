/**
 * llm.svc.LlmPromptCriticAsync
 *
 * Service: The "Coach".
 * Analyzes a transcript and provides structured feedback on the assistant's performance.
 *
 * Usage:
 *   const feedback = await LlmPromptCriticAsync({ ...context, turns });
 */

import { openaiClient } from "@/llm/adapter/llm.adapter.openai";
import { jsonParseSafe } from "@/llm/util/llm.util.jsonParseSafe";
import type { PromptCriticInput, PromptCriticOutput } from "@/llm/schema/llm.schema.PromptCriticTypes";

export async function LlmPromptCriticAsync(input: PromptCriticInput): Promise<PromptCriticOutput> {
  const transcript = input.turns
    .map((t) => `${t.role.toUpperCase()}: "${t.text}"`)
    .join("\n");

  const prompt = `
    SYSTEM:
    You are an expert UX and legal-intake conversation coach.
    You analyze transcripts between an AI intake assistant and a potential legal client.
    
    Your job is to:
    - Detect missed empathy opportunities (e.g., ignoring injury mentions).
    - Detect robotic or repetitive phrasing.
    - Detect "context amnesia" (ignoring previous user questions).
    - Propose better replies and specific prompt improvements.

    CONTEXT (The Assistant's Goal):
    - Form Name: ${input.formName}
    - Target Field: "${input.fieldTitle}" (${input.fieldKind})
    - Form Schema Summary:
    ${input.schemaSummary}

    TRANSCRIPT TO REVIEW:
    ${transcript}

    YOUR TASKS:
    
    1. SCORE the assistant's LAST response on (0-10):
       - Empathy (Does it validate feelings/situations?)
       - Clarity (Is the question clear?)
       - Goal Alignment (Does it move the intake forward appropriately?)
       - Sensitivity (Does it handle mentions of harm/risk with care?)

    2. RATE the response:
       - "good": Meets high standards.
       - "needs_soft_tweak": Functional but could be warmer or clearer.
       - "problematic": Ignores user intent, dismisses trauma, or hallucinates.

    3. IMPROVE (If not "good"):
       - Write a single "better_reply" that validates the user (if needed), connects to the legal goal, and asks the question.
    
    4. SUGGEST:
       - Write a 1-2 sentence "system_prompt_suggestion" to prevent this mistake globally.

    OUTPUT JSON FORMAT:
    {
      "scores": { "empathy": number, "clarity": number, "goal_alignment": number, "sensitivity": number },
      "rating": "good" | "needs_soft_tweak" | "problematic",
      "better_reply": "string or null",
      "system_prompt_suggestion": "string or null",
      "notes": "string (reasoning)"
    }
  `;

  try {
    const raw = await openaiClient(prompt);
    const parsed = jsonParseSafe<PromptCriticOutput>(raw);

    if (parsed.success) {
      return parsed.value;
    }

    // Fallback for parsing failure
    return {
      scores: { empathy: 0, clarity: 0, goal_alignment: 0, sensitivity: 0 },
      rating: "problematic",
      better_reply: null,
      system_prompt_suggestion: null,
      notes: "Failed to parse Critic response.",
    };
  } catch (err) {
    console.error("[PromptCritic] Error:", err);
    throw new Error("Prompt Critic Failed");
  }
}