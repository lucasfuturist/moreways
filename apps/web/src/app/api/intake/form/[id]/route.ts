import { NextRequest, NextResponse } from "next/server";

const FACTORY_API_URL = process.env.FACTORY_API_URL || "http://localhost:3002";
const API_KEY = process.env.ARGUEOS_API_KEY || "";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formId = params.id;
    console.log(`[Gateway] 📥 Fetching Schema for: ${formId}`);

    // Call Factory Public API
    const res = await fetch(`${FACTORY_API_URL}/api/public/v1/forms?id=${formId}`, {
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      console.error(`[Gateway] Factory Error: ${res.status}`);
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("[Gateway] Schema Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}