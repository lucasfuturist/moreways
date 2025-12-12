import { describe, it, expect, vi, beforeEach } from "vitest";
import { LlmPromptCriticAsync } from "@/llm/svc/llm.svc.LlmPromptCriticAsync";

// 1. Hoist
const mocks = vi.hoisted(() => ({
  openaiClient: vi.fn(),
}));

// 2. Mock
vi.mock("@/llm/adapter/llm.adapter.openai", () => ({
  openaiClient: mocks.openaiClient,
}));

describe("LlmPromptCriticAsync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const INPUT = {
    formName: "PI Intake",
    fieldTitle: "Injuries",
    fieldKind: "textarea",
    schemaSummary: "injuries (textarea)",
    turns: [
      { role: "user" as const, text: "I broke my leg." },
      { role: "assistant" as const, text: "Ok. Next question." } // Bad response
    ]
  };

  it("parses a valid critique response", async () => {
    // Mock a strict "Bad" rating response
    mocks.openaiClient.mockResolvedValue(JSON.stringify({
      scores: { empathy: 2, clarity: 9, goal_alignment: 5, sensitivity: 1 },
      rating: "problematic",
      better_reply: "I am so sorry to hear that. Are you in a safe place now?",
      system_prompt_suggestion: "Tell agent to validate pain.",
      notes: "Agent ignored injury."
    }));

    const result = await LlmPromptCriticAsync(INPUT);

    expect(result.rating).toBe("problematic");
    expect(result.scores.empathy).toBe(2);
    expect(result.better_reply).toContain("sorry");
  });

  it("handles non-JSON LLM output gracefully", async () => {
    mocks.openaiClient.mockResolvedValue("I cannot critique this.");

    const result = await LlmPromptCriticAsync(INPUT);

    // Should return a fallback object, not crash
    expect(result.rating).toBe("problematic");
    expect(result.notes).toContain("Failed to parse");
  });

  it("constructs the prompt with all context", async () => {
    mocks.openaiClient.mockResolvedValue("{}"); // Empty valid JSON

    await LlmPromptCriticAsync(INPUT);

    // Verify the prompt sent to OpenAI contains our inputs
    expect(mocks.openaiClient).toHaveBeenCalledWith(
      expect.stringContaining("PI Intake")
    );
    expect(mocks.openaiClient).toHaveBeenCalledWith(
      expect.stringContaining("I broke my leg")
    );
  });
});