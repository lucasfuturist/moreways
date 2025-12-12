-- 1. Add FTS Column
alter table legal_nodes 
add column if not exists fts tsvector 
generated always as (to_tsvector('english', content_text)) stored;

-- 2. Index It (GiST/GIN is fast for text)
create index if not exists idx_nodes_fts on legal_nodes using gin (fts);

-- 3. Update the Staging Table too
alter table legal_nodes_staging 
add column if not exists fts tsvector 
generated always as (to_tsvector('english', content_text)) stored;

create index if not exists idx_nodes_fts_staging on legal_nodes_staging using gin (fts);

-- 4. Create the Hybrid Search Function
-- This combines Vector Score (Semantic) + Rank Score (Keyword)

create or replace function match_legal_nodes_hybrid (
  query_embedding vector(1536),
  query_text text,
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  urn text,
  content_text text,
  similarity float,
  rank float
)
language plpgsql
as $$
begin
  return query
  select
    legal_nodes.id,
    legal_nodes.urn,
    legal_nodes.content_text,
    (1 - (legal_nodes.embedding <=> query_embedding))::float as similarity,
    (ts_rank(legal_nodes.fts, plainto_tsquery('english', query_text)))::float as rank
  from legal_nodes
  where 
    -- 1. FILTER: Purely based on Semantic Meaning (Vector)
    -- We lower the threshold to allow broader concept matching
    (1 - (legal_nodes.embedding <=> query_embedding) > match_threshold)
  order by 
    -- 2. SORT: Pure Relevance
    -- We rely 95% on the Vector score. FTS is just a tiny tie-breaker.
    -- This prevents the "vocab mismatch penalty".
    (
      (1 - (legal_nodes.embedding <=> query_embedding)) + 
      (coalesce(ts_rank(legal_nodes.fts, plainto_tsquery('english', query_text)), 0) * 0.05)
    ) desc
  limit match_count;
end;
$$;