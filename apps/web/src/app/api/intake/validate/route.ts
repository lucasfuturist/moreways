import { NextRequest, NextResponse } from "next/server";

const BRAIN_API_URL = process.env.BRAIN_API_URL || "http://localhost:3001";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData, intent } = body;

    console.log("[Gateway] 📡 Sending facts to The Brain (Judge)...");

    // 1. Try Real Backend
    try {
      const brainRes = await fetch(`${BRAIN_API_URL}/api/v1/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: intent || "General Consumer Issue",
          formData: formData,
          jurisdiction: "MA"
        })
      });

      if (brainRes.ok) {
        const data = await brainRes.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn("[Gateway] Brain unavailable, switching to Mock Verdict.");
    }

    // 2. FALLBACK (Mock Verdict)
    // This allows you to test the UI and Pixel even if the backend is down.
    await new Promise(r => setTimeout(r, 1500)); // Fake latency

    return NextResponse.json({
      data: {
        status: "LIKELY_VIOLATION",
        confidence_score: 0.85,
        analysis: {
          summary: "Based on the details provided, this appears to be a valid claim under local consumer protection laws. The timeline indicates a potential statutory violation.",
          missing_elements: [],
          strength_factors: ["Timely reporting", "Financial harm documented"],
          weakness_factors: []
        },
        relevant_citations: ["urn:lex:ma:93a:section_9"]
      }
    });

  } catch (error) {
    console.error("[Gateway] Validation Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}