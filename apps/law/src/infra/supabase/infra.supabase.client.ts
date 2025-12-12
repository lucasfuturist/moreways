import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { IDatabaseClient } from '../../graph/repo/graph.repo.nodeRepo';
import { LegalNodeRecord } from '../../graph/schema/graph.schema.nodes';

dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

if (!url || !key) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY in environment variables");
}

export const supabase = createClient(url, key);

function chunkArray<T>(array: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export class SupabaseDbClient implements IDatabaseClient {
  private client: SupabaseClient;
  private tableName: string;

  constructor(endpoint: string, apiKey: string, tableName: string = 'legal_nodes') {
    this.client = createClient(endpoint, apiKey);
    this.tableName = tableName;
  }

  async bulkInsertNodes(records: LegalNodeRecord[]): Promise<void> {
    if (records.length === 0) return;

    // [FIX] Reduced batch size from 100 to 50 for safety
    const chunks = chunkArray(records, 50); 

    for (const chunk of chunks) {
      const rows = chunk.map(r => ({
        id: r.id,
        urn: r.urn,
        citation_path: r.citation_path,
        jurisdiction: r.jurisdiction,
        content_text: r.content_text,
        structure_type: r.structure_type,
        embedding: r.embedding,
        logic_summary: r.logic_summary,
        validity_range: r.validity_range,
        source_job_id: r.source_job_id,
        page_number: r.page_number,
        bbox: r.bbox
      }));

      const { error } = await this.client
        .from(this.tableName)
        .insert(rows);

      if (error) {
        console.error(`❌ Supabase Insert Error (${this.tableName}):`, error);
        throw new Error(`DB Insert Failed: ${error.message}`);
      }
    }
  }

  async fetchActiveNodes(urns: string[]): Promise<LegalNodeRecord[]> {
    if (urns.length === 0) return [];

    // [CRITICAL FIX] Reduced batch size from 200 to 40
    // Long URNs cause "HeadersOverflowError" in GET requests if batch is too large.
    const chunks = chunkArray(urns, 40); 
    const allResults: LegalNodeRecord[] = [];

    for (const chunk of chunks) {
      try {
        const { data, error } = await this.client
          .from(this.tableName)
          .select('*')
          .in('urn', chunk);

        if (error) {
          console.error("❌ DB Fetch Error:", error);
          throw new Error(`Failed to fetch active nodes: ${error.message}`);
        }

        if (data) {
          const active = (data as any[]).filter(row => {
            const range = row.validity_range as string;
            return range.endsWith(',)') || range.includes('infinity');
          }).map(row => row as LegalNodeRecord);
          
          allResults.push(...active);
        }
      } catch (e: any) {
        // Catch network level errors (like the Overflow error)
        console.error(`❌ DB Network Error during fetch (Chunk size: ${chunk.length}):`, e.message);
        throw e; 
      }
    }

    return allResults;
  }

  async expireNodes(ids: string[], expiryDate: string): Promise<void> {
    if (ids.length === 0) return;

    const expiryDateStr = expiryDate.split('T')[0];
    
    // [FIX] Reduced batch size for consistency
    const chunks = chunkArray(ids, 50);

    for (const chunk of chunks) {
      const { data: nodes } = await this.client
        .from(this.tableName)
        .select('id, validity_range')
        .in('id', chunk);

      if (!nodes) continue;

      const updates = nodes.map(async (n: any) => {
        const currentRange = n.validity_range as string; 
        const start = currentRange.split(',')[0]; 
        const newRange = `${start},${expiryDateStr})`; 

        return this.client
          .from(this.tableName)
          .update({ validity_range: newRange })
          .eq('id', n.id);
      });

      await Promise.all(updates);
    }
  }
}