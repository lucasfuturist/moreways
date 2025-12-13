import { config } from 'dotenv';
config();

import fs from 'fs';
import path from 'path';
import { openai } from '../src/infra/openai/infra.openai.client';
import { SupabaseGraphReader } from '../src/infra/supabase/infra.supabase.reader';
import { HybridSearchService } from '../src/retrieve/svc/retrieve.svc.hybridSearch';
import { JudgeService } from '../src/validate/svc/validate.svc.judge';
import { SupabaseOverrideRepo } from '../src/graph/repo/graph.repo.overrideRepo';
import { withRetry } from '../src/shared/utils/resilience';

// --- CONFIG ---
const TARGET_SAMPLE_SIZE = 20; // 20 High-Fidelity Cases
const BATCH_SIZE = 5;

// 1. Staging File (Static): Keeps the generated cases so we can re-run logic without paying for generation again
const STAGING_FILE = path.join(__dirname, 'staging_complex_scenarios.json');

// 2. Results Directory: Where the final reports go
const RESULTS_DIR = path.join(__dirname, 'magistrate-results');

// --- FACTORIES ---
const reader = new SupabaseGraphReader();
const overrideRepo = new SupabaseOverrideRepo();
const searcher = new HybridSearchService();
const judge = new JudgeService(searcher, reader, overrideRepo);

// Helper to format filename timestamp (YYYY-MM-DD_HH-mm-ss)
const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
};

/**
 * Generates a specific chunk of HIGH-COMPLEXITY cases
 */
async function generateChunk(chunkIndex: number, count: number) {
    console.log(`[Generator] Creating Complex Batch ${chunkIndex + 1} (${count} cases)...`);
    
    const prompt = `
    Generate ${count} COMPLEX, REALISTIC legal intake scenarios.
    
    CRITERIA:
    1. **Detailed Data:** Do not use simple key-value pairs. Use nested objects, arrays, and long strings.
    2. **Messy Narratives:** The 'client_narrative' should sound like a real person—frustrated, maybe including irrelevant details, but containing the core facts.
    3. **Timelines:** Include a list of events with dates.
    4. **Variety:** Mix obvious violations, clear losers (statute of limitations), and complex gray areas.

    FOCUS AREAS:
    1. Auto Sales (Lemon Law, Warranty, Misrepresentation, 940 CMR 5.00).
    2. Debt Collection (Harassment, Workplace Calls, Validation, 940 CMR 7.00).
    3. Credit Reporting (Identity Theft, Mixed Files, Disputes, FCRA).
    4. Home Improvement (Contractor walked off job, bad work, 940 CMR 10.00).
    
    OUTPUT FORMAT (JSON):
    {
      "cases": [
        {
          "id": "complex_${chunkIndex}_01",
          "intent": "Auto Sales – Lemon Law", 
          "formData": {
             "client_info": { "state": "MA", "age": 45 },
             "key_dates": {
                "purchase_date": "2023-01-15",
                "first_issue": "2023-01-20",
                "dealer_notice": "2023-02-01"
             },
             "financials": {
                "purchase_price": 24000,
                "repair_costs_incurred": 1500,
                "finance_company": "Ally"
             },
             "timeline": [
                { "date": "2023-01-15", "event": "Purchased Ford Explorer" },
                { "date": "2023-01-20", "event": "Check engine light came on" },
                { "date": "2023-01-22", "event": "Dealer said it was just a loose cap" }
             ],
             "evidence_held": ["Sales Contract", "Repair Order #123"],
             "client_narrative": "I bought this car thinking it was reliable. Three days later, the light comes on. The dealer brushed me off. Now it's been in the shop 4 times for the same transmission issue. They are refusing to refund me and say I drove it too hard."
          },
          "expected_bias": "VIOLATION" 
        }
      ]
    }
    `;

    try {
        const response = await withRetry(() => openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.8 // High creativity
        }));
    
        const rawContent = response.choices[0].message.content || "{}";
        const data = JSON.parse(rawContent);

        if (data.cases && Array.isArray(data.cases)) return data.cases;
        if (Array.isArray(data)) return data;
        
        return [];
    } catch (err) {
        console.error(`[Generator] Batch ${chunkIndex} failed:`, err);
        return [];
    }
}

