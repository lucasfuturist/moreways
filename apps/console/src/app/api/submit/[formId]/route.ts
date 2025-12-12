import { NextRequest, NextResponse } from "next/server";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";
import { formSubmissionRepo } from "@/crm/repo/crm.repo.FormSubmissionRepo";
import { evaluateSubmissionFlags } from "@/forms/logic/forms.logic.evaluateSubmissionFlags";
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";
import { RateLimiter } from "@/infra/security/security.svc.rateLimiter"; // [NEW]

interface RouteContext {
  params: { formId: string };
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    // 1. [SECURITY] Rate Limit Public Submissions
    await RateLimiter.check({ interval: 60_000, limit: 10 }); // Strict: 10/min per IP

    const body = await req.json();
    const { data, _hp } = body; // _hp is the honeypot

    // 2. [SECURITY] Honeypot Check
    // If _hp has any value, it's a bot.
    if (_hp && String(_hp).length > 0) {
        console.warn("[Security] Bot detected via honeypot.");
        // Return fake success to confuse the bot
        return NextResponse.json({ success: true, submissionId: "bot-rejected" });
    }

    if (!data) {
      return NextResponse.json({ error: "No submission data provided" }, { status: 400 });
    }

    const formId = context.params.formId;
    const form = await formSchemaRepo.getPublicById(formId);

    if (!form) {
        return NextResponse.json({ error: "Form not found or unpublished" }, { status: 404 });
    }

    const schema = normalizeFormSchemaJsonShape(form.schemaJson);
    const flags = evaluateSubmissionFlags(schema, data);

    const submission = await formSubmissionRepo.create({
        organizationId: form.organizationId,
        formSchemaId: form.id,
        submissionData: data,
        flags: flags
    });

    return NextResponse.json({ 
        success: true, 
        submissionId: submission.id,
        flagsDetected: flags.length 
    });

  } catch (err: any) {
    if (err.message === "RATE_LIMIT_EXCEEDED") {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }
    console.error("Submission Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}