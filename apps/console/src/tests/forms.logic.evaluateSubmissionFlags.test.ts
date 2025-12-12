import { describe, it, expect } from "vitest";
import { evaluateSubmissionFlags } from "@/forms/logic/forms.logic.evaluateSubmissionFlags";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

describe("forms.logic.evaluateSubmissionFlags", () => {
  const schema: FormSchemaJsonShape = {
    type: "object",
    properties: {
      incidentDate: {
        kind: "date",
        title: "Date",
        id: "d1",
        key: "incidentDate",
        logic: [
          {
            id: "r1",
            action: "flag",
            flagCode: "STATUTE_RISK",
            flagMessage: "Over 2 years old",
            when: {
              fieldKey: "incidentDate",
              operator: "older_than_years",
              value: 2
            }
          }
        ]
      },
      description: {
        kind: "textarea",
        title: "Desc",
        id: "t1",
        key: "description",
        logic: [
          {
            id: "r2",
            action: "flag",
            flagCode: "PII_RISK",
            flagMessage: "SSN Detected",
            when: {
              fieldKey: "description",
              operator: "matches_regex",
              value: "\\d{3}-\\d{2}-\\d{4}" // Simple SSN regex
            }
          }
        ]
      }
    },
    order: ["incidentDate", "description"]
  };

  it("flags dates older than threshold", () => {
    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 3); // 3 years ago

    const flags = evaluateSubmissionFlags(schema, {
      incidentDate: oldDate.toISOString()
    });

    expect(flags).toHaveLength(1);
    expect(flags[0].code).toBe("STATUTE_RISK");
  });

  it("does NOT flag recent dates", () => {
    const recentDate = new Date();
    recentDate.setFullYear(recentDate.getFullYear() - 1); // 1 year ago

    const flags = evaluateSubmissionFlags(schema, {
      incidentDate: recentDate.toISOString()
    });

    expect(flags).toHaveLength(0);
  });

  it("flags regex matches (PII detection)", () => {
    const flags = evaluateSubmissionFlags(schema, {
      description: "My SSN is 123-45-6789 thanks."
    });

    expect(flags).toHaveLength(1);
    expect(flags[0].code).toBe("PII_RISK");
  });

  it("returns multiple flags if multiple violations exist", () => {
    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 5);

    const flags = evaluateSubmissionFlags(schema, {
      incidentDate: oldDate.toISOString(),
      description: "Here is 999-00-1111"
    });

    expect(flags).toHaveLength(2);
    expect(flags.map(f => f.code)).toContain("STATUTE_RISK");
    expect(flags.map(f => f.code)).toContain("PII_RISK");
  });
});