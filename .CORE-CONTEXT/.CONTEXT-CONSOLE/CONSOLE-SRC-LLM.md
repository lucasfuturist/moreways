# High-Resolution Interface Map

## Tree: `apps/console/src/llm`

```
llm/
├── adapter/
│   ├── llm.adapter.openai.ts
├── schema/
│   ├── llm.schema.ClaimAssessment.ts
│   ├── llm.schema.ExtractionResult.ts
│   ├── llm.schema.FormGenerationResultSchema.ts
│   ├── llm.schema.PromptCriticTypes.ts
├── svc/
│   ├── llm.svc.DialogModelCaller.ts
│   ├── llm.svc.ExtractionPromptBuilder.ts
│   ├── llm.svc.LlmClaimAssessorAsync.ts
│   ├── llm.svc.LlmGenerateFormFromPromptAsync.ts
│   ├── llm.svc.LlmGenerateLogicFromPromptAsync.ts
│   ├── llm.svc.LlmGenerateSuggestionsAsync.ts
│   ├── llm.svc.LlmIntakeAgentAsync.ts
│   ├── llm.svc.LlmIntakeReviewAsync.ts
│   ├── llm.svc.LlmPromptCriticAsync.ts
│   ├── llm.svc.SimpleReviewSync.ts
├── util/
│   ├── llm.util.jsonParseSafe.ts
│   ├── llm.util.promptLoader.ts
```

## File Summaries

### `adapter/llm.adapter.openai.ts`
**Role:** Singleton wrapper for the OpenAI API client, managing API keys and default configuration.
**Key Exports:**
- `openaiClient(fullPrompt, options): Promise<string>` - Executes a completion request (text or JSON mode) and returns the content string.
**Dependencies:** `openai` (package), `env`, `logger`.

### `schema/llm.schema.ClaimAssessment.ts`
**Role:** Defines the Zod schema for the AI legal merit assessment (scores, analysis, credibility flags).
**Key Exports:**
- `ClaimAssessmentSchema` - Validation rules for the assessment JSON.
- `ClaimAssessment` - TypeScript interface for the assessment result.
**Dependencies:** `zod`.

### `schema/llm.schema.ExtractionResult.ts`
**Role:** Defines the Zod schema for the JSON patch returned by the intake extraction model (field updates, traits, clarification requests).
**Key Exports:**
- `ExtractionResultSchema` - Validation rules for the extraction payload.
- `ExtractionResult` - TypeScript interface for the patch.
**Dependencies:** `zod`.

### `schema/llm.schema.FormGenerationResultSchema.ts`
**Role:** Defines the Zod schema for the "Form Architect" output, ensuring generated schemas match the system's expected JSON structure.
**Key Exports:**
- `FormGenerationEnvelopeSchema` - Validation for the thought process and schema update payload.
- `FormGenerationEnvelope` - TypeScript interface for the result.
**Dependencies:** `zod`.

### `schema/llm.schema.PromptCriticTypes.ts`
**Role:** Defines TypeScript interfaces for the "Prompt Critic" pipeline (grading AI performance).
**Key Exports:**
- `PromptCriticInput` - Contract for sending transcript data to the critic.
- `PromptCriticOutput` - Contract for receiving scores and feedback.
**Dependencies:** None.

### `svc/llm.svc.DialogModelCaller.ts`
**Role:** Orchestrates LLM calls for dialog and extraction, handling logging (JSONL) and validation.
**Key Exports:**
- `callDialogModel(prompt, options): Promise<string>` - Generic wrapper for text/json generation with logging.
- `callExtractionModel(input): Promise<ExtractionResult>` - Specialized pipeline that builds a prompt, calls the LLM, parses JSON, and validates against `ExtractionResultSchema`.
**Dependencies:** `openaiClient`, `promptLogger`, `ExtractionPromptBuilder`, `jsonParseSafe`.

