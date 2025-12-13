import { describe, it, expect } from 'vitest';
import { HybridSearchService } from '../../src/retrieve/svc/retrieve.svc.hybridSearch';
import { SupabaseGraphReader } from '../../src/infra/supabase/infra.supabase.reader';
import { ContextAssembler } from '../../src/retrieve/svc/retrieve.svc.contextAssembler';
import { SupabaseOverrideRepo } from '../../src/graph/repo/graph.repo.overrideRepo';

describe('Production Retrieval Diagnostics', () => {
    
    // Test #1: Test Semantic Search
    it('should find a Semantic Hit in Production', async () => {
        const searcher = new HybridSearchService();
        const results = await searcher.search("can I call someone who is on the do not call list?", 5);

        console.log('\n🔍 Search Results (Semantic):');
        results.forEach(r => console.log(`   [${(r.score * 100).toFixed(1)}%] ${r.urn}`));

        expect(results.length).toBeGreaterThan(0);
    }, 20000);

    // Test #2: Test Keyword Dominance (Ranking Inversion)
    it('should rank Exact Citation Matches #1 over generic vectors', async () => {
        const searcher = new HybridSearchService();
        
        const query = "47 CFR 64.1200"; 
        const results = await searcher.search(query, 5);

        console.log('\n🔍 Search Results (Exact Citation):');
        results.forEach(r => console.log(`   [${(r.score * 100).toFixed(1)}%] ${r.urn} (K:${r.keyword_score.toFixed(2)} / V:${r.vector_score.toFixed(2)})`));

        expect(results.length).toBeGreaterThan(0);
        
        const topHit = results[0].urn;
        
        // [FIX] URNs sanitize periods to underscores. Assert against the sanitized version.
        expect(topHit).toContain('64_1200'); 
        
        expect(results[0].keyword_score).toBeGreaterThan(0.5);
    }, 20000);

    // Test #3: Test Ancestry Climbing
    it('should successfully climb the ladder for a known URN', async () => {
        const reader = new SupabaseGraphReader();
        const searcher = new HybridSearchService();
        
        const results = await searcher.search("telemarketing sales rule", 1);
        if (results.length === 0) {
            console.warn("Skipping Ancestry test - No DB data.");
            return;
        }
        const targetUrn = results[0].urn;

        console.log(`\n🪜 Testing Ancestry for: ${targetUrn}`);

        const node = await reader.getNodeByUrn(targetUrn);
        expect(node).toBeDefined();

        if (node) {
            const ancestors = await reader.getAncestors(node.citation_path);
            console.log(`   Ancestors Found: ${ancestors.length}`);
            expect(ancestors.length).toBeGreaterThan(1);
        }
    }, 20000);

    // Test #4: Test Full Context Assembly
    it('should assemble a context with >100 characters of text', async () => {
        const searcher = new HybridSearchService();
        const results = await searcher.search("do not call registry", 1);
        
        if (results.length === 0) {
            console.warn("Skipping Assembly test - No DB data.");
            return;
        }

        const targetUrn = results[0].urn;
        const reader = new SupabaseGraphReader();
        const assembler = new ContextAssembler(reader, new SupabaseOverrideRepo());

        const context = await assembler.assembleContext(targetUrn);

        console.log('\n📦 Final Context Assembly:');
        console.log(`   Target: ${context.targetNode.structure_type}`);
        
        const totalText = [context.targetNode, ...context.ancestry]
            .map(n => n.content_text)
            .join('\n');

        console.log(`   Total Text Length: ${totalText.length} chars`);

        expect(totalText.length).toBeGreaterThan(100);
        expect(context.ancestry.length).toBeGreaterThan(0);
    }, 20000);
});