# High-Resolution Interface Map: `apps/law/src/graph`

## Tree: `apps/law/src/graph`

```
graph/
├── repo/
│   ├── graph.repo.auditLogRepo.ts
│   ├── graph.repo.linkRepo.ts
│   ├── graph.repo.nodeRepo.ts
│   ├── graph.repo.overrideRepo.ts
├── schema/
│   ├── graph.schema.nodes.ts
```

## File Summaries

### `repo/graph.repo.auditLogRepo.ts`
**Role:** Manages the immutable audit ledger by logging changes with cryptographic chaining (SHA-256) to ensure data integrity.
**Key Exports:**
- `logChange(entry: AuditEntry): Promise<void>` - Inserts a new audit record linked to the previous record's hash.
- `AuditEntry` - Interface defining the structure of a loggable action (URN, action type, payload, actor).
**Dependencies:** `supabase`, `crypto`.

### `repo/graph.repo.linkRepo.ts`
**Role:** *Placeholder.* Intended to manage cross-reference links between graph nodes.
**Key Exports:** *None (Empty File)*
**Dependencies:** *None*

### `repo/graph.repo.nodeRepo.ts`
**Role:** Handles the transformation of raw ingest data into structured graph nodes, calculating hierarchy (URNs) and managing Slowly Changing Dimensions (SCD) during commits.
**Key Exports:**
- `GraphNodeRepo` - Class responsible for node transformation and database synchronization.
- `commitParseResult(result, jurisdiction, corpus, enrichmentData, sourceJobId): Promise<void>` - Orchestrates the conversion of parse results into nodes, detects changes, and executes bulk inserts/expirations.
- `IDatabaseClient` - Interface abstracting the underlying database operations for nodes.
**Dependencies:** `ParseResult`, `ProcessingNode`, `LegalNodeRecord`.

### `repo/graph.repo.overrideRepo.ts`
**Role:** Retrieves judicial overrides (e.g., laws stayed or vacated by courts) by matching target URNs against wildcard patterns.
**Key Exports:**
- `SupabaseOverrideRepo` - Implementation that fetches active overrides from Supabase and filters via regex.
- `MockOverrideRepo` - In-memory implementation for testing.
- `overrideMatches(target, pattern): boolean` - Utility function converting wildcard URN patterns to Regex.
- `JudicialOverride` - Interface defining the structure of an override (pattern, type, citation, message).
**Dependencies:** `supabase`.

### `schema/graph.schema.nodes.ts`
**Role:** Defines the Zod schema and TypeScript types for a "Legal Node," representing the fundamental unit of data in the graph (laws, regulations).
**Key Exports:**
- `LegalNodeRecordSchema` - Zod definition including structure type, semantic embeddings, logic summaries, and validity ranges.
- `LegalNodeRecord` - TypeScript type inferred from the schema.
**Dependencies:** `zod`, `NodeTypeSchema`.