import { z } from "zod";

export const ClaimAssessmentSchema = z.object({
  meritScore: z.number().min(0).max(100).describe("0-100 score of legal viability"),
  
  category: z.enum(["high_merit", "potential", "low_merit", "frivolous", "insufficient_data"]),
  
  primaFacieAnalysis: z.object({
    duty: z.string().describe("Did a duty exist?"),
    breach: z.string().describe("Was that duty breached?"),
    causation: z.string().describe("Did the breach cause harm?"),
    damages: z.string().describe("Are there quantifiable damages?")
  }),

  credibilityFlags: z.array(z.string()).describe("List of consistency issues or vagueness"),
  
  summary: z.string().describe("One sentence executive summary for the attorney")
});

export type ClaimAssessment = z.infer<typeof ClaimAssessmentSchema>;