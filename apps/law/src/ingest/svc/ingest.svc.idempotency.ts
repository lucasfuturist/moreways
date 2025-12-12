import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import { supabase } from '../../infra/supabase/infra.supabase.client';

export async function checkIdempotency(filePath: string): Promise<boolean> {
    try {
        const fileBuffer = await fs.readFile(filePath);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const fileHash = hashSum.digest('hex');

        const { data } = await supabase
            .from('source_files')
            .select('id')
            .eq('file_hash', fileHash)
            .single();

        if (data) {
            console.log(`[Gatekeeper] Skipping duplicate file: ${filePath}`);
            return false; 
        }
        return true;
    } catch (error) {
        console.error(`[Gatekeeper] Error checking idempotency:`, error);
        return false; // Fail safe
    }
}

export async function registerSourceFile(filePath: string, jurisdiction: string) {
    const stats = await fs.stat(filePath);
    const fileBuffer = await fs.readFile(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    await supabase.from('source_files').insert({
        file_name: filePath.split(/[/\\]/).pop(),
        file_hash: hash,
        file_size_bytes: stats.size,
        jurisdiction: jurisdiction,
        status: 'PROCESSING'
    });
    
    return hash;
}