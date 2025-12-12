import React from "react";
import { clsx } from "clsx";
import type { FormVersionSummary } from "@/forms/repo/forms.repo.FormSchemaRepo";

interface VersionHistorySliderProps {
  versions: FormVersionSummary[];
  currentVersionId: string;
  onSelectVersion: (id: string) => void;
}

export function VersionHistorySlider({ versions, currentVersionId, onSelectVersion }: VersionHistorySliderProps) {
  if (!versions || versions.length <= 1) return null;

  const currentIndex = versions.findIndex(v => v.id === currentVersionId);
  const progressPercent = currentIndex === -1 ? 0 : (currentIndex / (versions.length - 1)) * 100;

  return (
    <div className="w-full px-4 py-2 bg-slate-100 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 backdrop-blur-sm flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-500 rounded-lg mt-2">
      
      <div className="flex-none flex flex-col">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Time Travel</span>
        <span className="text-xs font-mono text-indigo-500 dark:text-teal-400">v{versions[currentIndex]?.version}</span>
      </div>

      <div className="flex-1 relative h-8 flex items-center">
        {/* Track Line */}
        <div className="absolute left-0 right-0 h-0.5 bg-slate-300 dark:bg-white/10 rounded-full" />
        
        {/* Progress Line */}
        <div 
            className="absolute left-0 h-0.5 bg-indigo-500/50 dark:bg-teal-500/50 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercent}%` }} 
        />

        {/* Ticks */}
        <div className="absolute left-0 right-0 flex justify-between items-center">
          {versions.map((v, idx) => {
            const isActive = v.id === currentVersionId;
            const isPast = idx <= currentIndex;

            return (
              <button
                key={v.id}
                onClick={() => onSelectVersion(v.id)}
                className="group relative w-4 h-8 flex items-center justify-center focus:outline-none"
                title={`v${v.version} - ${new Date(v.createdAt).toLocaleTimeString()}`}
              >
                <div 
                    className={clsx(
                        "w-2 h-2 rounded-full transition-all duration-200 border",
                        isActive 
                            ? "bg-indigo-600 dark:bg-teal-500 border-indigo-500 dark:border-teal-400 scale-125 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                            : isPast 
                                ? "bg-indigo-200 dark:bg-teal-900/50 border-indigo-300 dark:border-teal-700 hover:bg-indigo-500 dark:hover:bg-teal-500"
                                : "bg-slate-300 dark:bg-black/50 border-slate-400 dark:border-white/10 hover:border-slate-500 dark:hover:border-white/30"
                    )} 
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white border border-white/10 px-2 py-1 rounded text-[9px] whitespace-nowrap z-20 shadow-lg">
                    v{v.version}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-none text-[9px] text-slate-500 text-right">
        Latest: v{versions[versions.length - 1].version}
      </div>
    </div>
  );
}