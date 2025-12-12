import { describe, it, expect } from "vitest";
import { getSuggestions } from "@/intake/ui/magic-input/SuggestionEngine";

describe("SuggestionEngine", () => {
  it("returns starter suggestions when input is empty", () => {
    const suggestions = getSuggestions("");
    
    expect(suggestions.length).toBeGreaterThan(0);
    // Should suggest creating forms
    expect(suggestions.some(s => s.label.includes("Create"))).toBe(true);
  });

  it("returns refinement suggestions when input has content", () => {
    const suggestions = getSuggestions("I need a divorce form");
    
    // Should suggest modifications
    expect(suggestions.some(s => s.label.includes("Create"))).toBe(false);
    expect(suggestions.some(s => s.label.includes("Add") || s.label.includes("Make"))).toBe(true);
  });

  it("handles whitespace only as empty", () => {
    const suggestions = getSuggestions("   ");
    expect(suggestions.some(s => s.label.includes("Create"))).toBe(true);
  });
});