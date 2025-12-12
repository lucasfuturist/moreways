import { openaiClient } from "@/llm/adapter/llm.adapter.openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { field, operation } = await req.json();
  
  let prompt = "";
  if (operation === "polish") {
    prompt = `Rewrite this form field label to be more professional, empathetic, and clear for a legal client. Return JSON: { "title": "new title", "placeholder": "new placeholder" }. Input: ${JSON.stringify(field)}`;
  } else if (operation === "translate") {
    prompt = `Translate this field label to Spanish. Return JSON: { "title": "${field.title} (Spanish Translation)" }. Input: ${JSON.stringify(field)}`;
  }

  try {
    const completion = await openaiClient(prompt);
    return NextResponse.json(JSON.parse(completion));
  } catch (e) {
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}