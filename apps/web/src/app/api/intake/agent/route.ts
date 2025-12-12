import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_ARGUEOS_API_BASE || "http://localhost:3001/api/public/v1";
const API_KEY = process.env.ARGUEOS_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Forward to ArgueOS Public Agent Endpoint
    const backendRes = await fetch(`${API_BASE}/agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY!,
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      // Fallback: If backend agent is down, return a generic response so UI doesn't crash
      return NextResponse.json({ 
        replyMessage: "I'm having trouble connecting to the legal brain right now. Please try filling this field manually.",
        type: "error"
      });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("[Proxy] Agent Error:", error);
    return NextResponse.json({ error: "Agent unavailable" }, { status: 500 });
  }
}