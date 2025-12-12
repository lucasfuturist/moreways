import { NextRequest, NextResponse } from "next/server";
import { LlmIntakeAgentAsync } from "@/llm/svc/llm.svc.LlmIntakeAgentAsync";

// [HELPER] Terminal Dashboard
function printTerminalDashboard(
  formName: string,
  targetField: string,
  userMessage: string,
  formData: Record<string, any>,
  agentResult: any
) {
  const cyan = "\x1b[36m";
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const white = "\x1b[37m";
  const reset = "\x1b[0m";
  const dim = "\x1b[2m";

  const trunc = (str: string, len: number) => {
    const s = String(str).replace(/\n/g, " ");
    return s.length > len ? s.substring(0, len - 3) + "..." : s.padEnd(len);
  };

  console.log(`\n${dim}┌───────────────────────────────────────────────────────────┐${reset}`);
  console.log(`${dim}│${reset} 📝 ${cyan}INTAKE SESSION:${reset} ${trunc(formName, 36)} ${dim}│${reset}`);
  console.log(`${dim}├───────────────────────────────────────────────────────────┤${reset}`);
  console.log(`${dim}│${reset} 🎯 ${white}Target Field:${reset}   ${trunc(targetField, 36)} ${dim}│${reset}`);
  console.log(`${dim}│${reset} 🗣️  ${dim}User Said:${reset}      ${trunc(userMessage, 36)} ${dim}│${reset}`);
  
  // Agent Outcome
  let outcome = "";
  if (agentResult.type === 'answer') {
    outcome = `${green}EXTRACTED: ${JSON.stringify(agentResult.extractedValue)}${reset}`;
  } else {
    outcome = `${yellow}ACTION: ${agentResult.type.toUpperCase()}${reset}`;
  }
  const rawOutcome = outcome.replace(/\x1b\[[0-9;]*m/g, "");
  console.log(`${dim}│${reset} 🤖 ${dim}Agent Logic:${reset}    ${trunc(rawOutcome, 36)} ${dim}│${reset}`);

  // [NEW] Print Corrections/Updates if they exist
  if (agentResult.updates && Object.keys(agentResult.updates).length > 0) {
     const updatesStr = JSON.stringify(agentResult.updates);
     console.log(`${dim}│${reset} 🔧 ${yellow}SIDE-LOADED:${reset}    ${trunc(updatesStr, 36)} ${dim}│${reset}`);
  }

  const keys = Object.keys(formData);
  console.log(`${dim}├───────────────────────────────────────────────────────────┤${reset}`);
  console.log(`${dim}│${reset} 📊 ${green}Progress:${reset} ${keys.length} fields filled${" ".repeat(28)} ${dim}│${reset}`);
  
  if (keys.length > 0) {
    console.log(`${dim}│${reset}    ${dim}Recent Data:${reset}                                       ${dim}│${reset}`);
    keys.slice(-3).forEach(k => {
        console.log(`${dim}│${reset}    • ${trunc(k, 15)} : ${trunc(String(formData[k]), 25)} ${dim}│${reset}`);
    });
  }
  console.log(`${dim}└───────────────────────────────────────────────────────────┘${reset}\n`);
}

function formatDataForLlm(data: Record<string, any>): string {
  if (!data || Object.keys(data).length === 0) return "";
  return Object.entries(data).map(([k, v]) => `- ${k}: ${v}`).join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // [CHANGE] Added fieldKey
    const { field, fieldKey, userMessage, formName, history, schemaSummary, formData } = body;

    if (!field || !userMessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await LlmIntakeAgentAsync({
      fieldTitle: field.title,
      // [CHANGE] Pass explicit key or fallback
      fieldKey: fieldKey || field.key || "unknown", 
      fieldKind: field.kind,
      fieldDescription: field.description,
      userMessage,
      formContext: formName || "Intake Form",
      recentHistory: Array.isArray(history) ? history : [],
      schemaSummary: schemaSummary || "Not available",
      formDataSummary: formatDataForLlm(formData || {})
    });

    printTerminalDashboard(
        formName || "Untitled", 
        field.title, 
        userMessage, 
        formData || {}, 
        result
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error("[API] Intake Agent Failed:", error);
    return NextResponse.json({ 
        type: "question", 
        replyMessage: "System is busy. Please try again." 
    });
  }
}