-- 1. Enable Extensions
create extension if not exists vector;
create extension if not exists ltree;
create extension if not exists btree_gist; -- Required for exclusion constraints

-- 2. Create the Node Table
create table if not exists legal_nodes (
    id uuid primary key default gen_random_uuid(),
    
    -- Identity
    urn text not null, 
    citation_path ltree not null, 
    jurisdiction text check (jurisdiction in ('MA', 'FED')),
    
    -- Content
    content_text text not null,
    structure_type text check (structure_type in ('ROOT', 'PART', 'SECTION', 'SUBSECTION', 'PARAGRAPH', 'SUBPARAGRAPH', 'CLAUSE', 'NOTE', 'APPENDIX')),
    
    -- AI/Semantics
    embedding vector(1536), 
    logic_summary jsonb, 
    
    -- Provenance & Validity (SCD Type 2)
    validity_range daterange not null default '[2000-01-01,)',
    source_job_id uuid not null,
    page_number int,
    bbox jsonb, -- Storing array as jsonb for flexibility
    
    created_at timestamptz default now(),

    -- 3. Constraints
    -- "No two rows can have the same URN and overlapping time ranges"
    constraint unique_active_version exclude using gist (
        urn with =, 
        validity_range with &&
    )
);

-- 3. Indexes for Performance
create index if not exists idx_nodes_urn on legal_nodes(urn);
create index if not exists idx_nodes_path on legal_nodes using gist (citation_path);
-- Vector Search Index (IVFFlat for speed, adjust lists based on row count)
create index if not exists idx_nodes_vector on legal_nodes using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- 4. RPC Function for Hybrid Search
-- This allows your API to call "rpc('match_legal_nodes', ...)"
create or replace function match_legal_nodes (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  urn text,
  content_text text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    legal_nodes.id,
    legal_nodes.urn,
    legal_nodes.content_text,
    1 - (legal_nodes.embedding <=> query_embedding) as similarity
  from legal_nodes
  where 1 - (legal_nodes.embedding <=> query_embedding) > match_threshold
  order by legal_nodes.embedding <=> query_embedding
  limit match_count;
end;
$$;