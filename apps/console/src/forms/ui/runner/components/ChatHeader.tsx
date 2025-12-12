"use client";

import React from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface ChatHeaderProps {
  formName: string;
  progressPercent: number;
}

export function ChatHeader({ formName, progressPercent }: ChatHeaderProps) {
  return (
    // CHANGED: fixed -> absolute. Anchors to ChatRunner container.
    <div className="absolute top-0 left-0 right-0 z-40 px-4 pt-4 pb-2 bg-gradient-to-b from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent pointer-events-none transition-all duration-500">
      <header className="pointer-events-auto mx-auto max-w-3xl h-16 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm flex items-center justify-between px-5 relative overflow-hidden transition-all duration-500">
        
        {/* Progress Bar Background */}
        <div 
            className="absolute bottom-0 left-0 h-[3px] bg-indigo-500/50 transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }} 
        />

        {/* Left: Brand + Context */}
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/20 shadow-inner">
                <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
                <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                    {formName || "Intake"}
                </h1>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                    {progressPercent < 100 ? `${progressPercent}% Complete` : 'Final Review'}
                </span>
            </div>
        </div>

        {/* Right: Security Badge + Theme */}
        <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Secure</span>
            </div>
            <div className="pl-2 border-l border-slate-200 dark:border-white/10">
                <ThemeToggle />
            </div>
        </div>
      </header>
    </div>
  );
}