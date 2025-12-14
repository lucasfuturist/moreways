import { NextRequest, NextResponse } from "next/server";
import { formSubmissionRepo } from "@/crm/repo/crm.repo.FormSubmissionRepo";
import { db } from "@/infra/db/infra.repo.dbClient"; 

interface RouteContext {
  params: { formId: string };
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { submissionId, intent } = await req.json();

    const submission = await db.formSubmission.findUnique({ 
        where: { id: submissionId } 
    });

    if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

    const lawServiceUrl = process.env.LAW_SERVICE_URL || "http://localhost:3004";
    
    console.log(`[Assessment] Calling Law Engine at: ${lawServiceUrl}/api/v1/validate`); // [LOGGING UPDATED]

    try {
        // [FIX] Added '/v1' to match the Law Engine's server.ts configuration
        const magistrateRes = await fetch(`${lawServiceUrl}/api/v1/validate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                intent: intent || "General Legal Inquiry",
                jurisdiction: "MA", 
                formData: submission.submissionData
            })
        });

        if (!magistrateRes.ok) {
            const errorText = await magistrateRes.text();
            console.error(`[Assessment] Law Engine Failed (${magistrateRes.status}):`, errorText);
            return NextResponse.json({ error: `Law Engine: ${errorText}` }, { status: 502 });
        }

        const magistrateJson = await magistrateRes.json();
        await formSubmissionRepo.updateVerdict(submissionId, magistrateJson.data);

        return NextResponse.json({ success: true, verdict: magistrateJson.data });

    } catch (fetchError) {
        console.error(`[Assessment] Network Error connecting to Law Engine:`, fetchError);
        return NextResponse.json({ error: "Could not connect to Legal Brain" }, { status: 503 });
    }

  } catch (err) {
    console.error("[Assessment] Critical Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}