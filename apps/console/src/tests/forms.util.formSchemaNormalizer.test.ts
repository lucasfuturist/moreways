import { describe, it, expect } from "vitest";
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

describe("formSchemaNormalizer (v1.5 Robustness)", () => {
  
  it("handles null, undefined, or non-object inputs gracefully", () => {
    const empty = normalizeFormSchemaJsonShape(null);
    expect(empty).toEqual({ type: "object", properties: {}, order: [], required: [] });

    const garbage = normalizeFormSchemaJsonShape("some string");
    expect(garbage).toEqual({ type: "object", properties: {}, order: [], required: [] });
  });

  it("upgrades v1 legacy schema (missing 'order', string 'options') to v1.5", () => {
    const legacyV1 = {
      type: "object",
      properties: {
        firstName: { kind: "text", title: "First Name" },
        status: { 
          kind: "select", 
          title: "Status", 
          options: ["Open", "Closed"] // Legacy string array
        }
      },
      required: ["firstName"] // Legacy root required
    };

    const normalized = normalizeFormSchemaJsonShape(legacyV1);

    // 1. Check Order derivation
    expect(normalized.order).toEqual(["firstName", "status"]);

    // 2. Check Option normalization
    const statusField = normalized.properties.status;
    expect(statusField.options?.[0]).toEqual(expect.objectContaining({
      label: "Open",
      value: "open"
    }));
    expect(statusField.options?.[0].id).toBeDefined(); // Should generate stable ID

    // 3. Check Required merging
    expect(normalized.properties.firstName.isRequired).toBe(true);
    expect(normalized.properties.status.isRequired).toBe(false);
  });

  it("sanitizes 'order' array by removing keys that do not exist", () => {
    const maliciousLLMOutput = {
      properties: {
        a: { kind: "text", title: "A" }
      },
      order: ["a", "b", "c"] // 'b' and 'c' don't exist
    };

    const result = normalizeFormSchemaJsonShape(maliciousLLMOutput);
    expect(result.order).toEqual(["a"]);
  });

  it("preserves v1.5 metadata, logic, and layout", () => {
    const v15Schema = {
      properties: {
        socialSecurity: {
          kind: "text",
          title: "SSN",
          metadata: { isPII: true },
          layout: { width: "half" },
          logic: [{ triggerFieldKey: "foo", action: "show" }]
        }
      }
    };

    const result = normalizeFormSchemaJsonShape(v15Schema);
    const field = result.properties.socialSecurity as FormFieldDefinition;

    expect(field.metadata?.isPII).toBe(true);
    expect(field.layout?.width).toBe("half");
    expect(field.logic?.[0].action).toBe("show");
  });

  it("generates stable IDs for fields if missing", () => {
    const raw = {
      properties: {
        fieldWithoutId: { kind: "text", title: "Ghost" }
      }
    };

    const result = normalizeFormSchemaJsonShape(raw);
    expect(result.properties.fieldWithoutId.id).toBeDefined();
    expect(result.properties.fieldWithoutId.id).toMatch(/^field_/);
  });
});