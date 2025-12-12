import { NextRequest, NextResponse } from "next/server";
// This import works in the backend because the file is named FormSchemaRepo.ts (PascalCase) there
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.ARGUEOS_API_KEY_PUBLIC) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { field, userMessage } = await req.json();
    
    // Stub Logic for V1
    const isQuestion = userMessage.includes("?");
    
    if (isQuestion) {
      return NextResponse.json({
        type: "chitchat",
        replyMessage: `Regarding "${field.title}": ${field.description || "This information helps us evaluate your claim."}`
      });
    } else {
      return NextResponse.json({
        type: "answer",
        extractedValue: userMessage,
        replyMessage: "Got it."
      });
    }

  } catch (error) {
    console.error("[Public Agent] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}