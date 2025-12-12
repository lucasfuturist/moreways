/**
 * scripts/auto-optimize-intake.ts
 *
 * RUN WITH:
 *   npx tsx scripts/auto-optimize-intake.ts
 */
/*
import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import {
  PROMPT_TEST_SCENARIOS,
  PromptTestScenario,
  TestTurn,
} from "./promptCriticScenarios";

// --- CONFIG ---
const __filename = fileURLToPath(import.meta.url);
const PROMPTS_DIR = path.join(process.cwd(), "prompts", "v1");
const ACTIVE_PROMPT_PATH = path.join(PROMPTS_DIR, "intake-agent.txt");
const HISTORY_PATH = path.join(PROMPTS_DIR, "intake-agent.history.json");

const MAX_ITERATIONS = 5;
const MIN_EMPATHY = 8;
const MIN_CLARITY = 8;
const MIN_GOAL_ALIGNMENT = 8;
const MIN_SENSITIVITY = 8;

// --- TYPES ---
interface CritiqueScores {
  empathy: number;
  clarity: number;
  goal_alignment: number;
  sensitivity: number;
}

interface CritiqueResult {
  scores: CritiqueScores;
  rating: "good" | "needs_soft_tweak" | "problematic";
  better_reply: string | null;
  system_prompt_suggestion: string | null;
  notes: string;
}

interface PromptVersion {
  id: string;
  timestamp: string;
  human_feedback: string;
  average_scores: CritiqueScores;
  prompt_text: string;
}

// [FIX] Updated type signature to match the new adapter options
type OpenAiClientFn = (prompt: string, options?: { jsonMode?: boolean }) => Promise<string>;

// --- UTILS ---
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(query, (ans) => { rl.close(); resolve(ans); }));
}

// Helper to append to history file
async function logPromptVersion(promptText: string, feedback: string, critiques: CritiqueResult[]) {
  let history: PromptVersion[] = [];
  
  try {
    const raw = await fs.readFile(HISTORY_PATH, "utf-8");
    history = JSON.parse(raw);
  } catch {
    // File might not exist yet
  }

  // Calculate Average Scores for this version
  const count = critiques.length > 0 ? critiques.length : 1;
  const avgScores = critiques.reduce((acc, c) => ({
    empathy: acc.empathy + c.scores.empathy,
    clarity: acc.clarity + c.scores.clarity,
    goal_alignment: acc.goal_alignment + c.scores.goal_alignment,
    sensitivity: acc.sensitivity + c.scores.sensitivity,
  }), { empathy: 0, clarity: 0, goal_alignment: 0, sensitivity: 0 });

  const finalAvg = {
    empathy: parseFloat((avgScores.empathy / count).toFixed(1)),
    clarity: parseFloat((avgScores.clarity / count).toFixed(1)),
    goal_alignment: parseFloat((avgScores.goal_alignment / count).toFixed(1)),
    sensitivity: parseFloat((avgScores.sensitivity / count).toFixed(1)),
  };

  const newVersion: PromptVersion = {
    id: `v${history.length + 1}`,
    timestamp: new Date().toISOString(),
    human_feedback: feedback || "Automated iteration",
    average_scores: finalAvg,
    prompt_text: promptText
  };

  history.push(newVersion);
  await fs.writeFile(HISTORY_PATH, JSON.stringify(history, null, 2));
  return newVersion;
}

async function main() {
  console.log("🚀 Starting Intake Prompt Optimization with History Tracking...\n");

  const { openaiClient } = await import("@/llm/adapter/llm.adapter.openai");
  const { jsonParseSafe } = await import("@/llm/util/llm.util.jsonParseSafe");

  try {
    await fs.access(ACTIVE_PROMPT_PATH);
  } catch {
    console.error(`❌ Base prompt not found at: ${ACTIVE_PROMPT_PATH}`);
    process.exit(1);
  }

  let currentPrompt = await fs.readFile(ACTIVE_PROMPT_PATH, "utf-8");

  // Initial Log
  try {
      await fs.access(HISTORY_PATH);
  } catch {
      await logPromptVersion(currentPrompt, "Initial Baseline", []);
  }

  for (let iter = 1; iter <= MAX_ITERATIONS; iter++) {
    console.log(`\n========== ITERATION ${iter}/${MAX_ITERATIONS} ==========\n`);

    let allGood = true;
    const critiquesPerScenario: {
      scenario: PromptTestScenario;
      critique: CritiqueResult;
      agentReply: string;
    }[] = [];

    // 1. RUN SIMULATIONS
    for (const scenario of PROMPT_TEST_SCENARIOS) {
      console.log(`🧪 SCENARIO: ${scenario.label}`);
      // [FIX] Passing openaiClient as typed function
      const agentReply = await runSimulationForScenario(currentPrompt, scenario, openaiClient as OpenAiClientFn, jsonParseSafe);
      console.log(`   🤖 AGENT: "${agentReply}"`);
      const critique = await runCritiqueForScenario(scenario, agentReply);
      
      console.log(`   🧐 RATING: ${critique.rating} (Emp:${critique.scores.empathy} Sen:${critique.scores.sensitivity})`);
      
      critiquesPerScenario.push({ scenario, critique, agentReply });

      if (!scoresPassThresholds(critique.scores)) allGood = false;
    }

    // 2. HUMAN FEEDBACK
    console.log("\n--- ✋ HUMAN FEEDBACK ---");
    if (allGood) console.log("✨ Scores look great!");
    
    console.log("Enter feedback to refine (or just ENTER to let AI fix issues, or 'q' to quit):");
    const userFeedback = await askQuestion("> ");

    if (userFeedback.toLowerCase() === 'q') break;

    // 3. OPTIMIZE
    console.log("\n🔧 Generating vNext...");
    currentPrompt = await generateImprovedSystemPrompt(currentPrompt, critiquesPerScenario, userFeedback, openaiClient as OpenAiClientFn);

    // 4. LOG TO HISTORY
    const loggedVersion = await logPromptVersion(
      currentPrompt, 
      userFeedback || "AI Correction based on critique", 
      critiquesPerScenario.map(c => c.critique)
    );
    
    console.log(`✅ Saved snapshot ${loggedVersion.id} to history.`);

    // 5. DEPLOY TO ACTIVE (Hot Swap for Dev)
    await fs.writeFile(ACTIVE_PROMPT_PATH, currentPrompt, "utf-8");
    console.log(`⚡ Hot-swapped ${ACTIVE_PROMPT_PATH}`);

    // Exit condition
    if (allGood && !userFeedback) {
      console.log("\n🎉 Optimization Complete. Best version is live.");
      break;
    }
  }
}

// --- HELPERS ---

function scoresPassThresholds(scores: CritiqueScores): boolean {
  return (
    scores.empathy >= MIN_EMPATHY &&
    scores.clarity >= MIN_CLARITY &&
    scores.goal_alignment >= MIN_GOAL_ALIGNMENT &&
    scores.sensitivity >= MIN_SENSITIVITY
  );
}

function buildHistoryText(history: TestTurn[]): string {
  return history.map((t) => `${t.role.toUpperCase()}: "${t.text}"`).join("\n");
}

async function runSimulationForScenario(
  systemTemplate: string,
  scenario: PromptTestScenario,
  openaiClient: OpenAiClientFn,
  jsonParseSafe: <T>(raw: string) => { success: boolean; value: T }
): Promise<string> {
  const historyText = buildHistoryText(scenario.history);
  let prompt = systemTemplate
    .replace(/{{fieldTitle}}/g, scenario.fieldTitle)
    .replace(/{{fieldKind}}/g, scenario.fieldKind)
    .replace(/{{fieldDescription}}/g, "None")
    .replace(/{{formContext}}/g, scenario.formName)
    .replace("{{schemaSummary}}", scenario.schemaSummary)
    .replace("{{historyText}}", historyText || "(No recent history)")
    .replace("{{userMessage}}", scenario.userInput);

  if (!prompt.toLowerCase().includes("json")) prompt += "\n\nIMPORTANT: You must output valid JSON.";

  // [FIX] Force JSON mode for the Agent Simulation (it must return the {type, replyMessage} JSON)
  const raw = await openaiClient(prompt, { jsonMode: true });
  
  const parsed = jsonParseSafe<any>(raw);
  if (!parsed.success) return raw;
  const value = parsed.value;
  if (typeof value === "object" && value.replyMessage) return String(value.replyMessage);
  return JSON.stringify(value);
}

async function runCritiqueForScenario(scenario: PromptTestScenario, agentReply: string): Promise<CritiqueResult> {
  const turns = [...scenario.history, { role: "user" as const, text: scenario.userInput }, { role: "assistant" as const, text: agentReply }];
  const res = await fetch("http://localhost:3000/api/ai/critique", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      formName: scenario.formName,
      fieldTitle: scenario.fieldTitle,
      fieldKind: scenario.fieldKind,
      schemaSummary: scenario.schemaSummary,
      turns,
    }),
  });
  if (!res.ok) throw new Error(`Critique API failed: ${res.status}`);
  return (await res.json()) as CritiqueResult;
}

// Inside scripts/auto-optimize-intake.ts
async function generateImprovedSystemPrompt(
  currentPrompt: string,
  critiques: { scenario: PromptTestScenario; critique: CritiqueResult; agentReply: string }[],
  userFeedback: string,
  openaiClient: OpenAiClientFn
): Promise<string> {
  const critiqueSummary = critiques.map((c) => `
SCENARIO: ${c.scenario.label}
USER: "${c.scenario.userInput}"
AGENT: "${c.agentReply}"
RATING: ${c.critique.rating}
CRITIC NOTES: ${c.critique.notes}
SUGGESTION: ${c.critique.system_prompt_suggestion}
`).join("\n---\n");

  // [FIX] Strengthened Meta-Prompt to prioritize Human Feedback
  const metaPrompt = `
You are a senior prompt engineer.
Optimize the SYSTEM PROMPT below based on critiques and human feedback.

CURRENT PROMPT:
"""
${currentPrompt}
"""

PERFORMANCE REPORT (Automated Critics):
${critiqueSummary}

HUMAN FEEDBACK (CRITICAL - HIGHEST PRIORITY):
"${userFeedback || "Optimize based on the report."}"

TASK:
1. Analyze the Human Feedback. It overrides all other signals.
2. If the human forbids a phrase (e.g. "I understand"), you must ADD A STRICT NEGATIVE CONSTRAINT to the prompt.
3. Return ONLY the updated prompt text. Keep placeholders exactly as is.
`;

  console.log("   (waiting for GPT-4o to rewrite prompt in TEXT mode...)");
  const raw = await openaiClient(metaPrompt, { jsonMode: false });
  
  return raw.replace(/^```[a-z]*\n/i, "").replace(/\n```$/, "").trim();
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

*/