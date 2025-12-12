### 3. `PROMPTS.md`

```markdown
# argueOS – LLM Prompt & Template Specification

This document governs the structure and location of LLM prompts used for form generation.

---

## 1. Philosophy

*   **Separation:** Prompt templates MUST be stored in a dedicated `/prompts` directory and separated from application code. They should be loaded at runtime.
*   **Reproducibility:** Prompts must be versioned and structured to produce consistent JSON output.
*   **Tweakability:** A non-developer should be able to understand and suggest changes to a prompt template.

---

## 2. Prompt Template Location

All prompt templates will reside in `/prompts`.

*   Example: `/prompts/v1/generate-form-schema.txt`

---

## 3. Template Structure

Our primary form generation prompt will consist of four parts:

1.  **System Role:** Define the AI's persona and primary goal.
2.  **Instructions & Constraints:** Provide clear, explicit rules for the output format, including the JSON structure, allowed field types, and naming conventions.
3.  **Few-Shot Examples:** Include 2-3 high-quality examples of a user prompt and the ideal JSON output. This is critical for steering the model toward the correct format.
4.  **User Input:** The placeholder for the actual user's prompt.

---

## 4. v1 Form Generation Constraints

The LLM will be instructed to generate a JSON object that adheres to the following rules:

*   **JSON Schema Subset:** The output MUST be a valid JSON object that resembles a subset of the JSON Schema specification.
*   **Allowed Field Types:** The model may only use the following types:
    *   `text` (for single-line input)
    *   `textarea` (for multi-line input)
    *   `date`
    *   `select` (must also generate an `options` array)
    *   `checkbox` (for boolean true/false)
*   **Field Naming:** Field keys MUST be `camelCase` and contain no spaces or special characters.
*   **Required Fields:** The model should intelligently infer which fields are essential and include them in a top-level `required` array.

---
## Example Snippet (`generate-form-schema.txt`)
SYSTEM: You are an expert legal tech assistant specializing in creating structured JSON intake forms. Your sole purpose is to convert a lawyer's description of a legal matter into a valid, well-structured JSON form schema.
INSTRUCTIONS:
The output MUST be a single JSON object. Do not include any other text or explanations.
The JSON object must have a 'properties' object and an optional 'required' array.
Field names in 'properties' must be camelCase.
Each field must have a 'type' and a 'title'.
Allowed types are: text, textarea, date, select, checkbox.
For 'select' type, include an 'options' array of strings.
EXAMPLE 1
User: "A simple form for a new client in a divorce case."
Assistant:
{
"properties": {
"clientFullName": { "type": "text", "title": "Client Full Name" },
"spouseFullName": { "type": "text", "title": "Spouse's Full Name" },
"dateOfMarriage": { "type": "date", "title": "Date of Marriage" }
},
"required": ["clientFullName", "dateOfMarriage"]
}
USER:
{{user_prompt}}