# High-Resolution Interface Map: `apps/web/src/intake`

## Tree: C:\projects\moreways-ecosystem\apps\web\src\intake

```
intake/
├── svc/
│   ├── intake.svc.promptToFormPipeline.ts
```

---

## File Summaries

### `intake/svc/intake.svc.promptToFormPipeline.ts`
**Role:** Service pipeline that coordinates the generation of structured legal intake forms from natural language prompts.
**Key Exports:**
- `IntakePromptToFormPipeline` - Class encapsulating the generation workflow.
  - `executeAsync(organizationId, userPrompt): Promise<FormEntity>` - Orchestrates the process: normalizes input, invokes the LLM, validates the output schema, and persists the result via the repository.
**Dependencies:** `FormSchemaRepo`, `logger`, `FormSchemaData`, `LlmService` (Interface).