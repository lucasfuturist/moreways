import { NextRequest, NextResponse } from "next/server";
import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";

interface Context {
  params: { id: string };
}

// GET: Fetch single form
export async function GET(req: NextRequest, { params }: Context) {
  const user = await GetCurrentUserAsync(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await formSchemaRepo.getById({
    organizationId: user.organizationId,
    id: params.id
  });

  if (!form) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(form);
}

// PUT: Save (Create New Version)
export async function PUT(req: NextRequest, { params }: Context) {
  const user = await GetCurrentUserAsync(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const currentForm = await formSchemaRepo.getById({
        organizationId: user.organizationId,
        id: params.id
    });

    if (!currentForm) return NextResponse.json({ error: "Form not found" }, { status: 404 });

    const body = await req.json();
    const { schema } = body; // Expecting { schema: ... }

    if (!schema) return NextResponse.json({ error: "Schema required" }, { status: 400 });

    const safeSchema = normalizeFormSchemaJsonShape(schema);

    // [VERSIONING LOGIC]
    // We create a NEW row with the SAME name but incremented version.
    const newVersion = await formSchemaRepo.createVersion({
        organizationId: user.organizationId,
        name: currentForm.name,
        schemaJson: safeSchema
    });

    return NextResponse.json(newVersion);

  } catch (err) {
    console.error("Update Form Error:", err);
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 });
  }
}

// DELETE: Archive Form
export async function DELETE(req: NextRequest, { params }: Context) {
  const user = await GetCurrentUserAsync(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await formSchemaRepo.softDelete({
        organizationId: user.organizationId,
        id: params.id
    });
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete Form Error:", err);
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 });
  }
}