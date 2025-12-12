// src/app/api/intake/get-schema-by-slug/route.ts

import { NextRequest, NextResponse } from "next/server";
import { argueosClient } from "@/lib/argueos-client";

// This is a secure server-side route that acts as a proxy.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    // argueosClient.getFormBySlug is a server-safe method that uses the API key.
    const form = await argueosClient.getFormBySlug(slug);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Return the full form object to the client
    return NextResponse.json(form);
    
  } catch (error) {
    console.error(`[Proxy Error] Failed to fetch schema for slug "${slug}":`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}