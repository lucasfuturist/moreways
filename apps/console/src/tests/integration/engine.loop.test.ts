import { describe, it, expect } from "vitest";
import { mergeExtractionIntoFormData } from "@/forms/logic/forms.logic.mergeExtraction";
import { getNextFieldKey } from "@/forms/logic/forms.logic.schemaIterator";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

describe("Integration: The Intake Engine Loop", () => {
  // 1. Define a typical Personal Injury Schema
  const schema: FormSchemaJsonShape = {
    type: "object",
    properties: {
      firstName: { kind: "text", title: "First Name", id: "1", key: "firstName" },
      lastName: { kind: "text", title: "Last Name", id: "2", key: "lastName" },
      incidentDate: { kind: "date", title: "Date", id: "3", key: "incidentDate" },
      wasInjured: { kind: "checkbox", title: "Injured?", id: "4", key: "wasInjured" }
    },
    order: ["firstName", "lastName", "incidentDate", "wasInjured"],
    required: []
  };

  it("completes a full multi-turn conversation successfully", () => {
    // --- START SESSION ---
    let currentData: Record<string, any> = {};
    let nextField = getNextFieldKey(schema, currentData);
    
    // Initial State: Bot should ask for First Name
    expect(nextField).toBe("firstName");

    // --- TURN 1: User gives FULL NAME (Deep Listening Trigger) ---
    // User says: "I am John Doe"
    // Mocking the Agent's extraction result:
    const turn1Extraction = {
      updates: {
        firstName: { value: "John" },
        lastName: { value: "Doe" } // Side-loaded!
      },
      traits: {},
      clarifications: []
    };

    // 1. Merge
    const merge1 = mergeExtractionIntoFormData(currentData, turn1Extraction, schema);
    currentData = merge1.nextFormData;

    // 2. Calculate Next
    // It should SKIP 'lastName' because it was just filled side-loaded
    nextField = getNextFieldKey(schema, currentData, nextField || undefined);
    
    expect(currentData.firstName).toBe("John");
    expect(currentData.lastName).toBe("Doe");
    expect(nextField).toBe("incidentDate"); // Skipped lastName!

    // --- TURN 2: User provides Date ---
    // User says: "It happened yesterday" (Agent converts to ISO)
    const turn2Extraction = {
      updates: {
        incidentDate: { value: "2023-10-27" }
      },
      traits: {},
      clarifications: []
    };

    const merge2 = mergeExtractionIntoFormData(currentData, turn2Extraction, schema);
    currentData = merge2.nextFormData;
    nextField = getNextFieldKey(schema, currentData, nextField || undefined);

    expect(nextField).toBe("wasInjured");

    // --- TURN 3: User finishes ---
    // User says: "No injuries"
    const turn3Extraction = {
      updates: {
        wasInjured: { value: false }
      },
      traits: {},
      clarifications: []
    };

    const merge3 = mergeExtractionIntoFormData(currentData, turn3Extraction, schema);
    currentData = merge3.nextFormData;
    nextField = getNextFieldKey(schema, currentData, nextField || undefined);

    // --- END OF FORM ---
    expect(nextField).toBeNull(); // No more fields
    expect(currentData).toEqual({
      firstName: "John",
      lastName: "Doe",
      incidentDate: "2023-10-27",
      wasInjured: false
    });
  });
});