import { NextRequest, NextResponse } from "next/server";
import { openaiClient } from "@/llm/adapter/llm.adapter.openai";

export async function POST(req: NextRequest) {
  try {
    const { history, persona } = await req.json();
    const lastMessage = history[history.length - 1]?.content || "Hello";

    const systemPrompt = `
      ROLE: You are playing the role of a user filling out a legal intake form.
      PERSONA: ${persona || "Standard Client (Cooperative, concise, clear)."}
      
      TASK: Respond to the intake agent's last question.
      
      AGENT ASKED: "${lastMessage}"

      GUIDELINES:
      1. Stay in character.
      2. Keep answers relatively short (like a chat), unless the persona is "Talkative".
      3. If the agent asks for a date/name/fact, invent a consistent one.
      4. Do NOT output "User:", just the text.
    `;

    const reply = await openaiClient(systemPrompt, {
      model: "gpt-4o", // Use 4o for better roleplay
      temperature: 0.8, // High creativity for variation
      jsonMode: false
    });

    return NextResponse.json({ reply });

  } catch (error) {
    return NextResponse.json({ reply: "Error simulating user." }, { status: 500 });
  }
}