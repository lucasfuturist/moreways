/**
 * scripts/auto-optimize-intake.ts
 */

import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// 1. LOAD ENV BEFORE IMPORTS
const envPath = path.resolve(__dirname, "../.env");
console.log(`Loading env from: ${envPath}`);
dotenv.config({ path: envPath });

// --- CONFIG ---
const FORM_NAME = "Dog Bite Incident Report";
const SIMULATION_COUNT = 3; 

// Schema Definition
const SCHEMA = {
  order: ["firstName", "dateOfIncident", "location", "description", "injuries", "medicalTreatment", "annualIncome", "creditScore"],
  properties: {
    firstName: { title: "First Name", kind: "text" },
    dateOfIncident: { title: "Date of Incident", kind: "date" },
    location: { title: "Location", kind: "text" },
    description: { title: "What happened?", kind: "textarea" },
    injuries: { title: "Injuries Sustained", kind: "textarea" },
    medicalTreatment: { title: "Medical Treatment", kind: "textarea" },
    annualIncome: { title: "Annual Income", kind: "currency" },
    creditScore: { title: "Credit Score", kind: "number" }
  }
};

const PERSONAS = [
  "Anxious Victim: Very worried, types fast, maybe typos, focuses on pain.",
  "Angry Client: Mad at the dog owner, swears occasionally, wants justice.",
  "Direct Professional: Short, concise answers. No fluff."
];

async function main() {
  const { openaiClient } = await import("../src/llm/adapter/llm.adapter.openai");
  const { LlmIntakeAgentAsync } = await import("../src/llm/svc/llm.svc.LlmIntakeAgentAsync");
  const { LlmClaimAssessorAsync } = await import("../src/llm/svc/llm.svc.LlmClaimAssessorAsync");
  const { getNextFieldKey } = await import("../src/forms/logic/forms.logic.schemaIterator");
  const { generateNaturalQuestion } = await import("../src/forms/logic/forms.logic.naturalizer");

  async function simulateUserReply(history: any[], persona: string, lastQuestion: string) {
    const prompt = `
      ROLE: You are playing a character filling out a form.
      PERSONA: ${persona}
      CONTEXT: You are chatting with a legal intake bot.
      LAST QUESTION: "${lastQuestion}"
      HISTORY: ${JSON.stringify(history.slice(-3))}
      INSTRUCTION: Reply to the last question in character. Keep it realistic (1-3 sentences).
    `;
    return await openaiClient(prompt, { temperature: 0.8, jsonMode: false });
  }

  async function runSimulation(runId: number) {
    const persona = PERSONAS[runId % PERSONAS.length];
    console.log(`\n🎬 STARTING RUN #${runId + 1}: ${persona}`);
    
    const transcript: string[] = [`# Simulation ${runId + 1}: ${persona}\n`];
    let formData: Record<string, any> = {};
    let history: any[] = [];
    let activeKey = getNextFieldKey(SCHEMA as any, formData);
    let turns = 0;

    while (activeKey && turns < 15) {
      const field = SCHEMA.properties[activeKey as keyof typeof SCHEMA.properties];
      const question = generateNaturalQuestion(field as any, turns === 0);
      console.log(`🤖 Bot: ${question}`);
      transcript.push(`**Bot:** ${question}`);
      
      const userReply = await simulateUserReply(history, persona, question);
      console.log(`👤 User: ${userReply}`);
      transcript.push(`**User:** ${userReply}`);
      
      history.push({ role: "assistant", text: question });
      history.push({ role: "user", text: userReply });

      const result = await LlmIntakeAgentAsync({
        field: { ...field, kind: field.kind },
        userMessage: userReply,
        formName: FORM_NAME,
        history,
        schemaSummary: "Dog bite form",
        formData
      });

      if (result.type === "question" || result.type === "chitchat") {
        console.log(`💡 Clarification: "${result.replyMessage}"`);
        transcript.push(`> *Clarification Needed*`);
        
        // Auto-resolve clarification for simulation
        const clarificationReply = await simulateUserReply(history, persona, result.replyMessage || "Please clarify.");
        console.log(`👤 User (Clarifying): ${clarificationReply}`);
        transcript.push(`**User (Clarifying):** ${clarificationReply}`);
        
        history.push({ role: "assistant", text: result.replyMessage || "" });
        history.push({ role: "user", text: clarificationReply });
        
        const retry = await LlmIntakeAgentAsync({
            field: { ...field, kind: field.kind },
            userMessage: clarificationReply,
            formName: FORM_NAME,
            history,
            schemaSummary: "Dog bite form",
            formData
        });

        if(retry.extractedValue) formData[activeKey] = retry.extractedValue;
        else formData[activeKey] = userReply; // Force advance
      } else {
        console.log(`✅ Extracted: ${JSON.stringify(result.extractedValue)}`);
        if (result.updates) Object.assign(formData, result.updates);
        if (result.extractedValue) formData[activeKey] = result.extractedValue;
      }

      activeKey = getNextFieldKey(SCHEMA as any, formData, activeKey);
      turns++;
    }

    // --- VERDICT ---
    console.log("⚖️  Running Magistrate...");
    const verdict = await LlmClaimAssessorAsync(formData, FORM_NAME);
    
    transcript.push(`\n## ⚖️ Final Verdict`);
    transcript.push(`**Status:** ${verdict.status}`);
    transcript.push(`**Score:** ${verdict.confidence_score}/100`);
    transcript.push(`**Summary:** ${verdict.analysis.summary}`);
    
    // [FIX] Added Citations and Analysis Points
    transcript.push(`\n### Key Factors`);
    transcript.push(`**Strengths:**\n- ${verdict.analysis.strength_factors?.join("\n- ") || "None"}`);
    transcript.push(`**Missing:**\n- ${verdict.analysis.missing_elements?.join("\n- ") || "None"}`);
    
    transcript.push(`\n### Relevant Authority`);
    transcript.push(verdict.relevant_citations?.length 
        ? `- ${verdict.relevant_citations.join("\n- ")}` 
        : "*No specific citations generated.*");
    
    return transcript.join("\n\n");
  }

  const allTranscripts: string[] = [];
  for (let i = 0; i < SIMULATION_COUNT; i++) {
    allTranscripts.push(await runSimulation(i));
    allTranscripts.push("---\n");
  }

  const outPath = path.resolve(__dirname, "../logs/simulation-report.md");
  fs.writeFileSync(outPath, allTranscripts.join("\n"));
  console.log(`\n📄 Report saved to: ${outPath}`);
}

main().catch(console.error);