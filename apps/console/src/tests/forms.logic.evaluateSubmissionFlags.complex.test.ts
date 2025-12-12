import { describe, it, expect } from "vitest";
import { evaluateSubmissionFlags } from "@/forms/logic/forms.logic.evaluateSubmissionFlags";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

describe("Logic Engine: Complex Boolean Evaluation (V2)", () => {
  const schema: FormSchemaJsonShape = {
    type: "object",
    properties: {
      age: { kind: "number", title: "Age", id: "1", key: "age" },
      hasGuardian: { kind: "checkbox", title: "Guardian?", id: "2", key: "hasGuardian" },
      state: { kind: "text", title: "State", id: "3", key: "state" },
      // This field exists just to hold the logic rule
      summary: { 
        kind: "info", title: "Summary", id: "4", key: "summary",
        logic: [
          {
            id: "risk1",
            action: "flag",
            flagCode: "MINOR_NO_GUARDIAN",
            flagMessage: "Minor without guardian present",
            when: {
              // (Age < 18) AND (hasGuardian != true)
              allOf: [
                { fieldKey: "age", operator: "less_than", value: 18 },
                { fieldKey: "hasGuardian", operator: "not_equals", value: true }
              ]
            }
          },
          {
            id: "risk2",
            action: "flag",
            flagCode: "JURISDICTION_WARN",
            flagMessage: "Out of area",
            when: {
              // State == "NY" OR State == "CA"
              anyOf: [
                { fieldKey: "state", operator: "equals", value: "NY" },
                { fieldKey: "state", operator: "equals", value: "CA" }
              ]
            }
          }
        ]
      }
    },
    order: ["age", "hasGuardian", "state", "summary"]
  };

  it("triggers AND group only when ALL conditions met", () => {
    // 1. Age < 18, No Guardian -> FLAG
    const res1 = evaluateSubmissionFlags(schema, { age: 16, hasGuardian: false });
    expect(res1.map(f => f.code)).toContain("MINOR_NO_GUARDIAN");

    // 2. Age < 18, HAS Guardian -> NO FLAG
    const res2 = evaluateSubmissionFlags(schema, { age: 16, hasGuardian: true });
    expect(res2.map(f => f.code)).not.toContain("MINOR_NO_GUARDIAN");

    // 3. Age > 18, No Guardian -> NO FLAG
    const res3 = evaluateSubmissionFlags(schema, { age: 25, hasGuardian: false });
    expect(res3.map(f => f.code)).not.toContain("MINOR_NO_GUARDIAN");
  });

  it("triggers OR group when ANY condition met", () => {
    // 1. State is NY -> FLAG
    const res1 = evaluateSubmissionFlags(schema, { state: "NY" });
    expect(res1.map(f => f.code)).toContain("JURISDICTION_WARN");

    // 2. State is CA -> FLAG
    const res2 = evaluateSubmissionFlags(schema, { state: "CA" });
    expect(res2.map(f => f.code)).toContain("JURISDICTION_WARN");

    // 3. State is TX -> NO FLAG
    const res3 = evaluateSubmissionFlags(schema, { state: "TX" });
    expect(res3.map(f => f.code)).not.toContain("JURISDICTION_WARN");
  });
});