import { openai } from "../../infra/openai/infra.openai.client";
import { HybridSearchService } from "../../retrieve/svc/retrieve.svc.hybridSearch";
import { Verdict, VerdictSchema } from "../schema/validate.schema.verdict";
import { SupabaseGraphReader } from "../../infra/supabase/infra.supabase.reader";
import { SupabaseOverrideRepo } from "../../graph/repo/graph.repo.overrideRepo";
import { LegalNodeRecord } from "../../graph/schema/graph.schema.nodes";
import { withRetry } from "../../shared/utils/resilience";

// 1) Precise URNs (Known Anchors)
const HARDCODED_ANCHORS: Record<string, string[]> = {
  robocall: [
    "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3",
    "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4",
  ],
  auto: ["urn:lex:ma:940_cmr_5_00___motor_vehicle_regulations:5_04"],
  dealership: ["urn:lex:ma:940_cmr_5_00___motor_vehicle_regulations:5_04"],
  debt: ["urn:lex:ma:940_cmr_7_00___debt_collection_regulations"],
  collection: ["urn:lex:ma:940_cmr_7_00___debt_collection_regulations"],
};

// 2) Fallback Concepts
const INTENT_CONCEPTS: Record<string, string> = {
  auto: "used car lemon law warranty inspection fail 7 days refund",
  debt: "debt collector harassment calls work frequency 940 cmr 7",
  robocall: "telemarketing do not call robocall consent 16 cfr 310",
  dog: "dog bite strict liability dangerous animal owner responsibility injury",
  bite: "dog bite strict liability dangerous animal owner responsibility injury",
  injury: "personal injury negligence duty of care damages medical expenses",
  accident: "negligence duty of care causation damages car accident",
};

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * STRICT: only allow URNs that were literally included in the law context we provided.
 * We detect allowed URNs by the exact "SECTION [<URN>]" wrappers we generate below.
 */
function extractProvidedUrns(lawText: string): string[] {
  const re = /SECTION\s+\[([^\]]+)\]/g;
  const found: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(lawText)) !== null) {
    const urn = (m[1] || "").trim();
    if (urn) found.push(urn);
  }
  return uniq(found);
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

export class JudgeService {
  constructor(
    private readonly searcher: HybridSearchService,
    private readonly reader: SupabaseGraphReader,
    private readonly overrideRepo: SupabaseOverrideRepo
  ) {}

  private async filterToExistingUrns(urns: string[]): Promise<string[]> {
    if (!urns || urns.length === 0) return [];
    const checks = await Promise.all(urns.map((u) => this.reader.getNodeByUrn(u)));
    return urns.filter((u, i) => checks[i] !== null);
  }

  private async resolveAnchors(intent: string): Promise<string[]> {
    const normalizedIntent = intent.toLowerCase();

    // A) Fuzzy match hardcoded anchors
    for (const [key, urns] of Object.entries(HARDCODED_ANCHORS)) {
      if (normalizedIntent.includes(key)) {
        const checks = await Promise.all(urns.map((urn) => this.reader.getNodeByUrn(urn)));
        if (checks.every((n) => n !== null)) return urns;
      }
    }

    // B) Dynamic search
    const conceptKey = Object.keys(INTENT_CONCEPTS).find((k) => normalizedIntent.includes(k));
    const searchCtx = conceptKey ? INTENT_CONCEPTS[conceptKey] : intent;

    const results = await this.searcher.search(searchCtx, 5);

    if (results.length > 0) {
      const lawCandidates = results.filter((r) => {
        const u = r.urn.toLowerCase();
        return u.includes("cfr") || u.includes("cmr") || u.includes("usc") || u.includes("act") || u.includes("statute");
      });
      const bestFit = lawCandidates.length > 0 ? lawCandidates[0] : results[0];
      return [bestFit.urn];
    }
    return [];
  }

