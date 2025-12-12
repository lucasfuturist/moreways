import { describe, it, expect } from "vitest";
import { buildSimpleIntakeSnapshot } from "@/intake/logic/SimpleIntakeEngine";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

describe("SimpleIntakeEngine (Snapshot Builder)", () => {
  const schema: FormSchemaJsonShape = {
    type: "object",
    properties: {
      f1: { kind: "text", title: "F1", id: "1", key: "f1" },
      f2: { kind: "text", title: "F2", id: "2", key: "f2" },
      f3: { kind: "text", title: "F3", id: "3", key: "f3" }
    },
    order: ["f1", "f2", "f3"]
  };

  it("correctly partitions filled and unfilled fields", () => {
    const formData = {
      f1: "Answered",
      f2: "" // Empty string should count as unfilled
      // f3 is undefined
    };

    const snapshot = buildSimpleIntakeSnapshot(schema, formData);

    // Filled
    expect(snapshot.filled).toHaveProperty("f1");
    expect(snapshot.filled.f1).toBe("Answered");
    
    // Unfilled (Should contain f2 and f3)
    expect(snapshot.unfilled).toContain("f2");
    expect(snapshot.unfilled).toContain("f3");
    expect(snapshot.unfilled).not.toContain("f1");
  });

  it("considers 'false' and '0' as filled", () => {
    const data = {
      f1: false,
      f2: 0
    };

    const snapshot = buildSimpleIntakeSnapshot(schema, data);

    expect(snapshot.unfilled).not.toContain("f1");
    expect(snapshot.unfilled).not.toContain("f2");
    expect(snapshot.filled.f1).toBe(false);
  });

  it("handles empty arrays (multiselect) as unfilled", () => {
    const data = {
      f1: [] 
    };

    const snapshot = buildSimpleIntakeSnapshot(schema, data);
    expect(snapshot.unfilled).toContain("f1");
  });
});