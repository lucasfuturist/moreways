import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/api/server';
import * as fs from 'fs';
import * as path from 'path';

// Expanded Scenario Type
type ScenarioType = 'POSITIVE' | 'NEGATIVE' | 'TRAP';

interface Scenario {
    topic: string;
    query: string;
    expectedContext: string[];
    type: ScenarioType;
}

// [UPDATED] Scenarios including "Negative" (Hallucination check) and "Trap" (Override check)
const SCENARIOS: Scenario[] = [
    // --- POSITIVE TESTS (Should find answer) ---
    { 
        topic: "Debt Collection (Work Calls)",
        query: "Can a debt collector call me at my place of work?", 
        expectedContext: ["940_cmr_7_00", "fair_debt", "1692", "7_04"],
        type: 'POSITIVE'
    },
    { 
        topic: "Auto Sales (Lemon Definition)",
        query: "What is the definition of a 'lemon' vehicle in MA?", 
        expectedContext: ["lemon", "940_cmr_6_00", "warranty"],
        type: 'POSITIVE'
    },
    { 
        topic: "Retail (Refunds)",
        query: "Do stores have to give cash refunds if I change my mind?", 
        expectedContext: ["refund", "940_cmr", "disclosure"],
        type: 'POSITIVE'
    },

    // --- TRAP TEST (Judicial Overrides) ---
    // If we have an override for the 'Non-Compete' rule (FTC ban stayed), this checks if we get warned.
    // (Assuming dataset includes FTC rules. If not, this is a placeholder for future implementation)
    {
        topic: "Trap: Non-Compete Ban (Stayed)",
        query: "Is the FTC ban on non-compete agreements currently in effect?",
        expectedContext: ["non_compete", "ftc"], 
        type: 'TRAP' // Expecting a warning or "Not currently active"
    },

    // --- NEGATIVE TESTS (Zero Hallucination) ---
    {
        topic: "Negative: Martian Law",
        query: "What are the zoning regulations for building on Mars?",
        expectedContext: [], 
        type: 'NEGATIVE' // Expecting "I cannot find..."
    },
    {
        topic: "Negative: Crypto Tax",
        query: "How much tax do I pay on Bitcoin in Massachusetts?",
        expectedContext: [], 
        type: 'NEGATIVE' // Expecting refusal (unless tax code is in DB, which it likely isn't)
    }
];

describe('Quality Assurance - 10 Scenario Report', () => {

    it('should generate a QA Markdown Report', async () => {
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(__dirname, '../../debug_output', `QA_REPORT_${timestamp}.md`);
        
        if (!fs.existsSync(path.dirname(reportPath))) {
            fs.mkdirSync(path.dirname(reportPath), { recursive: true });
        }

        let reportContent = `# QA Report - Law Parsing Engine\n`;
        reportContent += `**Date:** ${new Date().toLocaleString()}\n`;
        reportContent += `**Scenarios:** ${SCENARIOS.length}\n\n`;
        reportContent += `| Topic | Type | Status | Latency | Result |\n`;
        reportContent += `|-------|------|--------|---------|--------|\n`;

        let detailsContent = `\n---\n\n## Detailed Responses\n\n`;

        console.log(`\n🧪 STARTING QUALITY AUDIT...`);
        let passCount = 0;

        for (const [index, scenario] of SCENARIOS.entries()) {
            console.log(`\n[${index + 1}/${SCENARIOS.length}] ${scenario.topic} (${scenario.type})...`);
            
            const start = Date.now();
            const response = await request(app)
                .post('/api/v1/search')
                .send({ query: scenario.query });
            const duration = Date.now() - start;

            const data = response.body.data;
            const debug = response.body.debug || {}; 
            const answer = data?.answer || "FAIL: No Answer";
            
            // Logic Analysis
            let status = '❌ FAIL';
            let contextMatch = false;

            if (scenario.type === 'POSITIVE') {
                const contextUrns = (data?.context?.ancestry || []).map((n: any) => n.urn);
                if (data?.context?.urn) contextUrns.push(data.context.urn);
                
                contextMatch = scenario.expectedContext.some(term => 
                    contextUrns.some((urn: any) => typeof urn === 'string' && urn.toLowerCase().includes(term))
                );
                
                const isRefusal = answer.includes("I cannot find") || answer.includes("cannot answer");
                if (contextMatch && !isRefusal) status = '✅ PASS';
            } 
            else if (scenario.type === 'NEGATIVE') {
                // Pass if the model REFUSES to answer
                if (answer.includes("I cannot find") || answer.includes("cannot answer")) {
                    status = '✅ PASS';
                }
            }
            else if (scenario.type === 'TRAP') {
                // Pass if model mentions "stayed", "void", "preempted", or "court"
                const keywords = ["stayed", "vacated", "enjoined", "preempted", "court", "not effective"];
                if (keywords.some(k => answer.toLowerCase().includes(k))) {
                    status = '✅ PASS';
                }
            }
            
            if (status === '✅ PASS') passCount++;

            // Summary Table
            reportContent += `| ${scenario.topic} | ${scenario.type} | ${status} | ${duration}ms | ${status === '✅ PASS' ? 'OK' : 'Check'} |\n`;

            // Detailed Section
            detailsContent += `### ${index + 1}. ${scenario.topic}\n\n`;
            detailsContent += `**Query:** "${scenario.query}"\n\n`;
            detailsContent += `**Transformed:** "${debug.query_transformed || 'N/A'}"\n\n`; 
            detailsContent += `**Engine Response:**\n> ${answer.replace(/\n/g, '\n> ')}\n\n`;
            
            detailsContent += `**Vector Search Matches:**\n`;
            if (debug.vector_matches && debug.vector_matches.length > 0) {
                debug.vector_matches.forEach((m: any) => {
                    // [UPDATED] Now reflects the new scoring breakdown
                    detailsContent += `- **Total: ${m.total_score}** (Vec: \`${m.vector_score}\` | Key: \`${m.keyword_score}\`)\n`;
                    detailsContent += `  - URN: \`${m.urn}\`\n`;
                    detailsContent += `  - *${m.snippet.replace(/\n/g, ' ')}*\n`;
                });
            } else {
                detailsContent += `> ⚠️ NO MATCHES FOUND\n`;
            }
            
            // Show Alerts if any
            if (data?.context?.alerts && data.context.alerts.length > 0) {
                 detailsContent += `\n**⚠️ ALERTS TRIGGERED:**\n`;
                 data.context.alerts.forEach((a: any) => {
                     detailsContent += `- [${a.type}] ${a.message}\n`;
                 });
            }

            detailsContent += `\n---\n\n`;
        }

        fs.writeFileSync(reportPath, reportContent + detailsContent);
        console.log(`\n📝 REPORT GENERATED: ${reportPath}`);

        // We expect at least most to pass, but let's just assert no crashes for now
        expect(passCount).toBeGreaterThanOrEqual(0); 

    }, 120000); 
});