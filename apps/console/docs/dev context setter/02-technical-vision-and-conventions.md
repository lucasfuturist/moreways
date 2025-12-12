argueOS development MO + naming

---

## argueOS – development MO

**Project:** argueOS
**Focus:** v1 – AI-assisted legal intake + CRM (US, mid-size firms)

### 1. Product scope (v1)

* Build a **prompt-to-form system** for lawyers:

  * lawyer describes the goal in natural language
  * AI proposes fields/questions
  * lawyer iterates in a “vibe coding” style chat until the form feels right
* Build a **chat-based intake experience** for clients:

  * client chats with an assistant
  * assistant fills the same form schema under the hood
* Build a **simple but solid CRM layer**:

  * clients, matters, form schemas, submissions, and basic notes
  * multi-tenant from day 1 (per firm / org)

**Explicit non-goals for v1:**

* no jurisdiction-aware legal reasoning or guarantees
* no statute / case citations
* no full document-automation suite
* no complex workflow engine or multi-role approval flows

Ship a **fast, trustworthy intake system** first; heavy “legal brain” features are v2+.

---

### 2. Tech stack commitments

**Frontend**

* React + **Next.js**, used conservatively (no bleeding-edge experimental features)
* TypeScript everywhere
* TailwindCSS for styling
* React Hook Form (or similar) for form rendering + validation
* Client + lawyer UIs both web-first

**Backend**

* Node.js + TypeScript
* REST API (JSON over HTTP). Document with OpenAPI.
* PostgreSQL as the primary DB

  * JSONB for form schemas
  * relational tables for CRM entities
* Redis (or Postgres-backed queue) for background jobs and rate-limiting

**Auth / tenancy**

* Email/password + OAuth via an OSS solution (e.g. Auth.js / NextAuth) or a hosted provider with a clear escape hatch
* Multi-tenant:

  * `organizations` (firms)
  * `users`
  * all CRM records keyed by `organization_id`

---

### 3. Data & schema rules

* **Form schemas**:

  * Source of truth = **JSON Schema–like format**
  * Versioned (`form_schema.id`, `version`, `created_at`, `deprecated_at`)
  * Stable identifiers for fields so they can be referenced later in docgen
* Store:

  * schema
  * AI prompt that created/edited it
  * change history / diff when possible

**Core entities (minimum):**

* `Organization` (law firm)
* `User` (lawyer, staff, admin)
* `Client`
* `Matter` (case / engagement)
* `FormSchema`
* `FormSubmission`
* `Note` / `InteractionLog` (emails, calls, etc.)

---

### 4. AI / LLM usage

* Treat LLMs as **pluggable providers** behind an internal interface:

  * `generateText(prompt, options)`
  * `generateStructured(prompt, schema) -> JSON`
* Do **not** hard-wire business logic to a specific vendor’s features.
* Avoid deep dependency on LangChain / heavy agent frameworks in v1:

  * prefer small, explicit functions and prompt chains
* Always:

  * separate **prompt templates** from core code
  * log prompts + responses that change state (for audit and debugging)
  * validate LLM output against JSON Schema / Zod before saving

Primary AI tasks in v1:

1. Turn lawyer natural-language goals → initial form schema.
2. Suggest additional questions / variations.
3. Summarize or rephrase questions.
4. Map client chat turns → structured form answers.

No hallucinated “this is compliant in X jurisdiction” claims in v1.

---

### 5. Architecture principles

* **Layered separation**:

  * UI layer (React components, pages)
  * API layer (controllers / handlers)
  * domain logic (pure TS services)
  * infra adapters (DB, LLM, queues)
* Domain logic should not know about HTTP, React, or any specific LLM vendor.
* Favor **boring, explicit code** over magic abstractions.
* Design everything so it can run under **Docker** on generic cloud infra (AWS/GCP), even if we deploy to Vercel/Render initially.

---

### 6. Coding guidelines

