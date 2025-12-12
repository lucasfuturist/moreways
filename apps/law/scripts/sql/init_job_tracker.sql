-- Tracks the lifecycle of every file we attempt to ingest
create table if not exists source_ingest_log (
    source_id text primary key, -- Google Drive ID (or File Path)
    file_name text not null,
    file_hash text,             -- SHA-256 (Optional, for content change detection)
    
    status text check (status in ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    
    error_message text,         -- If it failed, why?
    attempts int default 0,     -- How many times have we tried?
    
    started_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Index for fast lookup during the loop
create index if not exists idx_ingest_status on source_ingest_log(status);