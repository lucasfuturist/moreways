"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button"; // Capital B for Console
import { clsx } from "clsx";

interface VerdictProps {
  // Using a flexible type here to match what the API actually returns
  verdict: {
      status: "LIKELY_VIOLATION" | "POSSIBLE_VIOLATION" | "UNLIKELY_VIOLATION" | "INELIGIBLE";
      confidence: number; // 0.0 to 1.0 or 0 to 100
      analysis: {
          summary: string;
          missing_elements?: string[];
          missingElements?: string[]; // Handle casing variance
      };
      relevant_citations?: string[];
      citations?: string[]; // Handle casing variance
  };
  onReset: () => void;
}

export function VerdictCard({ verdict, onReset }: VerdictProps) {
  
  const config = {
    LIKELY_VIOLATION: { color: "bg-emerald-500", text: "text-emerald-500", label: "Strong Claim", icon: CheckCircle2 },
    POSSIBLE_VIOLATION: { color: "bg-amber-500", text: "text-amber-500", label: "Potential Claim", icon: AlertTriangle },
    UNLIKELY_VIOLATION: { color: "bg-red-500", text: "text-red-500", label: "Unlikely Claim", icon: XCircle },
    INELIGIBLE: { color: "bg-slate-500", text: "text-slate-500", label: "Ineligible", icon: XCircle },
  };

  const status = verdict.status || "POSSIBLE_VIOLATION";
  const theme = config[status] || config.POSSIBLE_VIOLATION;
  
  // Handle both 0-1 and 0-100 scores
  const rawScore = verdict.confidence || 0;
  const scorePercent = rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);

  // Normalize data keys
  const missing = verdict.analysis.missing_elements || verdict.analysis.missingElements || [];
  const citations = verdict.relevant_citations || verdict.citations || [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Score Circle */}
            <div className="flex-none relative mx-auto md:mx-0">
                <div className={clsx("w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-[0_0_20px_rgba(0,0,0,0.1)]", theme.text.replace('text-', 'border-'))}>
                    <span className={clsx("text-2xl font-bold", theme.text)}>{scorePercent}%</span>
                </div>
                <div className={clsx("absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white uppercase whitespace-nowrap shadow-md", theme.color)}>
                    {theme.label}
                </div>
            </div>

            <div className="flex-1 space-y-5 text-left">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Legal Analysis</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                        {verdict.analysis.summary}
                    </p>
                </div>

                {missing.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/50">
                        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5" /> Missing Information
                        </h4>
                        <ul className="list-disc list-inside text-sm text-amber-800 dark:text-amber-200 space-y-1">
                            {missing.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                    </div>
                )}

                {citations.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5" /> Relevant Authority
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {citations.map((urn, i) => (
                                <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded font-mono border border-slate-200 dark:border-slate-700">
                                    {urn.split(':').pop()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button onClick={onReset} className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                      Start New Intake <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}