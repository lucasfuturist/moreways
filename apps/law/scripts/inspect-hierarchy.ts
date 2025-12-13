import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { env } from '../src/infra/config/infra.config.env';

// 🎯 The URN of the PARENT/ROOT document you want to inspect.
const PARENT_URN = 'urn:lex:ma:ma_lemon_law_used_and_new_vehicles';
const TABLE = 'legal_nodes'; // We'll inspect the final, promoted data.

const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, TABLE);

async function inspect() {
    console.log(`🔎 Inspecting children of PARENT: [${PARENT_URN}]`);

    // 1. Get the Parent Node's ID
    const { data: parent, error: parentError } = await db['client']
        .from(TABLE)
        .select('id, content_text')
        .eq('urn', PARENT_URN)
        .single();

    if (parentError || !parent) {
        console.error(`❌ Could not find parent node with URN: ${PARENT_URN}`);
        return;
    }

    console.log(`   Parent Found. ID: ${parent.id}`);

    // 2. Fetch all direct children of that Parent ID
    const { data: children, error: childrenError } = await db['client']
        .from(TABLE)
        .select('urn, structure_type, content_text')
        .eq('parentId', parent.id);

    if (childrenError) {
        console.error(`❌ Error fetching children:`, childrenError.message);
        return;
    }

    if (!children || children.length === 0) {
        console.log(`\n⚠️ No child nodes found for this parent.`);
        return;
    }

    console.log(`\n✅ Found ${children.length} direct child nodes. Here are the sections containing "definition":\n`);

    // 3. Print the children, highlighting the one we need
    for (const child of children) {
        const content = child.content_text.replace(/\n/g, ' ');
        // We are looking for the URN of the node that actually contains the word "definition"
        if (content.toLowerCase().includes('definition')) {
            console.log(`==================================================================`);
            console.log(`  🎯 POTENTIAL TARGET FOUND!`);
            console.log(`==================================================================`);
            console.log(`   - URN:     ${child.urn}`);
            console.log(`   - Type:    ${child.structure_type}`);
            console.log(`   - Snippet: "${content.substring(0, 150)}..."`);
            console.log(`\n   👆 Copy the URN above and use it in the atomizer script.`);
            console.log(`==================================================================\n`);
        }
    }
}

inspect().catch(console.error);