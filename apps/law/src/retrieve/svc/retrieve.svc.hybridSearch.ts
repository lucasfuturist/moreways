import { openai } from '../../infra/openai/infra.openai.client';
import { supabase } from '../../infra/supabase/infra.supabase.client';

export interface SearchResult {
  urn: string;
  score: number;
  vector_score: number; // [NEW] Explicit breakdown
  keyword_score: number; // [NEW] Explicit breakdown
  content_text: string;
}

export class HybridSearchService {
  
  /**
   * Performs Semantic Search using OpenAI Embeddings + Pgvector + FTS
   */
  async search(userQuery: string, limit: number = 10): Promise<SearchResult[]> {
    console.log(`[Search] Vectorizing query: "${userQuery}"`);

    // 1. Generate Embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: userQuery,
    });
    const vector = embeddingResponse.data[0].embedding;

    // 2. Call Supabase RPC (Hybrid)
    // [FIX] Lowered threshold to 0.01 to ensure semantic connections (like "call" vs "visit") aren't filtered out early.
    // The sorting logic will still prioritize high-quality matches.
    const { data, error } = await supabase.rpc('match_legal_nodes_hybrid', { 
      query_embedding: vector, 
      query_text: userQuery,
      match_threshold: 0.01, 
      match_count: limit 
    });

    if (error) {
      console.error("❌ Hybrid Search Error:", error);
      throw new Error("Search failed at Database layer");
    }

    if (!data || data.length === 0) {
      console.log("[Search] No matches found.");
      return [];
    }

    console.log(`[Search] Found ${data.length} matches.`);
    return data.map((row: any) => ({
      urn: row.urn,
      vector_score: row.similarity,
      keyword_score: row.rank,
      // Reconstruct total score based on SQL logic (0.7 vec + 0.3 keyword)
      score: (row.similarity * 0.7) + (row.rank * 0.3), 
      content_text: row.content_text
    }));
  }
}