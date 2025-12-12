// src/llm/svc/llm.svc.ExtractionPromptBuilder.ts

/**
 * llm.svc.ExtractionPromptBuilder
 *
 * Builds the **single** prompt string for the extraction model.
 * The model:
 * - Sees the current form JSON (schema + values),
 * - Sees a small text history,
 * - Returns ONLY ExtractionResult JSON (patch).
 */

import type {
  FormSchemaJsonShape,
  FormFieldDefinition,
} from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export interface SimpleMessage {
  role: "user" | "assistant";
  text: string;
}

export interface ExtractionPromptBuilderInput {
  formName: string;
  /**
   * Canonical form schema JSON for this intake.
   */
  schema: FormSchemaJsonShape;
  /**
   * Current field values keyed by field key.
   * This is the "state" that the model can only PATCH.
   */
  currentValues: Record<string, unknown>;
  /**
   * Simple traits/flags already known about the user/intake.
   * Can be empty.
   */
  traits?: Record<string, unknown>;
  /**
   * The latest user message for this turn.
   */
  userMessage: string;
  /**
   * Optional short history for context (last few turns).
   */
  history?: SimpleMessage[];
}

/**
 * Small helper to produce a compact summary of fields instead of dumping
 * the entire schema verbatim into the instructions.
 */
function buildFieldSummaries(schema: FormSchemaJsonShape): Array<{
  key: string;
  title: string;
  kind: string;
  required: boolean;
}> {
  const summaries: Array<{
    key: string;
    title: string;
    kind: string;
    required: boolean;
  }> = [];

  for (const [key, def] of Object.entries(schema.properties)) {
    const f = def as FormFieldDefinition;
    summaries.push({
      key,
      title: f.title,
      kind: f.kind,
      required: Boolean(f.isRequired),
    });
  }

  return summaries;
}

function truncateHistory(history: SimpleMessage[] | undefined, maxTurns = 6) {
  if (!history || history.length <= maxTurns) return history ?? [];
  return history.slice(-maxTurns);
}

/**
 * Main builder.
 *
 * NOTE: Returns a **string prompt**; the caller is responsible for sending it
 * to the vendor client and for logging via promptLogger.
 */
export function buildExtractionPromptFromTemplate(
  input: ExtractionPromptBuilderInput
): string {
  const {
    formName,
    schema,
    currentValues,
    traits = {},
    userMessage,
    history,
  } = input;

  const fieldSummaries = buildFieldSummaries(schema);
  const limitedHistory = truncateHistory(history);

  const schemaJson = JSON.stringify(schema, null, 2);
  const valuesJson = JSON.stringify(currentValues, null, 2);
  const traitsJson = JSON.stringify(traits, null, 2);
  const historyJson = JSON.stringify(limitedHistory, null, 2);

  return `
You are an extraction engine for a legal intake assistant.

You NEVER decide what to ask next.
You NEVER invent new fields.
You ONLY:
  - read the current form JSON (schema + values),
  - interpret the latest user message in context,
  - and return a JSON PATCH object called "ExtractionResult".

The engine will:
  - merge your patch into the canonical form JSON,
  - choose the next field to ask,
  - decide when sections/forms are complete.

Form Name: ${formName}

-------------------------
FORM FIELD SUMMARY
-------------------------

The form has these fields (key, title, kind, required):

${JSON.stringify(fieldSummaries, null, 2)}

-------------------------
CURRENT FORM JSON
-------------------------

SCHEMA:
${schemaJson}

CURRENT VALUES:
${valuesJson}

TRAITS / FLAGS:
${traitsJson}

-------------------------
DIALOG CONTEXT
-------------------------

RECENT HISTORY (assistant + user messages, newest last):
${historyJson}

LATEST USER MESSAGE (for THIS turn, focus on this):
"${userMessage}"

-------------------------
YOUR TASK
-------------------------

1. Read the form JSON and the current values.
2. Interpret ONLY the latest user message in the context of the history.
3. Produce an ExtractionResult JSON object with:
   {
     "updates": {
       "<fieldKey>": {
         "value": <clean value>,
         "reason": "short explanation of why this matches",
         "isCorrection": true | false
       },
       ...
     },
     "traits": {
       "<traitKey>": {
         "value": <boolean|string|number>,
         "reason": "short explanation"
       },
       ...
     },
     "clarifications": [
       {
         "fieldKey": "<fieldKey>",
         "question": "Concrete clarification question you want the engine to ask the user next.",
         "priority": "low" | "normal" | "high"
       }
     ]
   }

RULES:

- ONLY include fields in "updates" when the latest user message clearly answers or corrects them.
- Do NOT repeat fields that are already filled unless the user is clearly correcting them.
- If a field already has a value and you are NOT sure it is a correction, leave it out.
- If you infer traits/flags, include them in "traits" but keep them simple.
- If you genuinely need clarification, add a "clarifications" entry.

IMPORTANT FORMAT:

- Respond with a single JSON object ONLY.
- Do NOT wrap in backticks.
- Do NOT include any explanations outside of JSON.
- The JSON MUST conform to the ExtractionResult schema described above.
`;
}
