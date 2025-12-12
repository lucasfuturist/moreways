"use client";

import React, { useState } from "react";
import { Clock, X } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { VersionHistorySlider } from "./VersionHistorySlider";
import type { FormVersionSummary } from "@/forms/repo/forms.repo.FormSchemaRepo";

interface HistoryControlProps {
  versions: FormVersionSummary[];
  currentVersionId: string;
  onSelectVersion: (id: string) => void;
}

export function HistoryControl({ versions, currentVersionId, onSelectVersion }: HistoryControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!versions || versions.length <= 1) return null;

  return (
    <>
      {/* 1. The Trigger Button */}
      <div className="absolute bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "group flex items-center gap-0 overflow-hidden rounded-full shadow-2xl transition-all duration-300 border h-10",
            isOpen 
              ? "bg-slate-900 text-white border-slate-700 w-10 justify-center px-0" 
              : "bg-white/40 dark:bg-black/20 backdrop-blur-md border-white/20 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-white/90 dark:hover:bg-slate-900/90 hover:text-slate-900 dark:hover:text-white w-10 hover:w-28 pl-0"
          )}
        >
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
             {isOpen ? <X className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </div>
          
          {!isOpen && (
            <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-1">
              History
            </span>
          )}
        </button>
      </div>

      {/* 2. The Slider Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            <div className="w-full flex justify-center pt-2 pb-1 cursor-pointer" onClick={() => setIsOpen(false)}>
                <div className="w-12 h-1 bg-slate-300 dark:bg-white/10 rounded-full" />
            </div>

            <div className="pb-6 px-4 md:px-20">
               <VersionHistorySlider 
                  versions={versions} 
                  currentVersionId={currentVersionId} 
                  onSelectVersion={onSelectVersion} 
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}