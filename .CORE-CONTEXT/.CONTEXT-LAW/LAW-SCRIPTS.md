# High-Resolution Interface Map: `apps/law/scripts`

## Tree: `apps/law/scripts`

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
├── deep-search-by-urn.ts
├── get-node-text.ts
├── hydrate-from-cache.ts
├── inspect-definitions.ts
├── inspect-hierarchy.ts
├── rc/
│   ├── api/
│   │   ├── handler/
├── reconstruct-document.ts
├── reingest-all.ts
├── reingest-specific.ts
├── repair-orphan-links.ts
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

## File Summaries

### `ask-question.ts`
**Role:** CLI entry point for the full RAG pipeline to test question answering from the command line.
**Key Exports:**
- `main()` - Orchestrates Normalization, Search, Filtering, Context Assembly, and Synthesis.
**Dependencies:** `QueryNormalizer`, `HybridSearchService`, `RelevanceFilterService`, `ContextAssembler`, `synthesizeAnswer`.

### `atomize-definitions.ts`
**Role:** Post-processing script that scans existing nodes for definition lists, extracts them using Regex/LLMs, and creates atomic child nodes for better retrieval.
**Key Exports:**
- `main()` - Fetches nodes with definition keywords, parses terms, generates embeddings, and inserts new nodes into the DB.
**Dependencies:** `SupabaseDbClient`, `OpenAiClient`, `uuid`.

### `audit-quality.ts`
**Role:** Analyzes a local directory of PDFs to report parsing metrics (node counts, depth, tree health) without performing full ingestion.
**Key Exports:**
- `audit()` - Iterates files, runs the parser logic, and prints a tabular quality report to stdout.
**Dependencies:** `LocalPdfClient`, `IngestParsePdfAsync`.

### `debug-atomizer-target.ts`
**Role:** Diagnostic tool to check if a specific URN contains patterns compatible with the `atomize-definitions` script.
**Key Exports:**
- `inspect()` - Fetches a node by URN and runs the regex logic to preview extraction results without writing to DB.
**Dependencies:** `SupabaseDbClient`.

### `debug-azure-dry-run.ts`
**Role:** Tests the Azure Document Intelligence integration and Parser logic without database commits or OpenAI costs.
**Key Exports:**
- `main()` - Sends local PDFs to Azure, runs the parser, and saves JSON artifacts (Raw OCR + Parsed Tree) to disk.
**Dependencies:** `AzureDocIntelClient`, `IngestParsePdfAsync`, `lintGraph`.

### `debug-drive.ts`
**Role:** Verifies authentication and permission scopes for the Google Drive Service Account.
**Key Exports:**
- `runDebug()` - Attempts to list files and access a specific folder ID to confirm visibility.
**Dependencies:** `googleapis`.

### `debug-graph-dump.ts`
**Role:** Exports the parsed internal graph structure of local PDFs to JSON files for inspection.
**Key Exports:**
- `run()` - Parses PDFs and serializes the `ProcessingNode` map to a nested JSON format.
**Dependencies:** `LocalPdfClient`, `IngestParsePdfAsync`.

### `debug-retrieval.ts`
**Role:** Low-level database inspection to verify node existence and test Ltree ancestry queries.
**Key Exports:**
- `main()` - Fetches a node by URN/Text and prints its metadata and calculated ancestor path.
**Dependencies:** `SupabaseDbClient`.

### `debug-search.ts`
**Role:** CLI tool to manually test the `HybridSearchService` against the production database.
**Key Exports:**
- `main()` - Vectorizes a query and prints the top 5 semantic matches with score breakdowns.
**Dependencies:** `HybridSearchService`, `OpenAiClient`.

### `deep-search-by-urn.ts`
**Role:** Finds all descendant nodes of a URN prefix, useful for locating specific sections within a large document structure.
**Key Exports:**
- `deepSearch()` - Queries the DB for URNs matching a prefix and scans content for definition keywords.
**Dependencies:** `SupabaseDbClient`.

### `hydrate-from-cache.ts`
**Role:** Rapidly re-ingests data into the database using previously saved OCR JSON artifacts, bypassing Azure costs.
**Key Exports:**
- `main()` - Reads JSON files, reconstructs the ingestion job, and commits nodes via the `IngestWorker`.
**Dependencies:** `IngestWorker`, `GraphNodeRepo`, `EnrichmentService`.

