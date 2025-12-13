import { config } from 'dotenv';
config();

import fs from 'fs';
import path from 'path';
import { openai } from '../src/infra/openai/infra.openai.client';
import { SupabaseGraphReader } from '../src/infra/supabase/infra.supabase.reader';
import { HybridSearchService } from '../src/retrieve/svc/retrieve.svc.hybridSearch';
import { JudgeService } from '../src/validate/svc/validate.svc.judge';
import { SupabaseOverrideRepo } from '../src/graph/repo/graph.repo.overrideRepo';

// --- CONFIG ---
const TARGET_SAMPLE_SIZE = 100;
const BATCH_SIZE = 20; // Generate in chunks to prevent LLM timeouts
const OUTPUT_FILE = path.join(__dirname, 'magistrate_report.json');
const RESULT_FILE = path.join(__dirname, 'magistrate_results.json');

// --- FACTORIES ---
const reader = new SupabaseGraphReader();
const overrideRepo = new SupabaseOverrideRepo();
const searcher = new HybridSearchService();
const judge = new JudgeService(searcher, reader, overrideRepo);

/**
 * Generates a specific chunk of cases
 */
async function generateChunk(chunkIndex: number, count: number) {
    console.log(`[Generator] creating batch ${chunkIndex + 1} (${count} cases)...`);
    
    const prompt = `
    Generate ${count} diverse legal scenarios involving US Consumer Protection laws.
    
    EXPANDED FOCUS AREAS (Match these to real regulations):
    1. Auto Sales & Repairs (Lemon Law, Warranty, 940 CMR 5.00).
    2. Debt Collection (Harassment, Workplace Calls, 940 CMR 7.00, FDCPA).
    3. Robocalls & Telemarketing (TCPA, Do Not Call, 16 CFR 310, 47 CFR 64.1200).
    4. Credit Reporting (FCRA - Incorrect info, Identity Theft).
    5. Credit Billing Errors (FCBA - Unauthorized charges, disputes).
    6. Electronic Fund Transfers (EFTA/Reg E - Stolen debit card, unauthorized withdrawal).
    7. Home Improvement (Contractor disputes, 940 CMR 10.00).
    8. Online Shopping (ROSCA - Subscription traps, negative option marketing).
    9. Landlord/Tenant (Security deposits, lease violations - Article 2A).
    
    OUTPUT FORMAT (JSON):
    {
      "cases": [
        {
          "id": "batch_${chunkIndex}_case_01",
          "intent": "Credit Reporting – Identity Theft", 
          "formData": {
             "date_noticed": "2024-02-01",
             "issue": "Unknown credit card account on report",
             "bureau_response": "Refused to investigate"
          },
          "expected_bias": "VIOLATION" 
        }
      ]
    }
    
    IMPORTANT:
    - Make cases REALISTIC.
    - Mix "VIOLATION" (Clear win), "WEAK" (User error/Statute of Limitations), and "Gray Area".
    - VARY THE DATES. Some should be recent (2024-2025), some old (2015-2020) to test statute of limitations logic.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.7 // Higher temp for variety
        });
    
        const rawContent = response.choices[0].message.content || "{}";
        const data = JSON.parse(rawContent);

        // Robust extraction
        if (data.cases && Array.isArray(data.cases)) return data.cases;
        if (Array.isArray(data)) return data;
        
        return [];
    } catch (err) {
        console.error(`[Generator] Batch ${chunkIndex} failed:`, err);
        return [];
    }
}

async function runBatch() {
    console.log(`--- MAGISTRATE BATCH RUNNER (${TARGET_SAMPLE_SIZE} CASES) ---`);

    // 1. DATA GENERATION / LOADING
    let cases: any[] = [];
    
    // Check if we have a full dataset already
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
            if (Array.isArray(existing) && existing.length >= TARGET_SAMPLE_SIZE) {
                console.log(`Loaded ${existing.length} existing cases from disk.`);
                cases = existing;
            } else {
                console.log("Existing file is partial or invalid. Regenerating fresh dataset...");
            }
        } catch (e) {
            console.log("Error reading file. Regenerating...");
        }
    }

    // If we need to generate
    if (cases.length < TARGET_SAMPLE_SIZE) {
        const needed = TARGET_SAMPLE_SIZE;
        const batches = Math.ceil(needed / BATCH_SIZE);
        
        console.log(`Generating ${needed} cases in ${batches} batches...`);
        
        for (let i = 0; i < batches; i++) {
            const chunk = await generateChunk(i, BATCH_SIZE);
            cases = [...cases, ...chunk];
            console.log(`   Batch ${i+1}/${batches} done. Total so far: ${cases.length}`);
        }
        
        // Save immediately
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cases, null, 2));
    }

    // Limit to target if we went over
    cases = cases.slice(0, TARGET_SAMPLE_SIZE);
    console.log(`\n⚖️ DOCKET READY: ${cases.length} CASES queued for judgment.\n`);

    // 2. EXECUTION LOOP
    const results: any[] = [];
    const stats = { violations: 0, ineligible: 0, errors: 0 };
    
    for (let i = 0; i < cases.length; i++) {
        const c = cases[i];
        const progress = `[${i + 1}/${cases.length}]`;
        
        try {
            process.stdout.write(`${progress} Judging ${c.id} (${c.intent})... `);
            const start = Date.now();
            
            const verdict = await judge.evaluate(c.intent, c.formData);
            const duration = Date.now() - start;

            const resultEntry = {
                case_id: c.id,
                intent: c.intent,
                scenario: c.formData,
                expected_bias: c.expected_bias,
                actual_verdict: verdict.status,
                confidence: verdict.confidence_score,
                citations: verdict.relevant_citations,
                summary: verdict.analysis.summary,
                duration_ms: duration
            };

            results.push(resultEntry);
            
            // Console Feedback
            let icon = '⚪';
            if (verdict.status.includes('LIKELY')) { icon = '🔴'; stats.violations++; }
            else if (verdict.status.includes('POSSIBLE')) { icon = '🟠'; }
            else if (verdict.status.includes('INELIGIBLE')) { icon = '⚫'; stats.ineligible++; }
            else { icon = '🟢'; }

            console.log(`${icon} ${verdict.status} (${duration}ms)`);

        } catch (e) {
            console.log(`❌ ERROR`);
            console.error(e);
            results.push({ case_id: c.id, error: String(e) });
            stats.errors++;
        }
    }

    // 3. FINAL REPORT
    fs.writeFileSync(RESULT_FILE, JSON.stringify(results, null, 2));
    
    console.log(`\n---------------------------------------`);
    console.log(`✅ COURT ADJOURNED.`);
    console.log(`---------------------------------------`);
    console.log(`Total Cases: ${cases.length}`);
    console.log(`Violations Found: ${stats.violations}`);
    console.log(`Ineligible/Dismissed: ${stats.ineligible}`);
    console.log(`Errors: ${stats.errors}`);
    console.log(`Detailed Report: ${RESULT_FILE}`);
}

runBatch().catch(console.error);