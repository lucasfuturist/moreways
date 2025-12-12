# 08 – Security, Audit & Safety Policy

**Status:** Active  
**Version:** 1.0  
**Context:** Compliance & Legal Safety

## 1. Chain of Custody (Provenance)
In a legal environment, data integrity is paramount. We must be able to prove, mathematically, that the text stored in the database is identical to the text published by the government.

Every node in the graph retains strict provenance metadata:
*   **`source_hash`:** The SHA-256 hash of the original source PDF file.
*   **`page_number`:** The physical page index where the text appears.
*   **`bbox`:** The bounding box coordinates `[x, y, w, h]` of the text block on the source page. This allows the UI to highlight the original PDF, proving to the user that the system did not hallucinate the text.

## 2. Judicial Overrides (The Kill Switch)
Regulations are subject to judicial review. If a court strikes down a specific regulation (e.g., due to *Chevron* deference issues or unconstitutionality), the system must **immediately** cease referencing it, even if the source PDF on the state website remains unchanged.

### 2.1 The Mechanism
We utilize a dedicated `judicial_overrides` table that acts as a runtime filter.

### 2.2 The Logic
Before returning any node $N$ to the user or the LLM:
1.  Query `judicial_overrides` for $N.urn$.
2.  If a record exists with status `VOID`, `ENJOINED`, or `SUSPENDED`:
    *   **Redact** the node from the context.
    *   **Inject** a system warning: *"This regulation was enjoined by [Court Case Citation] on [Date]."*

## 3. Federal Preemption Safety
Under the Supremacy Clause, Federal regulations (e.g., FCC TCPA) generally preempt conflicting State regulations (e.g., MA 940 CMR). A naive system might return a valid State rule that is actually unenforceable.

### 3.1 Detection Logic
During the **Enrichment Phase**, the semantic classifier identifies if a State node regulates the same conduct as a Federal node (e.g., "Robocall Timeout").

### 3.2 Runtime Warning
If a query retrieves a State node with a known Federal overlap, the system appends a **Supremacy Warning**:
> *"Warning: Federal Regulation 16 CFR 310.4 may preempt Massachusetts 940 CMR regarding this specific conduct."*

## 4. Immutable Audit Logging
To prevent tampering (e.g., a developer manually editing a law to hide a bug), all writes to the `legal_nodes` table are logged to an append-only `audit_logs` table.

*   **Structure:** Merkle Tree.
*   **Guarantee:** The hash of the current log entry depends on the hash of the previous entry. Any modification to historical data breaks the chain, alerting security operations immediately.