import { openai } from '../../infra/openai/infra.openai.client';
import { SearchResult } from './retrieve.svc.hybridSearch';

export class RelevanceFilterService {

    public async filterRelevance(query: string, candidates: SearchResult[]): Promise<SearchResult[]> {
        if (candidates.length === 0) return [];

        console.log(`[Filter] Judging ${candidates.length} candidates for relevance...`);

        const candidateBlock = candidates.map((c, index) => 
            `[ID: ${index}] URN: ${c.urn}\nTEXT: ${c.content_text.substring(0, 500)}...` // Increased preview size
        ).join('\n---\n');

        const prompt = `
        You are a Legal Relevance Filter. 
        
        USER QUERY: "${query}"

        Below are raw text fragments from a legal database. 
        WARNING: The data may be messy, fragmented, or poorly formatted. 
        
        YOUR JOB:
        Look past the formatting. Read the actual text content.
        Identify any fragment that *might* contain the answer or useful context.
        
        CRITERIA:
        1. Be generous. If it looks 10% relevant, keep it.
        2. If a fragment looks like a "list of definitions", keep it only if the defined terms appear in the User Query.
        3. If a fragment seems to be cut off, keep it (the full text will be retrieved later).
        
        CANDIDATES:
        ${candidateBlock}

        Return a JSON object with a single key "relevant_indices" (array of integers).
        `;

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "system", content: "You are a generous legal filter." }, { role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0
            });

            const rawJson = response.choices[0].message.content || "{}";
            const result = JSON.parse(rawJson);
            const indices = result.relevant_indices || [];

            console.log(`[Filter] LLM selected ${indices.length} relevant items.`);

            const winners = indices
                .map((i: number) => candidates[i])
                .filter((c: any) => c !== undefined);

            return winners;

        } catch (error) {
            console.error("[Filter] LLM Filter failed. Falling back.", error);
            return candidates.slice(0, 5); // Fallback to top 5
        }
    }
}