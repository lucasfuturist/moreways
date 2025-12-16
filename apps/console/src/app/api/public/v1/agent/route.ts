import { NextRequest, NextResponse } from "next/server";
import { LlmIntakeAgentAsync } from "@/llm/svc/llm.svc.LlmIntakeAgentAsync";
import { logger } from "@/infra/logging/infra.svc.logger";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.ARGUEOS_API_KEY_PUBLIC) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const input = await req.json();
    const result = await LlmIntakeAgentAsync(input);
    return NextResponse.json(result);
  } catch (err) {
    logger.error("Public Agent Route Error", err);
    return NextResponse.json(
      { error: "Agent failed", message: "Could not process intake field" },
      { status: 500 }
    );
  }
}
