-- =========================================================
-- PROMOTION SCRIPT (Staging -> Production)
-- =========================================================

-- 1. Insert data from staging to production
INSERT INTO legal_nodes (
    id, 
    urn, 
    citation_path, 
    jurisdiction, 
    content_text, 
    structure_type, 
    embedding, 
    logic_summary, 
    validity_range, 
    source_job_id, 
    page_number, 
    bbox,
    created_at
)
SELECT 
    id, 
    urn, 
    citation_path, 
    jurisdiction, 
    content_text, 
    structure_type, 
    embedding, 
    logic_summary, 
    validity_range, 
    source_job_id, 
    page_number, 
    bbox,
    created_at
FROM legal_nodes_staging
ON CONFLICT (id) DO NOTHING; -- Idempotency check

-- 2. (Optional) Verify Counts Match
-- select 
--   (select count(*) from legal_nodes) as prod_count,
--   (select count(*) from legal_nodes_staging) as staging_count;

-- 3. Cleanup Staging (Only run if you are absolutely sure)
-- TRUNCATE TABLE legal_nodes_staging;