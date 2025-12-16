/**
 * scripts/auto-optimize-intake.ts
 *
 * Purpose:
 * - Run an automated “fake client” simulation across published forms
 * - Use your real form runner logic (schema iterator + naturalizer + intake agent)
 * - Optionally run Magistrate claim assessment at the end
 * - Save:
 *    (1) live append log: apps/console/logs/simulation-live-<timestamp>.log
 *    (2) final markdown report: apps/console/logs/simulation-report-<timestamp>.md
 *
 * RUN:
 *   cd apps/console
 *   npx tsx scripts/auto-optimize-intake.ts
 */

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import cliProgress from "cli-progress";

// Load envs (OpenAI + LAW service URL, etc).
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

type AnySchema = any;

type Persona = {
  name: string;
  desc: string;
};

type SimulationConfig = {
  maxTurns: number;
  model: string;
  temperature: number;
  formsToTest: string[];
  personas: Persona[];
  includeVerdict: boolean;

  // outputs
  outputReportPath: string;
  liveLogPath: string;

  // logging knobs
  logLiveQa: boolean;
  logLiveExtraction: boolean;
  logAnswerMaxLen: number;

  // NEW: citations
  logLiveCitations: boolean;
  logCitationExcerptMaxLen: number;
};

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function redactDbUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.password) u.password = "***";
    return u.toString();
  } catch {
    return url.replace(/:(.*?)@/, ":***@");
  }
}

function assertEnv() {
  const url = process.env.CONSOLE_DATABASE_URL || "";
  if (!url) {
    throw new Error(
      "CONSOLE_DATABASE_URL is not set. Set it to the Supabase Transaction Pooler URL (host *.pooler.supabase.com, port 6543)."
    );
  }

  if (!url.includes("pooler.supabase.com") || !url.includes(":6543")) {
    throw new Error(
      `CONSOLE_DATABASE_URL must be the Supabase Transaction Pooler URL (host *.pooler.supabase.com, port 6543). Got: ${redactDbUrl(
        url
      )}`
    );
  }

  if (!url.includes("pgbouncer=true")) {
    console.warn("⚠️  CONSOLE_DATABASE_URL does not include pgbouncer=true. (Recommended for Supabase pooler)");
  }
  if (!url.includes("sslmode=")) {
    console.warn("⚠️  CONSOLE_DATABASE_URL does not include sslmode=require. (Recommended for Supabase pooler)");
  }

  const direct = process.env.CONSOLE_DIRECT_DATABASE_URL || "";
  if (!direct) {
    console.warn("⚠️  CONSOLE_DIRECT_DATABASE_URL is not set. Migrations may be flaky without a direct connection.");
  }

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length < 10) {
    console.warn("⚠️  OPENAI_API_KEY is not set (your openai adapter may fail depending on env config).");
  }
  if (!process.env.LAW_SERVICE_URL) {
    console.warn("⚠️  LAW_SERVICE_URL is not set. Verdict calls may fail unless your service has another default.");
  }
}

function ensureDirForFile(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getFieldDef(schema: AnySchema, fieldKey: string): any | undefined {
  if (schema?.properties && schema.properties[fieldKey]) return schema.properties[fieldKey];
  if (Array.isArray(schema?.fields)) return schema.fields.find((f: any) => f?.key === fieldKey);
  if (schema?.fieldsByKey && schema.fieldsByKey[fieldKey]) return schema.fieldsByKey[fieldKey];
  return undefined;
}

function historyMsg(role: "assistant" | "user", text: string) {
  return { role, text, content: text };
}

function mdEscapeInline(s: string) {
  return s.replace(/\r\n/g, "\n");
}

function truncate(s: string, maxLen: number) {
  if (!s) return s;
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen) + "…";
}

function nowIso() {
  return new Date().toISOString();
}

/**
 * One-per-run append log (durable, tail-able)
 */
function makeLiveAppender(liveLogPath: string) {
  ensureDirForFile(liveLogPath);

  // create/overwrite header at the beginning of the run
  fs.writeFileSync(
    liveLogPath,
    `# simulation live log\n# started: ${nowIso()}\n# path: ${liveLogPath}\n\n`,
    "utf8"
  );

  return (line: string) => {
    try {
      fs.appendFileSync(liveLogPath, `[${nowIso()}] ${line}\n`, "utf8");
    } catch (e: any) {
      // do not crash the run because logging failed
      console.warn("⚠️  failed to append live log:", String(e?.message || e));
    }
  };
}

