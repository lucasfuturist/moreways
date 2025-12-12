import { QueryNormalizer } from '../src/retrieve/svc/retrieve.svc.queryNormalizer';
import { HybridSearchService } from '../src/retrieve/svc/retrieve.svc.hybridSearch';
import { RelevanceFilterService } from '../src/retrieve/svc/retrieve.svc.relevanceFilter';
import { ContextAssembler } from '../src/retrieve/svc/retrieve.svc.contextAssembler';
import { synthesizeAnswer } from '../src/retrieve/svc/retrieve.svc.synthesizer';
import { SupabaseGraphReader } from '../src/infra/supabase/infra.supabase.reader';
import { SupabaseOverrideRepo } from '../src/graph/repo/graph.repo.overrideRepo';

async function main() {
    const query = process.argv.slice(2).join(' ');
    if (!query) {
        console.error("Usage: npx ts-node scripts/ask-question.ts \"<Your Question>\"");
        process.exit(1);
    }

    console.log(`\n💬 USER: "${query}"`);
    console.log(`--------------------------------------------------`);

    // 1. Normalize
    const normalizer = new QueryNormalizer();
    const normalized = await normalizer.normalize(query);
    console.log(`🔍 [1/5] Optimizer:  "${normalized.transformed}"`);

    // 2. Search
    const searcher = new HybridSearchService();
    const rawResults = await searcher.search(normalized.transformed, 10);
    console.log(`📚 [2/5] Retrieval:  Found ${rawResults.length} candidates.`);

    if (rawResults.length === 0) {
        console.log("❌ No results found.");
        return;
    }

    // 3. Filter
    const filter = new RelevanceFilterService();
    const filtered = await filter.filterRelevance(query, rawResults);
    // Fallback: If filter removes everything, keep top 1
    const bestCandidates = filtered.length > 0 ? filtered : [rawResults[0]];
    console.log(`🎯 [3/5] Filtering:  Kept ${bestCandidates.length} relevant nodes.`);

    // 4. Assemble Context
    console.log(`📦 [4/5] Assembly:   Building context around "${bestCandidates[0].urn}"...`);
    const reader = new SupabaseGraphReader();
    const overrides = new SupabaseOverrideRepo();
    const assembler = new ContextAssembler(reader, overrides);
    
    // We assemble context for the #1 hit
    const context = await assembler.assembleContext(bestCandidates[0].urn);
    
    // Flatten all unique nodes to send to LLM
    const uniqueNodes = new Map();
    [context.targetNode, ...context.ancestry, ...context.definitions].forEach(n => uniqueNodes.set(n.id, n));
    const allNodes = Array.from(uniqueNodes.values());

    // 5. Synthesize
    console.log(`🤖 [5/5] Synthesis:  Asking GPT-4o (${allNodes.length} context nodes)...`);
    const answer = await synthesizeAnswer(query, allNodes);

    console.log(`\n=================== ANSWER ===================\n`);
    console.log(answer);
    console.log(`\n==============================================\n`);
}

main().catch(console.error);