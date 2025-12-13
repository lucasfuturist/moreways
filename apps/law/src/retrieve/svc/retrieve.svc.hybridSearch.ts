import { openai } from '../../infra/openai/infra.openai.client';
import { supabase } from '../../infra/supabase/infra.supabase.client';

export interface SearchResult {
  urn: string;
  score: number;
  vector_score: number;
  keyword_score: number;
  content_text: string;
}

export class HybridSearchService {
  
  /**
   * Performs Semantic Search using OpenAI Embeddings + Pgvector + FTS
   * 
   * STRATEGY UPDATE [Dec 2025]:
   * Prioritizing Exact Keyword Matches (FTS) over Semantic Vectors.
   * Weight Split: 75% Keyword / 25% Vector.
   * This ensures that if a user searches for specific regulation numbers (e.g. "16 CFR 310.4"), 
   * that exact hit bubbles to the top, even if the vector thinks a general summary is "semantically" close.
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
    // We keep the threshold low (0.01) to cast a wide net, then filter/sort via the weighted score below.
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
      // [CRITICAL UPDATE] Inverted Weighting
      // Old: (sim * 0.7) + (rank * 0.3)
      // New: (sim * 0.25) + (rank * 0.75)
      score: (row.similarity * 0.25) + (row.rank * 0.75), 
      content_text: row.content_text
    }));
  }
}