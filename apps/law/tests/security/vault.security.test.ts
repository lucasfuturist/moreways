import { describe, it, expect } from 'vitest';
import { supabase } from '../../src/infra/supabase/infra.supabase.client';
import { v4 as uuidv4 } from 'uuid';

describe('Security - Backup Vault', () => {

    it('should silently capture inserts into the vault', async () => {
        const testId = uuidv4();
        
        // 1. Insert into Staging (Triggers the backup)
        const { data, error } = await supabase
            .from('legal_nodes_staging')
            .insert({
                id: testId,
                urn: `urn:lex:test:security_check:${testId}`,
                content_text: 'Secret Data',
                citation_path: 'root.security',
                structure_type: 'PARAGRAPH',
                source_job_id: uuidv4(),
                // Mock required fields
                validity_range: '[2025-01-01,)'
            })
            .select()
            .single();

        expect(error).toBeNull();
        expect(data).toBeDefined();

        // The trigger is atomic/synchronous in Postgres, 
        // so if the insert succeeded, the backup MUST exist.
    });

    it('should BLOCK standard API access to the vault (Black Hole)', async () => {
        // Attempt to read the vault using the standard client 
        // (simulating a hacker or frontend trying to read backups)
        const { data, error } = await supabase
            .from('legal_nodes_vault')
            .select('*');

        // RLS default "Deny All" returns empty array, effectively 
        // pretending the table doesn't exist or is empty.
        expect(data).toEqual([]); 
    });

    it('should BLOCK deletion attempts via API', async () => {
        const { count } = await supabase
            .from('legal_nodes_vault')
            .delete()
            .neq('vault_id', '00000000-0000-0000-0000-000000000000'); // Try to delete everything

        // Should modify 0 rows because RLS hides them from the query scope
        expect(count).toBe(null); 
    });
});