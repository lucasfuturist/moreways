# argueOS – FIELD ACCEPTANCE TEST (FAT)

### Vertical Slice: “Prompt → AI-Generated Form → Stored Schema → Live Preview”

---

## A. ENVIRONMENT & SETUP

**deliverables**

* repo clones cleanly
* README includes:

  * setup steps
  * required node version + package manager
  * dev run command
* `.env.example` includes:

  * `CONSOLE_DATABASE_URL`
  * `OPENAI_API_KEY`
  * `LLM_MOCK_MODE`
  * `APP_BASE_URL`

**acceptance checks**

* [ ] fresh clone + README = running dev server
* [ ] app boots with valid `.env` and **no runtime boot errors**

---

## B. DATA & SCHEMA LAYER

**deliverables**

* DB migrations for:

  * `organizations`
  * `users` (`organization_id`, `role`)
  * `form_schemas` (`id`, `org_id`, `version`, `schema_json`, timestamps)
* repo layer functions:

  * `FormSchemaRepo.createVersion(...)`
  * `FormSchemaRepo.getLatestForOrg(...)`

**acceptance checks**

* [ ] migrations run clean on new DB
* [ ] creating schema writes correct `organization_id`, `version`
* [ ] fetching latest returns newest, non-deprecated schema

---

## C. LLM INTEGRATION

**deliverables**

* pluggable adapter:

  ```
  LlmGenerateFormFromPromptAsync(prompt) → schemaJSON
  ```
* prompt MUST come from a **template file**, not hard-coded
* schema validator rejects malformed JSON
* **mock mode** built in

**acceptance checks**

* [ ] malformed LLM output never reaches DB
* [ ] mock mode toggles via **env var**

  ```
  LLM_MOCK_MODE=true
  ```
* [ ] LLM logs include:

  * timestamp
  * organization_id
  * prompt (truncated ok)
  * model name

---

## D. PIPELINE: PROMPT → FORM SCHEMA

**deliverables**

* `IntakePromptToFormPipeline` with explicit step functions:

  1. normalize prompt
  2. call LLM / mock
  3. validate + normalize schema
  4. persist schema
  5. emit event (stub ok)
* service entrypoint:

  ```
  IntakeCreateFormFromPromptAsync(...)
  ```
* API Route:

  ```
  POST /api/intake/forms/from-prompt
  body: { prompt, organizationId }
  ```

**ACCEPTANCE CHECKS (CRITICAL)**

* [ ] API **validates that the authenticated user belongs to the org_id provided**
  → NO cross-org form creation
* [ ] successful request persists schema + returns:

  * schema id
  * version
  * normalized schema JSON
* [ ] failure returns **non-200** and structured error json

---

## E. UI – BUILDER & PREVIEW

**deliverables**

* page: `/forms/new-from-prompt`
* UI elements:

  * prompt textarea
  * “generate form” CTA
  * loading state
  * live preview of resulting schema
  * side panel showing schema JSON or field list

**acceptance checks**

* [ ] prompt → generate → live preview works end-to-end
* [ ] raw schema preview matches stored schema
* [ ] **IF API errors, UI shows human-readable message**, e.g.

  > “couldn’t generate the form – try refining your prompt”

---

## F. LOGGING & TESTING

**deliverables**

* logging wrapper, not raw `console.log`
* logs must include org + model metadata
* tests:

  * pipeline test with **mocked LLM**
  * schema validation test

**acceptance checks**

* [ ] `npm test` / `pnpm test` runs green
* [ ] LLM calls emit usage logs in console (or file) during dev

---

## G. NON-FUNCTIONAL REQUIREMENTS

**acceptance checks**

* [ ] TypeScript `strict: true`
* [ ] `npm run build` succeeds from clean clone
* [ ] `npm run lint` succeeds OR failing rules are documented

---

# **ACCEPTANCE CRITERIA – FINAL**

this FAT is **approved and signed off** when:

✔️ prompt → LLM → validated schema → DB write → UI preview works end-to-end
✔️ org scoping enforced in API
✔️ mock mode enabled via environment flag
✔️ prompt templates live outside code, not hard-wired
✔️ tests + build + lint all pass on a clean clone
✔️ errors surface to UI in a readable, non-crash way
✔️ logs contain organization_id + model + prompt metadata

---

**this is now production-grade FAT language.
no ambiguity. if all boxes are checked, the slice is done.**