  private async buildLawContext(anchors: string[]) {
    let lawText = "";
    const overrides: string[] = [];
    const nodesByUrn = new Map<string, LegalNodeRecord>();

    if (anchors.length === 0) {
      return { lawText: "", overrides, providedUrns: [], nodesByUrn };
    }

    for (const urn of anchors) {
      const nodeOverrides = await this.overrideRepo.getOverrides(urn);
      nodeOverrides.forEach((o) => {
        overrides.push(
          `[ALERT] The law at ${urn} is flagged: ${o.type} - ${o.message} (Cite: ${o.court_citation})`
        );
      });

      try {
        let nodesToRead: LegalNodeRecord[] = [];

        // Try to get children (full section context)
        const children = await this.reader.getChildren(urn.replace(/:/g, "."), urn);
        if (children.length > 0) {
          nodesToRead = children;
        } else {
          const self = await this.reader.getNodeByUrn(urn);
          if (self) nodesToRead = [self];
        }

        // Keep a deterministic map for “evidence”
        nodesToRead.forEach((n) => nodesByUrn.set(n.urn, n));

        // Build lawText with strict wrappers
        lawText += nodesToRead
          .map((n) => `SECTION [${n.urn}]:\n${n.content_text}`)
          .join("\n\n");
        lawText += "\n\n";
      } catch (e) {
        console.error(`[Judge] Failed to read node ${urn}`, e);
      }
    }

    const providedUrns = extractProvidedUrns(lawText);

    return { lawText, overrides, providedUrns, nodesByUrn };
  }

  private guardVerdict(
    raw: Verdict,
    providedUrns: string[]
  ): { verdict: Verdict; hadInvalidCitations: boolean } {
    const allowed = new Set(providedUrns);

    const originalCites = (raw.relevant_citations || []).map((c) => (c || "").trim()).filter(Boolean);
    const filtered = uniq(originalCites.filter((c) => allowed.has(c)));

    const hadInvalidCitations = filtered.length !== originalCites.length;

    // If they cited stuff we didn't provide, we treat it like a mistrial-lite.
    // We keep the analysis, but we reduce confidence and (optionally) degrade status.
    let status = raw.status;
    let confidence = clamp01(raw.confidence_score);

    if (providedUrns.length > 0 && filtered.length === 0) {
      // They were supposed to cite sections we provided but didn’t.
      status = "POSSIBLE_VIOLATION";
      confidence = Math.min(confidence, 0.35);
      raw.analysis.summary =
        `[CITATION_GUARD] Model returned no valid citations from the provided law context. ` +
        `Treat this as non-authoritative and require manual review.\n` +
        raw.analysis.summary;
    } else if (hadInvalidCitations) {
      confidence = Math.min(confidence, 0.6);
      raw.analysis.summary =
        `[CITATION_GUARD] Some citations were discarded because they were not in the provided context.\n` +
        raw.analysis.summary;
    }

    return {
      hadInvalidCitations,
      verdict: {
        ...raw,
        status,
        confidence_score: confidence,
        relevant_citations: filtered,
      },
    };
  }

