import { describe, it, expect, vi, beforeEach } from "vitest";
import { LlmClaimAssessorAsync } from "@/llm/svc/llm.svc.LlmClaimAssessorAsync";

// 1. Hoist
const mocks = vi.hoisted(() => ({
  openaiClient: vi.fn(),
}));

// 2. Mock
vi.mock("@/llm/adapter/llm.adapter.openai", () => ({
  openaiClient: mocks.openaiClient,
}));

describe("LlmClaimAssessorAsync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const STRONG_CASE_DATA = {
    formTitle: "Personal Injury Intake",
    formData: {
      description: "I was stopped at a red light on Main St. A delivery truck rear-ended me at 40mph.",
      injuries: "Broken collarbone, whiplash, concussion.",
      medical_treatment: "Taken to ER by ambulance, surgery scheduled.",
      police_report: "Yes, driver cited for negligence."
    }
  };

  const WEAK_CASE_DATA = {
    formTitle: "Personal Injury Intake",
    formData: {
      description: "My neighbor sends bad vibes towards my house.",
      injuries: "My aura is damaged.",
      medical_treatment: "None.",
      police_report: "No."
    }
  };

  it("identifies a HIGH MERIT claim correctly", async () => {
    // Mock LLM Response for Strong Case
    mocks.openaiClient.mockResolvedValue(JSON.stringify({
      meritScore: 95,
      category: "high_merit",
      primaFacieAnalysis: {
        duty: "Driver had duty to stop.",
        breach: "Rear-ended at 40mph.",
        causation: "Impact caused injury.",
        damages: "Broken bones, surgery."
      },
      credibilityFlags: [],
      summary: "Clear liability rear-end collision with significant documented damages."
    }));

    const result = await LlmClaimAssessorAsync(STRONG_CASE_DATA);

    expect(result.category).toBe("high_merit");
    expect(result.meritScore).toBeGreaterThan(90);
    expect(result.primaFacieAnalysis.damages).toContain("Broken bones");
  });

  it("identifies a FRIVOLOUS claim correctly", async () => {
    // Mock LLM Response for Weak Case
    mocks.openaiClient.mockResolvedValue(JSON.stringify({
      meritScore: 10,
      category: "frivolous",
      primaFacieAnalysis: {
        duty: "No legal duty to control vibes.",
        breach: "N/A",
        causation: "N/A",
        damages: "Aura damage is not recognized legal harm."
      },
      credibilityFlags: ["Subjective complaint", "No physical damages"],
      summary: "Complaint regarding 'bad vibes' lacks legal basis for a tort claim."
    }));

    const result = await LlmClaimAssessorAsync(WEAK_CASE_DATA);

    expect(result.category).toBe("frivolous");
    expect(result.meritScore).toBeLessThan(20);
    expect(result.credibilityFlags.length).toBeGreaterThan(0);
  });

  it("handles malformed JSON from LLM gracefully", async () => {
    mocks.openaiClient.mockResolvedValue("This is not JSON");

    const result = await LlmClaimAssessorAsync(STRONG_CASE_DATA);

    // Should return the fallback "insufficient_data" object
    expect(result.category).toBe("insufficient_data");
    expect(result.meritScore).toBe(0);
  });
});