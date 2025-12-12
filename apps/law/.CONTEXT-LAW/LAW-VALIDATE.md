# File Scan: `apps/law/src/validate`

## Tree: C:\projects\moreways-ecosystem\apps\law\src\validate

```
validate/

├── schema/
│   ├── validate.schema.verdict.ts
├── svc/
│   ├── validate.svc.judge.ts
```

## Files

### `validate/schema/validate.schema.verdict.ts`
**Role:** Defines the Zod data contracts for the validation input (user intent/form data) and the structural output of the AI judgment (verdict).
**Key Exports:**
- `VerdictSchema` - Zod schema validating the AI's analysis, confidence score, and citation list.
- `ValidationRequestSchema` - Zod schema validating the incoming request payload.
- `Verdict` - TypeScript type inferred from the output schema.
**Dependencies:** `zod`.

### `validate/svc/validate.svc.judge.ts`
**Role:** Acts as an AI Magistrate by resolving specific legal anchors (via hardcoded lookup or dynamic search) and evaluating user facts against the retrieved regulation text.
**Key Exports:**
- `JudgeService` - Class responsible for the "facts vs. law" evaluation logic.
- `evaluate(intent, formData): Promise<Verdict>` - Retrieves relevant legal context and prompts the LLM to render a verdict on the claim's validity.
**Dependencies:** `openai`, `HybridSearchService`, `SupabaseGraphReader`, `VerdictSchema`.