import { NextResponse } from "next/server";
import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";
import { FormSubmissionRepo } from "@/crm/repo/crm.repo.FormSubmissionRepo";

export async function GET(req: Request) {
  try {
    // 1. Auth Check
    const user = await GetCurrentUserAsync(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Query Params
    const { searchParams } = new URL(req.url);
    const formId = searchParams.get("formId") || undefined;

    // 3. Fetch Data (Scoped to Org)
    const submissions = await FormSubmissionRepo.findMany(user.organizationId, formId);

    // 4. Return as JSON
    return NextResponse.json(submissions);

  } catch (error) {
    console.error("[API] GetSubmissions Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}