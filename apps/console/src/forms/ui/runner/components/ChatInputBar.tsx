"use client";

import React, { useRef, useEffect } from "react";
import { Send, Calendar, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface ChatInputBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  inputType?: "text" | "date" | "phone";
  isVisible: boolean;
}

export function ChatInputBar({ value, onChange, onSubmit, inputType = "text", isVisible }: ChatInputBarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const slideUp = {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 },
      transition: { type: "spring", stiffness: 300, damping: 30 }
  } as const;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
        <motion.div 
            {...slideUp}
            className="absolute bottom-0 left-0 right-0 p-4 pb-8 z-50 bg-gradient-to-t from-white dark:from-slate-950 via-white/95 dark:via-slate-950/95 to-transparent flex justify-center pointer-events-none"
        >
            <div className="pointer-events-auto w-full max-w-2xl group relative">
                
                {/* Visual Glow behind input */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-[26px] opacity-20 blur group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200" />

                <div className={clsx(
                    "relative flex items-end gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[24px] shadow-2xl shadow-indigo-500/10 p-2 transition-all",
                    inputType === "date" ? "items-center" : ""
                )}>
                    
                    {/* Icon Indicator (Only for non-text types) */}
                    {inputType !== 'text' && (
                        <div className="pl-3 pb-3 pt-3 text-slate-400 hidden sm:block">
                            {inputType === 'date' && <Calendar className="w-5 h-5 text-indigo-500" />}
                            {inputType === 'phone' && <Phone className="w-5 h-5 text-emerald-500" />}
                        </div>
                    )}

                    {/* INPUT AREA */}
                    <div className="flex-1 min-w-0">
                        {inputType === 'date' ? (
                            <input 
                                type="date"
                                value={value}
                                className="w-full bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 text-base font-medium h-12 px-2"
                                onChange={(e) => onChange(e.target.value)} 
                                onBlur={() => { if(value) onSubmit(); }}
                                autoFocus
                            />
                        ) : (
                            <textarea 
                                ref={inputRef}
                                className={clsx(
                                    "w-full bg-transparent border-none py-3.5 px-3 text-[16px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 outline-none resize-none max-h-32 min-h-[50px] leading-relaxed custom-scrollbar font-sans",
                                    // Adjust padding based on icon presence to align text nicely
                                    inputType === 'text' ? 'pl-5' : 'pl-2' 
                                )}
                                placeholder={inputType === 'phone' ? "(555) 000-0000" : "Type your answer..."}
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                rows={1}
                            />
                        )}
                    </div>
                    
                    {/* Send Button */}
                    <button 
                        onClick={onSubmit}
                        disabled={!value.trim()}
                        className={clsx(
                            "mb-1 mr-1 p-3 rounded-full transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center",
                            value.trim() 
                                ? "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/25 rotate-0 scale-100" 
                                : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 scale-90"
                        )}
                    >
                        <Send className={clsx("w-4 h-4 transition-transform", value.trim() && "-ml-0.5")} />
                    </button>
                </div>
                
                {/* Helper Text */}
                <div className="absolute -bottom-6 left-6 text-[10px] text-slate-400 font-medium opacity-0 group-focus-within:opacity-100 transition-opacity">
                    {inputType === 'text' ? "Press Enter to submit, Shift+Enter for new line" : "Press Enter to confirm"}
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
  );
}