import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContextAssembler } from '../../src/retrieve/svc/retrieve.svc.contextAssembler';

// [FIX 1] Hoist the spy so it exists before the module import
// This creates a shared reference we can control inside the tests
const { sharedSearchSpy } = vi.hoisted(() => {
    return { sharedSearchSpy: vi.fn() };
});

// [FIX 2] Mock the module using a standard function to ensure 'new' works
vi.mock('../../src/retrieve/svc/retrieve.svc.hybridSearch', () => {
    return {
        HybridSearchService: function() {
            return { search: sharedSearchSpy };
        }
    };
});

// Mock dependencies
const mockAssembler = {
    assembleContext: vi.fn()
} as unknown as ContextAssembler;

vi.mock('../../src/retrieve/svc/retrieve.svc.synthesizer', () => ({
    synthesizeAnswer: vi.fn().mockResolvedValue("This is the synthesized legal answer.")
}));

// Import Controller AFTER mocks are set up
import { SearchController } from '../../src/api/handler/api.handler.searchRoute';

describe('API - Search Controller', () => {
    let controller: SearchController;

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Default Success Behavior
        sharedSearchSpy.mockResolvedValue([
            { urn: 'urn:lex:ma:3_00', score: 0.9, content_text: 'Match' }
        ]);

        controller = new SearchController(mockAssembler);
        
        (mockAssembler.assembleContext as any).mockResolvedValue({
            targetNode: { urn: 'urn:lex:ma:3_00', content_text: 'Content' },
            ancestry: [],
            definitions: [],
            alerts: []
        });
    });

    it('should validate inputs and throw on missing query', async () => {
        const invalidBody = { jurisdiction: 'MA' }; 
        await expect(controller.handleSearch(invalidBody))
            .rejects
            .toThrow();
    });

    it('should execute full search flow on valid input', async () => {
        const body = { query: 'security deposit', jurisdiction: 'MA' };
        
        // Cast to 'any' to bypass partial return type checking in test
        const response = await controller.handleSearch(body) as any;
        
        expect(response.data.answer).toBe("This is the synthesized legal answer.");
        expect(response.data.context.urn).toBe('urn:lex:ma:3_00');
        expect(sharedSearchSpy).toHaveBeenCalled();
    });

    it('should handle zero results gracefully', async () => {
        // [FIX 3] Control the spy directly via the hoisted variable
        sharedSearchSpy.mockResolvedValueOnce([]);
        
        const body = { query: 'unicorn laws', jurisdiction: 'MA' };
        const response = await controller.handleSearch(body) as any;

        expect(response.message).toContain("No relevant laws found");
        expect(response.data).toBeNull();
    });
});