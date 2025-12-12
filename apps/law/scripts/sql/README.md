# Database Schema & Migration Scripts

This directory contains the SQL scripts required to initialize, maintain, and inspect the Supabase (PostgreSQL) database for the Law Parsing Engine.

## 🏗️ Architecture Overview

The database uses several advanced PostgreSQL features:
*   **`pgvector`**: For storing OpenAI embeddings and performing semantic similarity search.
*   **`ltree`**: For storing hierarchical citation paths (e.g., `root.part_310.section_4.a`).
*   **SCD Type 2 (Time Travel)**: Uses `daterange` and `GIST` exclusion constraints to maintain historical versions of laws without overlaps.

## 📜 Script Manifest

### 1. Initialization (`init_db.sql`)
**Target:** Production (`legal_nodes`)
*   Enables required extensions (`vector`, `ltree`, `btree_gist`).
*   Creates the primary `legal_nodes` table.
*   Sets up the **Exclusion Constraint** for SCD Type 2 (prevents overlapping validity ranges for the same URN).
*   Creates indexes for URN lookups, Ltree paths, and Vector IVFFlat search.
*   Defines the production RPC function `match_legal_nodes`.

### 2. Job Tracking (`init_job_tracker.sql`)
**Target:** Ingestion Logs (`source_ingest_log`)
*   Creates the table used by the `JobTracker` service.
*   Tracks file hashes, processing status (`PENDING`, `COMPLETED`, `FAILED`), and error logs.
*   Ensures idempotency during the ingestion pipeline.

### 3. Staging Environment (`setup_staging.sql`)
**Target:** Staging (`legal_nodes_staging`)
*   Clones the schema of `legal_nodes` into `legal_nodes_staging`.
*   Replicates all constraints (including the SCD exclusion constraint) and indexes.
*   Creates the staging-specific RPC function `match_legal_nodes_staging`.
*   *Run this whenever `init_db.sql` changes to keep environments in sync.*

### 4. Promotion (`promote_staging.sql`)
**Action:** Copy Data
*   Copies records from `legal_nodes_staging` into `legal_nodes`.
*   Uses `ON CONFLICT DO NOTHING` to ensure idempotency.
*   Used at the end of a successful ingestion batch to make data live.

### 5. Inspection (`inspect_schema.sql`)
**Action:** Diagnostics
*   Queries `information_schema` to list all tables, columns, and specific data types.
*   Useful for verifying that extensions are working and columns have the correct types.

---

## 🚀 Execution Order (Setup)

If setting up a fresh Supabase project, run the scripts in the SQL Editor in this order:

1.  **`init_db.sql`** (Sets up extensions and Prod table)
2.  **`init_job_tracker.sql`** (Sets up logging)
3.  **`setup_staging.sql`** (Sets up Staging table and search functions)

## 🧪 Common Workflows

### Resetting Staging
To wipe the staging environment before a clean ingestion run:

```sql
TRUNCATE TABLE legal_nodes_staging;
```

### Verifying Vector Index Usage
To ensure your vector search is using the IVFFlat index:

```sql
EXPLAIN ANALYZE 
SELECT * FROM match_legal_nodes('[...vector...]', 0.5, 5);
```

### Checking for Orphans
To find nodes that have lost their parents (data integrity check):

```sql
SELECT count(*) 
FROM legal_nodes 
WHERE structure_type != 'ROOT' 
AND "parentId" IS NULL;
```
