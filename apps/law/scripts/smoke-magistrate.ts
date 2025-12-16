import "dotenv/config";
import { JudgeService } from "../src/validate/svc/validate.svc.judge";
import { HybridSearchService } from "../src/retrieve/svc/retrieve.svc.hybridSearch";
import { SupabaseGraphReader } from "../src/infra/supabase/infra.supabase.reader";
import { SupabaseOverrideRepo } from "../src/graph/repo/graph.repo.overrideRepo";

function guessFormData(intent: string) {
  const s = intent.toLowerCase();
  if (s.includes("debt") || s.includes("collector") || s.includes("work")) {
    return {
      calls_per_day: 5,
      called_work: true,
      consumer_sent_written_stop_notice: false,
      last_contact_date: new Date().toISOString().slice(0, 10),
    };
  }
  return {
    description: intent,
    incident_date: new Date().toISOString().slice(0, 10),
  };
}

async function main() {
  const intent = process.argv.slice(2).join(" ").trim();
  if (!intent) {
    console.error('usage: tsx scripts/smoke-magistrate.ts "your intent text"');
    process.exit(1);
  }

  console.log(`\n[Smoke] Magistrate evaluate intent:\n  "${intent}"\n`);

  const searcher = new HybridSearchService();
  const reader = new SupabaseGraphReader();
  const overrideRepo = new SupabaseOverrideRepo();
  const judge = new JudgeService(searcher, reader, overrideRepo);

  const formData = guessFormData(intent);
  const verdict = await judge.evaluate(intent, formData);

  console.log("[Smoke] ✅ Verdict:\n");
  console.log(JSON.stringify(verdict, null, 2));

  console.log("\n[Smoke] Evidence (DB excerpts for each citation):\n");

  for (const urn of verdict.relevant_citations || []) {
    const node = await reader.getNodeByUrn(urn);
    if (!node) {
      console.log(`- ${urn}\n  [MISSING IN DB]\n`);
      continue;
    }
    const excerpt = (node.content_text || "").replace(/\s+/g, " ").trim().slice(0, 400);
    console.log(`- ${urn}`);
    console.log(`  type=${(node as any).structure_type || (node as any).type || "?"} path=${(node as any).citation_path || "?"}`);
    console.log(`  excerpt="${excerpt}${excerpt.length >= 400 ? "..." : ""}"\n`);
  }
}

main().catch((e) => {
  console.error("[Smoke] ❌ Error:", e);
  process.exit(1);
});
