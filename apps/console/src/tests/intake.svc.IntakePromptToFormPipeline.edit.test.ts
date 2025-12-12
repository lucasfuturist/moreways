import { describe, it, expect, vi, beforeEach } from "vitest";
import { IntakePromptToFormPipelineAsync } from "@/intake/svc/intake.svc.IntakePromptToFormPipeline";
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";
import type { FormGenerationEnvelope } from "@/llm/schema/llm.schema.FormGenerationResultSchema";

describe("IntakePromptToFormPipeline (Edit Mode)", () => {
  const ORG_ID = "org_test_edit";
  
  const mockRepo = {
    createVersion: vi.fn(),
    getLatestByName: vi.fn(),
    getById: vi.fn(),
    listByOrg: vi.fn(),
    getPublicById: vi.fn(),
    listVersionsByName: vi.fn(),
  };

  const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  const mockLlmAdapter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes conversational context (history + schema) to the LLM", async () => {
    // Existing state
    const currentSchema = {
      type: "object" as const,
      properties: {
        age: { kind: "number", title: "Age", id: "f1", key: "age" }
      },
      order: ["age"],
      required: []
    };

    // Chat history
    const history = [
      { role: "user" as const, content: "Create an age field" },
      { role: "assistant" as const, content: "Done." }
    ];

    // Mock the "Architect" Envelope response
    const mockEnvelope: FormGenerationEnvelope = {
      thought_process: "User wants to make age required",
      summary_message: "I've updated the Age field to be required.",
      schema_update: {
        type: "object",
        properties: {
          age: { kind: "number", title: "Age", isRequired: true }
        },
        order: ["age"]
      }
    };
    
    mockLlmAdapter.mockResolvedValue(mockEnvelope);

    mockRepo.createVersion.mockResolvedValue({
      id: "ver_2",
      version: 2,
      organizationId: ORG_ID,
      name: "My Form",
      schemaJson: mockEnvelope.schema_update,
      createdAt: new Date(), 
      updatedAt: new Date(),
      isDeprecated: false
    });

    // EXECUTE
    const result = await IntakePromptToFormPipelineAsync({
      prompt: "Make it required",
      organizationId: ORG_ID,
      formName: "My Form",
      currentSchema: currentSchema as any, // Cast to satisfy strict shape checks
      history: history,
    }, {
      llmGenerateFormFromPrompt: mockLlmAdapter,
      normalizeFormSchema: normalizeFormSchemaJsonShape,
      repo: mockRepo,
      logger: mockLogger
    });

    // ASSERT
    // [FIX] Updated expectation signature to match (prompt, history, schema, key, context)
    expect(mockLlmAdapter).toHaveBeenCalledWith(
      "Make it required",
      history,       
      currentSchema, 
      undefined, // scopedFieldKey
      expect.anything()
    );

    // 2. Verify Pipeline Result
    expect(result.message).toBe("I've updated the Age field to be required.");
    expect(result.version).toBe(2);
    expect(result.schema.properties.age.isRequired).toBe(true);
  });
});