import { openai } from '../../infra/openai/infra.openai.client';
import { supabase } from '../../infra/supabase/infra.supabase.client';
import { withRetry } from '../../shared/utils/resilience'; // Import the new utility

export interface SearchResult {
  urn: string;
  score: number;
  vector_score: number;
  keyword_score: number;
  content_text: string;
}

export class HybridSearchService {
  
  async search(userQuery: string, limit: number = 10): Promise<SearchResult[]> {
    // 1. Generate Embedding (Retried for robustness)
    const embeddingResponse = await withRetry(() => openai.embeddings.create({
      model: "text-embedding-3-small",
      input: userQuery,
    }));
    const vector = embeddingResponse.data[0].embedding;

    // 2. Call Supabase RPC (Hybrid) - WRAPPED IN RETRY
    return await withRetry(async () => {
        const { data, error } = await supabase.rpc('match_legal_nodes_hybrid', { 
          query_embedding: vector, 
          query_text: userQuery,
          match_threshold: 0.01, 
          match_count: limit 
        });

        if (error) {
            // Log 57014 explicitly as it is common
            if (error.code === '57014') {
                console.warn(`[Search] DB Timeout (Cold Start). Retrying...`);
            }
            throw new Error(`Search failed at Database layer: ${error.message}`);
        }

        if (!data || data.length === 0) {
            return [];
        }
        
        return data.map((row: any) => ({
          urn: row.urn,
          vector_score: row.similarity,
          keyword_score: row.rank,
          // (sim * 0.25) + (rank * 0.75)
          score: (row.similarity * 0.25) + (row.rank * 0.75), 
          content_text: row.content_text
        }));
    }, { 
        maxRetries: 3, 
        initialDelayMs: 2000 // Give DB 2s to wake up before retry
    }); 
  }
}