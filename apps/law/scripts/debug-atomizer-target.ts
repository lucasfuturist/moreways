import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { env } from '../src/infra/config/infra.config.env';

// 🎯 The URN of the "Lemon Law" document or any other you want to test
const TARGET_URN = 'urn:lex:ma:ma_lemon_law_used_and_new_vehicles';
const TABLE = 'legal_nodes'

const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, TABLE);

async function inspect() {
    console.log(`🕵️  Inspecting Staging Node: [${TARGET_URN}]`);

    const { data: parent, error } = await db['client'].from(TABLE).select('*').eq('urn', TARGET_URN).single();

    if (error || !parent) {
        console.log("❌ Node NOT FOUND in Staging.");
        return;
    }

    console.log(`\n📄 Node Details:`);
    console.log(`   - ID:             ${parent.id}`);
    console.log(`   - Structure Type: ${parent.structure_type}`);
    console.log(`   - Length:         ${parent.content_text.length} chars`);
    console.log(`   - Snippet:        "${parent.content_text.substring(0, 80).replace(/\n/g, ' ')}..."`);

    console.log(`\n🔍 Running Atomizer Pre-flight Checks:`);
    
    // Check 1: Does it contain definition keywords?
    const hasKeywords = /: shall mean|: means|: is defined|definitions/i.test(parent.content_text);
    if (hasKeywords) {
        console.log(`   [✅] PASS: Node contains definition keywords.`);
    } else {
        console.log(`   [❌] FAIL: Node does NOT contain required keywords like ": means" or "definitions".`);
        return;
    }
    
    // Check 2: Has it already been processed?
    if (parent.content_text.includes("(Definitions atomized")) {
         console.log(`   [❌] FAIL: Node has already been processed.`);
         return;
    }

    // Check 3: Let's run the actual regex and see what it finds.
    const regex = /(?:^|\n)\s*([A-Z\d][a-zA-Z0-9 \-\/']{1,60})[:\.]\s+(?:An|The|means|shall mean|is defined|shall have the meaning)([\s\S]+?)(?=(?:\n\s*[A-Z\d][a-zA-Z0-9 \-\/']{1,60}[:\.]|$))/g;
    const matches = [...parent.content_text.matchAll(regex)];

    if (matches.length > 0) {
        console.log(`   [✅] PASS: Regex found ${matches.length} definition(s).`);
        console.log(`\n   --- SAMPLE MATCHES ---`);
        matches.slice(0, 3).forEach(m => console.log(`     - Term: "${m[1].trim()}"`));
        console.log(`   --------------------`);
        console.log(`\n🎉 CONCLUSION: This node should be successfully atomized by the script.`);

    } else {
        console.log(`   [❌] FAIL: Regex found 0 definitions.`);
        console.log(`      SUGGESTION: The format of the definitions in this document is unique. Check the text and consider adjusting the regex in atomize-definitions.ts.`);
        console.log(`\n Awaiting inspection...`);
    }
}

inspect().catch(console.error);