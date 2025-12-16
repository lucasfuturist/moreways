"use client";

// apps/web/src/app/magistrate/page.tsx
import React, { useMemo, useState } from "react";
import { VerdictCard } from "@/components/runner/components/VerdictCard";

export default function MagistratePlaygroundPage() {
  const [prompt, setPrompt] = useState("debt collector calling me at work");
  const [factsJson, setFactsJson] = useState<string>(
    JSON.stringify(
      {
        callsPerDay: 5,
        contactedWorkplace: true,
        writtenStopNoticeSent: false,
      },
      null,
      2
    )
  );

  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedFacts = useMemo(() => {
    try {
      const obj = factsJson.trim() ? JSON.parse(factsJson) : {};
      return { ok: true as const, value: obj };
    } catch (e: any) {
      return { ok: false as const, error: e?.message ?? "Invalid JSON" };
    }
  }, [factsJson]);

  async function run() {
    setError(null);
    setVerdict(null);

    if (!prompt.trim()) {
      setError("enter a prompt");
      return;
    }
    if (!parsedFacts.ok) {
      setError(`facts json error: ${parsedFacts.error}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/magistrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          jurisdiction: "MA",
          formData: parsedFacts.value,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json?.error ? `${json.error}` : "request failed");
        setVerdict(null);
        return;
      }

      // Normalize response shape:
      // - sometimes you return { verdict: {...} }
      // - sometimes just {...}
      const v = json?.verdict ?? json;

      // Extra safety: if the server accidentally returns nested again
      const normalized = v?.verdict ?? v;

      setVerdict(normalized);
    } catch (e: any) {
      setError(e?.message ?? "request crashed");
    } finally {
      setLoading(false);
    }
  }

  // also normalize at render-time (covers any future edge cases)
  const renderedVerdict = verdict?.verdict ?? verdict;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold">Magistrate Playground</h1>
          <button
            onClick={run}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Running..." : "Run Magistrate"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-200">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full min-h-[110px] rounded-lg bg-slate-900 border border-slate-800 p-3 text-sm text-slate-100"
              placeholder="e.g. debt collector calling me at work"
            />

            <label className="text-sm font-semibold text-slate-200">Facts (JSON)</label>
            <textarea
              value={factsJson}
              onChange={(e) => setFactsJson(e.target.value)}
              className="w-full min-h-[220px] rounded-lg bg-slate-900 border border-slate-800 p-3 text-xs text-slate-100 font-mono"
              placeholder='{"key":"value"}'
            />

            {!parsedFacts.ok && (
              <div className="text-sm text-red-400">JSON error: {parsedFacts.error}</div>
            )}
            {error && <div className="text-sm text-red-400">{error}</div>}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-200">Verdict</label>

            {renderedVerdict ? (
              <VerdictCard verdict={renderedVerdict as any} />
            ) : (
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-slate-300 text-sm">
                run it to see the verdict card render here.
              </div>
            )}

            {renderedVerdict && (
              <details className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                <summary className="cursor-pointer text-sm text-slate-200">Raw JSON</summary>
                <pre className="mt-3 text-xs text-slate-200 overflow-auto">
                  {JSON.stringify(renderedVerdict, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
