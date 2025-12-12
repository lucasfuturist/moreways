# File Scan: `apps/law/scripts`

## Tree: C:\projects\moreways-ecosystem\apps\law\scripts

```
scripts/

├── ask-question.ts
├── atomize-definitions.ts
├── audit-quality.ts
├── debug-atomizer-target.ts
├── debug-azure-dry-run.ts
├── debug-drive.ts
├── debug-graph-dump.ts
├── debug-retrieval.ts
├── debug-search.ts
├── debug-urns.ts
├── hydrate-from-cache.ts
├── inspect-definitions.ts
├── rc/
│   ├── api/
│   │   ├── handler/
├── reconstruct-document.ts
├── reingest-all.ts
├── reingest-specific.ts
├── run-drive-ingest.ts
├── run-local-ingest.ts
├── sql/
│   ├── README.md
│   ├── init_backup_vault.sql
│   ├── init_db.sql
│   ├── init_job_tracker.sql
│   ├── inspect_schema.sql
│   ├── migration_add_fts.sql
│   ├── preflight_health_check.sql
│   ├── promote_staging.sql
│   ├── setup_staging.sql
│   ├── staging_to_vault.sql
```

## Files

### `scripts/ask-question.ts`
**Role:** CLI entry point for testing the full RAG pipeline (Retrieval-Augmented Generation) with a user query.
**Key Exports:** None (Executes `main`).
**Dependencies:** `QueryNormalizer`, `HybridSearchService`, `RelevanceFilterService`, `ContextAssembler`, `synthesizeAnswer`.

### `scripts/atomize-definitions.ts`
**Role:** Post-processing script that detects embedded definition lists in parent nodes, splits them into atomic child nodes with embeddings, and truncates the parent text.
**Key Exports:** None (Executes `main`).
**Dependencies:** `SupabaseDbClient`, `OpenAiClient`.

### `scripts/audit-quality.ts`
**Role:** Scans a local directory of documents to assess parsing feasibility, identifying image-only PDFs or flat structures without hierarchy.
**Key Exports:** None (Executes `audit`).
**Dependencies:** `LocalPdfClient`, `IngestParsePdfAsync`.

### `scripts/debug-atomizer-target.ts`
**Role:** Diagnostic tool to inspect specific database nodes and determine why the definition atomization logic might skip them.
**Key Exports:** None (Executes `inspect`).
**Dependencies:** `SupabaseDbClient`.

### `scripts/debug-azure-dry-run.ts`
**Role:** Runs the ingestion pipeline (OCR + Parse + Lint) on local files without database commits, outputting JSON artifacts for debugging.
**Key Exports:** None (Executes `main`).
**Dependencies:** `AzureDocIntelClient`, `IngestParsePdfAsync`, `lintGraph`.

### `scripts/debug-drive.ts`
**Role:** Verifies Google Drive API credentials and folder visibility for the Service Account.
**Key Exports:** None (Executes `runDebug`).
**Dependencies:** `googleapis`.

### `scripts/debug-graph-dump.ts`
**Role:** Parses local PDFs and dumps the resulting graph hierarchy to JSON files to verify parent-child relationships visually.
**Key Exports:** None (Executes `run`).
**Dependencies:** `LocalPdfClient`, `IngestParsePdfAsync`.

### `scripts/debug-retrieval.ts`
**Role:** Debugs database lookups by fetching a node by URN or text and verifying its Ltree ancestry path connectivity.
**Key Exports:** None (Executes `main`).
**Dependencies:** `SupabaseDbClient`, `ContextAssembler`.

### `scripts/debug-search.ts`
**Role:** Executes a hybrid vector search query against the database and reports detailed semantic vs. keyword scoring.
**Key Exports:** None (Executes `main`).
**Dependencies:** `HybridSearchService`.

### `scripts/debug-urns.ts`
**Role:** Simple scanner that lists a sample of URNs and content snippets from the database to verify data presence.
**Key Exports:** None (Executes `main`).
**Dependencies:** `SupabaseDbClient`.

### `scripts/hydrate-from-cache.ts`
**Role:** Re-ingests data into the database using cached OCR outputs (JSON) to avoid incurring Azure costs during iterative development.
**Key Exports:**
- `CachedOcrClient` - Mock OCR implementation serving local JSON data.
**Dependencies:** `IngestWorker`, `GraphNodeRepo`, `EnrichmentService`.

### `scripts/inspect-definitions.ts`
**Role:** Verifies the existence of `DEFINITION` type nodes in the production database to confirm atomization success.
**Key Exports:** None (Executes `main`).
**Dependencies:** `SupabaseDbClient`.

### `scripts/reconstruct-document.ts`
**Role:** Rebuilds a document's full reading order by fetching all nodes under a corpus URN and sorting by citation path.
**Key Exports:** None (Executes `main`).
**Dependencies:** `SupabaseDbClient`.

### `scripts/reingest-all.ts`
**Role:** Destructive script that wipes the staging table and re-ingests all local documents, supporting text-file bypass for speed.
**Key Exports:**
- `TextBypassClient` - Mock OCR for plain text files.
**Dependencies:** `IngestWorker`, `AzureDocIntelClient`, `GraphNodeRepo`.

### `scripts/reingest-specific.ts`
**Role:** Surgically removes and re-ingests specific documents into staging without affecting the rest of the dataset.
**Key Exports:** None (Executes `main`).
**Dependencies:** `IngestWorker`, `GraphNodeRepo`.

### `scripts/run-drive-ingest.ts`
**Role:** Production-ready script that watches a Google Drive folder, processes new files via Azure/OpenAI, and updates job status in Supabase.
**Key Exports:** None (Executes `main`).
**Dependencies:** `GoogleDriveSource`, `IngestWorker`, `JobTracker`.

### `scripts/run-local-ingest.ts`
**Role:** Runs the full ingestion pipeline (Azure OCR -> Embedding -> DB) on a local folder of documents.
**Key Exports:** None (Executes `main`).
**Dependencies:** `IngestWorker`, `AzureDocIntelClient`, `EnrichmentService`.