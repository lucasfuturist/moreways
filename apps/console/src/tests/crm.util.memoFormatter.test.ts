import { describe, it, expect } from "vitest";
import { formatSubmissionAsMemo } from "@/crm/util/crm.util.memoFormatter";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

describe("crm.util.memoFormatter", () => {
  const schema: FormSchemaJsonShape = {
    type: "object",
    properties: {
      header1: { kind: "header", title: "Client Info", id: "h1", key: "header1" },
      fullName: { kind: "text", title: "Full Name", id: "f1", key: "fullName" },
      isMinor: { kind: "checkbox", title: "Is Minor?", id: "f2", key: "isMinor" },
      notes: { kind: "textarea", title: "Notes", id: "f3", key: "notes" },
      // Field that will be empty in data
      optionalField: { kind: "text", title: "Optional", id: "f4", key: "optionalField" }
    },
    order: ["header1", "fullName", "isMinor", "notes", "optionalField"]
  };

  it("formats a standard submission cleanly", () => {
    const data = {
      fullName: "John Doe",
      isMinor: true,
      notes: "Client seemed anxious."
    };

    const memo = formatSubmissionAsMemo(schema, data, { 
      clientName: "John Doe", 
      formName: "Intake v1" 
    });

    // Check Header
    expect(memo).toContain("# INTAKE SUMMARY");
    expect(memo).toContain("**Client:** John Doe");

    // Check Section
    expect(memo).toContain("## CLIENT INFO");

    // Check Values
    expect(memo).toContain("- **Full Name:** John Doe");
    
    // Check Boolean Conversion
    expect(memo).toContain("- **Is Minor?:** Yes");
  });

  it("handles false booleans correctly (not as empty)", () => {
    const data = { isMinor: false };
    const memo = formatSubmissionAsMemo(schema, data);
    
    expect(memo).toContain("- **Is Minor?:** No");
  });

  it("handles missing/undefined values gracefully", () => {
    const data = { fullName: "Jane" }; // 'notes' is missing
    const memo = formatSubmissionAsMemo(schema, data);

    expect(memo).toContain("- **Full Name:** Jane");
    // Should explicitly say (No answer) or be skipped depending on logic
    // Our util defaults to "(No answer)" for clarity in legal contexts
    expect(memo).toContain("- **Notes:** (No answer)");
  });

  it("formats multiselect arrays as lists", () => {
    const multiSchema: FormSchemaJsonShape = {
      type: "object",
      properties: {
        injuries: { kind: "multiselect", title: "Injuries", id: "m1", key: "injuries" }
      }
    };
    
    const data = { injuries: ["Neck", "Back"] };
    const memo = formatSubmissionAsMemo(multiSchema, data);

    expect(memo).toContain("- **Injuries:**");
    expect(memo).toContain("  * Neck");
    expect(memo).toContain("  * Back");
  });
});