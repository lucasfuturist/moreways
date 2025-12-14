"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, BookOpen } from "lucide-react";
import { clsx } from "clsx";

interface VerdictProps {
  status: "LIKELY_VIOLATION" | "POSSIBLE_VIOLATION" | "UNLIKELY_VIOLATION" | "INELIGIBLE";
  confidence: number; // 0.0 to 1.0
  summary: string;
  missingElements: string[];
  citations: string[];
}

export function VerdictCard({ 
  status, 
  confidence, 
  summary, 
  missingElements = [], 
  citations = []        
}: VerdictProps) {
  
  const config = {
    LIKELY_VIOLATION: { color: "bg-emerald-500", text: "text-emerald-500", label: "Strong Claim", icon: CheckCircle2 },
    POSSIBLE_VIOLATION: { color: "bg-amber-500", text: "text-amber-500", label: "Potential Claim", icon: AlertTriangle },
    UNLIKELY_VIOLATION: { color: "bg-red-500", text: "text-red-500", label: "Unlikely Claim", icon: XCircle },
    INELIGIBLE: { color: "bg-slate-500", text: "text-slate-500", label: "Ineligible", icon: XCircle },
  };

  const theme = config[status] || config.POSSIBLE_VIOLATION;
  const scorePercent = Math.round(confidence * 100);

  // [FIX] Pre-filter citations to remove garbage data (like "ii" or empty strings)
  const validCitations = citations.filter(c => c && c.length > 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Score Circle */}
            <div className="flex-none relative">
                <div className={clsx("w-24 h-24 rounded-full flex items-center justify-center border-4", theme.text.replace('text-', 'border-'))}>
                    <span className={clsx("text-2xl font-bold", theme.text)}>{scorePercent}%</span>
                </div>
                <div className={clsx("absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white uppercase whitespace-nowrap", theme.color)}>
                    {theme.label}
                </div>
            </div>

            <div className="flex-1 space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Legal Analysis</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{summary}</p>
                </div>

                {missingElements && missingElements.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/50">
                        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-2">Missing Information</h4>
                        <ul className="list-disc list-inside text-sm text-amber-800 dark:text-amber-200 space-y-1">
                            {missingElements.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                    </div>
                )}

                {/* [FIX] Render only valid citations */}
                {validCitations.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5" /> Cited Regulations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {validCitations.map((urn, i) => (
                                <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded font-mono border border-slate-200 dark:border-slate-700">
                                    {urn.split(':').pop()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}