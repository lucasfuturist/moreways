import { NextRequest, NextResponse } from "next/server";
import { LlmPromptCriticAsync } from "@/llm/svc/llm.svc.LlmPromptCriticAsync";
import type { PromptCriticInput } from "@/llm/schema/llm.schema.PromptCriticTypes";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Basic validation
    if (!body.turns || !Array.isArray(body.turns) || body.turns.length === 0) {
      return NextResponse.json({ error: "Valid transcript 'turns' required." }, { status: 400 });
    }

    const input: PromptCriticInput = {
      formName: body.formName || "Unknown Form",
      fieldTitle: body.fieldTitle || "Unknown Field",
      fieldKind: body.fieldKind || "text",
      schemaSummary: body.schemaSummary || "Not available",
      turns: body.turns,
    };

    const critique = await LlmPromptCriticAsync(input);

    return NextResponse.json(critique);

  } catch (error) {
    console.error("[API] Critique Error:", error);
    return NextResponse.json({ error: "Critique failed" }, { status: 500 });
  }
}