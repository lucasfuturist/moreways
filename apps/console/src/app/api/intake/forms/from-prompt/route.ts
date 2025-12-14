import { NextRequest, NextResponse } from "next/server";
import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";
import { IntakeCreateFormFromPromptAsync } from "@/intake/svc/intake.svc.IntakeCreateFormFromPromptAsync";
import { logger } from "@/infra/logging/infra.svc.logger";

export async function POST(req: NextRequest) {
  // 1. Auth Check
  const user = await GetCurrentUserAsync(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Parse Body
    const body = await req.json();
    const { prompt, formName, history, scopedFieldKey } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 3. Execute Pipeline
    // [SECURITY] We forcibly inject the user's organizationId. 
    // This prevents them from creating forms in other tenants.
    const result = await IntakeCreateFormFromPromptAsync({
        prompt,
        formName: formName || "New AI Form",
        history: history || [],
        scopedFieldKey,
        organizationId: user.organizationId, // <--- Enforce Multi-tenancy
        currentSchema: body.currentSchema 
    }, {
        organizationId: user.organizationId
    });

    return NextResponse.json(result);

  } catch (error: any) {
    logger.error("Form Generation Failed", { error });
    return NextResponse.json(
        { error: error.message || "Internal Server Error" }, 
        { status: 500 }
    );
  }
}