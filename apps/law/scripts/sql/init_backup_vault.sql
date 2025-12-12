-- =========================================================
-- 1. CREATE THE VAULT (Immutable Log)
-- =========================================================
create table if not exists legal_nodes_vault (
    vault_id uuid primary key default gen_random_uuid(),
    original_node_id uuid not null,
    
    -- We store the entire row as a JSON blob. 
    -- This makes the backup schema-agnostic.
    node_snapshot jsonb not null,
    
    -- Metadata
    origin_table text not null, -- 'staging' or 'prod'
    operation text not null, -- 'INSERT', 'UPDATE', 'DELETE'
    backup_timestamp timestamptz default now()
);

-- Index for searching history by the original node ID
create index if not exists idx_vault_original_id on legal_nodes_vault(original_node_id);

-- [CRITICAL FIX] Grant permissions so Service Role (API/Tests) can see it
grant all on legal_nodes_vault to postgres, service_role;

-- =========================================================
-- 2. MAX SECURITY RLS (The "Black Hole")
-- =========================================================
alter table legal_nodes_vault enable row level security;

-- POLICY: DENY ALL API ACCESS
-- We purposely create NO policies. 
-- In Supabase, this means the table is invisible to the API/Client.
-- Only the Service Role (Super Admin) or Internal Triggers can touch it.

-- =========================================================
-- 3. THE BACKUP FUNCTION (Security Definer)
-- =========================================================
-- 'SECURITY DEFINER' runs with superuser privileges, bypassing RLS.
create or replace function backup_legal_node()
returns trigger
language plpgsql
security definer 
as $$
begin
    insert into legal_nodes_vault (
        original_node_id,
        node_snapshot,
        origin_table,
        operation
    ) values (
        coalesce(new.id, old.id),
        row_to_json(coalesce(new, old)),
        TG_TABLE_NAME,
        TG_OP
    );
    return new;
end;
$$;

-- =========================================================
-- 4. ATTACH TRIGGERS
-- =========================================================

-- Watch Production
drop trigger if exists on_legal_nodes_change on legal_nodes;
create trigger on_legal_nodes_change
after insert or update or delete on legal_nodes
for each row execute function backup_legal_node();

-- Watch Staging
drop trigger if exists on_legal_nodes_staging_change on legal_nodes_staging;
create trigger on_legal_nodes_staging_change
after insert or update or delete on legal_nodes_staging
for each row execute function backup_legal_node();