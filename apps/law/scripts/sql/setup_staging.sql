-- =========================================================
-- 1. SETUP STAGING TABLE
-- =========================================================

-- Create a staging table with the exact same structure as production
-- 'including all' copies defaults, constraints, and indexes
create table if not exists legal_nodes_staging (like legal_nodes including all);

-- Ensure the specific exclusion constraint exists on the staging table 
-- (Postgres 'like including all' handles this, but good to be explicit for SCD)
alter table legal_nodes_staging 
drop constraint if exists unique_active_version_staging;

alter table legal_nodes_staging 
add constraint unique_active_version_staging 
exclude using gist (urn with =, validity_range with &&);

-- Grant access
grant all on legal_nodes_staging to postgres, service_role;

-- =========================================================
-- 2. SETUP STAGING INDEXES (Critical for Vector Search)
-- =========================================================

-- Ensure we have an IVFFlat index on the staging table too
-- This makes testing performance realistic
create index if not exists idx_nodes_vector_staging 
on legal_nodes_staging 
using ivfflat (embedding vector_cosine_ops) 
with (lists = 100);

-- =========================================================
-- 3. SETUP STAGING SEARCH FUNCTION
-- =========================================================

-- This allows the API/Debug scripts to search staging specifically
create or replace function match_legal_nodes_staging (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  urn text,
  content_text text,
  structure_type text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    legal_nodes_staging.id,
    legal_nodes_staging.urn,
    legal_nodes_staging.content_text,
    legal_nodes_staging.structure_type,
    1 - (legal_nodes_staging.embedding <=> query_embedding) as similarity
  from legal_nodes_staging
  where 1 - (legal_nodes_staging.embedding <=> query_embedding) > match_threshold
  order by legal_nodes_staging.embedding <=> query_embedding
  limit match_count;
end;
$$;