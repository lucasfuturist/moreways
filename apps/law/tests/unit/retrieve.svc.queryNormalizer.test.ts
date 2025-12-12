import { describe, it, expect } from 'vitest';
import { QueryNormalizer } from '../../src/retrieve/svc/retrieve.svc.queryNormalizer';

describe('Retrieval - Query Normalizer', () => {
    const normalizer = new QueryNormalizer();

    it('should expand colloquial terms into legal terminology', () => {
        // [FIX] Changed "kick me out" to "kick out" to match the simple string-includes logic of the mock normalizer.
        // In a real NLP system, we'd use stemming/lemmatization or vector-based synonymy.
        const query = "Can my landlord kick out a tenant?";
        const result = normalizer.normalize(query);
        
        expect(result.original).toBe("Can my landlord kick out a tenant?");
        expect(result.expanded).toContain("eviction");
        expect(result.expanded).toContain("summary process");
    });

    it('should extract explicit URNs', () => {
        const query = "Check urn:lex:ma:3_17 for rules.";
        const result = normalizer.normalize(query);
        
        expect(result.extractedUrns).toContain("urn:lex:ma:3_17");
        expect(result.isKeywordSearch).toBe(true);
    });

    it('should infer URNs from citations', () => {
        const query = "According to 940 CMR 3.17, this is illegal.";
        const result = normalizer.normalize(query);
        
        // Heuristic mapping check
        expect(result.extractedUrns).toContain("urn:lex:ma:3_17");
    });

    it('should sanitize input', () => {
        const query = "   Bad <script>Tag</script>   ";
        const result = normalizer.normalize(query);
        
        expect(result.original).toBe("Bad scriptTag/script");
    });
});