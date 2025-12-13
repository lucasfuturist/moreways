import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { env } from '../src/infra/config/infra.config.env';

// 🎯 The URN prefix for the document we want to find all parts of.
const ROOT_URN_PREFIX = 'urn:lex:ma:ma_lemon_law_used_and_new_vehicles';
const TABLE = 'legal_nodes';

const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, TABLE);

async function deepSearch() {
    console.log(`🔎 Performing deep URN search for prefix: [${ROOT_URN_PREFIX}]`);

    // Use a LIKE query to find all nodes whose URN starts with the root's URN, followed by a colon.
    // This finds all descendants, regardless of their parentId linkage.
    const { data: nodes, error } = await db['client']
        .from(TABLE)
        .select('urn, structure_type, content_text')
        .like('urn', `${ROOT_URN_PREFIX}:%`)
        .order('citation_path', { ascending: true }); // Order by citation path to show in document order

    if (error) {
        console.error(`❌ Error during deep search:`, error.message);
        return;
    }

    if (!nodes || nodes.length === 0) {
        console.log(`\n❌ CRITICAL ERROR: No descendant nodes found with this URN prefix.`);
        console.log(`   This suggests the ingestion for this document may have failed entirely after creating the root.`);
        return;
    }

    console.log(`\n✅ Success! Found ${nodes.length} descendant nodes. The document content exists but is orphaned.`);
    console.log(`   Searching for the 'definitions' section within these nodes...\n`);

    let targetUrn = '';

    for (const node of nodes) {
        if (node.content_text.toLowerCase().includes('for purposes of this section the fol')) {
            targetUrn = node.urn;
            console.log(`==================================================================`);
            console.log(`  🎯 DEFINITION SECTION FOUND!`);
            console.log(`==================================================================`);
            console.log(`   - URN:     ${node.urn}`);
            console.log(`   - Type:    ${node.structure_type}`);
            console.log(`   - Snippet: "${node.content_text.substring(0, 150).replace(/\n/g, ' ')}..."`);
            console.log(`\n   👆 This is the URN you need. Use it in the atomizer script.`);
            console.log(`==================================================================\n`);
            break; // Stop after finding the first match
        }
    }

    if (!targetUrn) {
        console.log(`\n⚠️ Could not automatically find the definitions section. Please manually review the list below for the correct URN:\n`);
        nodes.forEach(node => {
             console.log(` - [${node.structure_type}] ${node.urn}`);
        });
    }
}

deepSearch().catch(console.error);