  public async evaluate(intent: string, formData: Record<string, any>): Promise<Verdict> {
    const today = new Date().toISOString().split("T")[0];

    // 1) Resolve Anchor URNs
    const anchors = await this.resolveAnchors(intent);
    const factSummary = JSON.stringify(formData, null, 2);

    // 2) Fetch Law Text + Overrides + Provided URN allow-list
    const { lawText: rawLawText, overrides, providedUrns } = await this.buildLawContext(anchors);

    let lawText = rawLawText;

    // Guard: empty law => common law fallback
    if (!lawText || lawText.length < 50) {
      lawText = "NO SPECIFIC STATUTE FOUND. APPLY GENERAL COMMON LAW PRINCIPLES (NEGLIGENCE, STRICT LIABILITY, CONTRACTS).";
    }

    // 3) Magistrate Prompt (with explicit allow-list)
    const allowListBlock =
      providedUrns.length > 0
        ? providedUrns.map((u) => `- ${u}`).join("\n")
        : "None (Common law fallback).";

    const prompt = `
ROLE: You are an impartial Magistrate Judge.
TODAY'S DATE: ${today}
TASK: Compare the Claimant's Facts against the Provided Law (or Common Law if specific statute missing).

--- THE LAW ---
${lawText.substring(0, 20000)}

--- JUDICIAL OVERRIDES ---
${overrides.length > 0 ? overrides.join("\n") : "None."}

--- THE FACTS ---
${factSummary}

CRITICAL CITATION RULES (NON-NEGOTIABLE):
- You may ONLY cite URNs that appear in the ALLOWED URNS list below.
- If you cannot support a conclusion using ONLY those URNs, you must say so and choose POSSIBLE_VIOLATION or UNLIKELY_VIOLATION.
- Never invent URNs. Never cite a URN not in the list.

ALLOWED URNS:
${allowListBlock}

INSTRUCTIONS:
1. Compare facts to the elements of the law.
2. CHECK TIMELINESS: Compare dates in the FACTS against TODAY'S DATE (${today}).
3. OVERRIDE CHECK: If a law is flagged as VACATED or STAYED, you CANNOT find a violation based on it.

Determine Status:
- LIKELY_VIOLATION: Clear alignment + Timely.
- POSSIBLE_VIOLATION: Plausible, but vague.
- UNLIKELY_VIOLATION: Facts contradict elements or defense is clear.
- INELIGIBLE: Wrong jurisdiction or Statute of Limitations expired.

OUTPUT JSON:
{
  "status": "LIKELY_VIOLATION" | "POSSIBLE_VIOLATION" | "UNLIKELY_VIOLATION" | "INELIGIBLE",
  "confidence_score": number (0.0-1.0),
  "analysis": {
    "summary": "Concise legal opinion...",
    "missing_elements": ["Evidence needed..."],
    "strength_factors": ["Facts that support the claim..."],
    "weakness_factors": ["Facts that hurt the claim..."]
  },
  "relevant_citations": ["urn:lex:..."]
}
    `.trim();

    try {
      const response = await withRetry(
        async () => {
          return await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are a strict, citation-focused Magistrate. You never invent citations." },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0,
          });
        },
        { maxDurationMs: 30000 }
      );

      const rawJson = response.choices[0].message.content || "{}";
      const parsed = JSON.parse(rawJson);
      const verdict = VerdictSchema.parse(parsed);

      // 4) HARD GATE #1: citations must be subset of provided URNs
      const guarded = this.guardVerdict(verdict, providedUrns);

      // 5) HARD GATE #2: citations must resolve in DB (no “phantom URNs”)
      const verified = await this.filterToExistingUrns(guarded.verdict.relevant_citations);

      if (verified.length !== guarded.verdict.relevant_citations.length) {
        return {
          ...guarded.verdict,
          status: "POSSIBLE_VIOLATION",
          confidence_score: Math.min(guarded.verdict.confidence_score, 0.35),
          relevant_citations: verified,
          analysis: {
            ...guarded.verdict.analysis,
            summary:
              `[CITATION_DB_GUARD] Some citations did not resolve in the database and were removed.\n` +
              guarded.verdict.analysis.summary,
          },
        };
      }

      return {
        ...guarded.verdict,
        relevant_citations: verified,
      };

    } catch (error) {
      console.error("[Judge] ❌ Mistrial:", error);
      return {
        status: "POSSIBLE_VIOLATION",
        confidence_score: 0.5,
        analysis: {
            summary: "AI analysis unavailable. Defaulting to manual review.",
            missing_elements: [],
            findings: [],              // ✅ add this
            strength_factors: [],
            weakness_factors: []
        },
        relevant_citations: anchors
        };
    }
  }
}
