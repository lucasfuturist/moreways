import { z } from 'zod';
import { QueryNormalizer } from '../../retrieve/svc/retrieve.svc.queryNormalizer';
import { HybridSearchService } from '../../retrieve/svc/retrieve.svc.hybridSearch';
import { RelevanceFilterService } from '../../retrieve/svc/retrieve.svc.relevanceFilter';
import { ContextAssembler } from '../../retrieve/svc/retrieve.svc.contextAssembler';
import { synthesizeAnswer } from '../../retrieve/svc/retrieve.svc.synthesizer';
import { cache } from '../../shared/utils/cache';
import { formatLegalText } from '../../shared/utils/formatter';

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
        // ... (validation, cache check, normalization, search steps are unchanged) ...
        const req = SearchRequestSchema.parse(body);
        const cacheKey = cache.generateKey('search_v6_explicit_citations', req);
        const cachedResult = cache.get(cacheKey);
        if (cachedResult) return cachedResult;

        const normalized = await normalizer.normalize(req.query);
        const rawResults = await searcher.search(normalized.transformed, 15);

        if (rawResults.length === 0) {
            return { data: null, message: "No relevant laws found." };
        }

        const filteredResults = await filter.filterRelevance(req.query, rawResults);

        // [CRITICAL FIX] Make the fallback more generous.
        // If the filter is too strict and returns 0 results, we will now proceed
        // with the top 5 raw search hits instead of just the top 2.
        const candidatesToAssemble = filteredResults.length > 0 
            ? filteredResults 
            : rawResults.slice(0, 5); // Old value was 2

        // ... (context assembly and synthesis steps are unchanged) ...
        const topCandidates = candidatesToAssemble.slice(0, 5).map(r => r.urn);
        
        const contexts = await Promise.all(
            topCandidates.map(urn => this.assembler.assembleContext(urn))
        );

        const uniqueNodes = new Map<string, any>();
        contexts.forEach(ctx => {
            uniqueNodes.set(ctx.targetNode.urn, ctx.targetNode);
            ctx.ancestry.forEach(n => uniqueNodes.set(n.urn, n));
            ctx.definitions.forEach(n => uniqueNodes.set(n.urn, n));
        });

        const consolidatedNodes = Array.from(uniqueNodes.values());
        const consolidatedAlerts = contexts.flatMap(c => c.alerts);

        const answer = await synthesizeAnswer(req.query, consolidatedNodes, consolidatedAlerts);

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
                    ancestry: cleanContextNodes,
                    alerts: consolidatedAlerts
                }
            },
            debug: {
                query_original: normalized.original,
                query_transformed: normalized.transformed,
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

        cache.set(cacheKey, { ...responsePayload, meta: { ...responsePayload.meta, cached: true } }, 86400);

        return responsePayload;
    }
}