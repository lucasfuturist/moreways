import { NextRequest, NextResponse } from "next/server";
import { db } from "@/infra/db/infra.repo.dbClient";

interface RouteContext {
  params: { id: string };
}

export async function GET(req: NextRequest, context: RouteContext) {
  // [SECURITY] This endpoint exposes Form Structure (Titles, Questions).
  // It does NOT expose submission data.
  // We allow public access so the intake runner can load.

  try {
    const form = await db.formSchema.findUnique({
      where: { id: context.params.id },
      select: {
        id: true,
        organizationId: true,
        name: true,
        schemaJson: true,
        isPublished: true
      }
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({
        id: form.id,
        organizationId: form.organizationId,
        name: form.name,
        schema: form.schemaJson
    });

  } catch (err) {
    console.error("Public Schema Fetch Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}