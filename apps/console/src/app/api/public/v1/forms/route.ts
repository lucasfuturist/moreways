import { NextRequest, NextResponse } from "next/server";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const apiKey = req.headers.get("x-api-key");

  // [SECURITY] Simple API Key check
  if (apiKey !== process.env.ARGUEOS_API_KEY_PUBLIC) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  try {
    const form = await formSchemaRepo.getBySlug(slug);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // [FIX] Return 'schema' key (not 'fields') and pass the raw JSON
    return NextResponse.json({
      id: form.id,
      title: form.name,
      organizationId: form.organizationId,
      schema: form.schemaJson // <--- Direct pass-through of the seeded JSON
    });
  } catch (error) {
    console.error("[API] Public Form Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}