// --- Citations helpers (flexible shape) ---
type CitationLike = {
  citation?: string;
  source?: string;
  node_id?: string;
  nodeId?: string;
  url?: string;
  title?: string;
  excerpt?: string;
  quote?: string;
  text?: string;
  [k: string]: any;
};

function normalizeCitations(verdict: any): CitationLike[] {
  const raw =
    verdict?.relevant_citations ??
    verdict?.relevantCitations ??
    verdict?.citations ??
    verdict?.sources ??
    verdict?.source_citations ??
    verdict?.sourceCitations ??
    [];

  const arr = Array.isArray(raw) ? raw : [];

  // flatten common nested forms like { citation: {...} } or { source: {...} }
  return arr.map((x: any) => {
    if (!x) return { source: "unknown_source", raw: x };
    if (typeof x === "string") return { source: x, raw: x };
    const inner = x.citation ?? x.source ?? x.ref ?? x.doc ?? x.document ?? null;
    return inner && typeof inner === "object" ? { ...x, ...inner, raw: x } : { ...x, raw: x };
  });
}


function formatCitationLabel(c: CitationLike): string {
  const v =
    c.label ??
    c.source_label ??
    c.sourceLabel ??
    c.source_name ??
    c.sourceName ??
    c.document_title ??
    c.documentTitle ??
    c.title ??
    c.name ??
    c.url ??
    c.urn ??
    c.citation_path ??
    c.citationPath ??
    c.node_id ??
    c.nodeId ??
    c.id ??
    // nested fallbacks (since we attach raw)
    c.raw?.label ??
    c.raw?.title ??
    c.raw?.url ??
    c.raw?.urn ??
    c.raw?.citation_path ??
    c.raw?.citationPath ??
    c.raw?.node_id ??
    c.raw?.nodeId ??
    c.raw?.id ??
    "unknown_source";

  return String(v);
}


function formatCitationExcerpt(c: CitationLike): string {
  const v =
    c.excerpt ??
    c.snippet ??
    c.quote ??
    c.text ??
    c.content ??
    c.raw?.excerpt ??
    c.raw?.snippet ??
    c.raw?.quote ??
    c.raw?.text ??
    c.raw?.content ??
    "";
  return String(v || "");
}


