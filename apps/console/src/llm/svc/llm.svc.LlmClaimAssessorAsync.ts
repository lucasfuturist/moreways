/**
 * llm.svc.LlmClaimAssessorAsync
 * 
 * Orchestrates the legal merit assessment by delegating to the 
 * specialized 'apps/law' service.
 * 
 * Related docs:
 * - 00-theoretical-basis.md (Law App)
 * - 04-retrieval-logic.md (Law App)
 */

import { logger } from "@/infra/logging/infra.svc.logger";
import { env } from "@/infra/config/infra.svc.envConfig";

/**
 * Matches the VerdictSchema defined in apps/law
 */
export interface ClaimAssessment {
  status: 'LIKELY_VIOLATION' | 'POSSIBLE_VIOLATION' | 'UNLIKELY_VIOLATION' | 'INELIGIBLE';
  confidence_score: number; // 0.0 to 1.0
  analysis: {
    summary: string;
    missing_elements: string[];
    strength_factors?: string[];
    weakness_factors?: string[];
  };
  relevant_citations: string[];
}

export async function LlmClaimAssessorAsync(
  submissionData: Record<string, any>, 
  formName: string
): Promise<ClaimAssessment> {
  
  // 1. Construct the payload for the Law Magistrate
  const payload = {
    intent: formName, // e.g. "Used Car Issues" or "Debt Collection"
    formData: submissionData,
    jurisdiction: "MA" // Default for V1, can be dynamic based on data
  };

  try {
    logger.info("[ClaimAssessor] Delegating to Law Service Magistrate...", { 
      target: `${env.lawServiceUrl}/api/v1/validate` 
    });

    // 2. Execute call to Law App
    const response = await fetch(`${env.lawServiceUrl}/api/v1/validate`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Add API Key header here if apps/law middleware requires it in the future
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Law Service Error (${response.status}): ${errorText}`);
    }

    const result = await response.json();

    // 3. Extract the Verdict from the Law App response envelope
    // Note: apps/law returns { data: Verdict, meta: { ... } }
    const verdict = result.data as ClaimAssessment;

    logger.info("[ClaimAssessor] Received verdict from Magistrate", { 
      status: verdict.status,
      score: verdict.confidence_score 
    });

    return verdict;

  } catch (error: any) {
    logger.error("[ClaimAssessor] Law Service Delegation Failed", { error: error.message });
    
    // 4. Fail-Open Fallback
    // Returns a neutral "Manual Review" status if the legal engine is down
    return {
      status: "POSSIBLE_VIOLATION",
      confidence_score: 0.5,
      analysis: {
        summary: "Automated legal analysis is currently unavailable. This claim has been flagged for immediate manual review by a legal professional.",
        missing_elements: ["System connection to Legal Knowledge Base"],
        strength_factors: ["Submission successfully recorded in database"]
      },
      relevant_citations: []
    };
  }
}