import { openaiClient } from "@/llm/adapter/llm.adapter.openai";
import { logger } from "@/infra/logging/infra.svc.logger";
import { jsonParseSafe } from "@/llm/util/llm.util.jsonParseSafe";

interface IntakeAgentInput {
  field: { title: string; kind: string; description?: string };
  userMessage: string;
  formName: string;
  history: { role: string; text: string }[];
  schemaSummary: string;
  formData: Record<string, any>;
}

export interface IntakeAgentResponse {
  type: "answer" | "question" | "chitchat";
  extractedValue?: any;
  updates?: Record<string, any>;
  replyMessage?: string;
}

export async function LlmIntakeAgentAsync(input: IntakeAgentInput): Promise<IntakeAgentResponse> {
  const { field, userMessage, formName, history, formData } = input;

  // 1. Detect Context
  const lastAgentMsg = history.filter(h => h.role === 'assistant').pop()?.text || "";
  const isClarificationContext = lastAgentMsg.toLowerCase().includes("clarify") || lastAgentMsg.toLowerCase().includes("earlier you mentioned");

  const systemPrompt = `
    ROLE: You are an intelligent Intake Assistant for a law firm.
    GOAL: Extract data for the field: "${field.title}" (${field.kind}).
    
    CURRENT STATE:
    - Form: ${formName}
    - Field Description: ${field.description || "N/A"}
    - Current Known Data: ${JSON.stringify(formData)}
    - Context: ${isClarificationContext ? "⚠️ YOU JUST ASKED FOR CLARIFICATION." : "Standard data collection."}

    USER INPUT: "${userMessage}"

    LOGIC GATES:
    1. RESOLUTION CHECK: If Context is clarification, did they resolve it? (Yes/Correct/Explanation) -> ACCEPT.
    2. EXTRACTION: Can you extract a valid answer? -> type="answer".
    3. CLARIFICATION: Only if explicit contradiction with PREVIOUSLY SAVED fact. Adding detail is NOT a conflict.

    OUTPUT FORMAT (JSON):
    {
      "type": "answer" | "question" | "chitchat",
      "extractedValue": any | null,
      "updates": { "otherFieldKey": "value" },
      "replyMessage": string
    }
  `;

  try {
    const raw = await openaiClient(systemPrompt, {
      model: "gpt-4o", 
      temperature: 0,
      jsonMode: true
    });

    // [FIX] Unwrap the safe parse result
    const parsed = jsonParseSafe<IntakeAgentResponse>(raw);
    
    if (parsed.success) {
        return parsed.value;
    }
    
    logger.warn("Intake Agent JSON Parse Failed", { error: parsed.error });
    // Fallback
    return { type: "answer", extractedValue: userMessage };

  } catch (err) {
    logger.error("Intake Agent Error", err);
    // Fallback
    return { type: "answer", extractedValue: userMessage };
  }
}