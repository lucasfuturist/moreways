# argueOS – Product Spec (v1)

**Status:** Active  
**Version:** 1.0  
**Owner:** Founding Team  
**Scope:** Full v1 vertical slice  
**Updated:** 2025-XX-XX

---

## 1. Product Summary

argueOS v1 is a **law-firm-grade intake + CRM engine** driven by AI form generation.

It delivers three core capabilities in one vertically integrated workflow:

1. **Prompt-to-Form Generation**  
   Lawyers describe what they need → AI produces a structured form schema.

2. **Client Intake Experience**  
   Clients interact with a chat-based assistant that fills that schema under the hood.

3. **CRM Storage Layer**  
   All generated schemas, submissions, clients, and matters are stored in a multi-tenant backend.

v1 **must** prove all three layers work together end-to-end.

---

## 2. Core User Stories

### Lawyer – Form Creation
> “I type a description of the form I need, click generate, and immediately see a working structured form with a live preview.”

### Client – Intake Submission
> “I answer questions through a conversational UI, and the system records my answers correctly.”

### Firm – CRM Record Keeping
> “All forms, submissions, clients, and matters are stored under my firm, not visible to others.”

---

## 3. Required v1 Features

### 3.1 Form Generation
- Prompt input box
- Calls LLM or mock mode
- Schema validation before write
- Versioned storage (`form_schemas`)
- Live preview in UI
- Schema history table

### 3.2 Client Intake Chat
- Chat UI backed by same schema
- Assistant collects structured answers
- FormSubmission JSON stored after completion
- Minimal validation (required fields only)

### 3.3 CRM Backend
Minimum tables:

| Entity | Purpose |
|--------|---------|
| `organizations` | Law firm tenant |
| `users` | Auth + membership |
| `clients` | End-client identities |
| `matters` | Legal engagement per client |
| `form_schemas` | Versioned definitions |
| `form_submissions` | Completed structured answers |
| `notes` (optional) | Internal event log / comments |

(Refs match full data spec)

---

## 4. Non-Functional Requirements

| Requirement | Rule |
|------------|------|
| Multi-Tenant | All queries must scope by `organization_id` |
| Build Reliability | `pnpm build` must succeed on clean clone |
| Type Safety | TypeScript strict mode ON |
| LLM Safety | No unvalidated JSON reaches DB |
| No PII Logging | IDs only in logs |
| Latency Goal | Prompt → preview < 10s |

---

## 5. Explicit v1 Non-Goals

❌ Legal reasoning or jurisdiction checks  
❌ Document generation (PDFs, packets)  
❌ Payment processing  
❌ Multi-role legal workflows / approvals  
❌ External client portals with branding  
❌ Case analytics

If it is not listed in **Section 3**, it **does not ship** in v1.

---

## 6. System Architecture Boundaries

| Layer | Location | Responsibility |
|-------|----------|----------------|
| UI | `src/app/**` | React pages, fetch calls |
| API | `src/api/**` | request → service wiring |
| Services | `src/*/svc/**` | domain logic |
| Repos | `src/*/repo/**` | DB access only |
| LLM | `src/llm/**` | pluggable provider adapters |
| Infra | `src/infra/**` | config, logger, db bootstrapping |

**Allowed import flow:** UI → API → Service → Repo

---

## 7. Success Criteria for v1 Completion

v1 is **DONE** when:

✔ FAT passes end-to-end (prompt → schema → submission → persistent CRM records)  
✔ Five real forms generated inside UI without developer help  
✔ At least one live client intake completed + stored  
✔ No org A user can ever see org B data  
✔ Mock + real LLM modes both work  
✔ Build, test, lint all green on fresh clone

---

## 8. Change-Control Rules

Any PR that changes:

| Area | Must Update |
|------|-------------|
| APIs | `03-data-and-api-spec.md` |
| LLM behavior | `05-llm-prompt-spec.md` |
| Architecture / naming | `02-technical-vision-and-conventions.md` |
| Acceptance logic | `06-fat-v1-prompt-to-preview.md` |

No behavior may drift from written specs.

---

**End of Document**
