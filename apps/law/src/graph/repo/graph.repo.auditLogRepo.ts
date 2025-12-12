import { supabase } from '../../infra/supabase/infra.supabase.client';
import * as crypto from 'crypto';

export interface AuditEntry {
  urn: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'OVERRIDE';
  payload: any;
  actor: string; // 'SYSTEM' or User ID
}

export class AuditLogRepo {
  
  /**
   * Logs a change with cryptographic chaining (Merkle-ish)
   */
  async logChange(entry: AuditEntry): Promise<void> {
    
    // 1. Fetch the hash of the most recent log entry
    const { data: lastLog } = await supabase
      .from('audit_logs')
      .select('hash')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const prevHash = lastLog?.hash || 'GENESIS_HASH';

    // 2. Construct the current data block
    const timestamp = new Date().toISOString();
    const dataString = JSON.stringify({
      prevHash,
      timestamp,
      urn: entry.urn,
      action: entry.action,
      payload: entry.payload
    });

    // 3. Generate SHA-256 Hash of this entry + previous hash
    const currHash = crypto.createHash('sha256').update(dataString).digest('hex');

    // 4. Insert Record
    const { error } = await supabase.from('audit_logs').insert({
      urn: entry.urn,
      action: entry.action,
      payload: entry.payload, // Stored as JSONB
      actor: entry.actor,
      prev_hash: prevHash,
      hash: currHash,
      created_at: timestamp
    });

    if (error) console.error("❌ Audit Log Failure:", error);
  }
}