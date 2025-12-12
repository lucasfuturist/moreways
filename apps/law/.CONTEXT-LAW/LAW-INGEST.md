# File Scan: `apps/law/src/ingest`

## Tree: C:\projects\moreways-ecosystem\apps\law\src\ingest

```
ingest/

├── api/
│   ├── ingest.api.source.ts
│   ├── ingest.api.worker.ts
├── schema/
│   ├── ingest.schema.pdfInput.ts
├── svc/
│   ├── ingest.svc.enrichNode.ts
│   ├── ingest.svc.idempotency.ts
│   ├── ingest.svc.jobTracker.ts
│   ├── ingest.svc.linter.ts
│   ├── ingest.svc.parsePdf.ts
│   ├── ingest.svc.pipeline.ts
├── util/
│   ├── ingest.util.regexProfiles.ts
│   ├── ingest.util.sanitizer.ts
```

## Files

### `ingest/api/ingest.api.source.ts`
**Role:** Defines the contract for fetching raw file metadata and binary content from external storage (e.g., S3, Google Drive).
**Key Exports:**
- `IFileSource` - Interface defining `listFiles` and `downloadFile` methods.
- `FileMetadata` - Type definition for file attributes (id, name, mimeType).
**Dependencies:** None.

### `ingest/api/ingest.api.worker.ts`
**Role:** The main orchestration class that coordinates the entire ingestion lifecycle: OCR, Parsing, Auditing, Enrichment, and Persistence.
**Key Exports:**
- `IngestWorker` - Class encapsulating the processing logic.
- `processJob(job, fileBuffer): Promise<ParseResult>` - Executes the pipeline stages and commits results to the database.
- `IDocumentIntelligence` - Interface for the OCR provider (e.g., Azure Form Recognizer).
**Dependencies:** `GraphNodeRepo`, `EnrichmentService`, `IngestParsePdfAsync`, `lintGraph`.

### `ingest/schema/ingest.schema.pdfInput.ts`
**Role:** Defines the Zod schemas and types for data structures used throughout the ingestion pipeline, from raw OCR output to the processed graph tree.
**Key Exports:**
- `ParseResult` - Interface for the final output containing the root ID and the node lookup map.
- `ProcessingNode` - Type representing an intermediate node in the graph construction process.
- `IngestJob` - Type defining job execution parameters (jurisdiction, corpus, source URL).
- `NodeType` - Enum of legal structural levels (Section, Paragraph, Definition, etc.).
**Dependencies:** `zod`.

### `ingest/svc/ingest.svc.enrichNode.ts`
**Role:** Adds semantic value to structural nodes by generating vector embeddings and extracting logical summaries using AI providers.
**Key Exports:**
- `EnrichmentService` - Class handling the call to AI providers with context injection from parent nodes.
- `enrichNode(node, parentContext): Promise<Data>` - Generates embedding and summary for a specific node.
- `IAiProvider` - Interface abstracting the LLM/Embedding backend.
**Dependencies:** `ProcessingNode`, `process.env.DRY_RUN`.

### `ingest/svc/ingest.svc.idempotency.ts`
**Role:** Ensures files are processed only once by maintaining a registry of file hashes in Supabase.
**Key Exports:**
- `checkIdempotency(filePath): Promise<boolean>` - Verifies if a file's content hash already exists in the database.
- `registerSourceFile(filePath, jurisdiction)` - Inserts a new file record with its SHA-256 hash.
**Dependencies:** `supabase`, `crypto`, `fs`.

### `ingest/svc/ingest.svc.jobTracker.ts`
**Role:** Manages the state of ingestion jobs (PROCESSING, COMPLETED, FAILED) in the database to support resumption and error tracking.
**Key Exports:**
- `JobTracker` - Class wrapping Supabase state updates.
- `shouldProcess(sourceId): Promise<boolean>` - Determines if a job needs to run based on previous status.
- `markStarted/markComplete/markFailed` - Methods to transition job status.
**Dependencies:** `SupabaseClient`.

### `ingest/svc/ingest.svc.linter.ts`
**Role:** Performs structural integrity checks on the generated graph before persistence, detecting orphans and broken references.
**Key Exports:**
- `lintGraph(nodeMap, jurisdiction): LintResult` - Analyzes the node map for topological errors and missing citations.
- `LintResult` - Interface containing a list of warnings/critical errors and a validity boolean.
**Dependencies:** `ProcessingNode`.

### `ingest/svc/ingest.svc.parsePdf.ts`
**Role:** Transforms a flat list of raw PDF/OCR lines into a hierarchical tree structure based on indentation and regex patterns.
**Key Exports:**
- `IngestParsePdfAsync(lines, job): Promise<ParseResult>` - Runs the stack-based parsing algorithm, creates nodes, and prunes "ghost nodes" (duplicates).
**Dependencies:** `RegexProfile`, `sanitizer`, `uuid`.

### `ingest/svc/ingest.svc.pipeline.ts`
*File present in tree but content provided was empty.*

### `ingest/util/ingest.util.regexProfiles.ts`
**Role:** Provides jurisdiction-specific Regular Expression configurations to identify hierarchy levels (e.g., MA CMR vs. Federal CFR).
**Key Exports:**
- `getProfileForJurisdiction(jurisdiction): RegexProfile` - Factory function returning the appropriate parsing rules.
- `MA_CMR_Profile` - Config object for Massachusetts regulations.
- `US_CFR_Profile` - Config object for US Federal regulations.
**Dependencies:** `ParsingProfile` (type).

### `ingest/util/ingest.util.sanitizer.ts`
**Role:** Cleans raw OCR text by detecting headers/footers and normalizing unicode/spacing issues.
**Key Exports:**
- `isHeaderFooter(line): boolean` - Heuristic function to identify and exclude page artifacts.
- `sanitizeText(text): string` - Normalizes strings (NFKC), fixes spacing, and standardizes punctuation.
**Dependencies:** `RawPdfLine`.