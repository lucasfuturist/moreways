import { NextResponse } from "next/server";
import OpenAI from "openai";

const ROUTER_SYSTEM_PROMPT = `SYSTEM:
You are the intake router for a consumer-protection law firm.
You do NOT give legal advice. 
Your only job is to map the user's description of their issue to the closest matching form category.

RULES:
- Classify the issue into one of the predefined FORM TYPES below.
- If the user’s message is vague or incomplete, ask at most ONE clarifying question.
- Keep clarifying questions short (max 1 sentence).
- Never assume facts not stated.
- Never discuss legal outcomes, rights, strategies, or laws.
- If nothing fits cleanly, choose “General Consumer Complaint”.

FORM TYPES:
1. “Auto – Dealership or Repair”
2. “Debt Collection”
3. “Credit or Banking Problem”
4. “Retail or Services Dispute”
5. “Home Improvement / Contractor Issue”
6. “Housing – Landlord/Tenant Issue”
7. “Telemarketing / Robocall Issue”
8. “Scam / Fraud / Unfair Business Practice”
9. “General Consumer Complaint” (fallback)

OUTPUT FORMAT:
Respond ONLY with a JSON object in this format:

{
  "form_type": "string",
  "reason": "string",
  "needs_clarification": "yes" | "no",
  "clarification_question": "string" | null
}`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json(
        { message: "Service temporarily unavailable (configuration error)." },
        { status: 503 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ROUTER_SYSTEM_PROMPT },
        ...messages
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0].message.content || "{}";
    let parsed;
    
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI JSON", content);
      return NextResponse.json({ message: "System error processing response." });
    }

    let message = "";
    if (parsed.needs_clarification === "yes") {
      message = parsed.clarification_question;
    } else {
      message = `I understand. This looks like a ${parsed.form_type} issue. Routing you now...`;
    }

    return NextResponse.json({ 
      message, 
      router_data: parsed 
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}