### `svc/llm.svc.ExtractionPromptBuilder.ts`
**Role:** Constructs the massive system prompt for the extraction model by serializing the current form state, history, and schema summaries.
**Key Exports:**
- `buildExtractionPromptFromTemplate(input): string` - Returns the final interpolated string prompt for the LLM.
**Dependencies:** `FormSchemaJsonShape`.

### `svc/llm.svc.LlmClaimAssessorAsync.ts`
**Role:** AI Agent service that evaluates completed intake data for legal merit and credibility.
**Key Exports:**
- `LlmClaimAssessorAsync(input): Promise<ClaimAssessment>` - Generates a Prima Facie analysis and merit score.
**Dependencies:** `openaiClient`, `ClaimAssessmentSchema`.

### `svc/llm.svc.LlmGenerateFormFromPromptAsync.ts`
**Role:** AI Agent service (Architect) that transforms natural language prompts into form schemas (Create or Edit modes).
**Key Exports:**
- `LlmGenerateFormFromPromptAsync(prompt, history, currentSchema, ...): Promise<FormGenerationEnvelope>` - Loads specific templates, injects style guides, and returns a validated schema envelope.
**Dependencies:** `loadPrompt`, `promptLogger`, `jsonParseSafe`.

### `svc/llm.svc.LlmGenerateLogicFromPromptAsync.ts`
**Role:** AI Agent service that generates conditional logic rules (branching) based on natural language instructions.
**Key Exports:**
- `LlmGenerateLogicFromPromptAsync(schema, userPrompt): Promise<LogicGenerationResult[]>` - Returns a list of logic rules targeting specific fields.
**Dependencies:** `openaiClient`, `promptLoader`.

### `svc/llm.svc.LlmGenerateSuggestionsAsync.ts`
**Role:** Generates contextual "Magic Input" suggestions for the form builder UI.
**Key Exports:**
- `LlmGenerateSuggestionsAsync(schema, history): Promise<string[]>` - Returns short actionable commands based on form state.
**Dependencies:** `openaiClient`.

### `svc/llm.svc.LlmIntakeAgentAsync.ts`
**Role:** The "Interviewer" agent service used in the chat-based runner to ask questions or extract answers.
**Key Exports:**
- `LlmIntakeAgentAsync(input): Promise<IntakeAgentResponse>` - Determines if the user answered a question, provided side-loaded data, or needs clarification.
**Dependencies:** `openaiClient`, `jsonParseSafe`.

### `svc/llm.svc.LlmIntakeReviewAsync.ts`
**Role:** Generates a natural language summary of the data collected so far for user review.
**Key Exports:**
- `LlmIntakeReviewAsync(input): Promise<string>` - Produces a conversational summary of filled vs. unfilled fields.
**Dependencies:** `openaiClient`.

### `svc/llm.svc.LlmPromptCriticAsync.ts`
**Role:** The "Coach" agent service that analyzes chat transcripts to grade empathy, clarity, and safety.
**Key Exports:**
- `LlmPromptCriticAsync(input): Promise<PromptCriticOutput>` - Returns scores and specific improvement suggestions.
**Dependencies:** `openaiClient`, `jsonParseSafe`.

### `svc/llm.svc.SimpleReviewSync.ts`
**Role:** A deterministic (non-AI) fallback for generating review summaries to ensure 100% accuracy of displayed data.
**Key Exports:**
- `buildDeterministicReviewReply(snapshot, userMessage): string` - logical string builder for summarizing answers.
**Dependencies:** `SimpleIntakeSnapshot`.

### `util/llm.util.jsonParseSafe.ts`
**Role:** Robust utility for extracting valid JSON from LLM responses, handling Markdown fences and preamble noise.
**Key Exports:**
- `jsonParseSafe<T>(input): Result` - Attempts multiple parsing strategies (direct, fenced, substring) to recover JSON.
**Dependencies:** None.

### `util/llm.util.promptLoader.ts`
**Role:** File system utility to load raw text prompt templates from the project root.
**Key Exports:**
- `loadPrompt(relativePath): Promise<string>` - Reads files from the `prompts/` directory.
**Dependencies:** `fs`, `path`.