async function runBatch() {
    console.log(`--- COMPLEX MAGISTRATE RUNNER (${TARGET_SAMPLE_SIZE} CASES) ---`);

    // 0. Ensure Results Directory Exists
    if (!fs.existsSync(RESULTS_DIR)) {
        fs.mkdirSync(RESULTS_DIR, { recursive: true });
        console.log(`Created output directory: ${RESULTS_DIR}`);
    }

    // 1. DATA GENERATION / LOADING (Using Staging File for caching)
    let cases: any[] = [];
    
    if (fs.existsSync(STAGING_FILE)) {
        try {
            const existing = JSON.parse(fs.readFileSync(STAGING_FILE, 'utf-8'));
            if (Array.isArray(existing) && existing.length >= TARGET_SAMPLE_SIZE) {
                console.log(`Loaded ${existing.length} complex cases from staging.`);
                cases = existing;
            } else {
                console.log("Staging file is partial. Regenerating...");
            }
        } catch (e) {
            console.log("Error reading staging file. Regenerating...");
        }
    }

    if (cases.length < TARGET_SAMPLE_SIZE) {
        const needed = TARGET_SAMPLE_SIZE;
        const batches = Math.ceil(needed / BATCH_SIZE);
        
        console.log(`Generating ${needed} complex cases...`);
        
        for (let i = 0; i < batches; i++) {
            const chunk = await generateChunk(i, BATCH_SIZE);
            cases = [...cases, ...chunk];
            console.log(`   Batch ${i+1}/${batches} done. Total: ${cases.length}`);
        }
        
        // Update Staging
        fs.writeFileSync(STAGING_FILE, JSON.stringify(cases, null, 2));
    }

    // Slice to exact target
    cases = cases.slice(0, TARGET_SAMPLE_SIZE);
    console.log(`\n⚖️ DOCKET READY: ${cases.length} COMPLEX CASES.\n`);

    // 2. EXECUTION LOOP
    const results: any[] = [];
    const stats = { violations: 0, ineligible: 0, errors: 0 };
    
    for (let i = 0; i < cases.length; i++) {
        const c = cases[i];
        const progress = `[${i + 1}/${cases.length}]`;
        
        try {
            process.stdout.write(`${progress} Judging ${c.id}... `);
            const start = Date.now();
            
            // The JudgeService handles the nested 'formData' automatically
            const verdict = await judge.evaluate(c.intent, c.formData);
            const duration = Date.now() - start;

            const resultEntry = {
                case_id: c.id,
                intent: c.intent,
                narrative_snippet: c.formData.client_narrative?.substring(0, 100) + "...",
                expected_bias: c.expected_bias,
                actual_verdict: verdict.status,
                confidence: verdict.confidence_score,
                citations: verdict.relevant_citations,
                analysis: verdict.analysis, // Full analysis object for complex cases
                duration_ms: duration
            };

            results.push(resultEntry);
            
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

    // 3. FINAL REPORT (Timestamped)
    const timestamp = getTimestamp();
    const filename = `magistrate_results_${timestamp}.json`;
    const fullPath = path.join(RESULTS_DIR, filename);

    fs.writeFileSync(fullPath, JSON.stringify(results, null, 2));
    
    console.log(`\n---------------------------------------`);
    console.log(`✅ COURT ADJOURNED.`);
    console.log(`---------------------------------------`);
    console.log(`Violations: ${stats.violations} | Dismissals: ${stats.ineligible} | Errors: ${stats.errors}`);
    console.log(`Saved Report To: ${fullPath}`);
}

runBatch().catch(console.error);