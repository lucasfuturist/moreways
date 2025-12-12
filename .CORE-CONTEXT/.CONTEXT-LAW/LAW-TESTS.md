# File Scan: `apps/law/tests`

## Tree: C:\projects\moreways-ecosystem\apps\law\tests

```
tests/

├── e2e/
│   ├── live.server.test.ts
│   ├── quality.live.test.ts
│   ├── server.smoke.test.ts
├── fuzzing/
│   ├── pdf.fuzzer.test.ts
├── golden-set/
│   ├── expected/
│   ├── golden.test.ts
│   ├── source/
├── integration/
│   ├── error-handling.test.ts
│   ├── full-pipeline.test.ts
│   ├── retrieve.production.test.ts
│   ├── validate.fallback.test.ts
│   ├── validate.judge.test.ts
├── mocks/
│   ├── db.mock.ts
│   ├── llm.mock.ts
├── security/
│   ├── vault.security.test.ts
├── stress/
│   ├── concurrency.test.ts
│   ├── memory.test.ts
├── unit/
│   ├── api.search.test.ts
│   ├── graph.repo.nodeRepo.test.ts
│   ├── graph.scd.test.ts
│   ├── infra.google.drive.test.ts
│   ├── infra.supabase.chunking.test.ts
│   ├── ingest.api.worker.test.ts
│   ├── ingest.svc.definitions.test.ts
│   ├── ingest.svc.federal.test.ts
│   ├── ingest.svc.linter.test.ts
│   ├── ingest.svc.parsePdf.test.ts
│   ├── ingest.svc.scenarios.test.ts
│   ├── ingest.util.regex.test.ts
│   ├── ingest.util.sanitizer.debug.test.ts
│   ├── ingest.util.sanitizer.test.ts
│   ├── retrieve.svc.contextAssembler.test.ts
│   ├── retrieve.svc.queryNormalizer.test.ts
│   ├── retrieve.svc.scenarios.test.ts
│   ├── shared.cache.test.ts
│   ├── shared.resilience.test.ts
```

## Files

### `tests/e2e/live.server.test.ts`
**Role:** Executes live debugging tests against the in-memory API server, specifically checking retrieval logic for specific queries.
**Key Exports:** None (Test Suite).
**Dependencies:** `supertest`, `app`.

### `tests/e2e/quality.live.test.ts`
**Role:** Runs a 10-point quality audit on the search API, verifying context matches against expected URNs and generating a Markdown QA report.
**Key Exports:** None (Test Suite).
**Dependencies:** `supertest`, `app`, `fs`, `path`.

### `tests/e2e/server.smoke.test.ts`
**Role:** Verifies basic server health and input validation responses (400 Bad Request).
**Key Exports:** None (Test Suite).
**Dependencies:** `supertest`, `app`.

### `tests/fuzzing/pdf.fuzzer.test.ts`
**Role:** Tests the robustness of the PDF parser by injecting chaotic document structures (indentation jumps, negative coordinates, recursive depths).
**Key Exports:** None (Test Suite).
**Dependencies:** `IngestParsePdfAsync`, `MockDocBuilder` (internal helper).

### `tests/golden-set/golden.test.ts`
**Role:** Performs regression testing by hashing the output of the parser against a known "Golden" hash to ensure deterministic serialization.
**Key Exports:** None (Test Suite).
**Dependencies:** `crypto`, `IngestParsePdfAsync`.

### `tests/integration/error-handling.test.ts`
**Role:** Tests the ingestion worker's ability to handle "poison pill" inputs (e.g., 0-byte files) without hanging.
**Key Exports:** None (Test Suite).
**Dependencies:** `IngestWorker`, `MockDbClient`.

### `tests/integration/full-pipeline.test.ts`
**Role:** Verifies the complete data flow from PDF ingestion through graph persistence to context retrieval using mocks.
**Key Exports:** None (Test Suite).
**Dependencies:** `IngestWorker`, `ContextAssembler`, `MockDbClient`.

### `tests/integration/retrieve.production.test.ts`
**Role:** Diagnostics test suite for the retrieval subsystem, verifying vector search hits, ancestry ladder climbing, and context assembly size.
**Key Exports:** None (Test Suite).
**Dependencies:** `HybridSearchService`, `SupabaseGraphReader`, `ContextAssembler`.

### `tests/integration/validate.fallback.test.ts`
**Role:** Tests the `JudgeService` logic to ensure it falls back to hybrid search when hardcoded regulatory anchors fail.
**Key Exports:** None (Test Suite).
**Dependencies:** `JudgeService`, `vi` (Vitest Mocks).

### `tests/integration/validate.judge.test.ts`
**Role:** Integration test for the AI Judge API endpoint, verifying verdict generation for violation scenarios vs. weak cases.
**Key Exports:** None (Test Suite).
**Dependencies:** `supertest`, `app`.

### `tests/mocks/db.mock.ts`
**Role:** Provides an in-memory implementation of the database client interface for unit testing without a real Postgres connection.
**Key Exports:**
- `MockDbClient` - Class storing records in a local array and simulating active node filtering.
**Dependencies:** `IDatabaseClient`, `LegalNodeRecord`.

### `tests/mocks/llm.mock.ts`
*File present in tree but content provided was empty.*

### `tests/security/vault.security.test.ts`
**Role:** Verifies database security policies (RLS), ensuring the immutable backup vault cannot be read or deleted via the standard API.
**Key Exports:** None (Test Suite).
**Dependencies:** `supabase`.

### `tests/stress/concurrency.test.ts`
**Role:** Simulates race conditions to verify that database exclusion constraints reject duplicate active records during concurrent ingestion.
**Key Exports:** None (Test Suite).
**Dependencies:** `SmartMockDbClient` (internal helper), `IngestWorker`.

