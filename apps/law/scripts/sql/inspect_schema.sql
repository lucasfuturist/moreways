SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.udt_name as specific_type, -- Shows specific types like 'vector' or 'ltree'
    c.is_nullable
FROM 
    information_schema.tables t
JOIN 
    information_schema.columns c ON t.table_name = c.table_name
WHERE 
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
ORDER BY 
    t.table_name, 
    c.ordinal_position;