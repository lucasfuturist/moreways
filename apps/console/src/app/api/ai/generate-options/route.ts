import { NextRequest, NextResponse } from "next/server";
import { openaiClient } from "@/llm/adapter/llm.adapter.openai";

export async function POST(req: NextRequest) {
  try {
    const { label, context } = await req.json();
    
    if (!label) return NextResponse.json({ error: "Label required" }, { status: 400 });

    const prompt = `
      You are a helper for a form builder.
      Generate a list of standardized options for a select/dropdown field labeled: "${label}".
      Context: ${context || "General purpose form"}.
      
      Return a JSON object strictly:
      {
        "options": [
          { "label": "Display Text", "value": "internal_value" }
        ]
      }
      
      Rules:
      - Max 50 items.
      - Use snake_case for values.
      - If it's a list of US States, include all 50.
      - If it's Yes/No, just return those.
    `;

    const raw = await openaiClient(prompt);
    // Simple parse (assuming the adapter returns clean JSON or we use the util)
    // ideally reuse jsonParseSafe but for brevity:
    const data = JSON.parse(raw);
    
    return NextResponse.json(data);

  } catch (error) {
    console.error("Options Gen Error:", error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}