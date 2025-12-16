/**
 * apps/law/scripts/soke-grab-law.ts
 *
 * Usage:
 *   pnpm -C apps/law exec tsx scripts/smoke-grab-law.ts "debt collector calling me at work"
 *   pnpm -C apps/law exec tsx scripts/smoke-grab-law.ts --urn "urn:lex:ma:940_cmr_7_00___debt_collection_regulations"
 */

import { config } from "dotenv";
config();

import { HybridSearchService } from "../src/retrieve/svc/retrieve.svc.hybridSearch";
import { SupabaseGraphReader } from "../src/infra/supabase/infra.supabase.reader";

function argValue(flag: string) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return null;
  return process.argv[i + 1] ?? null;
}

async function main() {
  const urn = argValue("--urn");
  const query = process.argv.slice(2).filter(a => a !== "--urn" && a !== urn).join(" ").trim();

  const reader = new SupabaseGraphReader();
  const searcher = new HybridSearchService();

  if (urn) {
    console.log(`\n[Smoke] Reading by URN:\n  ${urn}\n`);
    const node = await reader.getNodeByUrn(urn);
    if (!node) {
      console.error(`[Smoke] ❌ Node not found for URN: ${urn}`);
      process.exit(1);
    }

    console.log(`[Smoke] ✅ Found node`);
    console.log(`URN: ${node.urn}`);
    console.log(`Type: ${node.structure_type}`);
    console.log(`Path: ${node.citation_path}`);
    console.log(`Text preview:\n${(node.content_text || "").slice(0, 800)}\n`);

    // Try expanding children (uses URN prefix path in your reader)
    const children = await reader.getChildren(urn.replace(/:/g, "."), urn);
    console.log(`[Smoke] Children found: ${children.length}`);
    if (children.length > 0) {
      console.log(`First child URN: ${children[0].urn}`);
      console.log(`First child preview:\n${(children[0].content_text || "").slice(0, 500)}\n`);
    }

    return;
  }

  if (!query) {
    console.error(`[Smoke] Provide either --urn <URN> or a query string.`);
    process.exit(1);
  }

  console.log(`\n[Smoke] Hybrid search query:\n  "${query}"\n`);
  const results = await searcher.search(query, 8);

  if (results.length === 0) {
    console.log(`[Smoke] ⚠️ No results returned.`);
    return;
  }

  console.log(`[Smoke] ✅ Top results:`);
  results.slice(0, 5).forEach((r, idx) => {
    console.log(
      `\n#${idx + 1}\nURN: ${r.urn}\nscore=${r.score} vector=${r.vector_score} keyword=${r.keyword_score}\npreview:\n${(r.content_text || "").slice(0, 300)}...`
    );
  });

  // Prove we can fetch the top result by URN
  const top = results[0].urn;
  console.log(`\n[Smoke] Fetching top URN node:\n  ${top}\n`);
  const node = await reader.getNodeByUrn(top);
  console.log(node ? `[Smoke] ✅ fetched node text len=${(node.content_text || "").length}` : `[Smoke] ❌ node not found`);
}

main().catch((e) => {
  console.error("[Smoke] ❌ Fatal:", e);
  process.exit(1);
});
