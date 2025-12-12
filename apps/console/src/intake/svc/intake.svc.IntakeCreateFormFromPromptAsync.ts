/**
 * intake.svc.IntakeCreateFormFromPromptAsync
 *
 * Service: Entry point for creating/editing forms via prompt.
 *
 * Updates (v1.5):
 * - Pass-through for `history` and `message`.
 *
 * Related docs:
 * - 06-fat-v1-prompt-to-preview.md
 *
 * Guarantees:
 * - Validates org membership (assumed from API layer).
 */
import type {
  CreateFormFromPromptRequest,
  CreateFormFromPromptResponse,
} from "@/intake/schema/intake.schema.IntakeRequestTypes";
import {
  IntakePromptToFormPipelineAsync,
  type IntakePromptToFormPipelineInput,
  type IntakePromptToFormPipelineOutput,
} from "@/intake/svc/intake.svc.IntakePromptToFormPipeline";

export interface AuthUserLike {
  organizationId: string;
}

export interface IntakeCreateFormFromPromptDeps {
  pipeline?: (
    input: IntakePromptToFormPipelineInput
  ) => Promise<IntakePromptToFormPipelineOutput>;
}

export async function IntakeCreateFormFromPromptAsync(
  request: CreateFormFromPromptRequest,
  user: AuthUserLike,
  deps: IntakeCreateFormFromPromptDeps = {}
): Promise<CreateFormFromPromptResponse> {
  const { pipeline = IntakePromptToFormPipelineAsync } = deps;

  const pipelineInput: IntakePromptToFormPipelineInput = {
    prompt: request.prompt,
    organizationId: request.organizationId,
    formName: request.formName,
    currentSchema: request.currentSchema,
    history: request.history,
    // [UPDATE] Pass the scope down
    scopedFieldKey: request.scopedFieldKey,
  };

  const result = await pipeline(pipelineInput);

  return {
    formSchemaId: result.formSchemaId,
    version: result.version,
    schema: result.schema,
    message: result.message,
  };
}