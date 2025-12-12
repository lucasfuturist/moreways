/**
 * llm.util.jsonParseSafe
 *
 * Safe JSON parsing helper for LLM responses.
 *
 * Pipeline: raw LLM text → jsonParseSafe → FormGenerationResultSchema → normalizer → repo.
 *
 * Related docs:
 * - 05-llm-prompt-spec.md
 * - 06-fat-v1-prompt-to-preview.md
 *
 * Guarantees:
 * - Never throws. Returns { success: true, value } or { success: false, error }.
 * - Best-effort extraction of JSON from noisy LLM output (markdown, preamble, etc.).
 */

export type JsonParseSafeResult<T = unknown> =
  | { success: true; value: T }
  | { success: false; error: Error };

/**
 * Attempt to parse JSON from a string.
 *
 * Strategy:
 * 1. Try direct JSON.parse on trimmed input.
 * 2. If that fails, try to extract the substring from the first `{` to the last `}` and parse that.
 * 3. If all attempts fail, return { success: false, error }.
 */
export function jsonParseSafe<T = unknown>(input: string): JsonParseSafeResult<T> {
  const trimmed = input.trim();

  // First attempt: direct parse
  try {
    const value = JSON.parse(trimmed) as T;
    return { success: true, value };
  } catch {
    // fall through to extraction attempts
  }

  // Second attempt: handle markdown fences like ```json ... ```
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch && fencedMatch[1]) {
    const fencedContent = fencedMatch[1].trim();
    try {
      const value = JSON.parse(fencedContent) as T;
      return { success: true, value };
    } catch {
      // ignore and fall through
    }
  }

  // Third attempt: extract substring between first '{' and last '}'
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonSlice = trimmed.slice(firstBrace, lastBrace + 1);
    try {
      const value = JSON.parse(jsonSlice) as T;
      return { success: true, value };
    } catch {
      // ignore and fall through
    }
  }

  // If we reach here, all attempts failed.
  return {
    success: false,
    error: new Error("Failed to parse JSON from LLM response."),
  };
}