async function main() {
  // safe env debug
  console.log({
    CONSOLE_DATABASE_URL: process.env.CONSOLE_DATABASE_URL ? new URL(process.env.CONSOLE_DATABASE_URL).host : null,
    CONSOLE_DIRECT_DATABASE_URL: process.env.CONSOLE_DIRECT_DATABASE_URL
      ? new URL(process.env.CONSOLE_DIRECT_DATABASE_URL).host
      : null,
  });

  const raw = process.env.CONSOLE_DATABASE_URL || "";
  let u: URL | null = null;
  try {
    u = new URL(raw);
  } catch {}
  console.log("CONSOLE_DATABASE_URL parsed:", {
    startsWith: raw.slice(0, 24),
    user: u?.username ?? null,
    host: u?.host ?? null,
    hasPgbouncer: u ? u.searchParams.get("pgbouncer") : null,
    sslmode: u ? u.searchParams.get("sslmode") : null,
  });

  console.log(chalk.cyan("🚀 Starting Simulation Script..."));
  assertEnv();

  const ts = timestamp();

  const CONFIG: SimulationConfig = {
    maxTurns: Number(process.env.SIM_MAX_TURNS || 12),
    model: process.env.SIM_MODEL || "gpt-4o",
    temperature: Number(process.env.SIM_TEMPERATURE || 0.8),
    includeVerdict: process.env.SIM_INCLUDE_VERDICT ? process.env.SIM_INCLUDE_VERDICT === "true" : true,

    formsToTest: ["UNWANTED ROBOCALLS", "DEBT COLLECTION", "USED CAR", "IDENTITY THEFT", "PERSONAL INJURY"],

    personas: [
      { name: "Frustrated Victim", desc: "Angry, feels unheard, wants justice." },
      { name: "Direct Pro", desc: "Brief, concise, provides facts only." },
    ],

    outputReportPath: path.resolve(__dirname, `../logs/simulation-report-${ts}.md`),
    liveLogPath: path.resolve(__dirname, `../logs/simulation-live-${ts}.log`),

    logLiveQa: process.env.SIM_LOG_LIVE_QA ? process.env.SIM_LOG_LIVE_QA === "true" : true,
    logLiveExtraction: process.env.SIM_LOG_LIVE_EXTRACTION ? process.env.SIM_LOG_LIVE_EXTRACTION === "true" : false,
    logAnswerMaxLen: Number(process.env.SIM_LOG_ANSWER_MAXLEN || 220),

    // NEW: citations
    logLiveCitations: process.env.SIM_LOG_LIVE_CITATIONS ? process.env.SIM_LOG_LIVE_CITATIONS === "true" : true,
    logCitationExcerptMaxLen: Number(process.env.SIM_LOG_CITATION_EXCERPT_MAXLEN || 180),
  };

  const appendLive = makeLiveAppender(CONFIG.liveLogPath);
  appendLive(`run.start report=${CONFIG.outputReportPath}`);

  // Prisma reads datasource.url from schema.prisma (CONSOLE_DATABASE_URL)
  const db = new PrismaClient();

  try {
    console.log(chalk.gray("🔌 Testing DB connection (pooler 6543 via CONSOLE_DATABASE_URL)..."));
    await db.$connect();
    console.log(chalk.green("✅ Database Connected Successfully!"));
    appendLive("db.connected ok");

    // --- DYNAMIC IMPORTS ---
    const { openaiClient } = await import("../src/llm/adapter/llm.adapter.openai");
    const { LlmIntakeAgentAsync } = await import("../src/llm/svc/llm.svc.LlmIntakeAgentAsync");
    const { LlmClaimAssessorAsync } = await import("../src/llm/svc/llm.svc.LlmClaimAssessorAsync");
    const { getNextFieldKey } = await import("../src/forms/logic/forms.logic.schemaIterator");
    const { generateNaturalQuestion } = await import("../src/forms/logic/forms.logic.naturalizer");

    // 1) FETCH PUBLISHED FORMS
    const publishedForms = await db.formSchema.findMany({
      where: { isPublished: true, isDeprecated: false },
      orderBy: { updatedAt: "desc" },
    });

    if (publishedForms.length === 0) {
      console.log(chalk.yellow("⚠️  No published forms found."));
      appendLive("forms.none");
      return;
    }

    // filter forms (so progress bar total is accurate)
    const runnableForms = publishedForms.filter((f) =>
      CONFIG.formsToTest.some((t) => f.name.toUpperCase().includes(t))
    );

    console.log("");
    console.log(chalk.white(`Found ${publishedForms.length} active forms.`));
    console.log(chalk.white(`Running simulation for name matches: ${CONFIG.formsToTest.join(", ")}`));
    console.log(chalk.white(`Max turns per run: ${CONFIG.maxTurns}`));
    console.log(chalk.white(`LLM model for persona replies: ${CONFIG.model}`));
    console.log(chalk.white(`Include verdict: ${CONFIG.includeVerdict ? "yes" : "no"}`));
    console.log(chalk.gray(`Live log: ${CONFIG.liveLogPath}`));
    console.log(chalk.gray(`Report:   ${CONFIG.outputReportPath}`));
    console.log("");

    if (runnableForms.length === 0) {
      console.log(chalk.yellow("⚠️  No forms matched your FORMS_TO_TEST filters. Nothing to simulate."));
      appendLive("forms.no_match");
      return;
    }

    // Progress bar (overall forms)
    const bar = new cliProgress.SingleBar(
      {
        format:
          chalk.gray("Progress") +
          " |" +
          chalk.cyan("{bar}") +
          "| " +
          chalk.white("{value}/{total}") +
          " " +
          chalk.gray("{form}"),
        barCompleteChar: "█",
        barIncompleteChar: "░",
        hideCursor: true,
      },
      cliProgress.Presets.shades_classic
    );

    bar.start(runnableForms.length, 0, { form: "starting..." });

    const allTranscripts: string[] = [];

    // 2) SIMULATION LOOP
    for (let idx = 0; idx < runnableForms.length; idx++) {
      const form = runnableForms[idx];

      const persona = pickRandom(CONFIG.personas);
      const formName = form.name;
      const schema = form.schemaJson as AnySchema;

      bar.update(idx, { form: truncate(formName, 36) });

      console.log(chalk.gray("\n" + "=".repeat(72)));
      console.log(chalk.cyan(`🎬 Simulating: ${formName} (${persona.name})`));
      appendLive(`form.start name="${formName}" persona="${persona.name}"`);

      const transcript: string[] = [
        `# ${mdEscapeInline(formName)} (${mdEscapeInline(persona.name)})`,
        `- turns: ${CONFIG.maxTurns}`,
        `- persona: ${mdEscapeInline(persona.desc)}`,
      ];

      let formData: Record<string, any> = {};
      let history: any[] = [];
      let activeKey: string | null = getNextFieldKey(schema, formData);
      let turns = 0;

      while (activeKey && turns < CONFIG.maxTurns) {
        const field = getFieldDef(schema, activeKey);

        if (!field) {
          const msg = `missing field definition for key=${activeKey}`;
          console.log(chalk.yellow(`⚠️  ${msg}`));
          transcript.push(`⚠️  ${msg}`);
          appendLive(`warn ${msg}`);

          activeKey = getNextFieldKey(schema, formData, activeKey);
          turns++;
          continue;
        }

        const question = generateNaturalQuestion(field, turns === 0);

        // Generate “user reply” (persona)
        const userPrompt =
          `ROLE: User filling form "${formName}". ` +
          `PERSONA: ${persona.desc}. ` +
          `QUESTION: "${question}". ` +
          `DATA: ${JSON.stringify(formData)}. ` +
          `Reply in 1 sentence.`;

        const userReply = await openaiClient(userPrompt, {
          temperature: CONFIG.temperature,
          model: CONFIG.model,
          jsonMode: false,
        });

        // Live console + live file append
        const qLine = `Q(${turns + 1}/${CONFIG.maxTurns}) ${question}`;
        const aLine = `A: ${truncate(userReply, CONFIG.logAnswerMaxLen)}`;

        if (CONFIG.logLiveQa) {
          console.log(chalk.yellow(qLine));
          console.log(chalk.green(aLine));
        }
        appendLive(`qa form="${formName}" key="${activeKey}" ${qLine}`);
        appendLive(`qa form="${formName}" key="${activeKey}" ${aLine}`);

        // history + transcript
        history.push(historyMsg("assistant", question));
        history.push(historyMsg("user", userReply));
        transcript.push(`**Bot:** ${mdEscapeInline(question)}\n**User:** ${mdEscapeInline(userReply)}`);

        // Intake agent extraction
        const result = await LlmIntakeAgentAsync({
          field: { ...field, kind: field.kind },
          fieldKey: activeKey,
          userMessage: userReply,
          formName,
          history,
          schemaSummary: "Intake",
          formData,
        });

        // Apply extracted result
        if (result?.extractedValue !== undefined) formData[activeKey] = result.extractedValue;
        if (result?.updates) Object.assign(formData, result.updates);

        // Fail-safe: ensure we advance even if the agent doesn't extract cleanly
        if (result?.type !== "answer" && formData[activeKey] == null) {
          formData[activeKey] = userReply;
        }

        if (CONFIG.logLiveExtraction) {
          const extracted = result?.extractedValue !== undefined ? result.extractedValue : undefined;
          const updates = result?.updates ? Object.keys(result.updates) : [];
          const eLine =
            extracted !== undefined
              ? `extracted key="${activeKey}" value=${JSON.stringify(extracted)}`
              : `extracted key="${activeKey}" value=null`;
          const uLine = updates.length ? `updates=${updates.join(",")}` : `updates=none`;

          console.log(chalk.magenta(`→ ${eLine}`));
          appendLive(`extract form="${formName}" ${eLine} ${uLine}`);
        } else {
          // still record a minimal extraction line in the live file
          const extracted = result?.extractedValue !== undefined ? result.extractedValue : undefined;
          appendLive(
            `extract form="${formName}" key="${activeKey}" value=${
              extracted !== undefined ? JSON.stringify(extracted) : "null"
            }`
          );
        }

        activeKey = getNextFieldKey(schema, formData, activeKey);
        turns++;
      }

      transcript.push(`\n## Final Data Snapshot\n\n\`\`\`json\n${JSON.stringify(formData, null, 2)}\n\`\`\``);
      appendLive(`form.data_snapshot name="${formName}" bytes=${JSON.stringify(formData).length}`);

      // verdict
      if (CONFIG.includeVerdict) {
        try {
          const verdict = await LlmClaimAssessorAsync(formData, formName);

          transcript.push(`\n## Verdict\n- status: **${verdict.status}**\n- confidence: **${verdict.confidence_score}%**`);

          if (verdict.executive_summary) {
            transcript.push(`\n### Executive Summary\n${mdEscapeInline(String(verdict.executive_summary))}`);
          }

          console.log(chalk.cyan(`Verdict: ${verdict.status}`) + chalk.gray(` (${verdict.confidence_score}%)`));
          appendLive(
            `verdict form="${formName}" status="${verdict.status}" confidence=${verdict.confidence_score}`
          );

          // --- NEW: live citations logging (console + append log + report) ---
          const citations = normalizeCitations(verdict);
          appendLive(`citations.debug form="${formName}" sample=${JSON.stringify(citations[0] ?? null)}`);
          transcript.push(`\n## Citations\n${citations.length ? "" : "_(none returned)_"}\n`);

          if (CONFIG.logLiveCitations) {
            if (citations.length) {
              console.log(chalk.blueBright(`Citations (${citations.length}):`));
              appendLive(`citations form="${formName}" count=${citations.length}`);

              citations.forEach((c, i) => {
                const label = formatCitationLabel(c);
                const excerpt = truncate(formatCitationExcerpt(c), CONFIG.logCitationExcerptMaxLen);

                // console
                console.log(chalk.blue(`  ${i + 1}. ${label}`));
                if (excerpt) console.log(chalk.gray(`     ↳ "${excerpt}"`));

                // live file
                appendLive(`citation form="${formName}" i=${i + 1} label=${JSON.stringify(label)}`);
                if (excerpt) appendLive(`citation.excerpt form="${formName}" i=${i + 1} text=${JSON.stringify(excerpt)}`);

                // markdown report
                const where =
                  (c.url || c.urn || c.citation_path || c.citationPath || c.node_id || c.nodeId || c.id || c.raw?.url || c.raw?.urn || "")
                    ? `\n  - _${mdEscapeInline(
                        String(c.url ?? c.urn ?? c.citation_path ?? c.citationPath ?? c.node_id ?? c.nodeId ?? c.id ?? c.raw?.url ?? c.raw?.urn)
                      )}_`
                    : "";

                transcript.push(
                  `- **${mdEscapeInline(label)}**${where}${excerpt ? `\n  - _${mdEscapeInline(excerpt)}_` : ""}`
                );
              });
            } else {
              console.log(chalk.yellow("Citations: NONE ⚠️"));
              appendLive(`citations form="${formName}" count=0`);
            }
          } else {
            // even if we aren't printing to console, still write count to live log
            appendLive(`citations form="${formName}" count=${citations.length}`);
          }
        } catch (e: any) {
          const msg = String(e?.message || e);
          transcript.push(`\n## Verdict\n**ERROR**\n\n\`\`\`\n${msg}\n\`\`\``);
          console.log(chalk.red(`Verdict ERROR: ${truncate(msg, 240)}`));
          appendLive(`verdict.error form="${formName}" msg=${JSON.stringify(msg)}`);
        }
      } else {
        transcript.push(`\n## Verdict\n(skipped)`);
        appendLive(`verdict.skipped form="${formName}"`);
      }

      allTranscripts.push(transcript.join("\n\n"));
      appendLive(`form.end name="${formName}" turns=${turns}`);

      bar.update(idx + 1, { form: truncate(formName, 36) });
    }

    bar.stop();

    // 4) SAVE REPORT
    ensureDirForFile(CONFIG.outputReportPath);
    fs.writeFileSync(CONFIG.outputReportPath, allTranscripts.join("\n\n---\n\n"), "utf8");
    console.log(chalk.green(`\n✅ Done! Report: ${CONFIG.outputReportPath}`));
    console.log(chalk.green(`✅ Live log: ${CONFIG.liveLogPath}`));
    appendLive(`run.end ok report=${CONFIG.outputReportPath}`);
  } catch (err: any) {
    console.error(chalk.red("\n❌ FAILED:"), err);
    console.error("\n(db url redacted):", redactDbUrl(process.env.CONSOLE_DATABASE_URL || ""));
    appendLive(`run.error msg=${JSON.stringify(String(err?.message || err))}`);
    process.exitCode = 1;
  } finally {
    await db.$disconnect();
  }
}

main();