### `tests/stress/memory.test.ts`
**Role:** Stress tests the PDF parser with massive inputs (5,000 pages) to monitor heap usage and detect memory leaks.
**Key Exports:** None (Test Suite).
**Dependencies:** `IngestParsePdfAsync`, `process.memoryUsage`.

### `tests/unit/api.search.test.ts`
**Role:** Unit tests for `SearchController`, validating input handling, search execution, and zero-result handling using mocked services.
**Key Exports:** None (Test Suite).
**Dependencies:** `SearchController`, `vi` (Vitest Mocks).

### `tests/unit/graph.repo.nodeRepo.test.ts`
**Role:** Unit tests for `GraphNodeRepo`, validating URN generation, Ltree path construction, and collision handling.
**Key Exports:** None (Test Suite).
**Dependencies:** `GraphNodeRepo`, `MockDbClient`.

### `tests/unit/graph.scd.test.ts`
**Role:** Unit tests for Slowly Changing Dimensions (SCD) logic, ensuring old nodes expire and new ones are inserted only when content changes.
**Key Exports:** None (Test Suite).
**Dependencies:** `GraphNodeRepo`, `MockDbClient`.

### `tests/unit/infra.google.drive.test.ts`
**Role:** Unit tests for the Google Drive adapter, verifying file filtering and smart download strategies (binary vs. export).
**Key Exports:** None (Test Suite).
**Dependencies:** `GoogleDriveSource`.

### `tests/unit/infra.supabase.chunking.test.ts`
**Role:** Tests the batching logic of the Supabase client to ensure large requests are split to avoid URL overflow errors.
**Key Exports:** None (Test Suite).
**Dependencies:** `SupabaseDbClient`.

### `tests/unit/ingest.api.worker.test.ts`
**Role:** Unit tests for `IngestWorker` orchestration, ensuring OCR output is correctly transformed and committed to the repo.
**Key Exports:** None (Test Suite).
**Dependencies:** `IngestWorker`, `MockGraphRepo` (internal helper).

### `tests/unit/ingest.svc.definitions.test.ts`
**Role:** Verifies that the parser correctly identifies and structures definition lists vs. standard subsections.
**Key Exports:** None (Test Suite).
**Dependencies:** `IngestParsePdfAsync`.

### `tests/unit/ingest.svc.federal.test.ts`
**Role:** Unit tests validating the parsing logic for Federal regulations (CFR/USC) which have different hierarchy rules than State laws.
**Key Exports:** None (Test Suite).
**Dependencies:** `IngestParsePdfAsync`, `MockDocBuilder`.

### `tests/unit/ingest.svc.linter.test.ts`
**Role:** Unit tests for the graph integrity linter, checking for orphaned nodes and missing roots.
**Key Exports:** None (Test Suite).
**Dependencies:** `lintGraph`.

### `tests/unit/ingest.svc.parsePdf.test.ts`
**Role:** Unit tests for the core PDF Stack Machine parser, validating hierarchy construction and text accumulation.
**Key Exports:** None (Test Suite).
**Dependencies:** `IngestParsePdfAsync`.

### `tests/unit/ingest.svc.scenarios.test.ts`
**Role:** Runs complex parsing scenarios (broken ladders, visual dissonance, garbage injection) to test parser robustness.
**Key Exports:** None (Test Suite).
**Dependencies:** `IngestParsePdfAsync`, `MockDocBuilder`.

### `tests/unit/ingest.util.regex.test.ts`
**Role:** Unit tests for the Regex Profiles used to detect headers in different jurisdictions (MA vs FED).
**Key Exports:** None (Test Suite).
**Dependencies:** `MA_CMR_Profile`, `US_CFR_Profile`.

### `tests/unit/ingest.util.sanitizer.debug.test.ts`
**Role:** Focused debug tests for specific sanitizer edge cases like merged headers and punctuation boundaries.
**Key Exports:** None (Test Suite).
**Dependencies:** `sanitizeText`, `isHeaderFooter`.

### `tests/unit/ingest.util.sanitizer.test.ts`
**Role:** Comprehensive test suite for the text sanitizer and header/footer detection logic.
**Key Exports:** None (Test Suite).
**Dependencies:** `sanitizeText`, `isHeaderFooter`.

### `tests/unit/retrieve.svc.contextAssembler.test.ts`
**Role:** Unit tests for `ContextAssembler`, verifying that it correctly gathers ancestry and scoped definitions for a target node.
**Key Exports:** None (Test Suite).
**Dependencies:** `ContextAssembler`, `MockGraphReader`.

### `tests/unit/retrieve.svc.queryNormalizer.test.ts`
**Role:** Unit tests for `QueryNormalizer`, verifying term expansion, URN extraction, and input sanitization.
**Key Exports:** None (Test Suite).
**Dependencies:** `QueryNormalizer`.

### `tests/unit/retrieve.svc.scenarios.test.ts`
**Role:** Validates complex retrieval scenarios including scope isolation, deep hierarchy resolution, and judicial override alerts.
**Key Exports:** None (Test Suite).
**Dependencies:** `ContextAssembler`, `GraphBuilder` (internal helper), `SmartMockReader` (internal helper).

### `tests/unit/shared.cache.test.ts`
**Role:** Unit tests for the in-memory cache utility, checking set/get, TTL expiration, and key generation.
**Key Exports:** None (Test Suite).
**Dependencies:** `cache`.

### `tests/unit/shared.resilience.test.ts`
**Role:** Unit tests for the retry utility, verifying behavior for successful calls, transient errors, and permanent failures.
**Key Exports:** None (Test Suite).
**Dependencies:** `withRetry`.