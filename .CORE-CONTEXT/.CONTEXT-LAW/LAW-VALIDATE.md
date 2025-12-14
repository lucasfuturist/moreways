--- START OF FILE LAW-VALIDATE.md ---

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

### `schema/validate.schema.verdict.ts`
**Role:** Defines the Zod schemas and TypeScript types for the compliance validation request payload and the resulting legal verdict.
**Key Exports:**
- `VerdictSchema` - Zod object validating and normalizing the Magistrate's decision (status, confidence, analysis, citations). Includes robust coercion for missing citations.
- `Verdict` - Type inference of the output schema.
- `ValidationRequestSchema` - Zod object validating the input intent and raw form data.
**Dependencies:** `zod`.

### `svc/validate.svc.judge.ts`
**Role:** Orchestrates the compliance review process by resolving relevant regulations (via hardcoded anchors or hybrid search), fetching content and overrides, and prompting an LLM (with retry resilience) to render a legal verdict based on the facts.
**Key Exports:**
- `JudgeService` - Class managing the judgment logic.
- `evaluate(intent, formData): Promise<Verdict>` - Resolves legal context, checks for overrides, and generates a structured compliance opinion using GPT-4o.
**Dependencies:** `openai`, `HybridSearchService`, `SupabaseGraphReader`, `SupabaseOverrideRepo`, `Verdict`, `withRetry`.