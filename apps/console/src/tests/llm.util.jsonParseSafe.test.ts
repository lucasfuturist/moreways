/**
 * llm.util.jsonParseSafe.test
 *
 * Tests for the safe JSON parsing helper used for LLM responses.
 */

import { describe, expect, it } from "vitest";
import { jsonParseSafe } from "../llm/util/llm.util.jsonParseSafe";

describe("jsonParseSafe", () => {
  it("parses valid JSON directly", () => {
    const input = `{"foo": "bar", "count": 3}`;
    const result = jsonParseSafe<{ foo: string; count: number }>(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.foo).toBe("bar");
      expect(result.value.count).toBe(3);
    }
  });

  it("parses JSON wrapped in markdown fences", () => {
    const input = [
      "here is your schema:",
      "```json",
      '{"foo": "bar"}',
      "```",
      "thank you.",
    ].join("\n");

    const result = jsonParseSafe<{ foo: string }>(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.foo).toBe("bar");
    }
  });

  it("parses JSON with leading/trailing noise", () => {
    const input = `LLM preamble blah blah
    {
      "foo": "bar",
      "nested": { "x": 1 }
    }
    some trailing notes that are not JSON`;

    const result = jsonParseSafe<{ foo: string; nested: { x: number } }>(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.foo).toBe("bar");
      expect(result.value.nested.x).toBe(1);
    }
  });

  it("returns failure for completely invalid JSON", () => {
    const input = "this is not json at all";

    const result = jsonParseSafe(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });
});
