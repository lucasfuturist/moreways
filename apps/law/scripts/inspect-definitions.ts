import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { env } from '../src/infra/config/infra.config.env';

// We default to 'legal_nodes_staging' or 'legal_nodes' depending on where you ran the atomizer
// Let's check PROD (legal_nodes) first as that's what the API reads
const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY);

async function main() {
    console.log("🔍 Inspecting 'DEFINITION' nodes in the Knowledge Graph...\n");

    // 1. Search for nodes that are explicitly typed as DEFINITIONS
    const { data: defs } = await db['client']
        .from('legal_nodes')
        .select('urn, content_text')
        .eq('structure_type', 'DEFINITION')
        .limit(20); // Just show the first 20

    if (!defs || defs.length === 0) {
        console.log("❌ No DEFINITION nodes found. (Did you promote Staging to Prod?)");
        
        // Fallback: Check Staging just in case
        console.log("   Checking Staging...");
        const { data: stagingDefs } = await db['client']
            .from('legal_nodes_staging')
            .select('urn, content_text')
            .eq('structure_type', 'DEFINITION')
            .limit(5);
            
        if (stagingDefs && stagingDefs.length > 0) {
            console.log(`   ✅ Found ${stagingDefs.length} definitions in Staging!`);
            console.log("   👉 You need to Promote Staging to Production.");
        }
        return;
    }

    console.log(`✅ Found definitions in Production! Here is a sample:\n`);

    defs.forEach(d => {
        // Extract the term from the URN or Text
        // urn:lex:ma:940cmr:10_01:contractor
        const termSlug = d.urn.split(':').pop();
        const snippet = d.content_text.split('\n')[0].substring(0, 60);
        
        console.log(`   🔑 Key: ${termSlug}`);
        console.log(`      URN: ${d.urn}`); // <--- THIS IS WHAT WE NEED
        console.log(`      "${snippet}..."`);
        console.log("   ------------------------------------------------");
    });
}

main().catch(console.error);