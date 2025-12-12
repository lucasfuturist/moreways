import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";
import { normalizeFormSchemaJsonShape } from "@/forms/util/forms.util.formSchemaNormalizer";
import { NextRequest, NextResponse } from "next/server";

// GET: List forms
export async function GET(req: NextRequest) {
  const user = await GetCurrentUserAsync(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const forms = await formSchemaRepo.listByOrg(user.organizationId);
  return NextResponse.json(forms);
}

// POST: Create new form (Manual Save)
export async function POST(req: NextRequest) {
  const user = await GetCurrentUserAsync(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, schema } = body;

    if (!schema) return NextResponse.json({ error: "Schema is required" }, { status: 400 });

    // Normalize to ensure safety/validity
    const safeSchema = normalizeFormSchemaJsonShape(schema);

    const newForm = await formSchemaRepo.createVersion({
      organizationId: user.organizationId,
      name: name || "Untitled Form",
      schemaJson: safeSchema,
    });

    return NextResponse.json(newForm);
  } catch (err) {
    console.error("Create Form Error:", err);
    return NextResponse.json({ error: "Failed to create form" }, { status: 500 });
  }
}