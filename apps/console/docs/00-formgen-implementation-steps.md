## 0. root + env scaffolding

* [x] **project root sanity**

  * [x] Confirm `C:\projects\argueOS-v1-form\` has `README.md`, `docs/` and your `src/` skeleton.
  * [x] Add `package.json` scripts for `dev`, `build`, `test`, `lint`, `typecheck`.
  * [x] Create `.env.example` with all required vars: `CONSOLE_DATABASE_URL`, `OPENAI_API_KEY`, `LLM_MOCK_MODE`, etc.
  * [x] Ensure TS + ESLint configs exist (`tsconfig`, `eslint`, `prettier`).

---

## 1. infra layer

### 1.1 DB client

* [x] **`src/infra/db/infra.repo.dbClient.ts`**

  * [x] Decide DB lib (Prisma / Drizzle / node-postgres).
  * [x] Export a single shared DB client instance.
  * [x] Wire it to `CONSOLE_DATABASE_URL` from env config.
  * [ ] Configure sensible pool size and timeouts.
  * [x] Add comments about **not** importing this from UI/API directly (only repo layer).

### 1.2 migrations runner

* [ ] **`src/infra/db/infra.repo.migrationsRunner.ts`**

  * [ ] Implement a function to apply pending migrations.
  * [ ] Hook into the DB lib’s migration system.
  * [ ] Provide a CLI entry (e.g., `pnpm db:migrate` calling this file).
  * [ ] Log migration start / end, and fail loudly on error.

### 1.3 env config

* [x] **`src/infra/config/infra.svc.envConfig.ts`**

  * [x] Define a typed `Env` interface.
  * [x] Read from `process.env` once and validate presence / types.
  * [x] Apply defaults for non-critical vars (like `LLM_MOCK_MODE`).
  * [x] Export a frozen `env` object consumed by all other layers.
  * [x] Ensure no file outside `infra` reads `process.env` directly.

### 1.4 logging

* [x] **`src/infra/logging/infra.svc.logger.ts`**

  * [x] Define logger interface: `info`, `warn`, `error`, `debug`.
  * [x] Implement a minimal console-based logger with structured payloads.
  * [ ] Explicitly strip or redact any PII / Sensitive data in log helpers.
  * [x] Add helper to include `organizationId` and `requestId` where available.

---

## 2. auth domain

### 2.1 user types

* [x] **`src/auth/schema/auth.schema.UserTypes.ts`**

  * [x] Define `User` type: `id`, `organizationId`, `email`, `role`, timestamps.
  * [x] Define `AuthContext` or similar type for what API routes see (user + org).
  * [ ] Document allowed roles (`admin`, `staff`, etc.) and their meaning.

### 2.2 auth services

* [ ] **`src/auth/svc/auth.svc.AuthenticateUserAsync.ts`**

  * [ ] Decide on auth mechanism (session/JWT/NextAuth).
  * [ ] Implement `AuthenticateUserAsync(credentials)` returning `User` or error.
  * [ ] Centralize password hashing / verification (if email+password).
* [x] **`src/auth/svc/auth.svc.GetCurrentUserAsync.ts`**

  * [x] Implement `GetCurrentUserAsync(request)` → `User | null`.
  * [x] Extract auth token/session from the HTTP request.
  * [ ] Use `AuthenticateUserAsync` or equivalent to resolve the user.
  * [x] Ensure returned user includes `organizationId` for multi-tenancy.

### 2.3 auth routes (basic)

* [ ] **`src/auth/api/auth.api.signInRoute.ts`**

  * [ ] Implement HTTP handler: accept credentials, call `AuthenticateUserAsync`.
  * [ ] On success: set session/cookie/token, return user summary.
  * [ ] On fail: return 401 with a sanitized error.
* [ ] **`src/auth/api/auth.api.signOutRoute.ts`**

  * [ ] Implement HTTP handler: clear session/cookie/token.
  * [ ] Return 200 with simple JSON `{ signedOut: true }`.

---

## 3. forms domain

### 3.1 schema types

* [x] **`src/forms/schema/forms.schema.FormSchemaModel.ts`**

  * [x] Define DB-model type with fields:

    * [x] `id`, `organizationId`, `name`, `version`, `schemaJson`, `isDeprecated`, timestamps.
  * [x] Add helper type for create input vs read model.
* [x] **`src/forms/schema/forms.schema.FormSchemaJsonShape.ts`**

  * [x] Define TypeScript type representing the form JSON (subset of JSON Schema):

    * [x] `properties` object keyed by camelCase field names.
    * [x] Each field: `type`, `title`, maybe `description`, `options` for selects, etc.
    * [x] Optional top-level `required: string[]`.
  * [x] Include comments that align this type with the prompt spec.

### 3.2 normalization utilities

* [x] **`src/forms/util/forms.util.formSchemaNormalizer.ts`**

  * [x] Implement function that:

    * [x] Validates field names and coerces to camelCase.
    * [x] Strips unknown field attributes from LLM output.
    * [x] Sorts fields or applies a consistent ordering.
    * [x] Ensures `required` keys all exist in `properties`.
  * [x] Make sure this function is pure and reusable across pipeline + UI.

### 3.3 repo

* [x] **`src/forms/repo/forms.repo.FormSchemaRepo.ts`**

  * [x] Implement:

    * [x] `createVersion({ organizationId, name, schemaJson })` → returns `FormSchemaModel`.
    * [x] `getLatest({ organizationId, name })` → latest version or `null`.
  * [x] Enforce `organizationId` in every query.
  * [x] Add DB-level unique constraint on `(organizationId, name, version)`.
  * [ ] Ensure soft-deprecations (`isDeprecated`) are handled if needed later.

---

## 4. llm domain

### 4.1 output validation schema

* [x] **`src/llm/schema/llm.schema.FormGenerationResultSchema.ts`**

  * [x] Define a runtime validator (Zod or similar) for LLM output:

    * [x] Must match `FormSchemaJsonShape`.
    * [x] Only allowed field types: `text`, `textarea`, `date`, `select`, `checkbox`.
    * [x] Must have `properties` object.
    * [x] `required` array, if present, must reference existing fields only.
  * [x] Export both the validator and its inferred TS type for reuse.

### 4.2 utility functions

* [x] **`src/llm/util/llm.util.promptLoader.ts`**

  * [x] Implement helper to load a prompt file given a relative path (e.g., `v1/generate-form-schema.txt`).
  * [x] Resolve path from `/prompts` at project root.
  * [x] Provide clear error if file is missing.
* [x] **`src/llm/util/llm.util.jsonParseSafe.ts`**

  * [x] Implement safe JSON parse:

    * [x] Returns `{ success: true, value }` or `{ success: false, error }`.
    * [x] Optionally strips leading/trailing noise around JSON.

### 4.3 LLM adapter

* [x] **`src/llm/svc/llm.svc.LlmGenerateFormFromPromptAsync.ts`**

  * [x] Implement function: `LlmGenerateFormFromPromptAsync(prompt: string)`:

    * [x] Load template: `/prompts/v1/generate-form-schema.txt` (via `promptLoader`).
    * [x] Interpolate `{{user_prompt}}` with the lawyer’s prompt.
    * [x] If mock mode is enabled (`LLM_MOCK_MODE` or `mockModeOverride`):

      * [x] Return a deterministic sample schema (valid per validator).
    * [x] Else:

      * [x] Call the injected vendor client (`llmClient`) with system + user prompt.
      * [x] Extract text output.
      * [x] Use `jsonParseSafe` to parse JSON.
      * [x] Validate with `FormGenerationResultSchema`.
  * [x] On validation failure:

    * [x] Throw a structured error (`code: 'llm_invalid_output'`).
  * [x] Make sure no Sensitive client data is ever sent here (prompt is meta only, and no raw prompt is logged).

---

## 5. intake domain: pipeline + API

### 5.1 request/response types

* [x] **`src/intake/schema/intake.schema.IntakeRequestTypes.ts`**

  * [x] Define `CreateFormFromPromptRequest`:

    * [x] `prompt: string`
    * [x] `organizationId: string`
    * [x] optional `formName: string`
  * [x] Define `CreateFormFromPromptResponse`:

    * [x] `formSchemaId`, `version`, `schema` (the normalized schema JSON).
  * [x] Define error response shapes (e.g., `{ code, message }`).

### 5.2 pipeline

* [x] **`src/intake/svc/intake.svc.IntakePromptToFormPipeline.ts`**

  * [x] Implement internal functions:

    * [x] `promptFormStep01_normalizePrompt(prompt)`
    * [x] `promptFormStep02_generateDraftSchema(normalizedPrompt)`
    * [x] `promptFormStep03_validateAndNormalizeSchema(draftSchema)`
    * [x] `promptFormStep04_persistSchema(validatedSchema, orgId, formName)`
    * [x] `promptFormStep05_emitEvents(persistedSchema)`
  * [x] Ensure each step is individually testable and pure where possible.
  * [x] Use forms normalizer + LLM adapter + repo in the appropriate steps.
* [x] **`src/intake/svc/intake.svc.IntakeCreateFormFromPromptAsync.ts`**

  * [x] Implement a public service function that:

    * [x] Accepts `CreateFormFromPromptRequest` + `User` (or `organizationId`).
    * [x] Delegates to the pipeline functions.
    * [x] Returns `CreateFormFromPromptResponse`.

### 5.3 API route

* [x] **`src/intake/api/intake.api.createFormFromPromptRoute.ts`**

  * [x] Implement an HTTP handler for `POST /api/intake/forms/from-prompt`:

    * [x] Parse body as `CreateFormFromPromptRequest`.
    * [x] Fetch current user via `GetCurrentUserAsync` (or injected equivalent).
    * [x] Verify `user.organizationId === body.organizationId`; else 403.
    * [x] Call `IntakeCreateFormFromPromptAsync`.
    * [x] Map domain errors to appropriate status codes (400/401/403/500).
  * [x] Ensure no raw stack traces or internal error messages in responses.

---

## 6. intake UI

### 6.1 main page

* [x] **`src/intake/ui/intake.ui.FormFromPromptPage.tsx`**

  * [x] Implement layout:

    * [x] Left: prompt textarea + “Generate form” button.
    * [x] Right: preview panel and optional JSON viewer.
  * [x] Manage state:

    * [x] `prompt`, `isLoading`, `schema`, `error`.
  * [x] On submit:

    * [x] Call `/api/intake/forms/from-prompt` with `prompt` + `organizationId`.
    * [x] Update UI accordingly.

### 6.2 preview components

* [x] **`src/intake/ui/intake.ui.FormSchemaPreview.tsx`**

  * [x] Accept props `{ schema: FormSchemaJsonShape | null }`.
  * [x] If null, show placeholder “No form generated yet”.
  * [x] Render fields based on schema (`text`, `textarea`, `date`, `select`, `checkbox`).
  * [x] Use React Hook Form (or simple controlled components) for structure.
* [x] **`src/intake/ui/intake.ui.SchemaJsonViewer.tsx`**

  * [x] Accept props `{ schema: FormSchemaJsonShape | null }`.
  * [x] Pretty-print JSON, possibly collapsible.
  * [x] Hide if no schema yet.

---

## 7. CRM domain (minimal v1)

### 7.1 models

* [ ] **`src/crm/schema/crm.schema.ClientModel.ts`**

  * [ ] Define client fields: `id`, `organizationId`, `fullName`, `email`, etc.
* [ ] **`src/crm/schema/crm.schema.MatterModel.ts`**

  * [ ] Define matter fields: `id`, `organizationId`, `clientId`, `name`, `status`.
* [ ] **`src/crm/schema/crm.schema.FormSubmissionModel.ts`**

  * [ ] Define submission fields: `id`, `organizationId`, `formSchemaId`, `clientId`, `matterId?`, `submissionData`.

### 7.2 repos (stubs ok for v1)

* [ ] **`src/crm/repo/crm.repo.ClientRepo.ts`**

  * [ ] Implement `create`, `getById`, `listByOrganizationId`.
* [ ] **`src/crm/repo/crm.repo.MatterRepo.ts`**

  * [ ] Implement `create`, `getById`, `listByClient`.
* [ ] **`src/crm/repo/crm.repo.FormSubmissionRepo.ts`**

  * [ ] Implement `create`, `getById`, `listByFormSchema`.
  * [ ] All queries must filter by `organizationId`.

---

## 8. prompts directory

* [x] **`/prompts/v1/generate-form-schema.txt`**

  * [x] Add system instructions for the LLM (role, constraints).
  * [x] Encode allowed field types and JSON-only output requirement.
  * [x] Include at least one full few-shot example: prompt → schema JSON.
* [ ] **`/prompts/v1/README.md` (optional)**

  * [ ] Describe how prompts are versioned and used.
  * [ ] Note that changing prompts may require updating tests.

---

## 9. tests

### 9.1 pipeline test

* [x] **`src/tests/intake.svc.IntakePromptToFormPipeline.test.ts`**

  * [x] Mock LLM adapter to return a known schema.
  * [x] Mock `FormSchemaRepo` to record calls.
  * [x] Assert:

    * [x] pipeline calls LLM with normalized prompt.
    * [x] normalized schema is persisted.
    * [x] returned value matches persisted schema.

### 9.2 llm adapter test

* [x] **`src/tests/llm.svc.LlmGenerateFormFromPromptAsync.test.ts`**

  * [x] Test mock mode (`LLM_MOCK_MODE` / `mockModeOverride`) returns a deterministic schema.
  * [x] Test non-mock path by mocking vendor client:

    * [x] valid JSON → passes validator → returns schema.
    * [x] invalid JSON → throws `llm_invalid_output`.

### 9.3 repo test

* [x] **`src/tests/forms.repo.FormSchemaRepo.test.ts`**

  * [x] Use a test DB (or transaction) to:

    * [x] Insert multiple versions for same `organizationId` + `name`.
    * [x] Confirm `getLatest` returns the right version.
    * [x] Confirm cross-org access is impossible (other org’s schemas not returned).

### 9.4 API route test

* [x] **`src/tests/intake.api.createFormFromPromptRoute.test.ts`**

  * [x] Mock `GetCurrentUserAsync` to return a user with `organizationId`.
  * [x] Mock `IntakeCreateFormFromPromptAsync`.
  * [x] Assert:

    * [x] 200 on happy path with correct JSON response.
    * [x] 403 if body `organizationId` ≠ user `organizationId`.
    * [x] proper mapping of domain errors to HTTP codes.

---

## 10. security & data-handling pass

* [ ] Review all repo queries to ensure **every** Sensitive table uses `organizationId` in WHERE.
* [ ] Scan logs to ensure no fields like `submissionData`, `client email`, etc. are logged.
* [ ] Verify LLM adapter never receives PII or submission payloads.
* [ ] Ensure error messages returned to clients do not reveal internals (SQL, stack traces).
* [ ] Update `03-security-and-data-handling.md` with any implementation deviations or clarifications.

---

## 11. final QA & docs

* [x] Verify fresh clone → `pnpm install` → `pnpm db:migrate` → `pnpm dev` works.
* [x] Manually test:

  * [x] sign in as sample user
  * [x] visit `/forms/new-from-prompt`
  * [x] generate a form and see preview.
* [ ] Update `README.md` with:

  * [ ] Quickstart (env, migrate, run).
  * [ ] Explanation of the v1 vertical slice.
  * [ ] Pointers to `docs/*.md` for deeper details.
  