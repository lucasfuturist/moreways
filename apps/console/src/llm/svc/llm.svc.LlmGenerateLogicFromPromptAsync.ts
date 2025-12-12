import { openaiClient } from "@/llm/adapter/llm.adapter.openai";
import { loadPrompt } from "@/llm/util/llm.util.promptLoader";
import { jsonParseSafe } from "@/llm/util/llm.util.jsonParseSafe";
import type { FormSchemaJsonShape, FieldLogicRule } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export interface LogicGenerationResult {
  targetFieldKey: string;
  rule: FieldLogicRule;
}

export async function LlmGenerateLogicFromPromptAsync(
  schema: FormSchemaJsonShape,
  userPrompt: string
): Promise<LogicGenerationResult[]> {
  
  const fieldsContext = Object.values(schema.properties).map(f => ({
    key: f.key,
    title: f.title,
    kind: f.kind
  }));

  const template = await loadPrompt("v1/generate-logic-rules.txt");
  const fullPrompt = template
    .replace("{{schema_context}}", JSON.stringify(fieldsContext, null, 2))
    .replace("{{user_prompt}}", userPrompt);

  const rawResponse = await openaiClient(fullPrompt);
  
  const parsed = jsonParseSafe(rawResponse);
  if (!parsed.success) {
    throw new Error("Failed to parse logic rules from AI.");
  }

  const data = parsed.value as { rules: LogicGenerationResult[] };
  
  if (!Array.isArray(data.rules)) return [];

  return data.rules.filter(r => {
    return schema.properties[r.targetFieldKey] !== undefined;
  });
}