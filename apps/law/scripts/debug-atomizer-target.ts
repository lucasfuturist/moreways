import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { env } from '../src/infra/config/infra.config.env';

// The URN from your Dry Run output
const TARGET_URN = 'urn:lex:fed:940_cmr_10_00___home_improvement_contractor_practices:10_01';
const TABLE = 'legal_nodes_staging';

const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, TABLE);

async function inspect() {
    console.log(`🕵️  Inspecting Staging Node: [${TARGET_URN}]`);

    // 1. Fetch the Parent Node
    const { data: parent, error } = await db['client']
        .from(TABLE)
        .select('*')
        .eq('urn', TARGET_URN)
        .single();

    if (error || !parent) {
        console.log("❌ Node NOT FOUND in Staging.");
        console.log("   Suggestion: Did you re-ingest? Check if the URN changed.");
        return;
    }

    console.log(`\n📄 Node Details:`);
    console.log(`   ID:             ${parent.id}`);
    console.log(`   Structure Type: ${parent.structure_type}`);
    console.log(`   Length:         ${parent.content_text.length} chars`);
    console.log(`   Content Snippet: "${parent.content_text.substring(0, 50)}..."`);

    // 2. Diagnostics
    console.log(`\n🔍 Why is the Atomizer skipping it?`);
    
    let skipped = false;

    if (parent.structure_type !== 'SECTION') {
        console.log(`   ⚠️  SKIPPED due to Type: Is '${parent.structure_type}', but Atomizer looks for 'SECTION'.`);
        skipped = true;
    }

    if (parent.content_text.length < 2000) {
        console.log(`   ⚠️  SKIPPED due to Size: Is ${parent.content_text.length}, but Atomizer looks for > 2000.`);
        skipped = true;
    }

    // 3. Check if Children already exist (Already Processed)
    const { count: childCount } = await db['client']
        .from(TABLE)
        .select('*', { count: 'exact', head: true })
        .eq('parentId', parent.id)
        .eq('structure_type', 'DEFINITION');

    if (childCount && childCount > 0) {
        console.log(`\n✅ STATUS: ALREADY PROCESSED`);
        console.log(`   Found ${childCount} atomic 'DEFINITION' children linked to this node.`);
        console.log(`   The parent content is likely just the header now.`);
    } else {
        if (!skipped) {
            console.log(`\n❓ STATUS: UNKNOWN. It matches criteria but wasn't found. Check the regex logic.`);
        } else {
            console.log(`\n❌ STATUS: PENDING (But criteria mismatch)`);
        }
    }
}

inspect().catch(console.error);