// src/app/api/intake/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { SimpleIntakeSnapshot } from "@/intake/logic/SimpleIntakeEngine";
import { buildSimpleIntakeSnapshot } from "@/intake/logic/SimpleIntakeEngine";
import { buildDeterministicReviewReply } from "@/llm/svc/llm.svc.SimpleReviewSync";

/**
 * POST body shape accepted:
 *  - { snapshot: SimpleIntakeSnapshot, userMessage: string }
 *  OR
 *  - { schema: FormSchemaJsonShape, formData: Record<string, any>, userMessage: string }
 *
 * This route is intentionally tolerant for frontends that haven't migrated to sending snapshot.
 */
export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    // Safety: log a tiny hint (not full PII) to server console for debugging
    console.info("[/api/intake/review] incoming review request. keys:", Object.keys(raw));

    const userMessage = String(raw?.userMessage ?? "").trim();
    if (!userMessage) {
      return NextResponse.json({ reply: "I couldn't see your question — try asking again." }, { status: 400 });
    }

    let snapshot: SimpleIntakeSnapshot | undefined = raw?.snapshot;

    // If snapshot wasn't provided (legacy clients), try to build it from schema+formData
    if (!snapshot && raw?.schema && raw?.formData) {
      try {
        snapshot = buildSimpleIntakeSnapshot(raw.schema, raw.formData);
      } catch (err) {
        console.warn("[/api/intake/review] failed to build snapshot from schema+formData:", err);
      }
    }

    if (!snapshot) {
      // Last resort: respond clearly so caller can surface a friendly message
      return NextResponse.json({ reply: "I couldn't find the form snapshot. Please try again or continue with the next question." }, { status: 400 });
    }

    const reply = buildDeterministicReviewReply(snapshot, userMessage);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[/api/intake/review] unexpected error:", err);
    return NextResponse.json({ reply: "Unable to produce a review right now. Try again." }, { status: 500 });
  }
}
