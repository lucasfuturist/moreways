import { describe, it, expect } from "vitest";
import { getNextFieldKey } from "@/forms/logic/forms.logic.schemaIterator";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

describe("forms.logic.schemaIterator", () => {
  const schema: FormSchemaJsonShape = {
    type: "object",
    properties: {
      firstName: { kind: "text", title: "First Name", id: "1", key: "firstName" },
      lastName: { kind: "text", title: "Last Name", id: "2", key: "lastName" },
      age: { kind: "number", title: "Age", id: "3", key: "age" },
      hasInjury: { kind: "checkbox", title: "Injured?", id: "4", key: "hasInjury" },
      injuryDetails: { 
        kind: "textarea", 
        title: "Details", 
        id: "5", 
        key: "injuryDetails",
        logic: [
          {
            id: "l1",
            action: "show",
            when: { fieldKey: "hasInjury", operator: "equals", value: true }
          }
        ]
      }
    },
    order: ["firstName", "lastName", "age", "hasInjury", "injuryDetails"],
    required: []
  };

  it("advances sequentially when fields are empty", () => {
    // Start at beginning
    const next = getNextFieldKey(schema, {}, undefined);
    expect(next).toBe("firstName");

    // After first name
    const next2 = getNextFieldKey(schema, { firstName: "Jane" }, "firstName");
    expect(next2).toBe("lastName");
  });

  it("SMART SKIP: Skips fields that are already filled (Deep Listening)", () => {
    // Scenario: User said "I am Jane Doe", so we have both names.
    const currentData = {
      firstName: "Jane",
      lastName: "Doe" // Side-loaded!
    };

    // We just finished asking firstName...
    // Standard iterator would go to lastName.
    // Smart iterator should see lastName is full and jump to age.
    const next = getNextFieldKey(schema, currentData, "firstName");
    
    expect(next).toBe("age"); 
  });

  it("hides conditional fields if logic not met", () => {
    // hasInjury is false -> hide injuryDetails
    const next = getNextFieldKey(schema, { hasInjury: false }, "hasInjury");
    
    // Should skip 'injuryDetails' and return null (end of form)
    expect(next).toBeNull();
  });

  it("shows conditional fields if logic is met", () => {
    // hasInjury is true -> show injuryDetails
    const next = getNextFieldKey(schema, { hasInjury: true }, "hasInjury");
    
    expect(next).toBe("injuryDetails");
  });
});