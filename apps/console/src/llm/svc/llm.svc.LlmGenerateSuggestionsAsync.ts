import { openaiClient } from "@/llm/adapter/llm.adapter.openai";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export async function LlmGenerateSuggestionsAsync(
  schema: FormSchemaJsonShape | undefined,
  history: { role: string; content: string }[]
): Promise<string[]> {
  
  // 1. Summarize Schema to save tokens
  const fieldSummary = schema && schema.properties
    ? Object.values(schema.properties).map(f => `${f.title} (${f.kind})`).join(", ")
    : "Empty Form";

  // 2. Summarize History (Last 3 turns)
  const recentHistory = history.slice(-3).map(m => `${m.role}: ${m.content}`).join("\n");

  const prompt = `
    Context:
    - Form Fields: ${fieldSummary}
    - Recent Chat:
    ${recentHistory}

    Task:
    Generate 4 short, actionable follow-up commands (max 6 words each) that the user might want to issue to the Form Architect next.
    - If the form is empty, suggest starting points (e.g. "Create a Personal Injury Intake").
    - If fields exist, suggest refinements (e.g. "Make phone number required", "Add a date of incident").
    - Be specific to the legal domain.

    Output:
    Strict JSON Array of strings: ["Suggestion 1", "Suggestion 2", ...]
  `;

  try {
    const raw = await openaiClient(prompt);
    // Tolerant Parse to catch potential markdown wrapping
    const jsonStr = raw.substring(raw.indexOf("["), raw.lastIndexOf("]") + 1);
    const suggestions = JSON.parse(jsonStr);
    return Array.isArray(suggestions) ? suggestions.slice(0, 4) : [];
  } catch (e) {
    console.error("Suggestion Gen Error", e);
    // Safe Fallback
    return ["Add contact fields", "Make all required", "Add a section header"];
  }
}