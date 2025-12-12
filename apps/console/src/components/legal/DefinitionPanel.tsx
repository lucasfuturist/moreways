"use client";

import React, { useEffect, useState } from "react";
import { X, BookOpen, Scale, Loader2, Copy, Check, ArrowLeft, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface DefinitionPanelProps {
  urn: string | null;
  onClose: () => void;
}

interface LegalNode {
  id: string;
  urn: string;
  structure_type: string;
  content_text: string;
  citation_path: string;
}

export function DefinitionPanel({ urn, onClose }: DefinitionPanelProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [data, setData] = useState<LegalNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const activeUrn = history.length > 0 ? history[history.length - 1] : urn;
  const isDrilledDown = history.length > 0;

  const API_BASE = process.env.NEXT_PUBLIC_LAW_ENGINE_URL || "http://localhost:3000/api/v1";

  // Reset history if the parent trigger changes
  useEffect(() => {
    if (urn) setHistory([]);
  }, [urn]);

  useEffect(() => {
    if (!activeUrn) return;

    setCopied(false);
    setError(false);
    
    // Smooth transition: Keep old data visible until new data arrives if drilling down
    if (!isDrilledDown) setData(null);

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/node/${encodeURIComponent(activeUrn)}`);
        
        if (res.ok) {
          const json = await res.json();
          // Artificial delay for UI feel
          await new Promise(r => setTimeout(r, 250)); 
          setData(json.data);
        } else {
          console.error("Failed to fetch node:", activeUrn);
          setError(true);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeUrn]);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.content_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    setHistory((prev) => prev.slice(0, -1));
  };

  const renderContent = (text: string, currentUrn: string) => {
    // Regex matches "940 CMR 10.05" or "10.05(4)"
    const citationRegex = /(?:940\s+CMR\s+)?(\d{1,2}\.\d{2})(?:\((\d+)\))?/gi;
    
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = citationRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        const section = match[1].replace('.', '_'); // 10.05 -> 10_05
        
        // [FIX] ROBUST STRATEGY: Always target the SECTION
        // We ignore the specific subsection (match[2]) for the URN lookup.
        // The backend's "Full Context" logic will return the whole section anyway.
        
        const urnParts = currentUrn.split(':');
        // Extract corpus prefix (urn:lex:fed:corpus_id)
        const corpusPrefix = urnParts.slice(0, 4).join(':');
        
        const targetUrn = `${corpusPrefix}:${section}`;

        parts.push(
            <span 
                key={match.index}
                onClick={(e) => {
                    e.stopPropagation();
                    console.log("Navigating to Section:", targetUrn);
                    setHistory(prev => [...prev, targetUrn]);
                }}
                className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-bold hover:underline decoration-2 underline-offset-2 bg-indigo-50 dark:bg-indigo-500/10 px-1 rounded mx-0.5 transition-colors inline-block"
                title={`Read Full Text of ${match[1]}`}
            >
                {match[0]}
            </span>
        );

        lastIndex = citationRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  const panelVariants: Variants = {
    hidden: { x: 380, opacity: 0, scale: 0.95 },
    visible: { 
      x: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    exit: { 
      x: 380, 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };

  const contentVariants: Variants = {
    initial: { opacity: 0, x: 20, filter: "blur(4px)" },
    animate: { 
      opacity: 1, 
      x: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.3 } 
    },
    exit: { 
      opacity: 0, 
      x: -20, 
      filter: "blur(4px)",
      transition: { duration: 0.2 } 
    }
  };

  if (!urn && history.length === 0) return null;

  return (
    <motion.div 
      className="fixed top-24 right-4 z-40 w-full max-w-sm"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={cn(
          "backdrop-blur-2xl border shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5 transition-colors duration-500",
          isDrilledDown 
            ? "bg-slate-50/95 dark:bg-slate-900/95 border-indigo-200 dark:border-indigo-900" 
            : "bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-700"
      )}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            {isDrilledDown ? (
               <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white" onClick={handleBack}>
                 <ArrowLeft className="w-4 h-4" />
               </Button>
            ) : (
               <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            )}
            
            <span className={cn(
                "text-xs font-bold uppercase tracking-wider transition-colors",
                isDrilledDown ? "text-slate-900 dark:text-white" : "text-indigo-600 dark:text-indigo-400"
            )}>
                {isDrilledDown ? "Full Legal Context" : "Official Definition"}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800" onClick={onClose}>
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Body Container */}
        <div className="p-6 max-h-[70vh] overflow-y-auto min-h-[200px] flex flex-col relative">
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 z-10 bg-inherit"
              >
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                <span className="text-sm font-medium">Fetching law...</span>
              </motion.div>
            ) : error ? (
                <motion.div
                    key="error"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                >
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-3 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Citation Not Found</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                        The system could not locate <code>{activeUrn?.split(':').pop()}</code>.
                    </p>
                    {isDrilledDown && (
                        <Button variant="link" size="sm" onClick={handleBack} className="mt-2 text-indigo-600 dark:text-indigo-400">
                            Go Back
                        </Button>
                    )}
                </motion.div>
            ) : data ? (
              <motion.div 
                key={data.urn} 
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                {/* Meta Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]" title={data.urn}>
                        {data.urn.split(':').pop()}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {data.structure_type}
                      </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="prose prose-sm dark:prose-invert">
                  <p className={cn(
                      "text-base font-medium leading-relaxed transition-colors whitespace-pre-line", // Added whitespace-pre-line to preserve structure
                      isDrilledDown ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"
                  )}>
                    {renderContent(data.content_text, data.urn)}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    {isDrilledDown ? <FileText className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                    <span className="font-mono truncate max-w-[150px]">{data.citation_path}</span>
                  </div>
                  
                  <button 
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                  >
                      <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                          <motion.span 
                            key="check"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center gap-1 text-emerald-500"
                          >
                            <Check className="w-3 h-3" /> Copied
                          </motion.span>
                        ) : (
                          <motion.span 
                            key="copy"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </motion.span>
                        )}
                      </AnimatePresence>
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}