* TypeScript strict mode on.
* Prefer clarity over cleverness.
* When generating files, output **full files**, not partial snippets, unless explicitly told otherwise.
* Keep env-specific values in `.env` / secrets; never hard-code keys.
* Include minimal tests for critical flows:

  * schema validation
  * form generation from prompts
  * chat → structured submission mapping

---

### 7. UX guidelines

* Lawyer experience should feel like:

  > “coding a form with a paralegal in chat, watching it come alive on the right.”
* Always show:

  * live form preview
  * field list / schema view
* Client experience:

  * default = conversational intake
  * always allow a plain form fallback

---

NAMING CONVENTIONS:

## 0. core philosophy

we want names that encode:

1. **layer** – where in the stack this thing lives
2. **domain** – which “subsystem” it belongs to (intake, forms, crm, auth, etc.)
3. **role/action** – what it actually does
4. **sequence (optional)** – what step in the pipeline it is, when order matters

formula you’ll see repeated:

> **`[layer]_[domain]_[roleOrAction]_[qualifier]`**

and for internal functions within a pipeline:

> **`[pipelineName]Step[NN]_[action]`**

---

## 1. domains & layers (fixed vocabulary)

### domains (prefixes)

define a fixed set of domain names and **never drift**:

* `intake` – everything related to client intake flows
* `forms` – form schemas, renderers, validators
* `crm` – contacts, matters, notes, timelines
* `auth` – sign-in, org membership, permissions
* `llm` – AI integration, prompt templates, parsers
* `billing` – payments, subscriptions
* `infra` – logging, config, queues, jobs

### layers (prefixes or folders)

* `ui` – React components & pages
* `api` – route handlers (Next API routes or equivalent)
* `svc` – domain services (pure-ish business logic)
* `repo` – persistence / DB interaction
* `job` – background workers / queues
* `schema` – validation & data shape definitions
* `util` – generic helpers

you can encode layer either in the **folder** or the **identifier**. I’d do both:

* folder: `src/intake/ui/`, `src/forms/svc/`, etc.
* name: `intakeCreateSessionSvc`, `formsFormSchemaRepo`, etc.

---

## 2. files & modules

### file name formula

> **`[domain].[layer].[role].ts`**

examples:

* `intake.ui.IntakeChatPanel.tsx`
* `intake.svc.createIntakeFromPrompt.ts`
* `forms.schema.clientIntakeForm.schema.ts`
* `llm.svc.generateFormFromPrompt.ts`
* `crm.repo.matterRepo.ts`

for more generic stuff:

* `infra.svc.emailSender.ts`
* `infra.repo.transactionManager.ts`

this is already “signal-flow friendly” because you can literally list:

1. `intake.ui.IntakeChatPanel`
2. `intake.api.createSessionRoute`
3. `intake.svc.createIntakeSession`
4. `llm.svc.generateFormFromPrompt`
5. `forms.repo.formSchemaRepo`

and draw pipes between them.

---

## 3. functions / methods

### service functions (domain-first, verb-second)

> **`[domain][Action][Target][SyncFlag]`**

* domain = PascalCase
* action = Verb
* target = Noun
* SyncFlag = optional `Async`

examples:

* `IntakeCreateSessionAsync`
* `IntakeUpdateSubmissionAsync`
* `FormsGenerateSchemaFromPromptAsync`
* `CrmLinkSubmissionToMatterAsync`
* `LlmGenerateFormQuestionsAsync`

these live in files like:

* `intake.svc.createIntakeSession.ts` (exporting `IntakeCreateSessionAsync`)

### repos

> **`[domain][Entity]Repo`** with methods like `getById`, `create`, etc.

* `ClientRepo`, `MatterRepo`, `FormSchemaRepo`
* functions: `FormSchemaRepo.getLatestForMatterType`, `MatterRepo.create`, etc.

this gives a clear flow:

```ts
const schema = await FormSchemaRepo.getLatestForMatterType(...);
await IntakeSubmissionRepo.create(...);
await CrmTimelineRepo.appendEvent(...);
```

easy to drop into a diagram as blocks.

