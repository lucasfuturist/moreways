/**
 * scripts/lab-critic-test.ts
 * 
 * RUN WITH:
 *   npx tsx scripts/lab-critic-test.ts
 * 
 * PREREQUISITE:
 *   Your Next.js app must be running on http://localhost:3000
 */

import "dotenv/config";

async function runLabTest() {
  console.log("🧪 Sending 'Banana Peel' transcript to Prompt Critic...");

  // This payload simulates a conversation where the user answers "off-topic"
  // but reveals key info (incident details) instead of their name.
  // The Agent SHOULD be empathetic but steer back to the name.
  const payload = {
    formName: "Personal Injury Intake",
    fieldTitle: "Full Name",
    fieldKind: "text",
    schemaSummary: "- Full Name (text)\n- Phone Number (phone)\n- Date of Incident (date)\n- Description (textarea)",
    turns: [
      { role: "assistant", text: "I'm here to help you with the form. Let's get started." },
      { role: "assistant", text: "Could you state your full name?" },
      { role: "user", text: "i slipped on a banana peel" },
      { role: "assistant", text: "I understand that might have been quite an experience. Let's focus on the form for now. Could you please provide your full name?" }
    ]
  };

  try {
    const res = await fetch("http://localhost:3000/api/ai/critique", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const critique = await res.json();

    console.log("\n--- 🧐 CRITIC RESULTS ---");
    console.log(`RATING: ${critique.rating.toUpperCase()}`);
    console.log(`\nSCORES:`);
    console.table(critique.scores);
    
    console.log(`\n💡 BETTER REPLY:\n"${critique.better_reply}"`);
    
    console.log(`\n🔧 SUGGESTED PROMPT TWEAK:\n${critique.system_prompt_suggestion}`);
    console.log("\n-------------------------");

  } catch (err) {
    console.error("❌ Failed to run critic:", err);
    console.error("Make sure 'npm run dev' is running on localhost:3000");
  }
}

runLabTest();