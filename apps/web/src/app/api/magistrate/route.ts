// apps/web/src/app/api/magistrate/route.ts
import { NextResponse } from "next/server";

const LAW_BASE_URL = process.env.LAW_BASE_URL || "http://localhost:3004";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = {
      intent: (body.prompt ?? body.intent ?? "").toString(),
      jurisdiction: (body.jurisdiction ?? "MA").toString(),
      formData: body.formData ?? {},
    };

    const upstream = await fetch(`${LAW_BASE_URL}/api/v1/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Magistrate proxy failed", details: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
