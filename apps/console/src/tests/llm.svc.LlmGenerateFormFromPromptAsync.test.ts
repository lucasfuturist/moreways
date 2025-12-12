import { describe, it, expect, vi, beforeEach } from "vitest";
import { IntakePromptToFormPipelineAsync } from "@/intake/svc/intake.svc.IntakePromptToFormPipeline";
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";

describe("IntakePromptToFormPipeline", () => {
  const MOCK_ORG_ID = "org_test_pipeline";
  const MOCK_SCHEMA_ID = "schema_gen_123";

  // [FIX] Complete mock to satisfy FormSchemaRepo interface
  const mockRepo = {
    createVersion: vi.fn(),
    getLatestByName: vi.fn(),
    getById: vi.fn(),
    listByOrg: vi.fn(),
    getPublicById: vi.fn(),
    listVersionsByName: vi.fn(),
  };

  const mockLlmAdapter = vi.fn();
  
  const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("runs full pipeline: normalize -> llm -> validate -> persist -> emit", async () => {
    const input = {
      prompt: "  make me a form  ",
      organizationId: MOCK_ORG_ID,
      formName: "Test Form",
    };

    mockLlmAdapter.mockResolvedValue({
      summary_message: "Here is your form.",
      thought_process: "Thinking...",
      schema_update: {
        type: "object",
        properties: {
          someField: { kind: "text", title: "Some Field" }
        }
      }
    });

    mockRepo.createVersion.mockResolvedValue({
      id: MOCK_SCHEMA_ID,
      organizationId: MOCK_ORG_ID,
      name: "Test Form",
      version: 1,
      schemaJson: {
        type: "object",
        properties: {
          someField: { kind: "text", title: "Some Field", id: "f1", key: "someField" }
        },
        required: [],
        order: ["someField"]
      },
      isDeprecated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await IntakePromptToFormPipelineAsync(input, {
      llmGenerateFormFromPrompt: mockLlmAdapter,
      normalizeFormSchema: normalizeFormSchemaJsonShape,
      repo: mockRepo,
      logger: mockLogger,
    });

    expect(mockLlmAdapter).toHaveBeenCalledWith(
        "make me a form", 
        undefined, 
        undefined, 
        undefined, 
        expect.anything()
    );
    expect(result.schema.properties.someField).toBeDefined();
    expect(result.message).toBe("Here is your form.");
    expect(result.formSchemaId).toBe(MOCK_SCHEMA_ID);
  });

  it("propagates errors if LLM fails", async () => {
    mockLlmAdapter.mockRejectedValue(new Error("LLM Exploded"));

    await expect(
      IntakePromptToFormPipelineAsync({
        prompt: "crash",
        organizationId: "org",
      }, {
        llmGenerateFormFromPrompt: mockLlmAdapter,
        normalizeFormSchema: normalizeFormSchemaJsonShape,
        repo: mockRepo,
        logger: mockLogger,
      })
    ).rejects.toThrow("LLM Exploded");

    expect(mockRepo.createVersion).not.toHaveBeenCalled();
  });
});