SELECT 
    json_build_object(
        'table', t.table_name,
        'columns', json_agg(
            json_build_object(
                'name', c.column_name,
                'type', c.udt_name, -- e.g., 'uuid', 'varchar', 'jsonb'
                'nullable', c.is_nullable,
                'default', c.column_default
            ) ORDER BY c.ordinal_position
        )
    ) as table_schema
FROM 
    information_schema.columns c
JOIN 
    information_schema.tables t ON c.table_name = t.table_name
WHERE 
    c.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
GROUP BY 
    t.table_name;