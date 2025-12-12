INSERT INTO legal_nodes_vault (
    original_node_id,
    node_snapshot,
    origin_table,
    operation
)
SELECT 
    id,                 -- The Node ID
    row_to_json(t),     -- The entire row as JSON
    'legal_nodes_staging',
    'BACKFILL'          -- Audit tag proving this was the initial load
FROM legal_nodes_staging t
-- Safety: Don't insert if this specific ID is already in the vault
WHERE NOT EXISTS (
    SELECT 1 FROM legal_nodes_vault v 
    WHERE v.original_node_id = t.id
);