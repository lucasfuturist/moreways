// src/tests/llm.schema.FormGenerationResultSchema.test.ts

import { describe, it, expect } from "vitest";
import {
  // [FIX] Updated import to match the Envelope pattern
  FormGenerationEnvelopeSchema,
  type FormGenerationEnvelope,
} from "@/llm/schema/llm.schema.FormGenerationResultSchema";

describe("FormGenerationEnvelopeSchema", () => {
  it("accepts a valid form generation result", () => {
    const raw = {
      thought_process: "Thinking...",
      summary_message: "Done.",
      schema_update: {
        type: "object",
        properties: {
            fullName: {
            kind: "text",
            title: "Full name",
            },
            injuryType: {
            kind: "select",
            title: "Type of injury",
            options: ["Car accident", "Slip and fall"], 
            },
        },
        required: ["fullName"],
      }
    };

    const parsed: FormGenerationEnvelope = FormGenerationEnvelopeSchema.parse(raw);

    expect(parsed.schema_update.type).toBe("object");
    expect(Object.keys(parsed.schema_update.properties)).toContain("fullName");
  });

  it("rejects non-object types at runtime", () => {
    const raw = {
      type: "array", // Invalid root
    };
    expect(() => FormGenerationEnvelopeSchema.parse(raw)).toThrow();
  });
});