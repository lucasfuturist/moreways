import { NextRequest, NextResponse } from "next/server";
import { LlmGenerateSuggestionsAsync } from "@/llm/svc/llm.svc.LlmGenerateSuggestionsAsync";

export async function POST(req: NextRequest) {
  try {
    const { schema, history } = await req.json();
    
    const suggestions = await LlmGenerateSuggestionsAsync(schema, history);
    
    return NextResponse.json({ suggestions });
  } catch (e) {
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}