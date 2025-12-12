import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

// GET: Load a saved form
export async function GET(req: NextRequest, context: RouteContext) {
  const user = await GetCurrentUserAsync(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await formSchemaRepo.getById({
    organizationId: user.organizationId,
    id: context.params.id,
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  return NextResponse.json(form);
}

// PUT: Update/Save a form
export async function PUT(req: NextRequest, context: RouteContext) {
  const user = await GetCurrentUserAsync(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { schema, name } = body;

    if (!schema) return NextResponse.json({ error: "Schema is required" }, { status: 400 });

    // 1. Check existence
    const existing = await formSchemaRepo.getById({
      organizationId: user.organizationId,
      id: context.params.id,
    });

    if (!existing) {
      return NextResponse.json({ error: "Form to update not found" }, { status: 404 });
    }

    // 2. Normalize
    const safeSchema = normalizeFormSchemaJsonShape(schema);

    // 3. Create new version
    const newVersion = await formSchemaRepo.createVersion({
      organizationId: user.organizationId,
      name: name || existing.name,
      schemaJson: safeSchema,
    });

    return NextResponse.json(newVersion);

  } catch (err) {
    console.error("[API] Update Form Error:", err);
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 });
  }
}