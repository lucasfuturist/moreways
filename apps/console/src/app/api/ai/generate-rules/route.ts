import { NextRequest, NextResponse } from "next/server";
import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";
import { LlmGenerateLogicFromPromptAsync } from "@/llm/svc/llm.svc.LlmGenerateLogicFromPromptAsync";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export async function POST(req: NextRequest) {
  // 1. Auth Check
  const user = await GetCurrentUserAsync(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { schema, prompt } = await req.json();

    if (!schema || !prompt) {
      return NextResponse.json({ error: "Schema and prompt required" }, { status: 400 });
    }

    // 2. Call Service
    const rules = await LlmGenerateLogicFromPromptAsync(
        schema as FormSchemaJsonShape, 
        prompt as string
    );

    return NextResponse.json({ rules });

  } catch (error) {
    console.error("[API] Generate Rules Failed:", error);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}