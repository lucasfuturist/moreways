import { jsonParseSafe } from "@/llm/util/llm.util.jsonParseSafe";
import { loadPrompt } from "@/llm/util/llm.util.promptLoader";
import { logLlmInteraction } from "@/infra/logging/infra.svc.promptLogger";
import { 
  FormGenerationEnvelopeSchema, 
  type FormGenerationEnvelope 
} from "@/llm/schema/llm.schema.FormGenerationResultSchema";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import type { ChatMessage } from "@/intake/schema/intake.schema.IntakeRequestTypes";

type LoggerLike = {
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
};

export interface LlmGenerateFormFromPromptDeps {
  llmClient?: (fullPrompt: string) => Promise<string>;
  loadPromptFn?: (relativePath: string) => Promise<string>;
  mockModeOverride?: boolean;
  logger?: LoggerLike;
}

function formatHistory(history: ChatMessage[]): string {
  if (!history || history.length === 0) return "No history.";
  return history.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n");
}

// [NEW] Enforcing Human-Readable Titles
const TITLE_STYLE_GUIDE = `
STYLE GUIDE FOR 'title' FIELD:
- The 'title' is the label the user sees. It MUST be natural language.
- BAD: "firstName", "dateOfIncident", "isEmployed"
- GOOD: "First Name", "Date of Incident", "Are you currently employed?"
- If the prompt implies a question, use the question as the title (e.g., "What happened?").
`;

// [UPDATED] Refined Placeholder Guide
const PLACEHOLDER_STYLE_GUIDE = `
STYLE GUIDE FOR 'placeholder' FIELD:
- The 'placeholder' MUST be a realistic "ghost data" example.
- Examples:
  - Email: "alex.smith@gmail.com"
  - Phone: "(555) 019-2834"
  - Zip: "90210"
  - Credit Score: "720"
  - SSN: "XXX-XX-6789"
  - Rent: "$2,500.00"
  - Description: "I was driving north on Main St when..."
`;

export async function LlmGenerateFormFromPromptAsync(
  userPrompt: string,
  history: ChatMessage[] | undefined,
  currentSchema: FormSchemaJsonShape | undefined,
  scopedFieldKey: string | undefined,
  deps: LlmGenerateFormFromPromptDeps = {}
): Promise<FormGenerationEnvelope> {
  const {
    llmClient,
    loadPromptFn = loadPrompt,
    mockModeOverride,
    logger = console,
  } = deps;

  const isMockMode = mockModeOverride ?? (process.env.LLM_MOCK_MODE === "true");

  if (isMockMode) {
    const defaultMockSchema: FormSchemaJsonShape = {
        type: "object", 
        properties: {
            mockField: { 
                id: "m_1", 
                key: "mockField", 
                kind: "text", 
                title: "Mock Question?", 
                placeholder: "Example answer" 
            }
        }, 
        required: ["mockField"] 
    };
    return {
      thought_process: "Mock mode active.",
      summary_message: "Mock form generated.",
      schema_update: currentSchema || defaultMockSchema,
    };
  }

  if (!llmClient) throw new Error("LlmGenerateFormFromPromptAsync requires llmClient in real mode.");

  let templateName = "v1/generate-form-schema.txt";
  
  if (scopedFieldKey && currentSchema) {
    templateName = "v1/micro-edit-field.txt";
  } else if (currentSchema) {
    templateName = "v1/edit-form-schema.txt";
  }

  logger.info(`[LLM] Loading template: ${templateName}`, { scopedFieldKey });

  const template = await loadPromptFn(templateName);
  
  let fullPrompt = template.replace("{{user_prompt}}", userPrompt);

  if (currentSchema) {
    fullPrompt = fullPrompt.replace("{{current_schema_json}}", JSON.stringify(currentSchema));
    fullPrompt = fullPrompt.replace("{{chat_history}}", formatHistory(history || []));
  }

  if (scopedFieldKey) {
    fullPrompt = fullPrompt.replace("{{scoped_field_key}}", scopedFieldKey);
  }

  // [INJECTION] Inject both Style Guides
  fullPrompt += `\n\n${TITLE_STYLE_GUIDE}\n\n${PLACEHOLDER_STYLE_GUIDE}`;

  const rawText = await llmClient(fullPrompt);

  logLlmInteraction({
    template: templateName,
    mode: scopedFieldKey ? "EDIT" : (currentSchema ? "EDIT" : "CREATE"),
    userPrompt,
    fullPrompt,
    rawResponse: rawText,
  });

  const parsed = jsonParseSafe(rawText);
  if (!parsed.success) {
    logger.warn("[LLM] JSON Parse Failed", { rawText });
    throw new Error("llm_invalid_output: JSON parse failed.");
  }

  let data = parsed.value as any;

  if (!data.schema_update && (data.properties || data.fields)) {
      if (data.fields && !data.properties) {
          data.properties = data.fields;
          delete data.fields;
      }
      data = {
          thought_process: "Auto-repaired: LLM returned raw schema.",
          summary_message: "I've updated the form based on your request.",
          schema_update: data
      };
  }

  const validation = FormGenerationEnvelopeSchema.safeParse(data);
  
  if (!validation.success) {
    logger.warn("[LLM] Schema validation failed", { 
        errors: validation.error, 
        rawJson: parsed.value 
    });
    throw new Error("llm_invalid_output: Envelope validation failed.");
  }

  return validation.data;
}