---

## 4. pipeline / algorithm naming (for signal flow)

for anything multi-step (like “prompt → schema → normalized fields → stored form”), define:

### a pipeline name

> **`[Domain][PipelineName]Pipeline`**

example:

* `IntakePromptToFormPipeline`

### step functions inside that pipeline

> **`[pipelineShortName]Step[NN]_[action]`**

example (inside `IntakePromptToFormPipeline.ts`):

```ts
function promptFormStep01_normalizePrompt(...) {}
function promptFormStep02_generateDraftSchema(...) {}
function promptFormStep03_refineSchemaWithRules(...) {}
function promptFormStep04_persistSchema(...) {}
function promptFormStep05_emitEvents(...) {}
```

so when someone reads the file, they literally see the signal chain:

1 → 2 → 3 → 4 → 5.

for diagrams you just rename them:

* S01 normalizePrompt
* S02 generateDraftSchema
* S03 refineSchemaWithRules
* S04 persistSchema
* S05 emitEvents

same pattern for client intake:

* `IntakeChatToSubmissionPipeline` with:

  * `chatSubmitStep01_extractFields`
  * `chatSubmitStep02_validateAnswers`
  * `chatSubmitStep03_persistSubmission`
  * `chatSubmitStep04_linkToMatter`
  * `chatSubmitStep05_triggerFollowups`

---

## 5. types & interfaces

### data models

> **`[Domain][Entity]`**

* `IntakeSession`
* `IntakeMessage`
* `FormSchema`
* `FormField`
* `CrmClient`
* `CrmMatter`
* `CrmInteraction`

### DTOs / payloads

> **`[Direction][Domain][Entity]Dto`**

* `ApiIntakeCreateSessionRequestDto`
* `ApiIntakeCreateSessionResponseDto`
* `ApiFormsGenerateFromPromptRequestDto`

### schemas / validation

> **`[Domain][Entity]Schema`**

* `FormsFormSchemaSchema`
* `IntakeSubmissionSchema`

this keeps the relationship super obvious:

* `IntakeSubmission` (type)
* `IntakeSubmissionSchema` (validation)
* `ApiIntakeCreateSubmissionRequestDto` (wire format)

---

## 6. ui components

### reusable components

> **`[Domain][ComponentRole]`**

* `IntakeChatPanel`
* `IntakeFormPreview`
* `FormsFieldEditor`
* `FormsFieldList`
* `CrmClientSummaryCard`
* `CrmMatterTimeline`

pages/routes can use path naming:

* `/intake/sessions/[id]` → `IntakeSessionPage`
* `/forms/[id]/builder` → `FormBuilderPage`

---

## 7. event / log naming

for events & logs (great for future analytics + diagrams):

> **`[domain].[entity].[action]`**

examples:

* `intake.session.created`
* `intake.submission.completed`
* `forms.schema.versioned`
* `crm.matter.created`
* `crm.client.linked_to_matter`

these can become the **nodes** on a higher-level signal flow map, with pipelines in between.

---

## 8. mini worked example (end-to-end)

say a lawyer prompts a new intake form:

**files**

* `intake.ui.IntakeFormBuilderPage.tsx`
* `intake.api.createFormFromPromptRoute.ts`
* `intake.svc.createFormFromPrompt.ts`
* `llm.svc.generateFormFromPrompt.ts`
* `forms.repo.formSchemaRepo.ts`
* `crm.repo.matterTypeRepo.ts`

**key functions**

* `IntakeCreateFormFromPromptAsync`
* `LlmGenerateFormFromPromptAsync`
* `FormSchemaRepo.createVersion`
* `CrmMatterTypeRepo.attachFormSchema`

**pipeline**

* `IntakePromptToFormPipeline`:

  * `promptFormStep01_normalizePrompt`
  * `promptFormStep02_generateDraftSchema`
  * `promptFormStep03_persistSchema`
  * `promptFormStep04_emitEvents`

that’s almost **1:1 with a block diagram**.

---
