import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { env } from '../src/infra/config/infra.config.env';

// We check 'legal_nodes' (Production)
const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, 'legal_nodes');

async function main() {
    console.log("🔍 Scanning Database for URN patterns...");

    // Fetch a sample of nodes
    const { data, error } = await db['client']
        .from('legal_nodes')
        .select('urn, content_text')
        .limit(50);

    if (error) {
        console.error("❌ DB Error:", error);
        return;
    }

    if (!data || data.length === 0) {
        console.log("❌ Table is EMPTY. No laws found.");
        return;
    }

    console.log(`✅ Found ${data.length} sample nodes. Here is the data format:\n`);
    
    data.forEach(n => {
        // Show URN and a tiny text snippet to identify the law
        const snippet = n.content_text.replace(/\n/g, ' ').substring(0, 60);
        console.log(`URN:  ${n.urn}`);
        console.log(`Text: ${snippet}...`);
        console.log('---');
    });
}

main().catch(console.error);