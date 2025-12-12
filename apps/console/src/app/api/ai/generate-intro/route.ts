import { NextRequest, NextResponse } from "next/server";
import { openaiClient } from "@/llm/adapter/llm.adapter.openai";

export async function POST(req: NextRequest) {
  try {
    const { formName, schemaSummary } = await req.json();

    const prompt = `
      SYSTEM:
      You are "Moreways Assistant", a professional, empathetic legal intake bot.
      
      CONTEXT:
      - Form Name: "${formName}"
      - Fields involved: ${schemaSummary}

      TASK:
      Write a warm, 1-sentence opening statement to the user.
      - Acknowledge what we are doing (e.g. "assessing your injury claim", "gathering details for your contract").
      - Set a professional tone.
      - Do NOT ask the first question (I will append that later).
      - Do NOT say "Hello" or "Hi" (I will handle the greeting).
      
      EXAMPLE OUTPUTS:
      - "I'm here to help gather the necessary details to evaluate your potential claim."
      - "To get this NDA drafted quickly, I just need to collect a few key details about the parties involved."
      - "I'll guide you through documenting the incident so our legal team can review your case."
    `;

    const intro = await openaiClient(prompt, { temperature: 0.7, jsonMode: false });
    
    // Clean up quotes if the LLM adds them
    const cleanIntro = intro.replace(/^"|"$/g, '').trim();

    return NextResponse.json({ intro: cleanIntro });

  } catch (error) {
    console.error("Intro Gen Error:", error);
    // Fallback if AI fails
    return NextResponse.json({ intro: "I'm ready to help you with this intake. We just need a few details to get started." });
  }
}