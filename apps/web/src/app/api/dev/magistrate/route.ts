import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  intent?: string;
  jurisdiction?: "MA" | "FED";
  formData?: Record<string, any>;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const intent = (body.intent || "").trim();
    const jurisdiction = (body.jurisdiction || "MA") as "MA" | "FED";
    const formData = body.formData && typeof body.formData === "object" ? body.formData : {};

    if (!intent) {
      return NextResponse.json({ error: "Missing intent." }, { status: 400 });
    }

    const base = process.env.LAW_SERVICE_URL?.trim();
    if (!base) {
      return NextResponse.json(
        {
          error:
            "LAW_SERVICE_URL is not set. Set it in apps/web/.env.local to your law service base URL.",
        },
        { status: 500 }
      );
    }

    const path = (process.env.LAW_VALIDATE_PATH || "/validate").trim();
    const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Matches your ValidationRequestSchema shape.
      body: JSON.stringify({ intent, jurisdiction, formData }),
    });

    const text = await upstream.text();
    let json: any = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      // If the upstream didn't return JSON, bubble raw text.
      json = { raw: text };
    }

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: json?.error || `Law service error (${upstream.status})`,
          details: json,
          url,
        },
        { status: 502 }
      );
    }

    // Expecting { verdict: ... } OR just the verdict object.
    const verdict = json?.verdict ?? json;

    return NextResponse.json({ verdict }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown server error." },
      { status: 500 }
    );
  }
}
