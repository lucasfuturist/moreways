# argueOS – Security & Data Handling Policy (v0.1)

**Status:** Active  
**Version:** 0.1  
**Owner:** Founding Team  
**Applies To:** All development, infrastructure, and data operations

---

## 1. Purpose & Scope

This policy defines the foundational security and data-handling standards for argueOS.

It exists to:

- Protect client confidentiality and system integrity
- Establish clear rules for developers and operators
- Ensure we are enterprise-ready from day one

This is a **living document** and will expand alongside product maturity.

---

## 2. Data Classification

| Class | Definition | Examples |
|-------|------------|----------|
| **Public** | Intended for external access | Marketing site text |
| **Internal** | Not public but low-risk | Internal metrics, non-sensitive logs |
| **Sensitive** | PII, legal matter data, client submissions | All `FormSubmission` data, client names, emails, notes |

**All engineers must treat Sensitive data as legally privileged.**

---

## 3. Core Policies

### 3.1 Data Storage

- All **Sensitive** data MUST reside in PostgreSQL.
- Production DB MUST use cloud-provider encryption at rest (AES-256).
- **Sensitive** fields MUST NOT appear in:
  - logs
  - third-party analytics
  - queue payloads

References must use internal IDs only.

---

### 3.2 Data in Transit

- All external traffic MUST use **TLS ≥ 1.2**
- No plaintext HTTP endpoints may exist in production
- Internal service traffic should be encrypted when feasible

---

### 3.3 Access Control & Multi-Tenancy

- Every DB query for **Sensitive** data MUST filter by `organization_id`.
  **There are zero exceptions.**
- API layer MUST verify the authenticated user belongs to the target organization.
- Row-level leaks between orgs = **critical severity security incident**

---

### 3.4 AI / LLM Handling

- V1 LLM usage is restricted to **schema generation only**
- No Sensitive client data may be sent to any LLM vendor
- Future expansion requires:
  - signed zero-retention agreement from vendor
  - explicit user opt-in
  - logged justification

argueOS does **not** generate legal advice or compliance assertions.

---

### 3.5 Developer & Environment Security

- Secrets MUST be stored in `.env` and **never committed**
- Production secrets must live in a secure secret manager
- Third-party dependencies must undergo automated vulnerability scanning

**Local development requirement:**  
Developers must use **seeded or redacted** data unless explicitly approved by the founding team.

---

## 4. Logging & Observability Rules

- Logs MUST be limited to **Internal** data only
- No logs may contain PII, raw form submissions, or client text
- LLM events must log:
  - timestamp
  - organization_id
  - model used
  - token counts
  **NOT** full prompt contents if prompt includes PII

---

## 5. Data Retention & Deletion (Initial Standard)

- Sensitive data is retained for the lifetime of the customer organization
- If an organization requests deletion:
  - data must be purged within **30 days**
- Backups follow the same purge window

(Will expand once automated retention policy is implemented)

---

## 6. Third-Party Vendor Policy

No vendor may store or retain Sensitive data unless:

1. A written agreement exists guaranteeing **no retention**, and  
2. They meet or exceed our encryption and handling standards

---

## 7. Incident Response (v0.1)

Any suspected data exposure, cross-tenant access, or security breach MUST be escalated to the founding team **within 24 hours**.

A formal response plan will be added in v0.2.

---

## 8. Future Enhancements

- Per-field encryption for high-sensitivity matters
- Automated audit log export
- Full formal SOC2 / ISO27001 alignment

---

**This policy is binding for all contributors.  
Failure to comply is grounds for immediate removal from the project.**
