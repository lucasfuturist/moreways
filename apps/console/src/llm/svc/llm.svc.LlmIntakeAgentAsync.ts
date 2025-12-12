import { openaiClient } from "@/llm/adapter/llm.adapter.openai";
import { jsonParseSafe } from "@/llm/util/llm.util.jsonParseSafe";

export interface SimpleMessage {
  role: "user" | "assistant";
  text: string;
}

interface IntakeAgentInput {
  fieldTitle: string;
  fieldKey: string; 
  fieldKind: string;
  fieldDescription?: string;
  userMessage: string;
  formContext: string;
  recentHistory: SimpleMessage[];
  schemaSummary: string;
  formDataSummary?: string;
}

export interface IntakeAgentResponse {
  type: "answer" | "question" | "chitchat";
  extractedValue?: any;
  replyMessage: string;
  updates?: Record<string, any>;
}

export async function LlmIntakeAgentAsync(input: IntakeAgentInput): Promise<IntakeAgentResponse> {
  const historyText = input.recentHistory
    .map(m => `${m.role.toUpperCase()}: "${m.text}"`)
    .join("\n");

  // [NEW] Provide context so AI can resolve "Yesterday" or "Last week"
  const todayISO = new Date().toISOString().split('T')[0];

  const prompt = `
    SYSTEM:
    You are an intelligent legal intake engine designed for "Deep Listening".
    You are currently filling out: "${input.formContext}".
    
    TODAY'S DATE: ${todayISO}

    --- FORMATTING RULES (STRICT) ---
    1. **Dates:** MUST be ISO 8601 (YYYY-MM-DD). If user says "Yesterday", calculate it based on today's date.
    2. **Phone:** Standardize to (XXX) XXX-XXXX.
    3. **Address:** Try to format as "Street, City, State Zip".
    4. **Currency:** Remove symbols, return raw number (e.g. 50000, not $50k).
    5. **Booleans:** Return true/false (not "yes"/"no" strings).

    --- CONTEXT ---
    
    1. CURRENT TARGET: 
       Extract data for: "${input.fieldTitle}" (Key: "${input.fieldKey}", Type: ${input.fieldKind}).
       Context: ${input.fieldDescription || "None"}.

    2. ALL AVAILABLE SCHEMA FIELDS (Key: Title):
    ${input.schemaSummary}

    3. DATA ALREADY COLLECTED (Read this to check for contradictions):
    ${input.formDataSummary || "(No data collected yet)"}

    4. RECENT CHAT:
    ${historyText || "(No recent history)"}

    5. USER INPUT:
    "${input.userMessage}"

    --- MISSION ---

    Your job is to harvest data. The user might answer the current question, but they might also provide information for OTHER fields, or correct previous information.

    RULES:
    1. **Primary Extraction:** Try to extract the value for the CURRENT TARGET ("${input.fieldTitle}").
    2. **Side-Loading:** Aggressively scan the USER INPUT for data matching ANY OTHER field in the SCHEMA. If found, include it in the "updates" object.
       - Example: If asked for "First Name" and user says "I'm Jane Doe", extract "Jane" for current, and add { "lastName": "Doe" } to updates.
    3. **Contradiction Check:** If the user provides new info that conflicts with "DATA ALREADY COLLECTED", do NOT overwrite silently. 
       - Return type "question" and ask for clarification (e.g. "Wait, earlier you said X, but now you're saying Y...").

    --- RESPONSE FORMAT (JSON) ---

    { 
      "type": "answer" | "question" | "chitchat",
      
      // The value for the CURRENT TARGET (${input.fieldKey})
      "extractedValue": ... or null,
      
      // Any OTHER fields discovered in this turn (Key: Value)
      "updates": { 
        "otherFieldKey": "value",
        "anotherFieldKey": "value" 
      },
      
      // What to say to the user.
      // If "answer": Acknowledge briefly (e.g. "Got it."). 
      // If "question": Ask the clarification.
      "replyMessage": "..." 
    }
  `;

  try {
    const raw = await openaiClient(prompt);
    const parsed = jsonParseSafe<IntakeAgentResponse>(raw);
    
    if (parsed.success) return parsed.value;
    
    // Fallback
    return { 
        type: "question", 
        replyMessage: "I missed that. Could you say it again?" 
    };
  } catch (e) {
    console.error("Intake Agent Error:", e);
    return { 
        type: "question", 
        replyMessage: "I'm having trouble connecting right now. Please try again." 
    };
  }
}