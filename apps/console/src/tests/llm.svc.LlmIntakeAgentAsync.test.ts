import { describe, it, expect, vi, beforeEach } from "vitest";
import { LlmIntakeAgentAsync } from "@/llm/svc/llm.svc.LlmIntakeAgentAsync";

// 1. Hoist Mocks
const mocks = vi.hoisted(() => ({
  openaiClient: vi.fn(),
}));

// 2. Mock Modules
vi.mock("@/llm/adapter/llm.adapter.openai", () => ({
  openaiClient: mocks.openaiClient,
}));

vi.mock("@/infra/config/infra.svc.envConfig", () => ({
  env: { llmApiKey: "mock-key", nodeEnv: "test" },
}));

describe("LlmIntakeAgentAsync (Deep Listening)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const BASE_INPUT = {
    fieldTitle: "First Name",
    fieldKey: "firstName",
    fieldKind: "text",
    userMessage: "My name is Jane Doe",
    formContext: "Test Intake",
    recentHistory: [],
    schemaSummary: "firstName (text), lastName (text)",
    formDataSummary: "", // Empty to start
  };

  it("Harvesting: Extracts current field AND side-loads other fields", async () => {
    // LLM Response mimicking Deep Listening
    mocks.openaiClient.mockResolvedValue(JSON.stringify({
      type: "answer",
      extractedValue: "Jane",
      replyMessage: "Got it.",
      updates: {
        lastName: "Doe"
      }
    }));

    const result = await LlmIntakeAgentAsync(BASE_INPUT);

    // 1. Verify Primary Extraction
    expect(result.extractedValue).toBe("Jane");
    expect(result.type).toBe("answer");

    // 2. Verify Side-Loading
    expect(result.updates).toBeDefined();
    expect(result.updates?.lastName).toBe("Doe");

    // 3. Verify Prompt Construction (Check if Instructions were injected)
    expect(mocks.openaiClient).toHaveBeenCalledWith(
      expect.stringContaining("Aggressively scan the USER INPUT")
    );
  });

  it("Contradiction: Detects conflict with existing data", async () => {
    // Scenario: User previously said 'Red', now says 'Blue'
    const inputWithHistory = {
      ...BASE_INPUT,
      fieldTitle: "Car Color",
      fieldKey: "carColor",
      userMessage: "Actually, it was Blue.",
      formDataSummary: "- carColor: Red", // Previous state
    };

    mocks.openaiClient.mockResolvedValue(JSON.stringify({
      type: "question",
      extractedValue: null,
      replyMessage: "Wait, earlier you mentioned the car was Red. Can you clarify?",
      updates: {}
    }));

    const result = await LlmIntakeAgentAsync(inputWithHistory);

    expect(result.type).toBe("question"); // Should STOP auto-advance
    expect(result.extractedValue).toBeNull();
    expect(result.replyMessage).toContain("earlier you mentioned");
  });

  it("Standard: Handles simple extraction without updates", async () => {
    mocks.openaiClient.mockResolvedValue(JSON.stringify({
      type: "answer",
      extractedValue: "Jane",
      replyMessage: "Thanks.",
      updates: {}
    }));

    const result = await LlmIntakeAgentAsync({
        ...BASE_INPUT,
        userMessage: "Just Jane."
    });

    expect(result.extractedValue).toBe("Jane");
    expect(result.updates).toEqual({});
  });

  it("Error Handling: Returns safe fallback on bad JSON", async () => {
    mocks.openaiClient.mockResolvedValue("This is not JSON");

    const result = await LlmIntakeAgentAsync(BASE_INPUT);

    expect(result.type).toBe("question");
    expect(result.replyMessage).toContain("missed that");
  });
});