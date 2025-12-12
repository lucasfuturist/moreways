"use client";

import React from "react";
import { clsx } from "clsx";
import { ShieldAlert, CheckCircle, AlertTriangle, XCircle, Gavel, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkline } from "@/components/viz/Sparkline"; // Assuming you have this or generic div

// Reuse the schema type or define locally for UI
interface ClaimAssessment {
  meritScore: number;
  category: "high_merit" | "potential" | "low_merit" | "frivolous" | "insufficient_data";
  primaFacieAnalysis: {
    duty: string;
    breach: string;
    causation: string;
    damages: string;
  };
  credibilityFlags: string[];
  summary: string;
}

interface ClaimAnalysisCardProps {
  assessment: ClaimAssessment | null;
  isLoading: boolean;
  onRunAssessment: () => void;
}

export function ClaimAnalysisCard({ assessment, isLoading, onRunAssessment }: ClaimAnalysisCardProps) {
  if (!assessment && !isLoading) {
    return (
      <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-slate-700 bg-slate-900/30">
        <div className="p-3 rounded-full bg-slate-800 text-slate-400">
            <Gavel className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-sm font-bold text-slate-200">AI Merit Analysis</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">Run a preliminary legal check on this intake.</p>
        </div>
        <button 
            onClick={onRunAssessment}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
        >
            Run Assessment
        </button>
      </GlassCard>
    );
  }

  if (isLoading) {
    return (
        <GlassCard className="p-8 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-xs font-mono text-indigo-400 animate-pulse">ANALYZING PRIMA FACIE ELEMENTS...</p>
        </GlassCard>
    );
  }

  if (!assessment) return null;

  // Visual Logic
  const scoreColor = 
    assessment.meritScore >= 80 ? "text-emerald-400" : 
    assessment.meritScore >= 50 ? "text-amber-400" : "text-red-400";
  
  const ringColor = 
    assessment.meritScore >= 80 ? "border-emerald-500" : 
    assessment.meritScore >= 50 ? "border-amber-500" : "border-red-500";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* SCORE HEADER */}
        <div className="flex gap-4">
            <GlassCard noPadding className="flex-1 p-5 flex items-center justify-between bg-gradient-to-br from-slate-900 to-slate-950 border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Gavel className="w-24 h-24" />
                </div>
                
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Merit Score</span>
                        <span className={clsx("text-[9px] px-1.5 py-0.5 rounded border border-white/10 uppercase font-mono", scoreColor)}>
                            {assessment.category.replace("_", " ")}
                        </span>
                    </div>
                    <div className={clsx("text-4xl font-black tracking-tighter", scoreColor)}>
                        {assessment.meritScore}/100
                    </div>
                </div>

                {/* Donut Chart Simulation */}
                <div className={clsx("w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-[0_0_20px_currentColor]", ringColor, scoreColor)}>
                    <span className="text-lg font-bold">{assessment.meritScore}</span>
                </div>
            </GlassCard>
        </div>

        {/* SUMMARY & FLAGS */}
        <GlassCard noPadding className="p-5 space-y-4 bg-slate-900/50">
            <div>
                <h4 className="text-[10px] font-bold uppercase text-slate-500 mb-2">Executive Summary</h4>
                <p className="text-sm text-slate-200 leading-relaxed italic border-l-2 border-indigo-500 pl-3">
                    "{assessment.summary}"
                </p>
            </div>

            {assessment.credibilityFlags.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2 text-red-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">Credibility Warnings</span>
                    </div>
                    <ul className="space-y-1">
                        {assessment.credibilityFlags.map((flag, i) => (
                            <li key={i} className="text-xs text-red-300 flex items-start gap-1.5">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500" />
                                {flag}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </GlassCard>

        {/* PRIMA FACIE GRID */}
        <div className="grid grid-cols-2 gap-3">
            <ElementBox label="Duty" value={assessment.primaFacieAnalysis.duty} />
            <ElementBox label="Breach" value={assessment.primaFacieAnalysis.breach} />
            <ElementBox label="Causation" value={assessment.primaFacieAnalysis.causation} />
            <ElementBox label="Damages" value={assessment.primaFacieAnalysis.damages} />
        </div>
    </div>
  );
}

function ElementBox({ label, value }: { label: string, value: string }) {
    const isNegative = value.toLowerCase().includes("n/a") || value.toLowerCase().includes("unclear") || value.toLowerCase().includes("no ");
    return (
        <GlassCard noPadding className={clsx("p-3 border-l-2", isNegative ? "border-l-red-500 bg-red-500/5" : "border-l-emerald-500 bg-emerald-500/5")}>
            <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] font-bold uppercase text-slate-500">{label}</span>
                {isNegative ? <XCircle className="w-3 h-3 text-red-500" /> : <CheckCircle className="w-3 h-3 text-emerald-500" />}
            </div>
            <p className="text-xs text-slate-300 line-clamp-3 leading-snug">{value}</p>
        </GlassCard>
    );
}