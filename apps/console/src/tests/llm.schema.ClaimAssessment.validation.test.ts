import { describe, it, expect } from "vitest";
import { ClaimAssessmentSchema } from "@/llm/schema/llm.schema.ClaimAssessment";

describe("ClaimAssessment Schema Validation", () => {
  
  it("rejects merit scores outside 0-100", () => {
    const invalidLow = {
      meritScore: -10,
      category: "low_merit",
      primaFacieAnalysis: { duty: "x", breach: "x", causation: "x", damages: "x" },
      credibilityFlags: [],
      summary: "bad"
    };

    const invalidHigh = { ...invalidLow, meritScore: 105 };

    const resLow = ClaimAssessmentSchema.safeParse(invalidLow);
    const resHigh = ClaimAssessmentSchema.safeParse(invalidHigh);

    expect(resLow.success).toBe(false);
    expect(resHigh.success).toBe(false);
  });

  it("rejects invalid categories", () => {
    const invalid = {
      meritScore: 50,
      category: "super_good_case", // Not in enum
      primaFacieAnalysis: { duty: "x", breach: "x", causation: "x", damages: "x" },
      credibilityFlags: [],
      summary: "ok"
    };

    const res = ClaimAssessmentSchema.safeParse(invalid);
    expect(res.success).toBe(false);
    // @ts-ignore
    expect(res.error.issues[0].message).toContain("Invalid enum value");
  });

  it("accepts valid structure", () => {
    const valid = {
      meritScore: 85,
      category: "high_merit",
      primaFacieAnalysis: { 
        duty: "Yes", 
        breach: "Yes", 
        causation: "Yes", 
        damages: "Broken Leg" 
      },
      credibilityFlags: ["Minor typo"],
      summary: "Solid case."
    };

    const res = ClaimAssessmentSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });
});