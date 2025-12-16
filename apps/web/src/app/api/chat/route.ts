import { NextResponse } from "next/server";
import OpenAI from "openai";
import { argueosClient } from "@/lib/argueos-client";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "Service unavailable." },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const { messages } = await req.json();

    // 🔹 Fetch REAL published forms
    const forms = await argueosClient.listForms();

    const catalog = forms
      .filter((f) => f.slug)
      .map((f) => `- ${f.name} (slug: ${f.slug})`)
      .join("\n");

    const systemPrompt = `
You are the intake router for a consumer-protection law firm.

Your job is to route the user to ONE real intake form.

AVAILABLE FORMS (USE slug EXACTLY):
${catalog}

RULES:
- Choose the best matching form.
- If unclear, ask ONE short clarification question.
- Never invent a slug.
- Never discuss legal advice, rights, or outcomes.

OUTPUT JSON:
{
  "needs_clarification": boolean,
  "clarification_question": string | null,
  "router_decision": {
    "form_slug": string | null,
    "confidence": number
  }
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    const raw = response.choices[0].message.content || "{}";
    const parsed = JSON.parse(raw);

    let message = "";
    if (parsed.needs_clarification) {
      message = parsed.clarification_question;
    } else {
      message = "Thanks — routing you to the correct intake now.";
    }

    return NextResponse.json({
      message,
      router_data: parsed,
    });
  } catch (error) {
    console.error("Chat Router Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
