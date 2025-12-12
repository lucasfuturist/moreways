import { NextRequest, NextResponse } from "next/server";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { buildSimpleIntakeSnapshot } from "@/intake/logic/SimpleIntakeEngine";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";

/**
 * POST body accepted:
 *  - { schema: FormSchemaJsonShape, formData?: Record<string, any> }
 *  - OR { formId: string, formData?: Record<string, any> }
 *
 * Response: { snapshot: { schema, allFields, filled, unfilled } }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let schema = body?.schema as FormSchemaJsonShape | undefined;
    const formData = body?.formData ?? {};

    // If schema not provided but formId is, try to load from repo
    if (!schema && body?.formId) {
      try {
        const form = await formSchemaRepo.getPublicById(body.formId);
        if (form) {
          schema = form.schemaJson;
        }
      } catch (e: any) {
        // intentionally silent — we'll return a helpful error below if schema still missing
        console.warn("[/api/intake/snapshot] could not load schema from repo:", e?.message ?? e);
      }
    }

    if (!schema) {
      return NextResponse.json({ error: "No schema provided and no schema found for formId." }, { status: 400 });
    }

    const snapshot = buildSimpleIntakeSnapshot(schema, formData);
    return NextResponse.json({ snapshot });
  } catch (err) {
    console.error("[/api/intake/snapshot] error:", err);
    return NextResponse.json({ error: "Failed to build snapshot." }, { status: 500 });
  }
}