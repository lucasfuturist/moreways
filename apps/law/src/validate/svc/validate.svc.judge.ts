import { openai } from '../../infra/openai/infra.openai.client';
import { HybridSearchService } from '../../retrieve/svc/retrieve.svc.hybridSearch';
import { Verdict, VerdictSchema } from '../schema/validate.schema.verdict';
import { SupabaseGraphReader } from '../../infra/supabase/infra.supabase.reader';

// 1. Precise URNs (If we know them exactly)
// Updated with the Telemarketing one we found in your logs
const HARDCODED_ANCHORS: Record<string, string[]> = {
    "Robocalls": ["urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3"], 
    "Auto – Dealership or Repair": ["urn:lex:ma:940_cmr_5_00___motor_vehicle_regulations:5_04"] // Best guess based on standard file naming
};

// 2. Fallback Concepts (If URNs fail, we search for this)
const INTENT_CONCEPTS: Record<string, string> = {
    "Auto – Dealership or Repair": "used car lemon law warranty inspection fail 7 days refund",
    "Debt Collection": "debt collector harassment calls work frequency 940 cmr 7",
    "Home Improvement": "contractor home improvement registration permit written contract 940 cmr 10",
    "Security Deposit": "security deposit landlord tenant 30 days interest triple damages",
    "Robocalls": "telemarketing do not call robocall consent 16 cfr 310"
};

export class JudgeService {
    constructor(
        private readonly searcher: HybridSearchService,
        private readonly reader: SupabaseGraphReader
    ) {}

    private async resolveAnchors(intent: string): Promise<string[]> {
        // A. Try Hardcoded
        const hardcoded = HARDCODED_ANCHORS[intent];
        if (hardcoded) {
            // Verify existence quickly
            const node = await this.reader.getNodeByUrn(hardcoded[0]);
            if (node) {
                console.log(`[Judge] 🎯 Found exact regulatory anchor: ${hardcoded[0]}`);
                return hardcoded;
            }
        }

        // B. Dynamic Search (Self-Healing)
        const concept = INTENT_CONCEPTS[intent] || intent;
        console.log(`[Judge] 🔍 Searching for law matching concept: "${concept}"`);
        
        const results = await this.searcher.search(concept, 1); // Get top 1 result
        
        if (results.length > 0) {
            console.log(`[Judge] ✅ Dynamically anchored to: ${results[0].urn}`);
            return [results[0].urn];
        }

        console.warn(`[Judge] ⚠️ Could not find any law for intent: ${intent}`);
        return [];
    }

    public async evaluate(intent: string, formData: Record<string, any>): Promise<Verdict> {
        console.log(`[Judge] ⚖️ Convening court for intent: "${intent}"`);

        // 1. Resolve Anchor URNs
        const anchors = await this.resolveAnchors(intent);
        const factSummary = JSON.stringify(formData);

        // 2. Fetch Law Text (Context)
        // We fetch the node + its children to get the full regulation text
        let lawText = "";
        
        if (anchors.length > 0) {
            const urn = anchors[0];
            
            // Try fetching children (if it's a Section header)
            // Note: We pass the URN to getChildren for robust prefix matching
            const children = await this.reader.getChildren(urn.replace(/:/g, '.'), urn);
            
            let nodesToRead = children;
            
            // If no children, it might be a leaf node (Paragraph), just read self
            if (nodesToRead.length === 0) {
                const self = await this.reader.getNodeByUrn(urn);
                if (self) nodesToRead = [self];
            }

            lawText = nodesToRead
                .map(n => `[${n.urn}] ${n.content_text}`)
                .join('\n\n')
                .substring(0, 15000); // Guard token limit
        }

        // [GUARD] Empty Law
        if (!lawText || lawText.length < 50) {
            return {
                status: "POSSIBLE_VIOLATION",
                confidence_score: 0.1,
                analysis: {
                    summary: "System could not retrieve specific regulations. The case requires manual legal review.",
                    missing_elements: ["Regulatory Context"],
                    strength_factors: [],
                    weakness_factors: []
                },
                relevant_citations: []
            };
        }

        // 3. The Magistrate Prompt
        const prompt = `
        ROLE: You are an impartial Magistrate Judge.
        TASK: Compare the Claimant's Facts against the Provided Law.

        THE LAW:
        ${lawText}

        THE FACTS:
        ${factSummary}

        INSTRUCTIONS:
        1. Compare facts to the elements of the law.
        2. Strict scrutiny: Do the dates, amounts, and actions match the violation criteria?
        3. Determine Likelihood:
           - LIKELY: Clear alignment with prohibited acts.
           - POSSIBLE: Plausible, but facts are vague.
           - UNLIKELY: Facts contradict elements.
           - INELIGIBLE: Wrong jurisdiction or statute of limitations.
        4. Cite specific URNs.

        OUTPUT JSON:
        {
          "status": "LIKELY_VIOLATION" | "POSSIBLE_VIOLATION" | "UNLIKELY_VIOLATION" | "INELIGIBLE",
          "confidence_score": number (0.0-1.0),
          "analysis": {
            "summary": "string",
            "missing_elements": ["string"],
            "strength_factors": ["string"],
            "weakness_factors": ["string"]
          },
          "relevant_citations": ["string"]
        }
        `;

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0
            });

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
                    summary: "AI analysis failed. Defaulting to manual review.",
                    missing_elements: [],
                    strength_factors: [],
                    weakness_factors: []
                },
                relevant_citations: anchors
            };
        }
    }
}