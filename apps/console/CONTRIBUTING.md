# Contributing to argueOS

This project is built to be maintainable by both humans and AI agents.  
All contributors (including agents) must follow these rules.

---

## 1. Core Principles

1. **Tenant Safety First**  
   No cross-org data access. Ever. Every sensitive query must be scoped by `organization_id`.

2. **Specs Are Source of Truth**  
   - Product behavior → Product Spec v1  
   - Architecture & naming → Development MO / Conventions  
   - Data shapes → Data & API Spec  
   - LLM behavior → PROMPTS spec  
   - Definition of “done” → FAT for the current slice

3. **Boring, Explicit, Testable Code**  
   Favor clarity over cleverness. Every important behavior should be backed by a test or a spec.

---

## 2. Repo Expectations

- TypeScript strict mode is enabled and must stay that way.
- Multi-tenancy is not optional:
  - all relevant tables have `organization_id`
  - API verifies user membership in organization.
- LLM usage is encapsulated behind the `llm` domain; no direct SDK calls from UI / domain services.

---

## 3. Workflow

1. **Sync main**
   ```bash
   git checkout main
   git pull
   git checkout -b feature/<short-description>
Read relevant docs

For new features: Product Spec v1 + FAT.

For DB/API changes: Data & API Spec.

For any new pipelines or modules: Development MO / Conventions.

For LLM modifications: PROMPTS spec.

Implement changes following domain × layer structure
Organize code into:

src/intake, src/forms, src/crm, src/llm, src/infra

with ui, api, svc, repo, schema, util sublayers where appropriate.

Run checks

bash
Copy code
pnpm lint
pnpm test
pnpm typecheck   # or pnpm build, depending on scripts
Open a Pull Request

Fill out the PR template

Link to the spec section(s) your change implements or modifies

4. Updating Specs
You MUST update specs when you:

Change DB schema or entity shape ⇒ update Data & API Spec.

Change API request/response formats ⇒ update Data & API Spec.

Change LLM prompt structure or constraints ⇒ update PROMPTS spec.

Add/modify major pipelines or architecture patterns ⇒ update Dev MO / Conventions.

Change behavior covered by FAT ⇒ update FAT or clearly explain why behavior is intentionally diverging.

Specs and code should never permanently disagree.

5. Security & Data Handling (Contributor Summary)
Do not log PII or full FormSubmission payloads.

Do not add third-party services that receive Sensitive data without explicit approval.

Do not weaken organization_id scoping or authorization checks.

Treat any potential cross-tenant access bug as critical.

See Security & Data Handling Policy for details.

6. LLM Usage Rules
Always use the LLM adapter in src/llm (e.g., LlmGenerateFormFromPromptAsync).

Prompts MUST be loaded from /prompts, not hard-coded.

All LLM output that affects state MUST be validated against a JSON Schema / Zod definition before saving.

Implement and respect mock mode (e.g., LLM_MOCK_MODE=true) for tests and local dev.

7. Tests
Minimum test expectations:

Multi-tenant safety:

tests proving users cannot access other orgs’ data.

LLM safety:

tests that invalid LLM JSON is rejected by the pipeline.

FAT slice:

tests that cover the vertical flow from prompt → schema → persisted version (with LLM mocked out).

If you add a critical feature without tests, you must explain why in the PR and consider that tech debt.

8. Coding Style & Naming
Follow the naming conventions in the Development MO:

DomainActionTargetAsync for services

DomainEntityRepo for repos

DomainPipelineNamePipeline for pipelines

pipelineShortNameStepNN_action for pipeline steps

Adhere strictly to the domain/layer split:

no DB calls from UI

no HTTP details in domain services

no vendor-specific logic in domain services

When in doubt, refer back to the examples in the Dev MO / Conventions doc.

9. Getting Help
If you are a human contributor and unsure how to proceed:

Start by reading the Product Spec and FAT for your area.

If it’s still unclear, open an issue describing:

what you’re trying to do

which spec sections you’ve read

what’s ambiguous

If you’re an agent, stop and request human review when you detect conflicting instructions or cannot satisfy specs without violating security rules.

yaml
Copy code

---

## `.github/pull_request_template.md`

```markdown
## Summary

- What does this PR change?
- Which part of the vertical slice or system does it touch?

---

## Spec Alignment

Tick all that apply and update the docs if needed.

- [ ] Behavior matches **Product Spec v1**
- [ ] Structure/naming comply with **Development MO & Conventions**
- [ ] DB / API shapes match **Data & API Spec**
- [ ] LLM behavior matches **PROMPTS Spec**
- [ ] Acceptance checks in **FAT v1 (Prompt → Preview)** still pass or are updated

If any box is unchecked, explain why:

---

## Testing

- [ ] `pnpm lint`
- [ ] `pnpm test`
- [ ] `pnpm typecheck` / `pnpm build`

Notes on tests added/changed:

---

## Security & Multi-Tenancy

- [ ] All new/changed queries for Sensitive data are scoped by `organization_id`
- [ ] API-level checks ensure authenticated user belongs to `organizationId` where applicable
- [ ] No PII or `FormSubmission` contents are added to logs

If you touched LLM code:

- [ ] LLM output is validated before being persisted
- [ ] LLM calls still respect mock mode (`LLM_MOCK_MODE`)

---

## Screenshots / UX (if applicable)

Add before/after screenshots or GIFs for UI changes.