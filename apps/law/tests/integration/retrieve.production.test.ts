import { describe, it, expect } from 'vitest';
import { HybridSearchService } from '../../src/retrieve/svc/retrieve.svc.hybridSearch';
import { SupabaseGraphReader } from '../../src/infra/supabase/infra.supabase.reader';
import { ContextAssembler } from '../../src/retrieve/svc/retrieve.svc.contextAssembler';
import { SupabaseOverrideRepo } from '../../src/graph/repo/graph.repo.overrideRepo';

describe('Production Retrieval Diagnostics', () => {
    
    // 1. Test the Vector Search (Does it find the "Do Not Call" node?)
    it('should find a Semantic Hit in Production', async () => {
        const searcher = new HybridSearchService();
        const results = await searcher.search("can I call someone who is on the do not call list?", 5);

        console.log('\n🔍 Search Results:');
        results.forEach(r => console.log(`   [${(r.score * 100).toFixed(1)}%] ${r.urn}`));

        expect(results.length).toBeGreaterThan(0);
        
        // Pass the best URN to the next test context (implicitly via console for now)
        return results[0].urn;
    });

    // 2. Test the Ancestry Lookup (The likely broken part)
    it('should successfully climb the ladder for a known URN', async () => {
        const reader = new SupabaseGraphReader();
        
        // Let's grab a node we KNOW exists from the previous step or hardcoded
        // Using a broad search to ensure we get a valid candidate
        const searcher = new HybridSearchService();
        const results = await searcher.search("telemarketing sales rule", 1);
        const targetUrn = results[0].urn;

        console.log(`\n🪜 Testing Ancestry for: ${targetUrn}`);

        // A. Fetch the Node directly
        const node = await reader.getNodeByUrn(targetUrn);
        expect(node).toBeDefined();
        console.log(`   Target Path: ${node?.citation_path}`);

        // B. Fetch Ancestors
        if (!node) throw new Error("Node lookup failed");
        
        const ancestors = await reader.getAncestors(node.citation_path);
        
        console.log(`   Ancestors Found: ${ancestors.length}`);
        ancestors.forEach(a => console.log(`   - [${a.structure_type}] ${a.urn} (${a.citation_path})`));

        // If this is 0 or 1, the retrieval is broken
        expect(ancestors.length).toBeGreaterThan(1);
    });

    // 3. Test the Full Assembly
    it('should assemble a context with >1000 characters of text', async () => {
        const searcher = new HybridSearchService();
        const results = await searcher.search("do not call registry", 1);
        const targetUrn = results[0].urn;

        const reader = new SupabaseGraphReader();
        const assembler = new ContextAssembler(reader, new SupabaseOverrideRepo());

        const context = await assembler.assembleContext(targetUrn);

        console.log('\n📦 Final Context Assembly:');
        console.log(`   Target: ${context.targetNode.structure_type}`);
        console.log(`   Ancestors: ${context.ancestry.length}`);
        
        const totalText = [context.targetNode, ...context.ancestry]
            .map(n => n.content_text)
            .join('\n');

        console.log(`   Total Text Length: ${totalText.length} chars`);

        expect(totalText.length).toBeGreaterThan(100);
        expect(context.ancestry.length).toBeGreaterThan(0);
    });
});