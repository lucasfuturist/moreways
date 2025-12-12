import { describe, it, expect } from "vitest";
import { mergeExtractionIntoFormData } from "@/forms/logic/forms.logic.mergeExtraction";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

describe("forms.logic.mergeExtraction", () => {
  const schema: FormSchemaJsonShape = {
    type: "object",
    properties: {
      fullName: { kind: "text", title: "Name", id: "1", key: "fullName" },
      age: { kind: "number", title: "Age", id: "2", key: "age" },
      isInjured: { kind: "checkbox", title: "Injured?", id: "3", key: "isInjured" },
      incidentDate: { kind: "date", title: "Date", id: "4", key: "incidentDate" }
    },
    order: ["fullName", "age", "isInjured", "incidentDate"],
    required: []
  };

  it("applies valid updates to empty state", () => {
    const current = {};
    const extraction = {
      updates: {
        fullName: { value: "John Doe" },
        age: { value: 30 }
      },
      traits: {},
      clarifications: []
    };

    const result = mergeExtractionIntoFormData(current, extraction, schema);

    expect(result.nextFormData).toEqual({
      fullName: "John Doe",
      age: 30
    });
    expect(result.appliedFieldKeys).toContain("fullName");
  });

  it("PROTECTION: Drops updates for fields not in the schema (Hallucinations)", () => {
    const current = {};
    const extraction = {
      updates: {
        fullName: { value: "John" },
        mood: { value: "Angry" } // 'mood' does not exist in schema
      },
      traits: {},
      clarifications: []
    };

    const result = mergeExtractionIntoFormData(current, extraction, schema);

    expect(result.nextFormData.fullName).toBe("John");
    expect(result.nextFormData).not.toHaveProperty("mood"); // Dropped
    expect(result.droppedFieldKeys).toContain("mood");
  });

  it("PROTECTION: Does NOT overwrite existing data without isCorrection flag", () => {
    const current = { fullName: "Jane Doe" };
    const extraction = {
      updates: {
        fullName: { value: "John Doe", isCorrection: false } // Casual mention, not a correction
      },
      traits: {},
      clarifications: []
    };

    const result = mergeExtractionIntoFormData(current, extraction, schema);

    // Should keep "Jane", ignore "John"
    expect(result.nextFormData.fullName).toBe("Jane Doe");
    expect(result.droppedFieldKeys).toContain("fullName");
  });

  it("ALLOWS overwrite if isCorrection is true", () => {
    const current = { fullName: "Jane Doe" };
    const extraction = {
      updates: {
        fullName: { value: "Jane Smith", isCorrection: true } // User specifically corrected it
      },
      traits: {},
      clarifications: []
    };

    const result = mergeExtractionIntoFormData(current, extraction, schema);

    expect(result.nextFormData.fullName).toBe("Jane Smith");
  });

  it("COERCION: Converts types based on schema definition", () => {
    const current = {};
    const extraction = {
      updates: {
        age: { value: "45" }, // String to Number
        isInjured: { value: "yes" } // "yes" to Boolean
      },
      traits: {},
      clarifications: []
    };

    const result = mergeExtractionIntoFormData(current, extraction, schema);

    expect(result.nextFormData.age).toBe(45);
    expect(result.nextFormData.isInjured).toBe(true);
  });
});