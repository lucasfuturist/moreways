# argueOS – Progress Notes (v1)

**Status date:** 11/20/2025
**Scope:** v1 form generator vertical slice (prompt → schema → DB)

---

## 1. Environment & Tooling

- Project root is established at `C:\projects\argueOS-v1-form\` with:
  - `README.md`
  - `docs/` (00–10 docs plus CONTRIBUTING)
  - `src/` folder for application code.
- `package.json` is configured with core scripts:
  - `dev`, `build`, `start`, `lint`, `typecheck`, `test`, and Prisma DB scripts.
- `.env.example` is in place and documents required configuration:
  - `CONSOLE_DATABASE_URL`, `OPENAI_API_KEY`, `LLM_MOCK_MODE`, Next/Auth-related vars, etc.
- TypeScript is configured via `tsconfig.json` with:
  - `strict: true`, `noEmit: true`, `baseUrl: "."`, and `@/*` path alias to `src/*`.
- `next-env.d.ts` is present so Next + TS types resolve cleanly.
- ESLint/Prettier dependencies are installed, but explicit config files are still TODO.

---

## 2. Database & Infra

### 2.1 Prisma schema & DB sync

- `prisma/schema.prisma` is defined with models:
  - `Organization`, `User`, `FormSchema`, `Client`, `Matter`, `FormSubmission`.
- Multi-tenancy is encoded at the schema level:
  - All domain tables except `Organization` include `organizationId`.
- `FormSchema` table has:
  - Versioning via `version: Int`
  - JSON column `schemaJson`
  - `@@unique([organizationId, name, version])` for per-org version uniqueness.
- Prisma client generation and schema application are working:
  - `pnpm prisma generate` succeeds.
  - `pnpm prisma db push` successfully syncs the schema to the database.

### 2.2 DB client

- `src/infra/db/infra.repo.dbClient.ts`:

  - Uses Prisma as the DB library.
  - Exposes a single shared `db` client instance.
  - Reads `CONSOLE_DATABASE_URL` from the typed `env` config.
  - Adds logging on initialization in development.
  - Includes comments and guarantees indicating this module is infra-only and should be consumed by repositories (not UI/API directly).

### 2.3 Env config

- `src/infra/config/infra.svc.envConfig.ts`:

  - Defines a typed `Env` interface.
  - Reads from `process.env` once, validates required keys, and applies defaults.
  - Handles non-critical defaults like `LLM_MOCK_MODE`.
  - Exports a frozen `env` object used across infra and domains.
  - Policy: no module outside `infra` should access `process.env` directly.

### 2.4 Logging

- `src/infra/logging/infra.svc.logger.ts`:

  - Provides a minimal logger with `info`, `warn`, `error`, and `debug` methods.
  - Logs are structured: message + metadata + optional context (e.g., `organizationId`, `requestId`).
  - PII redaction helpers are planned but not fully implemented yet.

### 2.5 Runtime environment

- Prisma is currently pointed at the configured `CONSOLE_DATABASE_URL` and has successfully synced with the target Postgres (Supabase-hosted in the current setup).
- Docker-based local Postgres is available as a fallback path; `.env.local` is set up to support local overrides when needed.

---

## 3. Forms Domain

### 3.1 Schema types

- `src/forms/schema/forms.schema.FormSchemaJsonShape.ts`:

  - Defines `FormSchemaJsonShape` as the JSON representation of a form:
    - `type: "object"`
    - `properties: Record<string, FormFieldDefinition>`
    - optional `required: string[]`.
  - Defines `FormFieldPrimitiveType` and `FormFieldKind`:
    - Supported kinds: `"text" | "textarea" | "date" | "select" | "checkbox"`.
    - Supported primitive types: `"string" | "boolean" | "number"`.
  - Models select fields via `options: string[]` when `kind === "select"`.
  - Includes comments tying this structure to:
    - `04-data-and-api-spec.md`
    - `05-llm-prompt-spec.md`
    - `06-fat-v1-prompt-to-preview.md`.

- `src/forms/schema/forms.schema.FormSchemaModel.ts`:

  - Defines domain-level `FormSchema` interface:
    - `id`, `organizationId`, `name`, `version`, `schemaJson`, `isDeprecated`, `createdAt`, `updatedAt`.
  - `schemaJson` is strongly typed as `FormSchemaJsonShape`.
  - Provides `FormSchemaCreateInput` for repo create operations.
  - Aliases the Prisma row type as `DbFormSchemaRow`.
  - Exposes `mapDbFormSchemaRowToDomain` to convert Prisma rows into domain models, centralizing JSON casting.

### 3.2 Normalization utilities

- `src/forms/util/forms.util.formSchemaNormalizer.ts`:

  - Exposes `normalizeFormSchemaJsonShape(raw)` which:
    - Validates that `raw` is an object with a `properties` (or `fields`) object.
    - Normalizes field keys to camelCase using a local `toCamelCase` helper.
    - Builds a `FormFieldDefinition` for each property, enforcing:
      - Allowed `kind` values.
      - Allowed `type` values.
      - Fallback `title` when missing (defaults to the field key).
      - Optional `description` and `format`.
      - Proper handling of `options` when `kind === "select"`.
    - Normalizes `required`:
      - Coerces each entry via `toCamelCase`.
      - Filters out required keys that do not exist in `properties`.
      - Deduplicates entries and omits `required` entirely if empty.
  - Function is pure and reusable across both pipeline and UI layers.
  - Unknown attributes from LLM output are effectively stripped by only copying the known, whitelisted fields into the normalized shape.

### 3.3 Repo

- `src/forms/repo/forms.repo.FormSchemaRepo.ts`:

  - Defines `FormSchemaRepo` interface with:
    - `createVersion(input: FormSchemaCreateInput): Promise<FormSchema>`.
    - `getLatestByName({ organizationId, name }): Promise<FormSchema | null>`.
  - Implements `PrismaFormSchemaRepo` which:
    - Computes `nextVersion` as `(latest?.version ?? 0) + 1` scoped by `(organizationId, name)`.
    - Creates new `formSchema` rows via Prisma, casting `schemaJson` to `Prisma.InputJsonValue` for the JSON column.
    - Enforces multi-tenancy by scoping all queries to `organizationId`.
    - Logs schema creation events with `organizationId`, `name`, and `version`.
    - Provides a `getLatestByName` method that returns the highest `version` for the given `(organizationId, name)` pair.
  - Exports a default singleton `formSchemaRepo` instance for services/pipelines.

---

## 4. Type System & Tooling Status

- TypeScript project is configured and `pnpm typecheck` passes with the current set of files.
- Path alias `@/*` is wired and already in use for infra imports (e.g., DB client, logger).
- Prisma client generation is integrated into the workflow and produces strongly-typed access for all DB models.

---

## 5. Remaining Work / Next Focus Areas

High-level remaining items for the v1 vertical slice:

- **LLM domain:**
  - Zod validator for LLM output (`llm.schema.FormGenerationResultSchema.ts`).
  - Prompt loader and safe JSON parse utilities.
  - `LlmGenerateFormFromPromptAsync` implementation with mock mode and vendor API integration.

- **Intake domain:**
  - Request/response types for `CreateFormFromPrompt`.
  - `IntakePromptToFormPipeline` wiring:
    - Normalize prompt → call LLM → validate/normalize schema → persist via `FormSchemaRepo` → emit events.
  - `IntakeCreateFormFromPromptAsync` as a clean service entry point.

- **API & UI:**
  - HTTP route for `POST /api/intake/forms/from-prompt` with auth + org checks.
  - `/forms/new-from-prompt` page with live preview + JSON viewer.

- **Auth & CRM:**
  - Minimal user/auth types & services to support multi-tenant access control.
  - Basic CRM models/repos (`Client`, `Matter`, `FormSubmission`) for future expansion.

- **Prompts & Tests:**
  - Prompt file for v1 form generation.
  - Vitest + Supertest tests for repo, LLM adapter, pipeline, and API route.

This snapshot captures the current state so future work can layer cleanly on top of a stable infra + forms backbone.

---

## 4. LLM domain – adapter + utilities implemented (11/18/2025)

### 4.1 Output validation schema

- `src/llm/schema/llm.schema.FormGenerationResultSchema.ts` is implemented as the canonical runtime validator for LLM form output.
- It is aligned with `FormSchemaJsonShape` and enforces:
  - Top-level `type: "object"`.
  - `properties` as a record of camelCase field keys.
  - Each field having:
    - `kind` ∈ `"text" | "textarea" | "date" | "select" | "checkbox"`.
    - `type` ∈ primitive types (`"string" | "boolean" | "number"`), with sensible combinations per kind.
    - Optional `title`, `description`, `options` (for `select`).
  - Optional top-level `required: string[]`:
    - All required keys must exist in `properties`.
- The file exports both:
  - `FormGenerationResultSchema` (Zod schema).
  - `FormGenerationResult` (inferred TS type) for reuse in services and tests.

### 4.2 LLM utilities

- `src/llm/util/llm.util.promptLoader.ts`:
  - Resolves prompt files from the project-root `/prompts` directory.
  - Accepts a relative path like `"v1/generate-form-schema.txt"`.
  - Produces a clear, actionable error if the prompt file is missing or unreadable.
- `src/llm/util/llm.util.jsonParseSafe.ts`:
  - Implements a safe JSON parse helper returning:
    - `{ success: true, value }` on success.
    - `{ success: false, error }` on failure.
  - Includes a “tolerant” mode that:
    - Trims whitespace.
    - Attempts to extract the first `{ ... }` block when the LLM wraps JSON in extra text.
  - This function is used by the LLM adapter to harden against noisy model output.

### 4.3 LLM adapter service

- `src/llm/svc/llm.svc.LlmGenerateFormFromPromptAsync.ts`:
  - Core service: `LlmGenerateFormFromPromptAsync(userPrompt, deps)` → `FormGenerationResult`.
  - Dependencies are injected via `deps`:
    - `llmClient(fullPrompt: string) => Promise<string>` (vendor wrapper).
    - `loadPromptFn(relativePath)` for testability (defaults to `promptLoader`).
    - `mockModeOverride?: boolean` to force mock / real mode in tests.
    - Optional `logger` interface (defaults to a simple console-backed logger).
  - Mock mode:
    - Reads `LLM_MOCK_MODE` from `process.env` (tolerant parsing) unless overridden.
    - Returns a deterministic, valid sample schema:
      - Fields like `clientFullName`, `email`, `incidentDate`, `incidentDescription`.
      - Required: `["clientFullName", "email", "incidentDate"]`.
    - Logs a lightweight info message without including the raw prompt.
  - Real mode:
    - Uses `loadPromptFn("v1/generate-form-schema.txt")` and interpolates `{{user_prompt}}`.
    - Calls the injected `llmClient(fullPrompt)` (no direct vendor dependency in this file).
    - Parses the raw text via `jsonParseSafe`.
    - Validates the parsed value using `FormGenerationResultSchema`.
    - On success, returns the validated schema.
    - On parse failure, throws an error with `code = "llm_invalid_output"` and logs a warning.
  - Security posture:
    - The adapter never logs the raw `userPrompt`.
    - The design assumes the prompt is meta-only and not raw client PII; this is documented in comments.

### 9. Tests & tooling for LLM slice

- `src/tests/llm.util.jsonParseSafe.test.ts`:
  - Covers:
    - Happy-path JSON parsing.
    - Failure mode with invalid JSON.
    - Tolerant parsing behavior around extra text.
- `src/tests/llm.util.promptLoader.test.ts`:
  - Verifies prompt resolution and error messaging for missing prompts.
- `src/tests/mocks/llm.mock.ts`:
  - Provides:
    - `mockLlmClientReturnsValidSchema` – JSON string for a minimal valid schema.
    - `mockLlmClientReturnsInvalidJson` – deliberately invalid string for error-path tests.
- `src/tests/llm.schema.FormGenerationResultSchema.test.ts`:
  - Asserts:
    - Valid LLM payloads pass both runtime validation and type inference.
    - Invalid field kinds / missing `properties` / bad `required` keys are rejected.
- `src/tests/llm.svc.LlmGenerateFormFromPromptAsync.test.ts`:
  - Confirms:
    - Mock mode returns a deterministic schema without requiring an `llmClient`.
    - Non-mock mode integrates `loadPromptFn` + `llmClient` and validates the result.
    - Invalid JSON from `llmClient` triggers the `llm_invalid_output` error code.
    - Non-mock mode without an `llmClient` throws a clear configuration error.
- `vitest.config.ts`:
  - Adds `@` → `<root>/src` alias resolution so tests can use the same import style as app code.
  - Configures Vitest with `globals: true` and `environment: "node"` for this backend-oriented slice.

This update effectively “lights up” the LLM domain for v1: the adapter, schema, utilities, and tests are all in place and green. The next vertical step is to wire this into the intake pipeline and API.

### 2025-11-18 – Intake pipeline + service + API wired

- Implemented intake request/response types:
  - `src/intake/schema/intake.schema.IntakeRequestTypes.ts`
  - Defines CreateFormFromPromptRequest/Response + ErrorResponse envelope.
- Implemented prompt→schema→DB pipeline:
  - `src/intake/svc/intake.svc.IntakePromptToFormPipeline.ts`
  - Steps: normalize prompt → LLM draft → normalize schema → persist FormSchema → emit logs.
  - Uses FormSchema normalizer, LLM adapter, and FormSchemaRepo with org scoping.
- Implemented public intake service:
  - `src/intake/svc/intake.svc.IntakeCreateFormFromPromptAsync.ts`
  - Accepts CreateFormFromPromptRequest + User, delegates to pipeline, returns typed response.
- Implemented framework-agnostic API handler:
  - `src/intake/api/intake.api.createFormFromPromptRoute.ts`
  - Handles POST /api/intake/forms/from-prompt with auth, org scoping, and structured error mapping.

### 2025-11-18 – Typecheck + LLM test baseline

**Commands run**

- `pnpm typecheck`
  - ✅ `tsc --noEmit` completes with no type errors.

- `pnpm test`
  - ✅ 4 test files passing:
    - `llm.util.jsonParseSafe.test.ts`
    - `llm.util.promptLoader.test.ts`
    - `llm.schema.FormGenerationResultSchema.test.ts`
    - `llm.svc.LlmGenerateFormFromPromptAsync.test.ts`
  - ⏭ 3 test files currently skipped (by design until their implementations land):
    - `forms.repo.FormSchemaRepo.test.ts`
    - `intake.api.createFormFromPromptRoute.test.ts`
    - `intake.svc.IntakePromptToFormPipeline.test.ts`

**Verified behavior**

- LLM mock mode:
  - `[LLM] Returning mock form generation result.`  
  - Deterministic, schema-valid JSON returned without calling the vendor client.
- Real mode:
  - `[LLM] Calling vendor for form generation.`  
  - Valid JSON path: `[LLM] Successfully validated form generation result.`
  - Invalid JSON path: `[LLM] Failed to parse JSON from LLM response.` → throws `llm_invalid_output` as expected.

**State**

- ✅ LLM slice (schema + util + core service) is wired, type-safe, and fully tested.
- ✅ Repo/tooling baseline (typecheck + test scripts) confirmed to be working.
- ⏳ Next milestones: implement + unskip
  - `FormSchemaRepo` tests (versioned persistence)
  - Intake pipeline (`IntakePromptToFormPipeline`)
  - HTTP route (`intake.api.createFormFromPromptRoute`)

### 2025-11-19 – Backend Vertical Slice Complete (Repo + Pipeline + API)

**Implementation Status**

- **Forms Domain:**
  - `FormSchemaRepo.ts` implemented.
    - Logic added for scoped version incrementing (`(max version ?? 0) + 1`).
    - DB writes are strictly scoped by `organizationId`.
  - `FormSchemaRepo` unit tests implemented (`src/tests/forms.repo.FormSchemaRepo.test.ts`) using Vitest mocks.

- **Intake Domain (Service Layer):**
  - `IntakePromptToFormPipeline.ts` implementation complete.
    - Steps 1-5 active: Normalize Prompt → LLM → Validate/Normalize Schema → DB Persist → Log/Emit.
    - Integration with `FormSchemaNormalizer` and `FormSchemaRepo` verified via static analysis.
  - `IntakeCreateFormFromPromptAsync.ts` wired as the clean service entry point.

- **Intake Domain (API Layer):**
  - `createFormFromPromptRoute.ts` implemented.
    - Middleware-style dependency injection used for `getCurrentUser`.
    - 401/403 logic implemented for Org ID mismatch.
    - Structured error handling mapping (domain errors → HTTP codes) installed.
  - `createFormFromPromptRoute.test.ts` implemented.
    - Verified 200 OK happy path.
    - Verified 403 Forbidden on cross-org attempts.
    - Verified 400 Bad Request on LLM failure.

**Test Status**

- `pnpm test` now includes:
  - ✅ `forms.repo.FormSchemaRepo.test.ts`
  - ✅ `intake.api.createFormFromPromptRoute.test.ts`
- *Pending:* `IntakePromptToFormPipeline.test.ts` is currently scaffolded but skipped (`describe.skip`).

**Next Immediate Actions (The Final Gap)**

1.  **UI Layer:** Implement the React components (`FormFromPromptPage`, `FormSchemaPreview`) which are currently empty shells.
2.  **Auth Stub:** Implement `GetCurrentUserAsync` to allow local development login/session resolution.
3.  **Prompts:** Create the physical file `prompts/v1/generate-form-schema.txt` (currently missing).

### 2025-11-19 – V1 Vertical Slice COMPLETE (FAT Passed)

**Milestone Achieved: Prompt → AI Form → DB → UI**

**Status:**
- **LLM Integration:**
  - `openai` adapter implemented and wired into the pipeline.
  - Real-world testing confirmed with complex prompts (Maritime Law example).
  - `LLM_MOCK_MODE` logic verified (can switch between True/False in env).
- **UI Layer:**
  - `FormFromPromptPage.tsx` implemented and functional.
  - `FormSchemaPreview.tsx` rendering dynamic inputs based on JSON schema.
  - Styles fixed (Tailwind configured globally).
- **Infrastructure:**
  - Docker Postgres database running on port 5433.
  - `.env.local` vs `.env` conflicts resolved.
  - Seeding script (`prisma/seed.ts`) verified working.

**Verification:**
- User generated a "Maritime Law" form via UI.
- System correctly generated fields: `vesselName`, `gpsCoordinates`, `weatherConditions`.
- Database persisted record as `v2`.
- UI rendered fields correctly.

**Ready for:**
- V2 Feature: Client Chat Interface (consuming these generated schemas).
- V2 Feature: Form Schema Editor (manual tweaking of AI output).

### 2025-11-19 – V1 Vertical Slice COMPLETE & Phase 2 (Editor) Started

**Status: FAT PASSED** 🏆

**1. Backend & Infrastructure**
- **Auth Stub:** Implemented `GetCurrentUserAsync` with header-based mocking capabilities for dev/test.
- **Prompt Template:** Created physical `prompts/v1/generate-form-schema.txt` with system instructions and few-shot examples.
- **Local Env:**
  - Created `docker-compose.yml` for local Postgres (port 5433 to avoid conflicts).
  - Implemented `prisma/seed.ts` to bootstrap `org_default_local`.
  - Aligned `.env` and `.env.local` configurations.

**2. UI Implementation (Intake Domain)**
- **Components:**
  - `FormFromPromptPage`: Main controller for prompt input and API interaction.
  - `FormSchemaPreview`: Dynamic form renderer using `react-hook-form`.
  - `SchemaJsonViewer`: Read-only JSON display.
- **Integration:**
  - Wired Next.js App Router (`src/app/forms/new-from-prompt/page.tsx`).
  - Added global navigation and Tailwind setup in `layout.tsx`.
  - Verified "Toxic Tort" stress test (complex dropdowns, dates, logic).

**3. Phase 2: Form Editor (Lawyer UI)**
- **Repo:** Added `getById` and `listByOrg` to `FormSchemaRepo`.
- **API:**
  - `GET /api/forms`: List forms by org.
  - `GET /api/forms/[id]`: Fetch specific schema.
  - `PUT /api/forms/[id]`: Update schema (creates new version).
- **UI:**
  - Created `FormEditor` for drag-and-drop field manipulation.
  - Created `FormsDashboard` to view list of created forms.

**Test Status**
- All 7 test suites passing (`pnpm test`), covering:
  - Repo logic (versioning, scoping).
  - Pipeline logic (mocked LLM).
  - API route logic (auth guards, error mapping).
  - LLM adapter resilience.

**Next Steps**
- Polish the Editor UI (edge cases).
- Begin CRM implementation (Client/Matter tables) to support actual form submissions.

### 2025-11-20 – Phase 2 UI & Architecture Overhaul

**1. Schema Evolution (Grand Unified Schema v1.5)**
- **Upgrade:** Updated `FormSchemaJsonShape` to support OS-grade features:
  - `logic`: Conditional rendering triggers.
  - `metadata`: PII flags, locked states.
  - `layout`: Width/columns support.
  - `kind`: Expanded to include `checkbox_group` vs `checkbox`, `currency`, etc.
- **Compatibility:** Implemented `formSchemaNormalizer` to bridge v1 $\to$ v1.5 automatically (deriving `required` array for legacy compat).

**2. UI/UX Transformation ("Midnight Glass")**
- **Theme:** Implemented `Violet Twilight` / `Verdigris` / `Shadow` palette via Tailwind.
- **Foundation:** Added `postcss.config.js` and patched missing `@tailwindcss/forms` plugin.
- **Layout:** Refactored `FormFromPromptPage` into a **Split-Screen Architect/Canvas** model:
  - **Left:** Persistent AI Chat (`ChatPanel`).
  - **Right:** Live `ReactiveCanvas` with drag-and-drop.
- **Interaction:** Implemented `FloatingFieldEditor` (draggable tool palette) with support for editing dropdown options directly in the UI.

**3. LLM Context & Intelligence**
- **Persistence:** Implemented "State-as-Context" pattern.
  - `IntakePromptToFormPipeline` now accepts `currentSchema`.
  - `LlmGenerateFormFromPromptAsync` intelligently switches between `CREATE` and `EDIT` modes.
- **Conversational:** Updated API to return `{ message, schema }`. The AI now "speaks" back in the chat panel.
- **Prompt Engineering:**
  - Created `edit-form-schema.txt` for diff-based updates.
  - Tuned prompts to act as "Senior Architect" (granular, specific fields) vs "Intern" (lazy, generic fields).

**4. Infrastructure**
- **Logging:** Added `infra.svc.promptLogger.ts` to write raw LLM input/output to `logs/llm-interactions.jsonl` for debugging and tuning.
- **Fixes:** Resolved dependency injection bugs in the pipeline (explicit `openaiClient` binding).

**Status:**
- ✅ Editor is now fully interactive (Drag, Rename, Add Options).
- ✅ AI maintains context across multiple turns.
- ✅ UI matches high-fidelity "Midnight Glass" aesthetic.

### 2025-11-20 – Grand Unified Schema & Architect Persona (v1.5)

**Status:** Implemented 🚀

**1. Schema Upgrade (Forms Domain)**
- **Grand Unified Schema (v1.5):** 
  - Updated `FormSchemaJsonShape` to support `logic`, `layout`, and `metadata` objects.
  - Added `FormFieldKind` support for `group`, `divider`, `currency`, and `checkbox_group`.
  - Added explicit `order` array to decouple visual sort from object property keys.
- **Migration Strategy:**
  - Implemented `normalizeFormSchemaJsonShape` utility that acts as a bridge.
  - Automatically upgrades v1 schemas (missing `order`, legacy `required` array) to v1.5 structure at runtime.

**2. AI Persona Upgrade (LLM Domain)**
- **New Contract:** Defined `FormGenerationEnvelope` (Talk + Do).
  - Returns `{ thought_process, summary_message, schema_update }`.
- **Prompt Engineering:** 
  - Created `prompts/v1/edit-form-schema.txt` with "Principal Architect" instructions.
  - Enabled "Capabilities" like `layout.width`, `logic` rules, and `PII` flagging via natural language.

**3. Pipeline Integration (Intake Domain)**
- **Wiring:** Updated `IntakePromptToFormPipeline` to:
  1.  Call LLM with context (history + schema).
  2.  Validate Envelope structure.
  3.  Extract `schema_update` and normalize it.
  4.  Persist valid schema and return `summary_message` to UI.

**Next Steps:**
- Build the UI controls (Manual Inspector) to expose these new schema capabilities (Logic, Metadata) visually, completing the "Ultimate Experiment" editor.

### 2025-11-20 – Grand Unified Schema & Architect Persona (v1.5)

**Status:** Implemented 🚀

**1. Schema Upgrade (Forms Domain)**
- **Grand Unified Schema (v1.5):** 
  - Updated `FormSchemaJsonShape` to support `logic`, `layout`, and `metadata` objects.
  - Added `FormFieldKind` support for `group`, `divider`, `currency`, and `checkbox_group`.
  - Added explicit `order` array to decouple visual sort from object property keys.
- **Migration Strategy:**
  - Implemented `normalizeFormSchemaJsonShape` utility that acts as a bridge.
  - Automatically upgrades v1 schemas (missing `order`, legacy `required` array) to v1.5 structure at runtime.

**2. AI Persona Upgrade (LLM Domain)**
- **New Contract:** Defined `FormGenerationEnvelope` (Talk + Do).
  - Returns `{ thought_process, summary_message, schema_update }`.
- **Prompt Engineering:** 
  - Created `prompts/v1/edit-form-schema.txt` with "Principal Architect" instructions.
  - Enabled "Capabilities" like `layout.width`, `logic` rules, and `PII` flagging via natural language.

**3. Pipeline Integration (Intake Domain)**
- **Wiring:** Updated `IntakePromptToFormPipeline` to:
  1.  Call LLM with context (history + schema).
  2.  Validate Envelope structure.
  3.  Extract `schema_update` and normalize it.
  4.  Persist valid schema and return `summary_message` to UI.

**Next Steps:**
- Build the UI controls (Manual Inspector) to expose these new schema capabilities (Logic, Metadata) visually, completing the "Ultimate Experiment" editor.

### 2025-11-20 – The "Ultimate Editor" & Runtime Engine (v1.7)

**Status:** Implemented 🚀

**1. Editor Ergonomics & Polish (UI Domain)**
- **"Professional Polish" Pack:**
  - Implemented **Mobile/Desktop Toggle** to preview responsive layouts.
  - Added **Command Palette** (`Cmd+K`) for keyboard-driven actions.
  - Built **Blueprint Mode** (X-Ray) to visualize technical field metadata and layout boundaries.
- **State Persistence:**
  - Integrated `useLocalStorage` hook to persist view modes, inventory toggles, and draft content across reloads.
  - Implemented robust **Chat Migration** logic to preserve AI history when converting a Draft to a Saved Form.

**2. Advanced Inspector & Micro-Coding (Forms Domain)**
- **Tabbed Inspector:** Replaced simple popup with a multi-tab Studio (`Settings`, `Logic`, `Data`).
  - **Logic Builder:** Visual UI for creating conditional rules (`if` trigger `equals` value `then` show/hide).
  - **Data Settings:** Controls for Database Keys, PII flagging, and Compliance Notes.
- **Micro-Vibe Coding:**
  - Added "Ask AI" bubbles to individual fields.
  - Wired API to accept `scopedFieldKey`, allowing the LLM to perform surgical edits on single fields without hallucinatory side effects.

**3. Runtime Engine & CRM Integration (CRM Domain)**
- **Public Runner:**
  - Created standalone `FormRunner` component optimized for end-users (distinct from the builder Preview).
  - Implemented public route `src/app/s/[id]` for external access.
- **Submission Pipeline:**
  - Built `FormSubmissionRepo` to persist raw JSON responses.
  - Deployed `POST /api/submit/[id]` endpoint to handle incoming data securely.

**4. System Hardening**
- **Visual Integrity:** Fixed Z-Index stacking issues with floating menus and added fluid spring animations.
- **Accessibility:** Enforced high-contrast text in Preview mode.
- **OS Awareness:** Implemented robust User-Agent detection to display correct shortcuts (`Cmd` vs `Ctrl`) dynamically.

**Next Steps:**
- Implement the **Submission Inbox** to view and export the data collected via the new Runtime Engine.