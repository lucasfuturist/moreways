import { NextRequest, NextResponse } from "next/server";
import { formSubmissionRepo } from "@/crm/repo/crm.repo.FormSubmissionRepo";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";
import { evaluateSubmissionFlags } from "@/forms/logic/forms.logic.evaluateSubmissionFlags";
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";

// [NEW] Configuration for the Attribution Engine
const ATTRIBUTION_ENGINE_URL = process.env.ATTRIBUTION_ENGINE_URL || "http://localhost:3000";
const TRACK_ENDPOINT = `${ATTRIBUTION_ENGINE_URL}/api/v1/track`;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_ATTRIBUTION_KEY || ""; // Must be set in Vercel/Railway Env

// [NEW] Function to close the loop
async function sendConversionToAttributionEngine(
  data: any, 
  submissionId: string
) {
    // 1. Extract IDs injected by the Moreways Pixel's hidden fields
    const anonymousId = data.mw_anonymous_id;
    const gclid = data.mw_gclid;
    
    if (!anonymousId && !gclid) return;

    try {
        await fetch(TRACK_ENDPOINT, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "x-publishable-key": PUBLIC_KEY
            },
            body: JSON.stringify({
                // Definitive conversion event
                type: "purchase", 
                anonymousId: anonymousId || "server-side-anon-fallback", 
                
                // Assumed consent since the user actively submitted a legal form
                consent: { ad_storage: "granted", analytics_storage: "granted" }, 
                
                context: {
                    url: "server-side-conversion-form-argueos",
                    user_agent: "ArgueOS-Backend/1.0"
                },
                
                // Pass IDs to ensure linkage and ad network optimization
                click: { gclid: gclid },
                
                data: {
                    value: 100, 
                    currency: "USD",
                    lead_source: "argueos_submission",
                    submission_id: submissionId
                }
            })
        });
        console.log(`[Attribution] ✅ Closed loop conversion sent for ${submissionId}`);

    } catch (e) {
        console.error("[Attribution] ❌ Failed to send closed loop conversion:", e);
        // Fail Open: Do not impede the core business function (saving the form)
    }
}


export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { formId, data, orgId } = body;

    if (!formId || !data || !orgId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch Schema to run Logic
    const form = await formSchemaRepo.getPublicById(formId);
    if (!form) {
        return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // 2. Calculate Flags
    const schema = normalizeFormSchemaJsonShape(form.schemaJson);
    const flags = evaluateSubmissionFlags(schema, data);

    // 3. Create Submission (Core Business Logic)
    const submission = await formSubmissionRepo.create({
      organizationId: orgId,
      formSchemaId: formId,
      submissionData: data,
      flags: flags
    });
    
    // 4. [CRITICAL] Close the Attribution Loop (Non-blocking)
    sendConversionToAttributionEngine(data, submission.id);

    return NextResponse.json({ 
        success: true, 
        id: submission.id,
        flagsDetected: flags.length 
    });

  } catch (e) {
    console.error("Public Submit Error", e);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}