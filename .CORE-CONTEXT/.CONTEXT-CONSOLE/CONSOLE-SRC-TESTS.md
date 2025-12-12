# High-Resolution Interface Map

## Tree: `apps/console/src/tests`

```
tests/
├── ai.api.generateOptionsRoute.test.ts
├── api.submit.honeypot.test.ts
├── crm.api.submissionDetailRoute.test.ts
├── crm.api.submissionsRoute.test.ts
├── crm.repo.FormSubmissionRepo.test.ts
├── crm.util.memoFormatter.test.ts
├── e2e/
│   ├── client-flow.spec.ts
│   ├── guardrails.spec.ts
│   ├── smoke.spec.ts
├── forms.logic.evaluateSubmissionFlags.complex.test.ts
├── forms.logic.evaluateSubmissionFlags.test.ts
├── forms.logic.mergeExtraction.test.ts
├── forms.logic.schemaIterator.test.ts
├── forms.repo.FormSchemaRepo.test.ts
├── forms.ui.canvas.field-actions.test.ts
├── forms.ui.hooks.useHistory.test.ts
├── forms.util.formSchemaNormalizer.fuzz.test.ts
├── forms.util.formSchemaNormalizer.test.ts
├── forms.util.migrateSchema.test.ts
├── infra.logging.redaction.test.ts
├── infra.security.encryption.integration.test.ts
├── infra.security.rateLimiter.test.ts
├── intake.api.agentRoute.test.ts
├── intake.api.createFormFromPromptRoute.test.ts
├── intake.logic.SimpleIntakeEngine.snapshot.test.ts
├── intake.svc.IntakePromptToFormPipeline.edit.test.ts
├── intake.svc.IntakePromptToFormPipeline.test.ts
├── intake.ui.magic-input.SuggestionEngine.test.ts
├── integration/
│   ├── engine.loop.test.ts
├── llm.schema.ClaimAssessment.validation.test.ts
├── llm.schema.FormGenerationResultSchema.test.ts
├── llm.svc.ExtractionPromptBuilder.test.ts
├── llm.svc.LlmClaimAssessorAsync.test.ts
├── llm.svc.LlmGenerateFormFromPromptAsync.micro.test.ts
├── llm.svc.LlmGenerateFormFromPromptAsync.test.ts
├── llm.svc.LlmIntakeAgentAsync.test.ts
├── llm.svc.LlmPromptCriticAsync.test.ts
├── llm.util.jsonParseSafe.test.ts
├── llm.util.promptLoader.test.ts
├── mocks/
│   ├── llm.mock.ts
├── setup/
│   ├── env.setup.ts
```

## File Summaries

### `ai.api.generateOptionsRoute.test.ts`
**Role:** Tests the AI endpoint for generating dropdown options.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `POST` (route), `openaiClient` (mock).

### `api.submit.honeypot.test.ts`
**Role:** Security test verifying that honeypot fields reject bot submissions without hitting the database.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `POST` (route), `RateLimiter` (mock), `formSubmissionRepo` (mock).

### `crm.api.submissionDetailRoute.test.ts`
**Role:** Tests the CRM endpoint for fetching a single submission by ID.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `GET` (route), `formSubmissionRepo` (mock), `GetCurrentUserAsync` (mock).

### `crm.api.submissionsRoute.test.ts`
**Role:** Tests the CRM endpoint for listing submissions with optional filters.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `GET` (route), `FormSubmissionRepo` (mock), `GetCurrentUserAsync` (mock).

### `crm.repo.FormSubmissionRepo.test.ts`
**Role:** Tests the repository layer for creating submissions, client linking strategies, and reading data.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `FormSubmissionRepo`, `db` (mock), `EncryptionService` (mock).

### `crm.util.memoFormatter.test.ts`
**Role:** Unit tests for the utility that converts JSON submission data into a Markdown legal memo.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `formatSubmissionAsMemo`.

### `e2e/client-flow.spec.ts`
**Role:** Playwright E2E test simulating a full client lifecycle: Public Form Access -> Submission -> CRM Verification.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `playwright`.

### `e2e/guardrails.spec.ts`
**Role:** Playwright E2E test verifying UI guardrails, specifically PII warnings when sensitive fields are generated.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `playwright`.

### `e2e/smoke.spec.ts`
**Role:** Playwright E2E smoke test verifying the core "Text-to-Form" generation flow in the UI.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `playwright`.

### `forms.logic.evaluateSubmissionFlags.complex.test.ts`
**Role:** Tests complex logic rule evaluation (AND/OR grouping) for generating submission flags.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `evaluateSubmissionFlags`.

### `forms.logic.evaluateSubmissionFlags.test.ts`
**Role:** Tests basic logic rule evaluation (operators like `older_than`, `matches_regex`).
**Key Exports:** *None (Test Suite)*
**Dependencies:** `evaluateSubmissionFlags`.

### `forms.logic.mergeExtraction.test.ts`
**Role:** Tests the merging of AI extraction results into form data, including side-loading and anti-hallucination checks.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `mergeExtractionIntoFormData`.

### `forms.logic.schemaIterator.test.ts`
**Role:** Tests the field navigation logic, including skipping filled fields and respecting conditional visibility.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `getNextFieldKey`.

### `forms.repo.FormSchemaRepo.test.ts`
**Role:** Tests the form schema repository for creating versioned schemas and retrieving the latest versions.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `formSchemaRepo`, `db` (mock).

### `forms.ui.canvas.field-actions.test.ts`
**Role:** Unit tests for UI helper functions that manipulate field definitions (add/edit/remove options).
**Key Exports:** *None (Test Suite)*
**Dependencies:** `generateKeyFromLabel`, `addOptionToField`.

