import { NextRequest, NextResponse } from "next/server";
import { openaiClient } from "@/llm/adapter/llm.adapter.openai";
import { logger } from "@/infra/logging/infra.svc.logger";

export async function POST(req: NextRequest) {
  try {
    const { nextField, prevField, prevValue, formName } = await req.json();

    if (!nextField) {
      return NextResponse.json({ message: "What would you like to add next?" });
    }

    // 1. Construct a focused prompt for the transition
    // We only provide immediate context to keep it fast and focused.
    const systemPrompt = `
You are an empathetic, professional legal intake assistant helping a client fill out a "${formName}".
Your goal is to ask the next question naturally, like a human conversation, not a robot reading a list.

CONTEXT:
${prevField 
  ? `The user just answered "${prevField.title}" with: "${prevValue}".` 
  : "This is the very first question of the session."}

TASK:
Ask for the next field: "${nextField.title}".
${nextField.description ? `Context for this field: ${nextField.description}` : ""}

GUIDELINES:
1. If there was a previous answer, briefly acknowledge it (e.g., "I see," "I'm sorry to hear that," "Got it") before asking the next question.
2. If the previous answer was sensitive (injuries, death, loss), show empathy.
3. Keep it brief. 1-2 sentences max.
4. Do NOT verify the previous answer ("Okay, you said X"). Just accept it and move on.
5. Return ONLY the text of the question.
    `.trim();

    // 2. Call LLM (Low temp for consistent style, but high enough for natural variation)
    const message = await openaiClient(systemPrompt, {
        model: "gpt-4o", // or gpt-3.5-turbo for speed, but 4o is smoother
        temperature: 0.7,
        jsonMode: false
    });

    return NextResponse.json({ message });

  } catch (error: any) {
    logger.error("Talk API Error", error);
    // Fallback if AI fails
    return NextResponse.json({ message: "Could you please provide the next item?" }, { status: 500 });
  }
}