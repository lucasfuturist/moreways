"use client";

import React, { useRef, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { getSuggestions } from "./SuggestionEngine";

interface CommandPaletteProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function CommandPalette({ value, onChange, onSubmit, isLoading }: CommandPaletteProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [suggestions, setSuggestions] = useState(getSuggestions(""));

  useEffect(() => {
    setSuggestions(getSuggestions(value));
  }, [value]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleChipClick = (label: string) => {
    if (!value.trim()) {
      onChange(`Create a ${label} form that collects...`);
    } else {
      onChange(`${value}\n\nAlso ${label.toLowerCase()}...`);
    }
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 flex flex-col gap-3">
      
      {/* Suggestion Chips */}
      <div className="flex gap-2 justify-center overflow-x-auto pb-1 mask-linear no-scrollbar">
        {suggestions.map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleChipClick(chip.label)}
            className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-midnight-900/60 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-accent-500/10 transition-all whitespace-nowrap backdrop-blur-md shadow-sm"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Card */}
      <GlassCard 
        noPadding 
        className="relative ring-1 ring-slate-200 dark:ring-white/10 focus-within:ring-indigo-500/50 dark:focus-within:ring-accent-500/50 focus-within:shadow-lg transition-all shadow-xl bg-white/90 dark:bg-slate-900/80"
      >
        <div className="flex items-end p-2 gap-2">
          
          {/* Magic Icon (Visual) */}
          <div className="pb-3 pl-2 text-indigo-500 dark:text-accent-400 animate-pulse-slow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="flex-1 relative py-2">
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the form you need..."
              rows={1}
              disabled={isLoading}
              className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 resize-none p-0 max-h-60 overflow-y-auto font-sans text-base leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-1">
            {/* Send Button */}
            <Button
              size="icon"
              variant="primary"
              onClick={onSubmit}
              disabled={!value.trim() || isLoading}
              className="rounded-lg"
            >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
        </div>

        {/* Keyboard Hint */}
        <div className="absolute right-14 bottom-4 text-[10px] text-slate-400 dark:text-slate-600 font-mono pointer-events-none hidden sm:block">
          ⌘ + ↵
        </div>
      </GlassCard>
      
      <div className="text-center">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
          ARGUEOS v1.0 • POWERED BY LLM
        </p>
      </div>
    </div>
  );
}