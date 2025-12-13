import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { env } from '../src/infra/config/infra.config.env';

const TARGET_TABLE = 'legal_nodes';
const DRY_RUN = false; // Set to false to apply the fixes
const CHUNK_SIZE = 200; // Process in safe batches of 100

const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, TARGET_TABLE);

async function repairOrphans() {
    console.log(`🛠️  Starting Orphan Repair Script on [${TARGET_TABLE}]`);
    console.log(`   Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);

    const { data: roots, error: rootsError } = await db['client']
        .from(TARGET_TABLE)
        .select('id, urn')
        .eq('structure_type', 'ROOT');

    if (rootsError) throw rootsError;
    if (!roots || roots.length === 0) {
        console.log("No ROOT nodes found. Exiting.");
        return;
    }

    console.log(`\nFound ${roots.length} ROOT nodes to process.`);
    let totalRepaired = 0;

    for (const root of roots) {
        const { data: orphans, error: orphansError } = await db['client']
            .from(TARGET_TABLE)
            .select('id, urn, parentId')
            .like('urn', `${root.urn}:%`)
            .is('parentId', null);

        if (orphansError) {
            console.error(`  [${root.urn}] Error fetching orphans: ${orphansError.message}`);
            continue;
        }

        if (orphans && orphans.length > 0) {
            console.log(`\n  [${root.urn}]`);
            console.log(`    -> Found ${orphans.length} orphaned child node(s).`);

            if (DRY_RUN) {
                console.log(`    (DRY RUN) Would repair ${orphans.length} links in ${Math.ceil(orphans.length / CHUNK_SIZE)} batches.`);
            } else {
                // --- BATCH PROCESSING LOGIC ---
                let overallSuccess = true;
                for (let i = 0; i < orphans.length; i += CHUNK_SIZE) {
                    const chunk = orphans.slice(i, i + CHUNK_SIZE);
                    const batchNum = (i / CHUNK_SIZE) + 1;
                    const totalBatches = Math.ceil(orphans.length / CHUNK_SIZE);
                    
                    process.stdout.write(`      -> Processing batch ${batchNum} of ${totalBatches}... `);

                    const { error: updateError } = await db['client']
                        .from(TARGET_TABLE)
                        .update({ parentId: root.id })
                        .in('id', chunk.map(o => o.id));

                    if (updateError) {
                        console.log(`❌ FAILED: ${updateError.message}`);
                        overallSuccess = false;
                        break; // Stop processing batches for this root if one fails
                    } else {
                        console.log(`✅`);
                        totalRepaired += chunk.length;
                    }
                }
                
                if (overallSuccess) {
                     console.log(`    ✅ SUCCESS: Repaired ${orphans.length} total parent-child links.`);
                } else {
                     console.error(`    ❌ FAILED: Stopped processing due to an error.`);
                }
            }
        }
    }

    console.log(`\n--- SCRIPT COMPLETE ---`);
    console.log(`   Total nodes re-parented: ${totalRepaired}`);
}

repairOrphans().catch(console.error);