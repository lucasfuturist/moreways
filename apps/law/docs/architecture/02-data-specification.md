# 02 – Data Schema & Ontology

**Status:** Ratified  
**Version:** 1.0  
**Context:** Database Storage

## 1. Canonical URN Scheme
To ensure global uniqueness across jurisdictions, all nodes adhere to the following URN specification:

`urn:lex:[jurisdiction]:[corpus]:[structure_path]`

**Examples:**
*   **Massachusetts Regulation:** `urn:lex:ma:940cmr:3.17:2:a`
*   **Federal Regulation:** `urn:lex:us:16cfr:310.4:b:1`

## 2. Database DDL (PostgreSQL)
The core table `legal_nodes` utilizes PostgreSQL extensions `ltree` for hierarchy and `btree_gist` for temporal exclusion constraints.

```sql
-- Core Hierarchy Table
CREATE TABLE legal_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 1. Identity
    urn TEXT NOT NULL, 
    citation_path LTREE NOT NULL, -- Indexable path: root.part_3.sec_17
    jurisdiction TEXT CHECK (jurisdiction IN ('MA', 'FED')),
    
    -- 2. Content
    content_text TEXT NOT NULL,
    intro_text TEXT, -- Content appearing before children (preamble)
    structure_type TEXT CHECK (structure_type IN ('SECTION', 'PARAGRAPH', 'TABLE', 'NOTE')),
    
    -- 3. Logic & Semantics
    logic_summary JSONB, -- Pre-computed LLM extraction of rules
    embedding VECTOR(1536), -- Semantic embedding of content_text
    
    -- 4. Temporal Validity (SCD Type 2)
    validity_range DATERANGE NOT NULL DEFAULT '[2000-01-01,)',
    
    -- 5. Provenance
    source_hash TEXT NOT NULL, -- SHA-256 of source file
    
    -- Constraints
    -- Prevent overlapping versions of the same node
    CONSTRAINT unique_active_version EXCLUDE USING GIST (urn WITH =, validity_range WITH &&)
);

-- Indexing Strategy
CREATE INDEX idx_nodes_path ON legal_nodes USING GIST (citation_path);
CREATE INDEX idx_nodes_urn ON legal_nodes (urn);
CREATE INDEX idx_nodes_vector ON legal_nodes USING ivfflat (embedding vector_cosine_ops);
```

## 3. The Controlled Vocabulary
To map colloquial user language to statutory terms, we maintain a synonym ontology.

*   **Table:** `legal_synonyms`
*   **Mapping:** `User Term ("Car")` -> `Statutory URN (urn:lex:ma:940cmr:3.01:motor_vehicle)`
