import { SupabaseClient } from '@supabase/supabase-js';

export class JobTracker {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Checks if we should process this file.
   * Returns FALSE if already completed.
   */
  async shouldProcess(sourceId: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('source_ingest_log')
      .select('status')
      .eq('source_id', sourceId)
      .single();

    if (!data) return true; // Never seen before -> Process it
    if (data.status === 'COMPLETED') return false; // Done -> Skip
    if (data.status === 'FAILED') return true; // Retry failed jobs
    if (data.status === 'PROCESSING') {
        // Edge Case: It was processing when the container crashed.
        // We assume we can retry it (since our DB writes are idempotent).
        console.log(`[Tracker] Resuming interrupted job: ${sourceId}`);
        return true; 
    }
    return true;
  }

  async markStarted(sourceId: string, fileName: string) {
    // Upsert: Create or Update
    const { error } = await this.supabase
      .from('source_ingest_log')
      .upsert({
        source_id: sourceId,
        file_name: fileName,
        status: 'PROCESSING',
        updated_at: new Date().toISOString(),
        error_message: null // Clear previous errors
      }, { onConflict: 'source_id' });

    if (error) console.error("Failed to mark job started:", error);
  }

  async markComplete(sourceId: string) {
    await this.supabase
      .from('source_ingest_log')
      .update({
        status: 'COMPLETED',
        updated_at: new Date().toISOString()
      })
      .eq('source_id', sourceId);
  }

  async markFailed(sourceId: string, error: any) {
    await this.supabase
      .from('source_ingest_log')
      .update({
        status: 'FAILED',
        error_message: error.message || String(error),
        updated_at: new Date().toISOString()
      })
      .eq('source_id', sourceId);
  }
}