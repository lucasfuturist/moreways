import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface FieldAiPromptBubbleProps {
  fieldKey: string;
  onClose: () => void;
  onSubmit: (prompt: string) => Promise<void>;
}

export function FieldAiPromptBubble({ fieldKey, onClose, onSubmit }: FieldAiPromptBubbleProps) {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(input);
      onClose();
    } catch (err) {
      setError("AI request failed. Try again.");
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div 
      className="absolute top-full right-0 mt-2 z-50 w-72 animate-in fade-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl p-3 space-y-3 bg-white/95 dark:bg-violet-950/90 backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-teal-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            <span className="text-[10px] font-bold tracking-wide uppercase">Ask AI</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Input */}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`How should I change this field?`}
            rows={2}
            disabled={isSubmitting}
            className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-teal-500/50 resize-none"
          />
        </div>

        {/* Error State */}
        {error && (
          <p className="text-[10px] text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded border border-red-100 dark:border-red-500/20">
            {error}
          </p>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono hidden sm:inline-block">⌘ + Enter</span>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2 py-1 transition-colors"
            >
              Cancel
            </button>
            <Button 
              size="sm" 
              className="h-7 text-xs"
              onClick={handleSubmit} 
              isLoading={isSubmitting}
              disabled={!input.trim()}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* Pointer Triangle */}
      <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white dark:bg-violet-950/90 border-l border-t border-slate-200 dark:border-white/10 transform rotate-45 pointer-events-none" />
    </div>
  );
}