import { openai } from '../../infra/openai/infra.openai.client';
import { HybridSearchService } from '../../retrieve/svc/retrieve.svc.hybridSearch';
import { Verdict, VerdictSchema } from '../schema/validate.schema.verdict';
import { SupabaseGraphReader } from '../../infra/supabase/infra.supabase.reader';
import { SupabaseOverrideRepo } from '../../graph/repo/graph.repo.overrideRepo';
import { LegalNodeRecord } from '../../graph/schema/graph.schema.nodes';
import { withRetry } from '../../shared/utils/resilience';

// 1. Precise URNs (Known Anchors)
const HARDCODED_ANCHORS: Record<string, string[]> = {
    "robocall": ["urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3", "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4"], 
    "auto": ["urn:lex:ma:940_cmr_5_00___motor_vehicle_regulations:5_04"],
    "dealership": ["urn:lex:ma:940_cmr_5_00___motor_vehicle_regulations:5_04"],
    "debt": ["urn:lex:ma:940_cmr_7_00___debt_collection_regulations"],
    "collection": ["urn:lex:ma:940_cmr_7_00___debt_collection_regulations"]
};

// 2. Fallback Concepts (Updated for Personal Injury)
const INTENT_CONCEPTS: Record<string, string> = {
    "auto": "used car lemon law warranty inspection fail 7 days refund",
    "debt": "debt collector harassment calls work frequency 940 cmr 7",
    "robocall": "telemarketing do not call robocall consent 16 cfr 310",
    // [FIX] Added Dog Bite / Personal Injury Context
    "dog": "dog bite strict liability dangerous animal owner responsibility injury",
    "bite": "dog bite strict liability dangerous animal owner responsibility injury",
    "injury": "personal injury negligence duty of care damages medical expenses",
    "accident": "negligence duty of care causation damages car accident"
};

export class JudgeService {
    constructor(
        private readonly searcher: HybridSearchService,
        private readonly reader: SupabaseGraphReader,
        private readonly overrideRepo: SupabaseOverrideRepo
    ) {}

    private async resolveAnchors(intent: string): Promise<string[]> {
        const normalizedIntent = intent.toLowerCase();

        // A. Fuzzy Match Hardcoded Anchors
        for (const [key, urns] of Object.entries(HARDCODED_ANCHORS)) {
            if (normalizedIntent.includes(key)) {
                const checks = await Promise.all(urns.map(urn => this.reader.getNodeByUrn(urn)));
                if (checks.every(n => n !== null)) return urns;
            }
        }

        // B. Dynamic Search
        const conceptKey = Object.keys(INTENT_CONCEPTS).find(k => normalizedIntent.includes(k));
        const searchCtx = conceptKey ? INTENT_CONCEPTS[conceptKey] : intent;
        
        // [LOGGING] Verify what we are searching for
        // console.log(`[Judge] 🔍 Intent: "${intent}" -> Search Context: "${searchCtx}"`);

        const results = await this.searcher.search(searchCtx, 5); 
        
        if (results.length > 0) {
            // Filter for structural nodes (regulations/statutes) rather than definitions if possible
            const lawCandidates = results.filter(r => {
                const u = r.urn.toLowerCase();
                return u.includes('cfr') || u.includes('cmr') || u.includes('usc') || u.includes('act') || u.includes('statute');
            });
            const bestFit = lawCandidates.length > 0 ? lawCandidates[0] : results[0];
            return [bestFit.urn];
        }
        return [];
    }

