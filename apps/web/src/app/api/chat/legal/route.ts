import { NextRequest, NextResponse } from "next/server";

const BRAIN_API_URL = process.env.BRAIN_API_URL || "http://localhost:3001";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]; // User's latest query

    console.log("[Gateway] ⚖️ Consulting the Law Library...");

    // 1. Call Hybrid Search + Synthesis
    const brainRes = await fetch(`${BRAIN_API_URL}/api/v1/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: lastMessage.content,
        jurisdiction: "MA"
      })
    });

    if (!brainRes.ok) throw new Error("Brain search failed");

    const brainJson = await brainRes.json();
    const { answer, context } = brainJson.data;

    // 2. Format for the UI
    // We return the text answer + structured citations for the UI to render cards
    return NextResponse.json({
      role: "assistant",
      content: answer,
      citations: context.ancestry.map((node: any) => ({
        urn: node.urn,
        title: node.urn.split(':').pop(), // Simple title extraction
        text: node.content_text,
        similarity: 0.99 // Mock score or pass through from search
      }))
    });

  } catch (error) {
    console.error("[Gateway] Legal Chat Error:", error);
    return NextResponse.json(
      { role: "assistant", content: "I'm having trouble accessing the law library right now." },
      { status: 500 }
    );
  }
}