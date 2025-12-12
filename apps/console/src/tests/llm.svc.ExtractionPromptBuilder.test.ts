import { describe, it, expect } from "vitest";
import { buildExtractionPromptFromTemplate } from "@/llm/svc/llm.svc.ExtractionPromptBuilder";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

describe("llm.svc.ExtractionPromptBuilder", () => {
  const schema: FormSchemaJsonShape = {
    type: "object",
    properties: {
      firstName: { kind: "text", title: "First Name", id: "1", key: "firstName" },
      lastName: { kind: "text", title: "Last Name", id: "2", key: "lastName" }
    },
    order: ["firstName", "lastName"],
    required: []
  };

  const input = {
    formName: "Test Intake",
    schema,
    currentValues: { firstName: "Alice" },
    userMessage: "My last name is Smith",
    history: []
  };

  it("includes the form name", () => {
    const prompt = buildExtractionPromptFromTemplate(input);
    expect(prompt).toContain("Form Name: Test Intake");
  });

  it("summarizes fields correctly (Schema Injection)", () => {
    const prompt = buildExtractionPromptFromTemplate(input);
    
    // Should see key, title, kind
    expect(prompt).toContain('"key": "firstName"');
    expect(prompt).toContain('"title": "First Name"');
    expect(prompt).toContain('"kind": "text"');
  });

  it("injects current values (Context Injection)", () => {
    const prompt = buildExtractionPromptFromTemplate(input);
    
    // Check for JSON block of values
    expect(prompt).toContain('"firstName": "Alice"');
  });

  it("injects the user message at the end", () => {
    const prompt = buildExtractionPromptFromTemplate(input);
    expect(prompt).toContain('"My last name is Smith"');
  });

  it("truncates history to conserve tokens", () => {
    // Create 10 dummy messages
    const longHistory = Array(10).fill({ role: "user", text: "msg" });
    
    const prompt = buildExtractionPromptFromTemplate({
        ...input,
        history: longHistory
    });

    // We assume the builder defaults to 6 turns max
    // So we shouldn't see the full length of JSON for 10 items
    // A simple heuristic check:
    const matches = prompt.match(/"role": "user"/g);
    expect(matches?.length).toBeLessThanOrEqual(6); 
  });
});