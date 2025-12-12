import { logger as defaultLogger } from "@/infra/logging/infra.svc.logger";
import type { FormSchema } from "@/forms/schema/forms.schema.FormSchemaModel";
import type { FormSchemaCreateInput } from "@/forms/schema/forms.schema.FormSchemaModel";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import type { ChatMessage } from "@/intake/schema/intake.schema.IntakeRequestTypes";
import type { FormGenerationEnvelope } from "@/llm/schema/llm.schema.FormGenerationResultSchema";
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";
import {
  formSchemaRepo,
  type FormSchemaRepo,
} from "@/forms/repo/forms.repo.FormSchemaRepo";
import {
  LlmGenerateFormFromPromptAsync,
} from "@/llm/svc/llm.svc.LlmGenerateFormFromPromptAsync";
import { openaiClient } from "@/llm/adapter/llm.adapter.openai"; 

type LoggerLike = {
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error?: (message: string, meta?: Record<string, unknown>) => void;
};

export interface IntakePromptToFormPipelineInput {
  prompt: string;
  organizationId: string;
  formName?: string;
  currentSchema?: FormSchemaJsonShape;
  history?: ChatMessage[];
  scopedFieldKey?: string;
}

export interface IntakePromptToFormPipelineOutput {
  formSchemaId: string;
  version: number;
  schema: FormSchemaJsonShape;
  message: string;
}

export interface IntakePromptToFormPipelineDeps {
  llmGenerateFormFromPrompt?: (
    prompt: string,
    history: ChatMessage[] | undefined,
    currentSchema: FormSchemaJsonShape | undefined,
    scopedFieldKey: string | undefined,
    ctx: { logger: LoggerLike; llmClient?: (p: string) => Promise<string> }
  ) => Promise<FormGenerationEnvelope>;

  normalizeFormSchema?: (raw: unknown) => FormSchemaJsonShape;
  repo?: FormSchemaRepo;
  logger?: LoggerLike;
}

export function promptFormStep01_normalizePrompt(prompt: string): string {
  return prompt.trim().replace(/\s+/g, " ");
}

export async function promptFormStep02_generateDraftEnvelope(
  normalizedPrompt: string,
  history: ChatMessage[] | undefined,
  currentSchema: FormSchemaJsonShape | undefined,
  scopedFieldKey: string | undefined,
  deps: {
    llmGenerateFormFromPrompt: (
      prompt: string,
      history: ChatMessage[] | undefined,
      currentSchema: FormSchemaJsonShape | undefined,
      scopedFieldKey: string | undefined,
      ctx: { logger: LoggerLike; llmClient?: (p: string) => Promise<string> }
    ) => Promise<FormGenerationEnvelope>;
    logger: LoggerLike;
  }
): Promise<FormGenerationEnvelope> {
  const { llmGenerateFormFromPrompt, logger } = deps;

  logger.info("[INTAKE] Generating draft envelope from prompt.", {
    source: "IntakePromptToFormPipeline",
    hasContext: !!currentSchema,
    historyLength: history?.length ?? 0,
    scopedFieldKey,
  });

  const envelope = await llmGenerateFormFromPrompt(
    normalizedPrompt,
    history,
    currentSchema,
    scopedFieldKey,
    { logger }
  );

  return envelope;
}

export function promptFormStep03_validateAndNormalizeSchema(
  envelope: FormGenerationEnvelope,
  deps: {
    normalizeFormSchema: (raw: unknown) => FormSchemaJsonShape;
  }
): FormSchemaJsonShape {
  const { normalizeFormSchema } = deps;
  return normalizeFormSchema(envelope.schema_update);
}

export async function promptFormStep04_persistSchema(
  validatedSchema: FormSchemaJsonShape,
  orgId: string,
  formName: string,
  deps: {
    repo: FormSchemaRepo;
    logger: LoggerLike;
  }
): Promise<FormSchema> {
  const { repo, logger } = deps;

  const createInput: FormSchemaCreateInput = {
    organizationId: orgId,
    name: formName,
    schemaJson: validatedSchema,
  };

  const persisted = await repo.createVersion(createInput);

  logger.info("[INTAKE] Persisted form schema version.", {
    source: "IntakePromptToFormPipeline",
    organizationId: orgId,
    formSchemaId: persisted.id,
    version: persisted.version,
    name: persisted.name,
  });

  return persisted;
}

export function promptFormStep05_emitEvents(
  persisted: FormSchema,
  message: string,
  deps: { logger: LoggerLike }
): void {
  const { logger } = deps;

  logger.info("[INTAKE] Emitting form schema created event.", {
    source: "IntakePromptToFormPipeline",
    organizationId: persisted.organizationId,
    formSchemaId: persisted.id,
    version: persisted.version,
    architectMessage: message.substring(0, 50) + "...",
  });
}

export async function IntakePromptToFormPipelineAsync(
  input: IntakePromptToFormPipelineInput,
  deps: IntakePromptToFormPipelineDeps = {}
): Promise<IntakePromptToFormPipelineOutput> {
  const {
    llmGenerateFormFromPrompt = LlmGenerateFormFromPromptAsync,
    normalizeFormSchema = normalizeFormSchemaJsonShape,
    repo = formSchemaRepo,
    logger = defaultLogger,
  } = deps;

  const { prompt, organizationId, formName, currentSchema, history, scopedFieldKey } = input;

  const normalizedPrompt = promptFormStep01_normalizePrompt(prompt);

  const envelope = await promptFormStep02_generateDraftEnvelope(
    normalizedPrompt,
    history,
    currentSchema,
    scopedFieldKey,
    { 
      llmGenerateFormFromPrompt: (p, h, s, k, ctx) => 
        llmGenerateFormFromPrompt(p, h, s, k, { ...ctx, llmClient: openaiClient }),
      logger 
    }
  );

  const validatedSchema = promptFormStep03_validateAndNormalizeSchema(
    envelope,
    { normalizeFormSchema }
  );

  // [FIX] Inject chat history into metadata so it persists with the schema
  if (history && history.length > 0) {
      validatedSchema.metadata = {
          ...validatedSchema.metadata,
          chatHistory: history
      };
  }

  const persisted = await promptFormStep04_persistSchema(
    validatedSchema,
    organizationId,
    formName ?? "Untitled form",
    { repo, logger }
  );

  promptFormStep05_emitEvents(persisted, envelope.summary_message, { logger });

  return {
    formSchemaId: persisted.id,
    version: persisted.version,
    schema: validatedSchema,
    message: envelope.summary_message,
  };
}