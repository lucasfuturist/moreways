import { describe, it, expect } from "vitest";
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";

describe("Schema Normalizer: Fuzz Testing", () => {
  
  it("Recovers from 'flat' options array (String[])", () => {
    const chaoticInput = {
      properties: {
        status: {
          kind: "select",
          title: "Status",
          options: ["Open", "Closed", "Pending"] // LLM forgot object structure
        }
      }
    };

    const result = normalizeFormSchemaJsonShape(chaoticInput);
    const opts = result.properties.status.options || [];

    expect(opts).toHaveLength(3);
    expect(opts[0]).toEqual(expect.objectContaining({ label: "Open", value: "open" }));
    // Critical: Ensure IDs were generated so React keys don't crash
    expect(opts[0].id).toBeDefined(); 
  });

  it("Recovers from missing 'properties' object", () => {
    const chaoticInput = {
      fields: { // LLM used 'fields' instead of 'properties'
        name: { kind: "text" }
      }
    };

    const result = normalizeFormSchemaJsonShape(chaoticInput);
    // The normalizer should check aliases or default to empty
    expect(result.properties.name).toBeDefined();
  });

  it("Infers 'select' kind if options exist but kind is text", () => {
    const chaoticInput = {
      properties: {
        category: {
          kind: "text", // LLM hallucinated wrong kind
          title: "Category",
          options: [{ label: "A", value: "a" }]
        }
      }
    };

    const result = normalizeFormSchemaJsonShape(chaoticInput);
    expect(result.properties.category.kind).toBe("select"); // Auto-corrected
  });

  it("Sanitizes invalid Logic blocks", () => {
    const chaoticInput = {
      properties: {
        age: {
          kind: "number",
          logic: "Show if age > 18" // LLM returned string instead of array
        }
      }
    };

    const result = normalizeFormSchemaJsonShape(chaoticInput);
    // Should be undefined or empty array, NOT a string (which crashes map())
    expect(Array.isArray(result.properties.age.logic)).toBeFalsy(); 
    expect(result.properties.age.logic).toBeUndefined();
  });

  it("Preserves Metadata even if deep nested", () => {
    const input = {
      properties: {
        f1: { kind: "text" }
      },
      metadata: {
        chatHistory: [{ role: "user", content: "Hi" }],
        customTag: "v1.2"
      }
    };

    const result = normalizeFormSchemaJsonShape(input);
    expect(result.metadata?.chatHistory).toHaveLength(1);
    expect(result.metadata?.customTag).toBe("v1.2");
  });
});