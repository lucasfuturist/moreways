"use client";

import * as React from "react";

type EvidenceQuote = { urn: string; quote: string };

type Finding = {
  text: string;
  citations: string[];
  evidence_quotes: EvidenceQuote[];
};

export type Verdict = {
  status: "LIKELY_VIOLATION" | "POSSIBLE_VIOLATION" | "UNLIKELY_VIOLATION" | "INELIGIBLE";
  confidence_score: number;
  analysis?: {
    summary?: string;
    missing_elements?: string[];
    strength_factors?: string[];
    weakness_factors?: string[];
    findings?: Finding[];
  };
  relevant_citations?: string[];
};

function pct(n: number) {
  if (!Number.isFinite(n)) return "0%";
  const clamped = Math.max(0, Math.min(1, n));
  return `${Math.round(clamped * 100)}%`;
}

function statusTone(status: Verdict["status"]) {
  switch (status) {
    case "LIKELY_VIOLATION":
      return "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30";
    case "POSSIBLE_VIOLATION":
      return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30";
    case "UNLIKELY_VIOLATION":
      return "bg-slate-500/15 text-slate-200 ring-1 ring-slate-500/30";
    case "INELIGIBLE":
      return "bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30";
  }
}

function hasGuardText(summary: string) {
  return summary.includes("[CITATION_GUARD]") || summary.includes("[CITATION_DB_GUARD]");
}

function splitGuard(summary: string) {
  const lines = summary.split("\n");
  const guardLines = lines.filter(
    (l) => l.includes("[CITATION_GUARD]") || l.includes("[CITATION_DB_GUARD]")
  );
  const bodyLines = lines.filter((l) => !guardLines.includes(l));
  return {
    guard: guardLines.join("\n").trim(),
    body: bodyLines.join("\n").trim(),
  };
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}

export function VerdictCard({
  verdict,
  title = "Magistrate Verdict",
  onUrnClick,
}: {
  verdict: Verdict;
  title?: string;
  onUrnClick?: (urn: string) => void;
}) {
  // --- hardening: never assume shape ---
  const status = verdict?.status ?? "POSSIBLE_VIOLATION";
  const confidence = typeof verdict?.confidence_score === "number" ? verdict.confidence_score : 0;

  const analysis = verdict?.analysis ?? {};
  const rawSummary = typeof analysis?.summary === "string" ? analysis.summary : "";
  const { guard, body } = splitGuard(rawSummary);

  const citations = uniq(((verdict?.relevant_citations ?? []) as string[]).filter(Boolean));

  const strength = ((analysis?.strength_factors ?? []) as string[]).filter(Boolean);
  const weakness = ((analysis?.weakness_factors ?? []) as string[]).filter(Boolean);
  const missing = ((analysis?.missing_elements ?? []) as string[]).filter(Boolean);
  const findings = ((analysis?.findings ?? []) as Finding[]).filter(Boolean);

  const showGuard = rawSummary ? hasGuardText(rawSummary) : false;
  const displaySummary = body || rawSummary || "No summary returned.";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm text-white/60">{title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusTone(
                status
              )}`}
            >
              {status}
            </span>
            <span className="text-xs text-white/60">
              confidence: <span className="font-semibold text-white/80">{pct(confidence)}</span>
            </span>
          </div>
        </div>

        {showGuard && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
            <div className="font-semibold">citation guard triggered</div>
            <div className="mt-1 whitespace-pre-wrap text-amber-100/90">
              {guard || "Some citations were filtered/removed."}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4">
        <div className="text-xs font-semibold text-white/70">Summary</div>
        <div className="mt-2 whitespace-pre-wrap text-sm text-white/85">{displaySummary}</div>
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Section title="Missing Elements" emptyText="None listed.">
          <BulletList items={missing} />
        </Section>

        <Section title="Suggested Citations (DB-verified)" emptyText="None.">
          <ul className="space-y-2">
            {citations.map((urn) => (
              <li key={urn} className="flex items-start justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onUrnClick?.(urn)}
                  className="text-left text-xs text-sky-200 hover:text-sky-100 underline underline-offset-2"
                  title="Open law node"
                >
                  {urn}
                </button>

                <CopyButton value={urn} />
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Strength Factors" emptyText="None listed.">
          <BulletList items={strength} />
        </Section>

        <Section title="Weakness Factors" emptyText="None listed.">
          <BulletList items={weakness} />
        </Section>
      </div>

      {/* Findings (optional) */}
      <div className="mt-4">
        <details className="rounded-xl border border-white/10 bg-black/10 px-4 py-3">
          <summary className="cursor-pointer select-none text-sm font-semibold text-white/80">
            Findings ({findings.length})
            <span className="ml-2 text-xs font-normal text-white/50">
              (structured claims; may be empty unless you prompt for them)
            </span>
          </summary>

          {findings.length === 0 ? (
            <div className="mt-3 text-sm text-white/60">No findings returned.</div>
          ) : (
            <div className="mt-3 space-y-4">
              {findings.map((f, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-sm font-semibold text-white/85">
                    {idx + 1}. {f.text}
                  </div>

                  <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold text-white/60">Citations</div>
                      <ul className="mt-1 space-y-1">
                        {(f.citations || []).map((u) => (
                          <li key={u}>
                            <button
                              type="button"
                              onClick={() => onUrnClick?.(u)}
                              className="text-left text-xs text-sky-200 hover:text-sky-100 underline underline-offset-2"
                            >
                              {u}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-white/60">Evidence Quotes</div>
                      <div className="mt-1 space-y-2">
                        {(f.evidence_quotes || []).map((q, qi) => (
                          <blockquote
                            key={qi}
                            className="rounded-lg border border-white/10 bg-black/20 p-2"
                          >
                            <div className="text-[11px] text-white/60">{q.urn}</div>
                            <div className="mt-1 text-xs text-white/85">“{q.quote}”</div>
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </details>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  emptyText,
}: {
  title: string;
  children: React.ReactNode;
  emptyText: string;
}) {
  // keep simple: always render children; BulletList handles empties
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-4">
      <div className="text-xs font-semibold text-white/70">{title}</div>
      <div className="mt-2">{children ?? <div className="text-sm text-white/60">{emptyText}</div>}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <div className="text-sm text-white/60">None.</div>;
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-white/80">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70 hover:text-white/90"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 900);
        } catch {
          // ignore
        }
      }}
      title="Copy"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}