### `inspect-definitions.ts`
**Role:** Verifies the existence of atomized definition nodes in the database.
**Key Exports:**
- `main()` - Queries for nodes with `structure_type='DEFINITION'` and prints samples.
**Dependencies:** `SupabaseDbClient`.

### `inspect-hierarchy.ts`
**Role:** Lists direct children of a specific root node to verify proper parent-child linkage.
**Key Exports:**
- `inspect()` - Fetches a parent node and lists all children pointing to its UUID.
**Dependencies:** `SupabaseDbClient`.

### `reconstruct-document.ts`
**Role:** Re-assembles fragmented graph nodes back into a linear, readable text format.
**Key Exports:**
- `main()` - Fetches all nodes for a corpus, sorts by `citation_path`, and prints indented text to stdout.
**Dependencies:** `SupabaseDbClient`.

### `reingest-all.ts`
**Role:** Bulk processing script to wipe the staging table and re-ingest all local documents.
**Key Exports:**
- `main()` - Truncates staging, detects file types (PDF vs Text), and runs the `IngestWorker` pipeline.
**Dependencies:** `IngestWorker`, `AzureDocIntelClient`, `GraphNodeRepo`.

### `reingest-specific.ts`
**Role:** targeted repair script to clean and re-ingest specific documents into the staging environment.
**Key Exports:**
- `main()` - Deletes records matching a specific URN pattern and re-processes specific files.
**Dependencies:** `IngestWorker`, `SupabaseDbClient`.

### `repair-orphan-links.ts`
**Role:** Data integrity script that scans for nodes missing `parentId` and attempts to re-link them based on URN hierarchy.
**Key Exports:**
- `repairOrphans()` - identifying orphans under a root URN and performs batch updates to restore lineage.
**Dependencies:** `SupabaseDbClient`.

### `run-drive-ingest.ts`
**Role:** Production entry point for ingesting documents directly from a Google Drive folder.
**Key Exports:**
- `main()` - Lists Drive files, checks `JobTracker` for idempotency, downloads content, and executes the ingestion worker.
**Dependencies:** `GoogleDriveSource`, `AzureDocIntelClient`, `JobTracker`.

### `run-local-ingest.ts`
**Role:** Production entry point for ingesting documents from a local folder with full Azure/OpenAI integration.
**Key Exports:**
- `main()` - Iterates local files, constructs `IngestJob` objects, and executes the pipeline.
**Dependencies:** `IngestWorker`, `AzureDocIntelClient`, `GraphNodeRepo`.

---

## SQL File Summaries

### `sql/init_db.sql`
**Role:** Defines the primary schema for the production database.
**Key Schema Elements:**
- `legal_nodes` (Table) - Stores graph nodes with Vector and Ltree support.
- `match_legal_nodes` (RPC) - Native function for vector similarity search.
- Constraints for SCD Type 2 validity ranges.

### `sql/init_backup_vault.sql`
**Role:** Sets up an immutable audit log for data changes.
**Key Schema Elements:**
- `legal_nodes_vault` (Table) - Stores JSON snapshots of rows before modification.
- `backup_legal_node` (Trigger Function) - Captures INSERT/UPDATE/DELETE events.

### `sql/init_job_tracker.sql`
**Role:** Sets up the logging table for the ingestion pipeline.
**Key Schema Elements:**
- `source_ingest_log` (Table) - Tracks status, hashes, and errors for file processing.

### `sql/migration_add_fts.sql`
**Role:** Adds Full Text Search capabilities and the hybrid search function.
**Key Schema Elements:**
- `fts` (Column) - Generated `tsvector` column on `legal_nodes`.
- `match_legal_nodes_hybrid` (RPC) - Search function combining Vector similarity and FTS rank.

### `sql/setup_staging.sql`
**Role:** Mirrors the production schema for the staging environment.
**Key Schema Elements:**
- `legal_nodes_staging` (Table) - Identical structure to production.
- `match_legal_nodes_staging` (RPC) - Search function targeting the staging table.

### `sql/promote_staging.sql`
**Role:** SQL commands to move data from staging to production.
**Key Actions:**
- `INSERT INTO ... SELECT ...` - Copies staging rows to production with conflict handling.

### `sql/staging_to_vault.sql`
**Role:** Backfills the backup vault with current staging data.
**Key Actions:**
- Snapshots current staging state into the vault for historical tracking.