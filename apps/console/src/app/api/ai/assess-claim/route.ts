import { NextRequest, NextResponse } from "next/server";
import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";
import { LlmClaimAssessorAsync } from "@/llm/svc/llm.svc.LlmClaimAssessorAsync";

// [CRITICAL FIX] Prevent Static Generation
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth & Context
    const user = await GetCurrentUserAsync(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { submissionData, formName } = await req.json();

    if (!submissionData) {
        return NextResponse.json({ error: "No data to assess" }, { status: 400 });
    }

    // 2. Run the Assessor
    const assessment = await LlmClaimAssessorAsync({
        formTitle: formName || "Legal Intake",
        formData: submissionData
    });

    return NextResponse.json(assessment);

  } catch (error) {
    console.error("[API] Assessment Failed:", error);
    return NextResponse.json({ error: "Assessment failed" }, { status: 500 });
  }
}