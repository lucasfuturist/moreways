# argueOS – Agent Operating Guide

**Audience:** Autonomous coding agents (and tools orchestrating them)  
**Repo:** argueOS – AI-assisted legal intake + CRM (v1: prompt → form schema → preview → stored)  

---

## 1. Mission

You are a coding agent working on argueOS.

Your primary goal in v1 is to implement and maintain the vertical slice:

> “Lawyer prompt → AI-generated form schema → stored version → live preview (org-scoped)”

All work MUST align with:

- Product scope & non-goals in the product spec  
- Architecture & naming rules in the technical vision  
- Data model & API contract  
- LLM prompt & schema rules  
- FAT acceptance criteria for the v1 slice  

(See `/docs` and root-level spec files for details.)

---

## 2. Required Reading (BEFORE editing)

Before writing or modifying code, you MUST read and obey:

1. **Product Spec v1** – what v1 does and does NOT do  
2. **Development MO & Naming** – how to structure code, domains, and layers  
3. **Data Model & API Spec** – DB tables + `POST /api/intake/forms/from-prompt` contract  
4. **LLM Prompt & Template Spec** – prompt location, structure, and JSON schema subset  
5. **FAT v1 – Prompt → Preview** – what “DONE” means for this slice  

If code you’re touching conflicts with those docs, you must either:

- adapt your changes to match the docs, OR
- update the docs in the same PR to reflect the new reality (and keep things consistent).

---

## 3. Core Rules (Do / Don’t)

### 3.1 Do

- **Follow the domain × layer structure** for files and modules (intake, forms, crm, llm, infra; ui/api/svc/repo/schema/util).
- **Enforce multi-tenancy**:
  - every sensitive query must be scoped by `organization_id`
  - API must validate the authenticated user belongs to `organizationId`.
- **Use the LLM via the adapter layer**:
  - call `LlmGenerateFormFromPromptAsync(...)` (or equivalent)
  - never hit the vendor SDK directly from UI or domain logic.
- **Validate all LLM output against the schema** before writing to DB.
- **Keep prompt templates in `/prompts`**, not hard-coded in services.
- **Log LLM calls through the logging/infra layer**, not ad-hoc `console.log`.

### 3.2 Don’t

- Don’t bypass `organization_id` scoping. Ever.
- Don’t put PII or raw form submissions in logs.
- Don’t send sensitive client data to LLMs in v1.
- Don’t change public API shapes or DB schemas without also updating the Data/API spec.
- Don’t introduce new dependencies or frameworks that conflict with the technical vision (e.g., heavy agent frameworks embedded in v1).

---

## 4. Step-by-Step Workflow for Any Task

When you’re given a task (e.g., “implement form builder UI” or “wire pipeline”), follow this sequence:

1. **Locate the relevant spec section:**
   - Product behavior → product spec  
   - Architecture / naming → dev MO  
   - Tables / fields / endpoints → data/API spec  
   - LLM interaction → prompts spec  
   - Acceptance checks → FAT  

2. **Plan the change in terms of domains & layers:**
   - Identify affected domain(s): `intake`, `forms`, `crm`, `llm`, `infra`.
   - Identify layers: `ui`, `api`, `svc`, `repo`, `schema`, `util`.

3. **Modify or create files ONLY in the correct locations:**
   - Example:
     - `src/intake/ui/IntakeFormBuilderPage.tsx`
     - `src/intake/api/intakeCreateFormFromPromptRoute.ts`
     - `src/intake/svc/IntakeCreateFormFromPromptAsync.ts`
     - `src/forms/repo/FormSchemaRepo.ts`
     - `src/llm/svc/LlmGenerateFormFromPromptAsync.ts`

4. **Respect naming rules:**
   - Services: `DomainActionTargetAsync` (e.g., `IntakeCreateFormFromPromptAsync`)
   - Repos: `DomainEntityRepo` (e.g., `FormSchemaRepo`)
   - Pipelines: `DomainPipelineNamePipeline` + `pipelineShortNameStepNN_action`
   - Events/logs: `domain.entity.action`

5. **Wire to the LLM correctly:**
   - Load prompt from `/prompts`, not inline.
   - Call vendor via the LLM adapter.
   - Validate JSON against the schema / Zod before persisting.

6. **Update docs if needed:**
   - If you change an API shape → update Data/API spec.
   - If you change LLM behavior or constraints → update PROMPTS spec.
   - If you add/move pipelines or modules → update dev MO if the change is structural.

7. **Run checks:**
   - `pnpm lint`
   - `pnpm test`
   - `pnpm typecheck` / `pnpm build` (as configured)
   - Confirm FAT items you touched still pass.

---

## 5. Special Focus: FAT v1 – Prompt → Preview

High-level target flow:

1. Lawyer hits `/forms/new-from-prompt`
2. Enters natural language prompt
3. UI calls `POST /api/intake/forms/from-prompt` with `organizationId`
4. API:
   - validates auth + org membership
   - runs `IntakePromptToFormPipeline`
   - stores `FormSchema` (versioned, org-scoped)
5. UI receives normalized schema and renders a live preview form

As an agent, when working on anything in this vertical slice, you must:

- Align behavior with the endpoint contract and data model.
- Ensure validations and error responses match the FAT.
- Show user-friendly errors in the UI for non-200 responses.
- Keep mocks available for LLM so tests aren’t flaky.

---

## 6. Security & Data Handling (Agent-specific Summary)

- Never log:
  - client names
  - emails
  - raw `FormSubmission` contents
- Never de-scope `organization_id` from queries for Sensitive data.
- Treat any cross-tenant access as a critical bug.
- Do not add any flows that send Sensitive data to LLM providers in v1.

If you cannot complete a task without violating these rules, you must stop and require human intervention.

---

## 7. When You’re Uncertain

If the specs conflict, or something is ambiguous:

1. Prefer the **Security & Data Handling** policy over convenience.
2. Prefer the **FAT** as the source of truth for the vertical slice behavior.
3. Prefer the **Data/API spec** for DB/API shapes.
4. Prefer the **Dev MO** for naming, structure, and architecture decisions.

Never “invent” new patterns if an existing one can be reused.

---

## 8. Output Style (for coding agents that propose patches)

When proposing code changes, prefer:

- Full files for new modules.
- Clear diff-style patches for existing files.
- Short explanation of:
  - what was added
  - why it matches the specs
  - which FAT check(s) it satisfies

This makes human review faster and safer.
