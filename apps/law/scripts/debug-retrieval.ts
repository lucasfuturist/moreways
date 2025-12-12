import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { SupabaseOverrideRepo } from '../src/graph/repo/graph.repo.overrideRepo';
import { ContextAssembler } from '../src/retrieve/svc/retrieve.svc.contextAssembler';
import { env } from '../src/infra/config/infra.config.env';

const TABLE_NAME = 'legal_nodes'; // Default to Production now, or use 'legal_nodes_staging'

async function main() {
    // Join arguments to handle quotes or spaces better
    const query = process.argv.slice(2).join(' ');
    
    if (!query) {
        console.error("Usage: npx ts-node scripts/debug-retrieval.ts \"<query or text snippet>\"");
        process.exit(1);
    }

    // Default to Production for valid tests
    const dbClient = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, TABLE_NAME);
    
    console.log(`🔎 Searching in table: [${TABLE_NAME}] for: "${query}"...`);

    // 1. Find the Target
    // We try to match URN first, then content text
    let candidates = [];
    
    // Try URN match
    const { data: urnMatch } = await dbClient['client']
        .from(TABLE_NAME)
        .select('*')
        .eq('urn', query)
        .limit(1);

    if (urnMatch && urnMatch.length > 0) {
        candidates = urnMatch;
    } else {
        // Try Text Search
        const { data: textMatch } = await dbClient['client']
            .from(TABLE_NAME)
            .select('*')
            .ilike('content_text', `%${query}%`)
            .limit(1);
        candidates = textMatch || [];
    }

    if (!candidates || candidates.length === 0) {
        console.log("❌ No text or URN matches found.");
        return;
    }

    const target = candidates[0];
    console.log(`\n🎯 TARGET NODE FOUND`);
    console.log(`   ID:   ${target.id}`);
    console.log(`   URN:  ${target.urn}`);
    console.log(`   PATH: ${target.citation_path}`);
    console.log(`   TYPE: ${target.structure_type}`);
    console.log(`   PARENT ID: ${target.parentId || 'NULL'}`);

    // 2. Debug Ancestry Query
    console.log(`\n🔎 Debugging Ancestry Lookup...`);
    
    // Attempt A: Direct Parent Lookup via ID
    if (target.parentId) {
        const { data: parent } = await dbClient['client']
            .from(TABLE_NAME)
            .select('id, urn, citation_path')
            .eq('id', target.parentId)
            .single();
        
        if (parent) {
            console.log(`   ✅ Parent Exists (via ID): ${parent.urn}`);
        } else {
            console.log(`   ❌ Parent ID ${target.parentId} points to nothing (ORPHAN).`);
        }
    } else {
        console.log(`   ⚠️  Target has no Parent ID.`);
    }

    // Attempt B: Ltree Path Lookup (The Ladder)
    // Logic: Find nodes where 'citation_path' contains (@>) the target's path
    // Supabase Filter: .filter('column', 'cs', 'value') -> Contains
    
    if (target.citation_path) {
        const { data: ancestors, error } = await dbClient['client']
            .from(TABLE_NAME)
            .select('id, urn, citation_path, structure_type')
            .filter('citation_path', 'cs', target.citation_path) // 'cs' = Contains (@>)
            .neq('id', target.id) // Exclude self
            .order('citation_path'); // Sort root -> leaf

        if (error) {
            console.log(`   ❌ Ltree Query Failed: ${error.message}`);
        } else {
            console.log(`   ✅ Found ${ancestors?.length} ancestors via Ltree Path:`);
            ancestors?.forEach(a => console.log(`      ⬆️  [${a.structure_type}] ${a.urn}`));
        }
    }
}

main().catch(console.error);