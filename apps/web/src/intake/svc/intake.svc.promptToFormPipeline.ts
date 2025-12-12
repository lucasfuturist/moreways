/**
 * intake.svc.promptToFormPipeline
 *
 * Pipeline: lawyer prompt → normalized → LLM draft → validated schema → persisted version.
 * Related docs: 01-product-spec-v1.md
 */
import { FormSchemaRepo } from "@/forms/repo/forms.repo.formSchemaRepo";
import { logger } from "@/infra/logging/infra.svc.logger";
import { FormSchemaData } from "@/forms/schema/forms.schema.formEntity";

interface LlmService {
  generateStructured(prompt: string): Promise<FormSchemaData>;
}

export class IntakePromptToFormPipeline {
  constructor(
    private readonly formRepo: FormSchemaRepo,
    private readonly llm: LlmService
  ) {}

  async executeAsync(organizationId: string, userPrompt: string) {
    // [SECURITY] Context logging
    logger.info("Starting prompt-to-form pipeline", { organizationId });

    // [PIPELINE] Step 01 – normalize prompt
    const cleanPrompt = userPrompt.trim();

    // [PIPELINE] Step 02 – call LLM
    const draftSchema = await this.llm.generateStructured(cleanPrompt);

    // [PIPELINE] Step 03 – validate & normalize schema
    if (!draftSchema.fields || draftSchema.fields.length === 0) {
      throw new Error("LLM failed to generate valid fields");
    }

    // [PIPELINE] Step 04 – persist schema
    const savedForm = await this.formRepo.createVersionAsync(organizationId, draftSchema);

    // [PIPELINE] Step 05 – emit events
    logger.info("Form generated successfully", { formId: savedForm.id });

    return savedForm;
  }
}
