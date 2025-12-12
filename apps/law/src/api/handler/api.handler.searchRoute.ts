import { z } from 'zod';
import { QueryNormalizer } from '../../retrieve/svc/retrieve.svc.queryNormalizer';
import { HybridSearchService, SearchResult } from '../../retrieve/svc/retrieve.svc.hybridSearch';
import { RelevanceFilterService } from '../../retrieve/svc/retrieve.svc.relevanceFilter';
import { ContextAssembler } from '../../retrieve/svc/retrieve.svc.contextAssembler';
import { synthesizeAnswer } from '../../retrieve/svc/retrieve.svc.synthesizer';
import { cache } from '../../shared/utils/cache';
import { formatLegalText } from '../../shared/utils/formatter'; // [NEW] Import for text cleaning

const SearchRequestSchema = z.object({
    query: z.string().min(3),
    jurisdiction: z.enum(['MA', 'FED']).default('MA')
});

const normalizer = new QueryNormalizer();
const searcher = new HybridSearchService();
const filter = new RelevanceFilterService();

export class SearchController {
    
    constructor(
        private readonly assembler: ContextAssembler
    ) {}

    public async handleSearch(body: unknown) {
        // 1. Validation
        const req = SearchRequestSchema.parse(body);
        
        // 2. Cache Check
        const cacheKey = cache.generateKey('search_v4_llm_query', req); // Bump version
        const cachedResult = cache.get(cacheKey);
        
        if (cachedResult) {
            console.log(`[API] ⚡ Cache Hit for "${req.query}"`);
            return cachedResult;
        }

        console.log(`[API] 🐢 Cache Miss for "${req.query}". Processing...`);

        // 3. Normalization (Now with LLM Intelligence)
        const normalized = await normalizer.normalize(req.query);

        // 4. Retrieval Strategy (Pure Semantic/Hybrid)
        // Use the TRANSFORMED query (e.g. "debt collector employer")
        // Limit set to 15 to catch fragmented contexts.
        const rawResults = await searcher.search(normalized.transformed, 15);

        if (rawResults.length === 0) {
            return { data: null, message: "No relevant laws found." };
        }

        // 5. Relevance Filter (LLM Judge)
        // We pass the ORIGINAL query here so the judge knows what the user actually asked,
        // matching it against the results found by the optimized query.
        const filteredResults = await filter.filterRelevance(req.query, rawResults);

        // Fallback: If filter is too strict, keep top 2 raw results
        const candidatesToAssemble = filteredResults.length > 0 
            ? filteredResults 
            : rawResults.slice(0, 2);

        // 6. Context Assembly
        const topCandidates = candidatesToAssemble.slice(0, 5).map(r => r.urn);
        
        const contexts = await Promise.all(
            topCandidates.map(urn => this.assembler.assembleContext(urn))
        );

        // Flatten nodes
        const uniqueNodes = new Map<string, any>();
        
        contexts.forEach(ctx => {
            uniqueNodes.set(ctx.targetNode.urn, ctx.targetNode);
            ctx.ancestry.forEach(n => uniqueNodes.set(n.urn, n));
            ctx.definitions.forEach(n => uniqueNodes.set(n.urn, n));
        });

        const consolidatedNodes = Array.from(uniqueNodes.values());
        const consolidatedAlerts = contexts.flatMap(c => c.alerts);

        // 7. Synthesis
        const answer = await synthesizeAnswer(req.query, consolidatedNodes);

        // [FIX] Clean nodes for the frontend (fix PDF artifacts)
        const cleanContextNodes = consolidatedNodes.map(n => ({
            ...n,
            content_text: formatLegalText(n.content_text)
        }));

        const responsePayload = {
            data: {
                answer,
                context: {
                    urn: topCandidates[0],
                    related_urns: topCandidates,
                    ancestry: cleanContextNodes, // Send cleaned text
                    alerts: consolidatedAlerts
                }
            },
            debug: {
                // Show the user what we actually searched for
                query_original: normalized.original,
                query_transformed: normalized.transformed,
                
                // [FIX] Clean snippets in debug view
                vector_matches: rawResults.slice(0, 5).map(r => ({
                    urn: r.urn,
                    total_score: r.score.toFixed(4),
                    vector_score: r.vector_score.toFixed(4),
                    keyword_score: r.keyword_score.toFixed(4),
                    snippet: formatLegalText(r.content_text).substring(0, 150) + "..."
                })),
                selected_hits: topCandidates
            },
            meta: {
                cached: false,
                timestamp: new Date().toISOString()
            }
        };

        // 8. Write Cache
        cache.set(cacheKey, { ...responsePayload, meta: { ...responsePayload.meta, cached: true } }, 86400);

        return responsePayload;
    }
}