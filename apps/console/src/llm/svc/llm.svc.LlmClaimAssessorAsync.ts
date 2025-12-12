import { openaiClient } from "@/llm/adapter/llm.adapter.openai";
import { jsonParseSafe } from "@/llm/util/llm.util.jsonParseSafe";
import type { ClaimAssessment } from "@/llm/schema/llm.schema.ClaimAssessment";
import { ClaimAssessmentSchema } from "@/llm/schema/llm.schema.ClaimAssessment";

interface AssessmentInput {
  formTitle: string;
  formData: Record<string, any>;
}

export async function LlmClaimAssessorAsync(input: AssessmentInput): Promise<ClaimAssessment> {
  // 1. Flatten Data for the LLM
  const facts = Object.entries(input.formData)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");

  const prompt = `
    SYSTEM:
    You are a Senior Intake Attorney. Your job is to evaluate the LEGITIMACY and MERIT of a potential legal claim based on raw intake data.
    You are skeptical but fair. You look for the "Prima Facie" elements of a tort/case.

    CONTEXT:
    Form Type: ${input.formTitle}

    CLAIMANT FACTS:
    ${facts}

    YOUR TASK:
    Analyze these facts. Determine if this represents a viable legal claim.

    CRITERIA:
    1. **Merit Score (0-100):**
       - 90-100: Clear liability, significant damages, solid evidence mentioned.
       - 50-89: Plausible, but needs investigation or damages are unclear.
       - 20-49: Weak liability, minor damages, or huge gaps in the story.
       - 0-19: Frivolous, incoherent, or no legal basis (e.g. "My neighbor looked at me wrong").

    2. **Prima Facie Analysis:**
       - Breakdown Duty, Breach, Causation, and Damages based *strictly* on the text provided.

    3. **Credibility:**
       - Flag inconsistencies (e.g. "Says they can't walk, but admits to playing soccer").
       - Flag vagueness (e.g. "I was hurt bad" with no specifics).

    OUTPUT JSON:
    Return a JSON object matching this TypeScript interface:
    {
      meritScore: number,
      category: "high_merit" | "potential" | "low_merit" | "frivolous" | "insufficient_data",
      primaFacieAnalysis: { duty: string, breach: string, causation: string, damages: string },
      credibilityFlags: string[],
      summary: string
    }
  `;

  try {
    const raw = await openaiClient(prompt);
    const parsed = jsonParseSafe<ClaimAssessment>(raw);

    if (!parsed.success) {
      throw new Error("Failed to parse assessment JSON");
    }

    // Runtime Validation
    const validated = ClaimAssessmentSchema.safeParse(parsed.value);
    
    if (!validated.success) {
        // Fallback for partial failures
        return {
            meritScore: 0,
            category: "insufficient_data",
            primaFacieAnalysis: { duty: "?", breach: "?", causation: "?", damages: "?" },
            credibilityFlags: ["System Error: Validation Failed"],
            summary: "Automated assessment failed to validate."
        };
    }

    return validated.data;

  } catch (err) {
    console.error("[ClaimAssessor] Error:", err);
    return {
        meritScore: 0,
        category: "insufficient_data",
        primaFacieAnalysis: { duty: "N/A", breach: "N/A", causation: "N/A", damages: "N/A" },
        credibilityFlags: ["System Error"],
        summary: "Assessment unavailable."
    };
  }
}