"use client";

import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Layers, FileText, Edit, Send, MessageSquare, AlertTriangle } from "lucide-react";

export type MessageVariant =
  | "system"
  | "agent"
  | "user"
  | "section"
  | "warning"
  | "section_complete"
  | "review_summary"
  | "completion_options";

interface IntakeChatMessageProps {
  variant: MessageVariant;
  content: React.ReactNode;
  label?: string;
  description?: string;
  isLatest?: boolean;
  data?: Record<string, any>;
  onReview?: () => void;
  onSubmit?: () => void;
}

// FIX: Wrapped in forwardRef to satisfy Framer Motion (AnimatePresence)
export const IntakeChatMessage = forwardRef<HTMLDivElement, IntakeChatMessageProps>(
  ({ variant, content, isLatest, data, onReview, onSubmit }, ref) => {
  
  // --- USER MESSAGE ---
  if (variant === "user") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex justify-end mb-6 pl-12"
      >
        <div className="flex flex-col items-end gap-1 max-w-[85%]">
          <div className="bg-slate-900 dark:bg-indigo-600 text-white px-5 py-4 rounded-[1.25rem] rounded-tr-sm shadow-xl shadow-indigo-900/10 dark:shadow-indigo-500/20 border border-white/10 text-sm leading-relaxed">
             {content}
          </div>
          <span className="text-[10px] text-slate-400 font-medium mr-1 opacity-80">You</span>
        </div>
      </motion.div>
    );
  }

  // --- SPECIAL UI BLOCKS ---
  if (variant === "completion_options") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex flex-wrap gap-3 mt-4 mb-16 ml-12"
      >
        <button 
            onClick={onReview}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm hover:scale-105"
        >
            <Edit className="w-3.5 h-3.5" />
            <span className="font-medium text-xs">Review Answers</span>
        </button>

        <button 
            onClick={onSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all font-semibold text-xs"
        >
            <Send className="w-3.5 h-3.5" />
            <span>Finish & Register</span>
        </button>
      </motion.div>
    );
  }

  if (variant === "review_summary") {
    const entries = Object.entries(data || {});
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 ml-12 max-w-md"
      >
        <div className="rounded-2xl overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-white/10">
            <div className="bg-indigo-500/10 px-4 py-3 border-b border-indigo-500/10 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">Summary</span>
            </div>
            <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {entries.map(([key, val]) => (
                    <div key={key} className="flex justify-between items-start gap-4 text-xs border-b border-slate-200 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                        <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-0.5">{key}</span>
                        <span className="text-slate-800 dark:text-slate-200 text-right font-medium">{String(val)}</span>
                    </div>
                ))}
            </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "section") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="my-8 flex items-center justify-center gap-3 opacity-60"
      >
        <div className="h-px w-12 bg-indigo-500/50" />
        <div className="flex items-center gap-2 text-indigo-400 dark:text-indigo-300">
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{content}</span>
        </div>
        <div className="h-px w-12 bg-indigo-500/50" />
      </motion.div>
    );
  }

  if (variant === "warning") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="ml-12 mr-8 my-2 p-3 rounded-lg border border-amber-500/20 bg-amber-500/10 flex gap-3"
      >
        <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-100/90 leading-relaxed">{content}</p>
      </motion.div>
    );
  }

  // --- ASSISTANT MESSAGE ---
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "flex items-end gap-3 mb-6 max-w-[90%]",
        isLatest ? "mb-8" : "mb-4"
      )}
    >
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shadow-sm flex-none ring-1 ring-white/20 z-10">
        <MessageSquare className="w-4 h-4 text-slate-600 dark:text-slate-300" />
      </div>
      
      <div className="flex flex-col gap-1 w-full">
        <div className={clsx(
            "px-5 py-4 rounded-[1.25rem] rounded-tl-sm text-sm leading-relaxed border backdrop-blur-md transition-all duration-500",
            isLatest 
                ? "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 shadow-sm" 
                : "bg-white/60 dark:bg-slate-800/50 border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-300"
        )}>
          {content}
        </div>
        <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider opacity-60">Moreways Assistant</span>
      </div>
    </motion.div>
  );
});

IntakeChatMessage.displayName = "IntakeChatMessage";