// src/forms/ui/simulator/SimulatorOverlay.tsx

"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { Play, RotateCcw, User, Zap, Coffee, Briefcase } from "lucide-react";
import { playSimulation, type PersonaType } from "./AutoFillEngine";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface SimulatorOverlayProps {
  schema: FormSchemaJsonShape | null;
  onReset: () => void;
  onSimulateField: (key: string, val: any) => void;
}

export function SimulatorOverlay({ schema, onReset, onSimulateField }: SimulatorOverlayProps) {
  const [activePersona, setActivePersona] = useState<PersonaType>("standard");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  if (!schema) return null;

  const handlePlay = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    onReset(); // Clear form first

    await playSimulation(
        schema, 
        activePersona, 
        (key, val) => onSimulateField(key, val),
        (key) => setActiveField(key)
    );

    setIsPlaying(false);
  };

  const personas = [
    { id: "standard", label: "Standard", icon: <User className="w-3 h-3"/> },
    { id: "anxious", label: "Anxious", icon: <Coffee className="w-3 h-3"/> },
    { id: "corporate", label: "Pro", icon: <Briefcase className="w-3 h-3"/> },
    { id: "senior", label: "Senior", icon: <Zap className="w-3 h-3"/> },
  ];

  return (
    <div className="mt-12 border-t border-dashed border-slate-200 dark:border-slate-800 pt-8 relative">
      
      {/* Active Field Indicator (Floating Badge) */}
      {activeField && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-bounce z-20 border border-indigo-400">
           GHOST TYPING: {activeField}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner border border-slate-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
        
        {/* Animated Background Gradient (Subtle) */}
        <div className={clsx("absolute inset-0 opacity-10 dark:opacity-20 transition-opacity duration-500 pointer-events-none", isPlaying ? "opacity-30" : "opacity-0")}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 animate-pulse" />
        </div>

        {/* Left: Controls */}
        <div className="flex items-center gap-4 relative z-10 overflow-hidden w-full md:w-auto">
           <div className="flex items-center gap-2 flex-shrink-0">
              <div className={clsx("w-2 h-2 rounded-full transition-colors", isPlaying ? "bg-emerald-500 animate-pulse" : "bg-slate-400 dark:bg-slate-600")} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Simulator</span>
           </div>

           <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-2 flex-shrink-0" />

           {/* Persona Switcher (Scrollable) */}
           {/* [FIX] Added overflow-x-auto and max-w-full to prevent clipping on narrow screens */}
           <div className="flex bg-white dark:bg-black/40 p-1 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm overflow-x-auto max-w-full custom-scrollbar">
              {personas.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActivePersona(p.id as PersonaType)}
                    disabled={isPlaying}
                    className={clsx(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all disabled:opacity-50 whitespace-nowrap flex-shrink-0",
                        activePersona === p.id 
                            ? "bg-indigo-600 text-white shadow-md" 
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                    )}
                  >
                      {p.icon}
                      <span className="inline">{p.label}</span>
                  </button>
              ))}
           </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 relative z-10 flex-shrink-0">
            <button 
                onClick={handlePlay} 
                disabled={isPlaying}
                className={clsx(
                    "relative inline-flex items-center justify-center rounded-lg px-6 py-2 text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
                    "bg-slate-900 text-white hover:bg-slate-800",
                    "dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500"
                )}
            >
                {isPlaying ? (
                    <span className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> 
                        Running...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 fill-current" /> 
                        Auto-Fill
                    </span>
                )}
            </button>
            
            <button 
                onClick={onReset}
                disabled={isPlaying} 
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-30"
                title="Clear Form"
            >
                <RotateCcw className="w-4 h-4" />
            </button>
        </div>

      </div>
    </div>
  );
}