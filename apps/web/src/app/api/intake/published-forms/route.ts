import { NextResponse } from "next/server";
import { db } from "@/infra/db/client";
import { formSchemas } from "@/infra/db/schema";
import { and, eq, isNotNull } from "drizzle-orm";

// Cache the list for 1 minute to reduce DB load
export const revalidate = 60; 

export async function GET() {
  try {
    const forms = await db
      .select({
        id: formSchemas.id,
        name: formSchemas.name,
        slug: formSchemas.slug,
      })
      .from(formSchemas)
      .where(
        and(
          eq(formSchemas.isPublished, true),
          eq(formSchemas.isDeprecated, false),
          isNotNull(formSchemas.slug)
        )
      );

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Failed to fetch published forms:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}