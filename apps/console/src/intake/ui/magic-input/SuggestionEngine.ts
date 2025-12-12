/**
 * SuggestionEngine
 * 
 * Simple heuristics to suggest prompt refinements based on the current input.
 */

const SUGGESTIONS = [
  { label: "Create Slip & Fall", trigger: "empty" },
  { label: "Create Divorce Intake", trigger: "empty" },
  { label: "Create NDA", trigger: "empty" },
  { label: "Add Spanish translations", trigger: "has_content" },
  { label: "Make strict validation", trigger: "has_content" },
  { label: "Add client history section", trigger: "has_content" },
];

export function getSuggestions(currentValue: string) {
  const hasContent = currentValue.trim().length > 0;
  
  return SUGGESTIONS.filter(s => 
    hasContent ? s.trigger === "has_content" : s.trigger === "empty"
  );
}