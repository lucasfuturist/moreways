import { NextRequest, NextResponse } from "next/server";

// Configuration
const ENGINE_URL = process.env.ATTRIBUTION_ENGINE_URL || "http://localhost:3002";
const TRACK_ENDPOINT = `${ENGINE_URL}/api/v1/track`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // [FIX] Extract Key from Headers (Pixel sends it here) OR Body
    const publicKey = req.headers.get("x-publishable-key") || body.publicKey || "";
    
    // [DEBUG] 1. Verify Configuration
    console.log(`[Proxy] 🎯 Target: ${TRACK_ENDPOINT}`);
    console.log(`[Proxy] 🔑 Key: ${publicKey}`); // Log the actual resolved key
    console.log(`[Proxy] 📦 Event: ${body.type}`);

    // 2. Forward request to Attribution Engine
    const response = await fetch(TRACK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-key": publicKey, // [FIX] Use the resolved key variable
        // Forward IP for geolocation to work on the backend
        "x-forwarded-for": req.headers.get("x-forwarded-for") || "127.0.0.1",
        "user-agent": req.headers.get("user-agent") || ""
      },
      body: JSON.stringify(body)
    });

    // [DEBUG] 3. Log Result
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Proxy] ❌ Upstream Error (${response.status}): ${errorText}`);
    } else {
        const resJson = await response.json();
        console.log(`[Proxy] ✅ Success:`, resJson);
    }

    return NextResponse.json({ success: true });
    
  } catch (e: any) {
    // [DEBUG] 4. Network Failures
    console.error(`[Proxy] 💀 NETWORK CRASH:`, e.cause || e.message);
    // Still return success to client so UI doesn't break
    return NextResponse.json({ success: true }); 
  }
}