### `forms.ui.hooks.useHistory.test.ts`
**Role:** Tests the custom React hook responsible for Undo/Redo state management.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `useHistory` (logic test).

### `forms.util.formSchemaNormalizer.fuzz.test.ts`
**Role:** Fuzz testing for the schema normalizer to ensure resilience against malformed LLM outputs.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `normalizeFormSchemaJsonShape`.

### `forms.util.formSchemaNormalizer.test.ts`
**Role:** Standard unit tests for the schema normalizer, verifying legacy migration and structural guarantees.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `normalizeFormSchemaJsonShape`.

### `forms.util.migrateSchema.test.ts`
**Role:** Tests the utility that upgrades deprecated schema structures to the latest version.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `migrateSchemaToV15`.

### `infra.logging.redaction.test.ts`
**Role:** Verifies that the logging infrastructure correctly redacts sensitive keys (PII) from logs.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `logger`.

### `infra.security.encryption.integration.test.ts`
**Role:** Integration test verifying that PII fields are encrypted before DB insertion and decrypted upon retrieval.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `FormSubmissionRepo`, `EncryptionService`.

### `infra.security.rateLimiter.test.ts`
**Role:** Tests the API rate limiter logic to ensure limits are enforced and counters reset.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `RateLimiter`.

### `intake.api.agentRoute.test.ts`
**Role:** Tests the conversational agent API endpoint, verifying parameter passing and error handling.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `POST` (route), `LlmIntakeAgentAsync` (mock).

### `intake.api.createFormFromPromptRoute.test.ts`
**Role:** Tests the form generation API endpoint, including auth checks and pipeline orchestration.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `createFormFromPromptRoute`, `IntakeCreateFormFromPromptAsync` (mock).

### `intake.logic.SimpleIntakeEngine.snapshot.test.ts`
**Role:** Tests the snapshot builder that categorizes fields into "filled" and "unfilled" for the AI context.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `buildSimpleIntakeSnapshot`.

### `intake.svc.IntakePromptToFormPipeline.edit.test.ts`
**Role:** Tests the "Edit Mode" of the form generation pipeline, ensuring history context is passed to the LLM.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `IntakePromptToFormPipelineAsync`.

### `intake.svc.IntakePromptToFormPipeline.test.ts`
**Role:** Tests the "Create Mode" of the form generation pipeline, verifying the normalize -> generate -> persist flow.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `IntakePromptToFormPipelineAsync`.

### `intake.ui.magic-input.SuggestionEngine.test.ts`
**Role:** Unit tests for the heuristic engine that suggests prompts based on current input state.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `getSuggestions`.

### `integration/engine.loop.test.ts`
**Role:** Integration test simulating a multi-turn conversation loop (Intake Engine) to verify state updates and field transitions.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `mergeExtractionIntoFormData`, `getNextFieldKey`.

### `llm.schema.ClaimAssessment.validation.test.ts`
**Role:** Verifies that the Claim Assessment Zod schema correctly validates and rejects AI outputs.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `ClaimAssessmentSchema`.

### `llm.schema.FormGenerationResultSchema.test.ts`
**Role:** Verifies that the Form Generation Zod schema correctly validates LLM envelopes.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `FormGenerationEnvelopeSchema`.

### `llm.svc.ExtractionPromptBuilder.test.ts`
**Role:** Tests the construction of the system prompt for the extraction model, ensuring context injection.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `buildExtractionPromptFromTemplate`.

### `llm.svc.LlmClaimAssessorAsync.test.ts`
**Role:** Tests the Claim Assessor service using mocked LLM responses for strong vs. weak claims.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `LlmClaimAssessorAsync`, `openaiClient` (mock).

### `llm.svc.LlmGenerateFormFromPromptAsync.micro.test.ts`
**Role:** Tests the "Micro-Edit" logic, verifying that the correct prompt template is selected when a specific field is targeted.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `LlmGenerateFormFromPromptAsync`.

### `llm.svc.LlmGenerateFormFromPromptAsync.test.ts`
**Role:** Tests the general form generation service, verifying template loading and mock mode fallback.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `LlmGenerateFormFromPromptAsync`.

### `llm.svc.LlmIntakeAgentAsync.test.ts`
**Role:** Tests the Intake Agent service, verifying "Deep Listening" extraction and contradiction detection.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `LlmIntakeAgentAsync`, `openaiClient` (mock).

### `llm.svc.LlmPromptCriticAsync.test.ts`
**Role:** Tests the Prompt Critic service, verifying it can parse critiques and handle failures.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `LlmPromptCriticAsync`.

### `llm.util.jsonParseSafe.test.ts`
**Role:** Unit tests for the robust JSON parser, checking recovery from markdown fences and noise.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `jsonParseSafe`.

### `llm.util.promptLoader.test.ts`
**Role:** Tests the file system prompt loader utility.
**Key Exports:** *None (Test Suite)*
**Dependencies:** `loadPrompt`.

### `mocks/llm.mock.ts`
**Role:** Provides reusable mock implementations of LLM clients for unit tests.
**Key Exports:**
- `mockLlmClientReturnsValidSchema` - Returns valid schema JSON.
- `mockLlmClientReturnsInvalidJson` - Returns garbage text.
**Dependencies:** None.

### `setup/env.setup.ts`
**Role:** Configures the global test environment, mocking the environment configuration module.
**Key Exports:** *None (Side Effect)*
**Dependencies:** `vi` (Vitest), `infra.svc.envConfig`.