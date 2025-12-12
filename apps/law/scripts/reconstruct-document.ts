import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { env } from '../src/infra/config/infra.config.env';

// Target the "Poorly Written" / Complex law (e.g. Debt Collection or Home Improvement)
const TARGET_CORPUS = '940_cmr_10_00'; // Home Improvement (The one with the Definitions list)

async function main() {
    const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY);

    console.log(`Reconstructing Document: ${TARGET_CORPUS}...\n`);
    console.log("=".repeat(80));

    // 1. Fetch all atoms for this document
    // We sort by 'citation_path' to ensure they come out in reading order
    const { data: nodes } = await db['client']
        .from('legal_nodes')
        .select('content_text, citation_path, structure_type')
        .ilike('urn', `%${TARGET_CORPUS}%`)
        .order('citation_path');

    if (!nodes || nodes.length === 0) {
        console.error("No nodes found!");
        return;
    }

    // 2. Render
    for (const node of nodes) {
        // Calculate indentation based on tree depth
        // root.ma.940cmr.10_00.10_01 -> Depth 5
        const depth = node.citation_path.split('.').length;
        const indent = "  ".repeat(Math.max(0, depth - 4)); // Adjust baseline

        // Visual distinction for Headers vs Body
        if (node.structure_type === 'SECTION') {
            console.log(`\n${indent}# ${node.content_text.toUpperCase()}`);
        } else if (node.structure_type === 'DEFINITION') {
            console.log(`${indent}• [DEF] ${node.content_text}`);
        } else {
            console.log(`${indent}${node.content_text}`);
        }
    }

    console.log("=".repeat(80));
    console.log(`\nReconstructed ${nodes.length} segments.`);
}

main();