    public async evaluate(intent: string, formData: Record<string, any>): Promise<Verdict> {
        const today = new Date().toISOString().split('T')[0];

        // 1. Resolve Anchor URNs
        const anchors = await this.resolveAnchors(intent);
        const factSummary = JSON.stringify(formData, null, 2);

        // 2. Fetch Law Text (Context) + Check Overrides
        let lawText = "";
        let overrides: string[] = [];

        if (anchors.length > 0) {
            for (const urn of anchors) {
                const nodeOverrides = await this.overrideRepo.getOverrides(urn);
                nodeOverrides.forEach(o => {
                    overrides.push(`[ALERT] The law at ${urn} is flagged: ${o.type} - ${o.message} (Cite: ${o.court_citation})`);
                });

                try {
                    let nodesToRead: LegalNodeRecord[] = [];
                    // Try to get children (full section context)
                    const children = await this.reader.getChildren(urn.replace(/:/g, '.'), urn);
                    if (children.length > 0) {
                        nodesToRead = children;
                    } else {
                        const self = await this.reader.getNodeByUrn(urn);
                        if (self) nodesToRead = [self];
                    }
                    lawText += nodesToRead
                        .map(n => `SECTION [${n.urn}]:\n${n.content_text}`)
                        .join('\n\n');
                } catch (e) {
                    console.error(`[Judge] Failed to read node ${urn}`, e);
                }
            }
        }

        // [GUARD] Empty Law - Fallback to General Principles if no specific law found
        if (!lawText || lawText.length < 50) {
            lawText = "NO SPECIFIC STATUTE FOUND. APPLY GENERAL COMMON LAW PRINCIPLES (NEGLIGENCE, STRICT LIABILITY, CONTRACTS).";
        }

        // 3. The Magistrate Prompt
        const prompt = `
        ROLE: You are an impartial Magistrate Judge.
        TODAY'S DATE: ${today}
        TASK: Compare the Claimant's Facts against the Provided Law (or Common Law if specific statute missing).

        --- THE LAW ---
        ${lawText.substring(0, 20000)}

        --- JUDICIAL OVERRIDES ---
        ${overrides.length > 0 ? overrides.join('\n') : "None."}

        --- THE FACTS ---
        ${factSummary}

        INSTRUCTIONS:
        1. Compare facts to the elements of the law.
        2. **CHECK TIMELINESS:** Compare dates in the FACTS against TODAY'S DATE (${today}).
        3. **STRICT CITATION:** If specific SECTION [urn]s are provided above, USE THEM. If using General Common Law, cite principles (e.g. "Restatement (Second) of Torts").
        4. **OVERRIDE CHECK:** If a law is flagged as VACATED or STAYED, you CANNOT find a violation based on it.
        
        Determine Status:
           - LIKELY_VIOLATION: Clear alignment with prohibited acts + Timely.
           - POSSIBLE_VIOLATION: Plausible, but facts are vague.
           - UNLIKELY_VIOLATION: Facts contradict elements or defense is clear.
           - INELIGIBLE: Wrong jurisdiction or Statute of Limitations expired.

        OUTPUT JSON:
        {
          "status": "LIKELY_VIOLATION" | "POSSIBLE_VIOLATION" | "UNLIKELY_VIOLATION" | "INELIGIBLE",
          "confidence_score": number (0.0-1.0),
          "analysis": {
            "summary": "Concise legal opinion...",
            "missing_elements": ["Evidence needed..."],
            "strength_factors": ["Facts that support the claim..."],
            "weakness_factors": ["Facts that hurt the claim..."]
          },
          "relevant_citations": ["urn:lex:... or Legal Principle"]
        }
        `;

        try {
            const response = await withRetry(async () => {
                return await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: "system", content: "You are a strict, citation-focused Magistrate." }, { role: "user", content: prompt }],
                    response_format: { type: "json_object" },
                    temperature: 0
                });
            }, { maxDurationMs: 30000 });

            const rawJson = response.choices[0].message.content || "{}";
            const parsed = JSON.parse(rawJson);
            return VerdictSchema.parse(parsed);

        } catch (error) {
            console.error("[Judge] ❌ Mistrial:", error);
            // Fallback
            return {
                status: "POSSIBLE_VIOLATION",
                confidence_score: 0.5,
                analysis: {
                    summary: "AI analysis unavailable. Defaulting to manual review.",
                    missing_elements: [],
                    strength_factors: [],
                    weakness_factors: []
                },
                relevant_citations: anchors
            };
        }
    }
}