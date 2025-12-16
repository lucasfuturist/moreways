import { NextRequest, NextResponse } from "next/server";
import { formSchemaRepo } from "@/forms/repo/forms.repo.FormSchemaRepo";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.ARGUEOS_API_KEY_PUBLIC) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  try {
    // MODE 1: fetch a single published form by slug
    if (slug) {
      const form = await formSchemaRepo.getBySlug(slug);

      if (!form) {
        return NextResponse.json({ error: "Form not found" }, { status: 404 });
      }

      return NextResponse.json({
        id: form.id,
        title: form.name,
        organizationId: form.organizationId,
        schema: form.schemaJson,
      });
    }

    // MODE 2: global published catalog (for router)
    const forms = await formSchemaRepo.listPublishedPublic();
    return NextResponse.json(forms);
  } catch (error) {
    console.error("[API] Public Forms Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
