import * as fs from 'fs/promises';
import { SupabaseDbClient } from '../src/infra/supabase/infra.supabase.client';
import { OpenAiClient } from '../src/infra/openai/infra.openai.client';
import { env } from '../src/infra/config/infra.config.env';
import { v4 as uuidv4 } from 'uuid';

// --- CONFIGURATION ---
const DRY_RUN = false; // ✅ Set to FALSE to apply changes
const TARGET_TABLE = 'legal_nodes_staging';

// 🎯 FORCE TARGET: Specific Node
const FORCE_URN = 'urn:lex:fed:940_cmr_10_00___home_improvement_contractor_practices:10_01';

const db = new SupabaseDbClient(env.SUPABASE_URL, env.SUPABASE_KEY, TARGET_TABLE);
const ai = new OpenAiClient(env.OPENAI_API_KEY);

async function main() {
    console.log(`⚛️  Starting Definition Atomizer on [${TARGET_TABLE}]`);
    console.log(`   Mode: ${DRY_RUN ? '🛡️ DRY RUN (Read Only)' : 'LIVE (Write Enabled)'}`);

    let nodes = [];

    // 1. Fetch Candidates
    if (FORCE_URN) {
        console.log(`\n🎯 FORCING specific URN: ${FORCE_URN}`);
        const { data } = await db['client']
            .from(TARGET_TABLE)
            .select('*')
            .eq('urn', FORCE_URN);
        nodes = data || [];
    } else {
        const { data } = await db['client']
            .from(TARGET_TABLE)
            .select('*')
            .gt('length(content_text)', 1000) 
            .or('content_text.ilike.%: shall mean%,content_text.ilike.%: means%,content_text.ilike.%: is defined%');
        nodes = data || [];
    }

    if (!nodes || nodes.length === 0) {
        console.log(`❌ Target node not found.`);
        return;
    }

    console.log(`\n📋 Processing ${nodes.length} candidates...`);

    for (const parent of nodes) {
        console.log(`\n==================================================`);
        console.log(`📄 ANALYZING PARENT: ${parent.urn}`);
        console.log(`   Current Type: ${parent.structure_type}`);
        console.log(`   Total Length: ${parent.content_text.length} chars`);

        if (parent.content_text.includes("(Definitions atomized")) {
             console.log("   ⏭️  Skipping (Already processed).");
             continue;
        }

        // 2. The Regex
        const regex = /(?:^|\n)\s*([A-Z][a-zA-Z0-9 \-\/']{1,60})[:\.]\s+(?:An|The|means|shall mean|is defined|shall have the meaning)([\s\S]+?)(?=(?:\n\s*[A-Z][a-zA-Z0-9 \-\/']{1,60}[:\.]|$))/g;
        
        const matches = [...parent.content_text.matchAll(regex)];
        
        if (matches.length < 2) {
            console.log("   ⚠️  Skipping (Not enough definitions found via Regex).");
            continue;
        }

        // 3. Prepare Nodes
        console.log(`\n🔍 DETECTED ${matches.length} DEFINITIONS. Generating Vectors...`);
        const newNodes = [];
        
        for (const match of matches) {
            const term = match[1].trim();     
            const fullDef = match[0].trim();
            const suffix = term.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
            
            let vector = null;
            if (!DRY_RUN) {
                // Contextual Embedding
                const contextText = `${parent.urn.split(':').pop()} ${fullDef}`;
                try {
                    vector = await ai.generateEmbedding(contextText);
                    process.stdout.write('.'); 
                } catch (e: any) {
                    console.error("❌ Embedding Error:", e.message);
                }
            }

            newNodes.push({
                id: uuidv4(),
                urn: `${parent.urn}:${suffix}`,
                citation_path: `${parent.citation_path}.${suffix}`,
                jurisdiction: parent.jurisdiction,
                content_text: fullDef,
                structure_type: 'DEFINITION', 
                parentId: parent.id,          
                embedding: vector,
                validity_range: parent.validity_range,
                source_job_id: uuidv4(),
                page_number: parent.page_number,
                bbox: parent.bbox
            });
        }
        
        console.log("\n");
        
        // 4. Execute Action
        if (DRY_RUN) {
            console.log(`\n--- [AFTER] PROPOSED PARENT STATE ---`);
            const headerOnly = parent.content_text.substring(0, 200).split('\n')[0] + "\n\n(Definitions atomized into child nodes)";
            console.log(headerOnly);
            console.log(`-------------------------------------`);
            console.log(`\nℹ️  SUMMARY: Would insert ${matches.length} children and truncate parent.`);
        } else {
            // INSERT CHILDREN
            const { error: insertErr } = await db['client'].from(TARGET_TABLE).insert(newNodes);
            
            if (insertErr) {
                console.error(`   ❌ Insert Failed: ${insertErr.message}`);
                continue;
            }

            // UPDATE PARENT
            const headerOnly = parent.content_text.substring(0, 200).split('\n')[0] + "\n\n(Definitions atomized into child nodes)";
            const { error: updateErr } = await db['client']
                .from(TARGET_TABLE)
                .update({ content_text: headerOnly })
                .eq('id', parent.id);

            if (updateErr) {
                console.error(`   ⚠️  Inserted children but failed to update parent: ${updateErr.message}`);
            } else {
                console.log(`   🚀 SUCCESS: Inserted ${newNodes.length} nodes & cleaned parent.`);
            }
        }
    }
}

main().catch(console.error);