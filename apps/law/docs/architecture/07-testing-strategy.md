# 07 – Testing Strategy

**Status:** Active  
**Version:** 1.0  
**Context:** QA & CI/CD

## 1. Philosophy: Integrity Over Isolation
In a generic SaaS application, unit tests focus on isolated logic. In a **Legal Engine**, unit tests are insufficient. A perfectly functioning parser that misinterprets an indentation level by one pixel can alter the legal meaning of a statute, creating liability.

Therefore, we prioritize **Data Regression Testing** (The "Golden Set") over granular unit isolation.

## 2. The "Golden Set" Protocol
We maintain a repository of Reference Artifacts—complex PDFs representing edge cases (nested tables, amendments, bad OCR)—and their "Perfect Parsed JSON" counterparts.

*   **Location:** `tests/golden-set/`
*   **Trigger:** Runs on every Pull Request.
*   **Mechanism:**
    1.  The CI pipeline spins up the `IngestWorker`.
    2.  It parses the Reference PDF using the current code branch.
    3.  It generates a deterministic SHA-256 hash of the output JSON tree.
    4.  It compares this hash against the stored "Golden Hash."
*   **Failure Condition:** If the hashes differ even by one byte, the build fails. This ensures zero regression in parsing logic.

## 3. Test Categories

### 3.1 Unit Tests (Logic Verification)
These test the deterministic helper functions.
*   **Regex Profiles:** Verify that `(a)` is correctly identified as a Paragraph in Massachusetts Law but a Sub-paragraph in US Federal Code.
*   **Linter:** Verify that broken cross-references (e.g., citing a non-existent URN) trigger the appropriate warning flags.
*   **Sanitizers:** Verify that unicode ligatures (`ﬁ` -> `fi`) are normalized correctly.

### 3.2 Integration Tests (Pipeline Flow)
These test the signal flow without external dependencies.
*   **Scope:** Ingest -> Store -> Retrieve.
*   **Mocking Strategy:**
    *   **Database:** Use a Dockerized PostgreSQL instance (never mock the DB logic itself, as `ltree` behavior is critical).
    *   **LLM:** **NEVER** call live LLMs in tests. Use `tests/mocks/llm.mock.ts` to return static, deterministic JSON logic summaries.
    *   **Azure:** Mock the JSON response from the Layout Analysis API.

## 4. Directory Structure

```text
src/tests/
├── golden-set/
│   ├── source/          # The Reference PDFs
│   │   ├── ma-940-cmr-3.pdf
│   │   └── fed-16-cfr-310.pdf
│   └── expected/        # The Signed JSON Outputs
│       ├── ma-940-cmr-3.json
│       └── fed-16-cfr-310.json
├── mocks/
│   ├── azure-layout.mock.json
│   └── llm-logic-summary.mock.json
├── unit/
│   ├── ingest.util.regex.test.ts
│   └── graph.schema.urn.test.ts
└── integration/
    └── full-pipeline.test.ts
```

## 5. Continuous Integration (CI) Rules
1.  **Blocker:** No merge is allowed if the Golden Set regression fails.
2.  **Coverage:** 100% coverage is required for `ingest/util` (Regex) and `retrieve/svc` (Context Assembly).
