import { NextRequest, NextResponse } from "next/server";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import type { FormFieldValues } from "@/forms/schema/forms.schema.FormFieldValues";
import { buildSimpleIntakeSnapshot } from "@/intake/logic/SimpleIntakeEngine";

// [FIX] Correct Import Path for the caller
import { callExtractionModel } from "@/llm/svc/llm.svc.DialogModelCaller"; 

// [FIX] Correct Import Path for the type
import type { ExtractionResult } from "@/llm/schema/llm.schema.ExtractionResult";

import {
  mergeExtractionIntoFormData,
} from "@/forms/logic/forms.logic.mergeExtraction";

/**
 * POST /api/intake/turn
 *
 * Body:
 * {
 *   schema: FormSchemaJsonShape;
 *   currentData: FormFieldValues;
 *   userMessage: string;
 *   formName?: string;
 *   history?: { role: "user" | "assistant"; content: string }[];
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const schema = body?.schema as FormSchemaJsonShape | undefined;
    const currentData = (body?.currentData ?? {}) as FormFieldValues;
    const userMessage = String(body?.userMessage ?? "").trim();
    const formName =
      typeof body?.formName === "string" && body.formName.trim().length > 0
        ? body.formName.trim()
        : "Intake Form";

    const history = Array.isArray(body?.history) ? body.history : [];

    if (!schema) {
      return NextResponse.json({ error: "Missing form schema" }, { status: 400 });
    }

    if (!userMessage) {
      return NextResponse.json({ error: "Missing userMessage" }, { status: 400 });
    }

    // 1) Build snapshot (Optional, helpful for debugging logs)
    const snapshot = buildSimpleIntakeSnapshot(schema, currentData);

    // 2) Call the extraction model
    const extraction: ExtractionResult = await callExtractionModel({
      formName,
      schema,
      currentValues: currentData,
      traits: {}, 
      userMessage,
      // [FIX] Explicitly type the history item 'h' to resolve implicit 'any' error
      history: history.map((h: { role: string; content: string }) => ({ 
        role: h.role === "user" ? "user" : "assistant", 
        text: h.content 
      })),
    });

    // 3) Merge into the existing form state
    const mergeResult = mergeExtractionIntoFormData(
      currentData,
      extraction,
      schema
    );

    const updatedData = mergeResult.nextFormData;

    // 4) Build a simple reply message
    let replyMessage = "Got it.";
    
    // Check if extraction has explicit clarifications
    if (extraction.clarifications && extraction.clarifications.length > 0) {
        replyMessage = extraction.clarifications[0].question;
    } else {
        replyMessage = "I've updated the form with that information.";
    }

    return NextResponse.json({
      updatedData,
      replyMessage,
      extraction,
      debugLog: [
        { label: "📄 FULL JSON STATE", data: snapshot }
      ]
    });

  } catch (err) {
    console.error("[/api/intake/turn] error:", err);
    return NextResponse.json(
      { error: "Failed to process intake turn" },
      { status: 500 }
    );
  }
}