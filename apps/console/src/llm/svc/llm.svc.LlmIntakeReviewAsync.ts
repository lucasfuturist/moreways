// src/llm/svc/llm.svc.LlmIntakeReviewAsync.ts

import { openaiClient } from "@/llm/adapter/llm.adapter.openai";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export interface IntakeReviewInput {
  schema: FormSchemaJsonShape;
  formData: Record<string, any>;
  userMessage: string;
}

export async function LlmIntakeReviewAsync(
  input: IntakeReviewInput
): Promise<string> {
  const { schema, formData, userMessage } = input;

  // answered vs remaining, using the *actual* schema + order
  const answeredLines: string[] = [];
  const remainingLines: string[] = [];

  const order = Array.isArray(schema.order)
    ? schema.order
    : Object.keys(schema.properties);

  for (const key of order) {
    const def = schema.properties[key];
    if (!def) continue;

    const label = def.title || key;
    const raw = formData?.[key];

    const isEmpty =
      raw === undefined ||
      raw === null ||
      (typeof raw === "string" && raw.trim() === "") ||
      (Array.isArray(raw) && raw.length === 0);

    if (isEmpty) {
      remainingLines.push(`- ${label}`);
    } else {
      // keep it simple; LLM can summarize / rephrase
      answeredLines.push(`- ${label}: ${String(raw)}`);
    }
  }

  const answeredBlock =
    answeredLines.length > 0
      ? answeredLines.join("\n")
      : "(no answers captured yet)";

  const remainingBlock =
    remainingLines.length > 0
      ? remainingLines.join("\n")
      : "(no remaining questions — form appears complete)";

  const systemInstructions = [
    "You are an empathetic but concise intake assistant for a legal/consumer protection form.",
    "Your job is to explain what has been collected so far from the user and what is still left in the form.",
    "You MUST NOT invent or guess any answers that are not present in the 'Answered fields' list.",
    "You can only describe information that exists in that list or in the form schema.",
    "If the user asks what you've learned about them so far, summarize the answered fields in 2–5 short sentences.",
    "If they ask what else is in the form or what's left, describe the remaining field labels in everyday language.",
    "If they ask both, do both: first a brief summary of what you've learned, then a short overview of what's left.",
    "Do NOT dump raw JSON or internal field keys. Use the human-friendly titles from the schema.",
    "Keep your response short, clear, and conversational. Avoid legalese.",
  ].join(" ");

  const context = [
    `User message: "${userMessage}"`,
    "",
    "Answered fields (title → value):",
    answeredBlock,
    "",
    "Remaining fields (titles only):",
    remainingBlock,
    "",
    "Full form schema (for your reference only, do NOT echo this back verbatim):",
    JSON.stringify(
      {
        type: schema.type,
        order,
        properties: Object.fromEntries(
          Object.entries(schema.properties).map(([key, def]) => [
            key,
            {
              title: def.title,
              description: def.description,
              kind: def.kind,
              // [FIX] Removed 'type' access; 'kind' is the discriminator in v1.5 schema
              options: def.options,
            },
          ])
        ),
      },
      null,
      2
    ),
  ].join("\n");

  const prompt = [
    "SYSTEM:",
    systemInstructions,
    "",
    "CONTEXT:",
    context,
    "",
    "ASSISTANT:",
  ].join("\n");

  const raw = await openaiClient(prompt);
  return raw.trim();
}