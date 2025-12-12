import { openai } from '../../infra/openai/infra.openai.client';

export interface NormalizedQuery {
    original: string;
    transformed: string; // [NEW] The LLM-optimized version
}

export class QueryNormalizer {
    
    /**
     * USES LLM TO REWRITE THE QUERY.
     * 
     * Input: "can they call my boss?"
     * Output: "debt collector communication employer workplace prohibition truth in lending"
     */
    public async normalize(rawQuery: string): Promise<NormalizedQuery> {
        const clean = rawQuery.trim();

        console.log(`[Normalizer] Transforming query: "${clean}"`);

        const prompt = `
        You are a Legal Search Optimizer.
        Convert the user's natural language question into a keyword-rich semantic search string.
        
        TARGET DATABASE: Massachusetts State Regulations (CMR) and Federal Laws (CFR, USC) regarding Consumer Protection, Debt Collection, Telemarketing, and Auto Sales.
        
        INSTRUCTIONS:
        1. Remove conversational noise ("hello", "please", "I want to know").
        2. Expand terms to their legal equivalents (e.g. "boss" -> "employer", "work" -> "place of employment").
        3. Add relevant statute names if the topic is obvious (e.g. "lemon" -> "Lemon Law", "debt" -> "FDCPA", "calls" -> "TCPA").
        4. Do NOT output JSON. Output ONLY the optimized search string.
        
        USER QUERY: "${clean}"
        `;

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini", // Fast & Cheap
                messages: [{ role: "system", content: "You are a search query optimizer." }, { role: "user", content: prompt }],
                temperature: 0,
                max_tokens: 100
            });

            const optimized = response.choices[0].message.content?.trim() || clean;
            console.log(`[Normalizer] Optimized: "${optimized}"`);

            return {
                original: clean,
                transformed: optimized
            };

        } catch (error) {
            console.error("[Normalizer] LLM failed. Using raw query.", error);
            return {
                original: clean,
                transformed: clean
            };
        }
    }
}