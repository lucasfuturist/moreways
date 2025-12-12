import { describe, it, expect } from "vitest";
import { 
  generateKeyFromLabel, 
  addOptionToField, 
  updateOptionInField, 
  removeOptionFromField,
  generateId
} from "@/forms/ui/canvas/field-actions";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

describe("forms.ui.canvas.field-actions", () => {
  
  describe("generateKeyFromLabel", () => {
    it("converts natural language to camelCase", () => {
      expect(generateKeyFromLabel("First Name")).toBe("firstName");
      expect(generateKeyFromLabel("Date of Birth")).toBe("dateOfBirth");
      expect(generateKeyFromLabel("SSN")).toBe("ssn");
    });

    it("handles special characters", () => {
      expect(generateKeyFromLabel("E-mail Address!")).toBe("emailAddress");
      expect(generateKeyFromLabel("What happened?")).toBe("whatHappened");
    });

    it("provides fallback for empty strings", () => {
      expect(generateKeyFromLabel("")).toBe("field");
      expect(generateKeyFromLabel("   ")).toBe("field");
    });
  });

  describe("Option Management", () => {
    const mockField: FormFieldDefinition = {
      id: "f1",
      key: "status",
      kind: "select",
      title: "Status",
      options: [
        { id: "opt_1", label: "Open", value: "open" }
      ]
    };

    it("adds a new option with stable ID", () => {
      const updated = addOptionToField(mockField);
      
      expect(updated.options).toHaveLength(2);
      expect(updated.options?.[1].label).toBe("Option 2");
      expect(updated.options?.[1].id).toBeDefined();
    });

    it("updates an existing option", () => {
      const updated = updateOptionInField(mockField, "opt_1", { label: "Closed" });
      
      expect(updated.options?.[0].label).toBe("Closed");
      expect(updated.options?.[0].value).toBe("open"); // Value didn't change
    });

    it("removes an option", () => {
      const updated = removeOptionFromField(mockField, "opt_1");
      
      expect(updated.options).toHaveLength(0);
    });

    it("handles fields with undefined options gracefully", () => {
      const emptyField = { ...mockField, options: undefined };
      const updated = addOptionToField(emptyField);
      
      expect(updated.options).toHaveLength(1);
    });
  });
});