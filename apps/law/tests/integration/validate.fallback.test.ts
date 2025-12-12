// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Hoist Mocks
const { mockSearch, mockGetChildren, mockGetNode, mockOpenAiCreate } = vi.hoisted(() => ({
    mockSearch: vi.fn(),
    mockGetChildren: vi.fn(),
    mockGetNode: vi.fn(),
    mockOpenAiCreate: vi.fn()
}));

// 2. Mock Modules
vi.mock('../../src/retrieve/svc/retrieve.svc.hybridSearch', () => ({
    HybridSearchService: class { search = mockSearch; }
}));

vi.mock('../../src/infra/supabase/infra.supabase.reader', () => ({
    SupabaseGraphReader: class {
        getChildren = mockGetChildren;
        getNodeByUrn = mockGetNode;
    }
}));

// Mock OpenAI to prevent network timeouts
vi.mock('../../src/infra/openai/infra.openai.client', () => ({
    openai: {
        chat: {
            completions: {
                create: mockOpenAiCreate
            }
        }
    }
}));

// 3. Import Class Under Test
import { JudgeService } from '../../src/validate/svc/validate.svc.judge';
import { HybridSearchService } from '../../src/retrieve/svc/retrieve.svc.hybridSearch';
import { SupabaseGraphReader } from '../../src/infra/supabase/infra.supabase.reader';

describe('Judge Service - Dynamic Fallback', () => {
    let judge: JudgeService;

    beforeEach(() => {
        vi.clearAllMocks();
        judge = new JudgeService(new HybridSearchService(), new SupabaseGraphReader());

        // Setup successful OpenAI response so the code doesn't hang or crash
        mockOpenAiCreate.mockResolvedValue({
            choices: [{
                message: {
                    content: JSON.stringify({
                        status: "LIKELY_VIOLATION",
                        confidence_score: 0.9,
                        analysis: {
                            summary: "Mock analysis",
                            missing_elements: [],
                            strength_factors: [],
                            weakness_factors: []
                        },
                        relevant_citations: []
                    })
                }
            }]
        });
    });

    it('should fall back to Hybrid Search if exact URN is missing', async () => {
        // A. Hardcoded Lookup Fails
        mockGetNode.mockResolvedValue(null);

        // B. Search Succeeds
        mockSearch.mockResolvedValue([
            { urn: 'urn:lex:ma:found_via_search:5_04', score: 0.9 }
        ]);

        // C. Fetch Content for the Found Node
        mockGetChildren.mockResolvedValue([
            {
                urn: 'urn:lex:ma:found_via_search:5_04',
                content_text: 'The Lemon Law requires a refund if inspection fails in 7 days.'
            }
        ]);

        await judge.evaluate('Auto – Dealership or Repair', {
            issue: "Car failed inspection"
        });

        // ASSERTIONS
        
        // 1. Verify Search was called with the concept text
        expect(mockSearch).toHaveBeenCalledWith(
            expect.stringContaining("lemon law"), 
            1
        );

        // 2. Verify it used the Found Node's text
        expect(mockGetChildren).toHaveBeenCalledWith(
            'urn.lex.ma.found_via_search.5_04', // Path (dots)
            'urn:lex:ma:found_via_search:5_04'  // URN (colons)
        );
    });
});