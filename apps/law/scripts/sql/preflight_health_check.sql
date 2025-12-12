SELECT 
    'Staging Total Rows' as metric, 
    count(*) as value, 
    CASE WHEN count(*) > 1000 THEN '✅ OK' ELSE '❌ FAIL' END as status
FROM legal_nodes_staging
UNION ALL
SELECT 
    'Nodes with Embeddings', 
    count(*), 
    CASE WHEN count(*) > 1000 THEN '✅ OK' ELSE '❌ FAIL' END
FROM legal_nodes_staging
WHERE embedding IS NOT NULL
UNION ALL
SELECT 
    'Root Nodes Found', 
    count(*), 
    CASE WHEN count(*) > 0 THEN '✅ OK' ELSE '❌ FAIL' END
FROM legal_nodes_staging
WHERE structure_type = 'ROOT'
UNION ALL
SELECT 
    'Vault Backups Secured', 
    count(*), 
    CASE WHEN count(*) > 0 THEN '✅ OK' ELSE '❌ FAIL' END
FROM legal_nodes_vault;