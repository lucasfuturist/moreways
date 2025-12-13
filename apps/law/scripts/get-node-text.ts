import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { env } from '../src/infra/config/infra.config.env';

// 🎯 The URN of the node whose text we need to inspect.
const TARGET_URN = 'urn:lex:ma:ma_lemon_law_used_and_new_vehicles:section_7N_c04f';
const TABLE = 'legal_nodes_staging'; // Assuming the data is in production

const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, TABLE);

async function getNodeText() {
    console.log(`📄 Fetching content_text for URN: [${TARGET_URN}]`);

    const { data, error } = await db['client']
        .from(TABLE)
        .select('content_text')
        .eq('urn', TARGET_URN)
        .single();

    if (error || !data) {
        console.error(`❌ Could not fetch node:`, error?.message || 'Not found');
        return;
    }

    console.log(`\n--- BEGIN RAW TEXT (from ${TARGET_URN}) ---`);
    console.log(data.content_text);
    console.log(`--- END RAW TEXT ---`);
}

getNodeText().catch(console.error);