import { describe, it, expect, vi, beforeEach } from "vitest";
import { LlmGenerateFormFromPromptAsync } from "@/llm/svc/llm.svc.LlmGenerateFormFromPromptAsync";

describe("LlmGenerateFormFromPromptAsync (Template Logic)", () => {
  const mockLoadPromptFn = vi.fn();
  const mockLlmClient = vi.fn();
  const mockLogger = { info: vi.fn(), warn: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadPromptFn.mockResolvedValue("Mock Template Content");
    mockLlmClient.mockResolvedValue(JSON.stringify({
      schema_update: { type: "object", properties: {} } // Minimal valid return
    }));
  });

  it("loads CREATE template when no schema exists", async () => {
    await LlmGenerateFormFromPromptAsync(
      "Make a form",
      [],
      undefined, // No current schema
      undefined, // No scoped key
      { loadPromptFn: mockLoadPromptFn, llmClient: mockLlmClient, logger: mockLogger }
    );

    expect(mockLoadPromptFn).toHaveBeenCalledWith("v1/generate-form-schema.txt");
  });

  it("loads EDIT template when schema exists but no specific field target", async () => {
    await LlmGenerateFormFromPromptAsync(
      "Add a field",
      [],
      { type: "object", properties: {} }, // Schema exists
      undefined, // No scoped key
      { loadPromptFn: mockLoadPromptFn, llmClient: mockLlmClient, logger: mockLogger }
    );

    expect(mockLoadPromptFn).toHaveBeenCalledWith("v1/edit-form-schema.txt");
  });

  it("loads MICRO-EDIT template when scopedFieldKey is provided", async () => {
    // This is the critical test for the Field Inspector
    await LlmGenerateFormFromPromptAsync(
      "Make it required",
      [],
      { type: "object", properties: {} }, 
      "firstName", // Scoped Key!
      { loadPromptFn: mockLoadPromptFn, llmClient: mockLlmClient, logger: mockLogger }
    );

    expect(mockLoadPromptFn).toHaveBeenCalledWith("v1/micro-edit-field.txt");
  });

  it("injects the scopedFieldKey into the prompt", async () => {
    mockLoadPromptFn.mockResolvedValue("Target: {{scoped_field_key}}");

    await LlmGenerateFormFromPromptAsync(
      "Fix this",
      [],
      { type: "object", properties: {} },
      "lastName",
      { loadPromptFn: mockLoadPromptFn, llmClient: mockLlmClient, logger: mockLogger }
    );

    // Verify interpolation happened before sending to LLM
    expect(mockLlmClient).toHaveBeenCalledWith(
      expect.stringContaining("Target: lastName")
    );
  });
});