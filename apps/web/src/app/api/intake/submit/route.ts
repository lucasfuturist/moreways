import { NextRequest, NextResponse } from "next/server";

const FACTORY_API_URL = process.env.FACTORY_API_URL || "http://localhost:3002";
const API_KEY = process.env.ARGUEOS_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Proxy to Factory CRM
    const res = await fetch(`${FACTORY_API_URL}/api/public/v1/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Factory rejected submission");
    
    const data = await res.json();
    return NextResponse.json(data);

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}