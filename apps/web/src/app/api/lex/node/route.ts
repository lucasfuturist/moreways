import { NextRequest, NextResponse } from "next/server";

const BRAIN_API_URL = process.env.BRAIN_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  try {
    // 1. Extract URN from Query String (?urn=...)
    const { searchParams } = new URL(req.url);
    const urn = searchParams.get("urn");

    if (!urn) {
      return NextResponse.json({ error: "URN is required" }, { status: 400 });
    }
    
    console.log(`[Gateway] 🔍 Proxying lookup for URN: ${urn}`);

    // 2. Forward to Brain
    // Note: We MUST encode the URN here because it becomes part of the Brain's URL path
    const targetUrl = `${BRAIN_API_URL}/api/v1/node/${encodeURIComponent(urn)}`;
    
    const brainRes = await fetch(targetUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store" // Prevent Next.js from caching stale errors
    });

    if (!brainRes.ok) {
        console.warn(`[Gateway] Brain returned ${brainRes.status} for ${urn}`);
        return NextResponse.json({ error: "Node not found in Knowledge Graph" }, { status: 404 });
    }

    const data = await brainRes.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("[Gateway] Node Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}