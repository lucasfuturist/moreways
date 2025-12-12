import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Use vi.hoisted to create the mocks BEFORE the module import happens
const { mockFrom, mockSelect, mockIn, mockInsert } = vi.hoisted(() => {
    const mockIn = vi.fn();
    const mockSelect = vi.fn();
    const mockInsert = vi.fn();
    const mockFrom = vi.fn();
    
    return { mockFrom, mockSelect, mockIn, mockInsert };
});

// 2. Mock the library
vi.mock('@supabase/supabase-js', () => ({
    createClient: () => ({
        from: mockFrom
    })
}));

// 3. Import the class AFTER the mock is set up
import { SupabaseDbClient } from '../../src/infra/supabase/infra.supabase.client';

describe('Supabase Client - Batching & Stability', () => {
    let dbClient: SupabaseDbClient;

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Wire up the chain: .from() -> .select() -> .in()
        mockIn.mockResolvedValue({ data: [], error: null });
        mockSelect.mockReturnValue({ in: mockIn });
        mockInsert.mockResolvedValue({ error: null });
        
        mockFrom.mockReturnValue({
            select: mockSelect,
            insert: mockInsert
        });

        dbClient = new SupabaseDbClient('http://mock', 'key');
    });

    it('should split fetchActiveNodes into small chunks to prevent Header Overflow', async () => {
        // Generate 100 fake URNs
        const urns = Array.from({ length: 100 }, (_, i) => `urn:lex:test:${i}`);

        await dbClient.fetchActiveNodes(urns);

        // Logic: 
        // We set the batch size to 40 in the code.
        // 100 items / 40 = 2 full chunks + 1 partial chunk = 3 calls.
        expect(mockFrom).toHaveBeenCalledTimes(3);
        
        // Verify the first call received a chunk of 40
        // args[0] is the column ('urn'), args[1] is the array
        const firstCallArg = mockIn.mock.calls[0][1] as string[];
        expect(firstCallArg.length).toBe(40);
        
        // Verify the last call received the remainder (20)
        const lastCallArg = mockIn.mock.calls[2][1] as string[];
        expect(lastCallArg.length).toBe(20);
    });

    it('should handle extremely long URNs without erroring in the client wrapper', async () => {
        // Generate URNs that simulate the length of the failing ones
        const longUrn = `urn:lex:fed:940_cmr_10_00_home_improvement_contractor_practices:manufactured_home_definitions_and_scope_section_long_suffix`;
        const urns = Array.from({ length: 50 }, () => longUrn);

        // We expect this to execute (calling our mock) without throwing logic errors
        await expect(dbClient.fetchActiveNodes(urns)).resolves.not.toThrow();
        
        // With batch size 40, 50 items = 2 calls
        expect(mockFrom).toHaveBeenCalledTimes(2);
    });
});