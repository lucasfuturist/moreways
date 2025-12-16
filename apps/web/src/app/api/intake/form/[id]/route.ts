import { NextResponse } from "next/server";
import { db } from "@/infra/db/client";
import { formSchemas } from "@/infra/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idOrSlug = params.id;
    
    // Fetch directly from DB using ID OR Slug
    const result = await db
      .select()
      .from(formSchemas)
      .where(or(
        eq(formSchemas.id, idOrSlug),
        eq(formSchemas.slug, idOrSlug)
      ))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const form = result[0];
    
    return NextResponse.json({
        id: form.id,
        name: form.name,
        slug: form.slug,
        schemaJson: form.schemaJson
    });

  } catch (error) {
    console.error("Fetch form error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}