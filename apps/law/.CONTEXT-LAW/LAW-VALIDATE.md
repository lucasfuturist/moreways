# High-Resolution Interface Map: `apps/law/src/validate`

## Tree: `apps/law/src/validate`

```
validate/

├── schema/
│   ├── validate.schema.verdict.ts
├── svc/
│   ├── validate.svc.judge.ts
```

## File Summaries

### `validate.schema.verdict.ts`
**Role:** Defines the Zod schemas and TypeScript types for the compliance validation request payload and the resulting legal verdict.
**Key Exports:**
- `VerdictSchema` - Zod object validating the structure of the Magistrate's decision (status, confidence, analysis, citations).
- `Verdict` - Type inference of the output schema.
- `ValidationRequestSchema` - Zod object validating the input intent and raw form data.
**Dependencies:** `zod`

### `validate.svc.judge.ts`
**Role:** Orchestrates the compliance review process by resolving relevant regulations (via hardcoded anchors or search), fetching content and overrides, and prompting an LLM to render a legal verdict based on the facts.
**Key Exports:**
- `JudgeService` - Class managing the judgment logic.
- `evaluate(intent: string, formData: Record<string, any>): Promise<Verdict>` - Resolves legal context, checks for overrides, and generates a structured compliance opinion using GPT-4o.
**Dependencies:** `openai`, `HybridSearchService`, `SupabaseGraphReader`, `SupabaseOverrideRepo`, `Verdict`, `LegalNodeRecord`