import { describe, it, expect } from "vitest";
import { migrateSchemaToV15 } from "@/forms/util/forms.util.migrateSchema";

describe("forms.util.migrateSchema", () => {
  it("migrates legacy 'required' array to boolean flags", () => {
    const legacy = {
      type: "object",
      properties: {
        f1: { title: "Name" },
        f2: { title: "Age" }
      },
      required: ["f1"] // Old way
    };

    const result = migrateSchemaToV15(legacy);

    // Check v1.5 format
    expect(result.properties.f1.isRequired).toBe(true);
    expect(result.properties.f2.isRequired).toBe(false);
  });

  it("generates missing 'order' array if absent", () => {
    const legacy = {
      type: "object",
      properties: {
        z: { title: "Z" },
        a: { title: "A" }
      }
      // No order array
    };

    const result = migrateSchemaToV15(legacy);

    expect(result.order).toBeDefined();
    expect(result.order).toHaveLength(2);
    // Should respect insertion order of keys usually, or at least exist
    expect(result.order).toContain("z");
    expect(result.order).toContain("a");
  });

  it("is idempotent (running it twice doesn't break things)", () => {
    const v15 = {
      type: "object",
      properties: {
        f1: { title: "Name", isRequired: true }
      },
      order: ["f1"],
      required: ["f1"] // Legacy field might still linger
    };

    const result1 = migrateSchemaToV15(v15);
    const result2 = migrateSchemaToV15(result1);

    expect(result2.properties.f1.isRequired).toBe(true);
    expect(result2.order).toEqual(["f1"]);
  });

  it("handles null/undefined input safely", () => {
    const result = migrateSchemaToV15(null);
    expect(result).toEqual({ 
      type: "object", 
      order: [], 
      properties: {}, 
      required: [] 
    });
  });
});