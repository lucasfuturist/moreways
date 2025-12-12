// src/intake/ui/chat/ChatPanel.tsx

"use client";

import React, { useRef, useEffect } from "react";
import { clsx } from "clsx";
import { Send, Sparkles, X, User, Lightbulb, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message { id: string; role: "user" | "assistant"; text: string; }

interface ChatPanelProps {
  messages: Message[];
  input: string;
  setInput: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onMinimize: () => void;
  suggestions?: string[];
}

export function ChatPanel({ messages, input, setInput, onSubmit, isLoading, onMinimize, suggestions = [] }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); }
  };

  return (
    // [FIX] Removed bg-slate-50/50 to let the parent Glass Panel shine through
    <div className="flex flex-col h-full relative overflow-hidden bg-transparent transition-colors duration-500">
      
      {/* 1. Header (Sticky) */}
      <div className="flex-none px-5 py-4 flex justify-between items-center border-b border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md z-10 transition-colors duration-500">
        <div className="flex items-center gap-2.5">
           <div className="p-1 rounded bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
             <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
           </div>
           <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-200">AI Architect</span>
        </div>
        <button onClick={onMinimize} className="p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
            <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Messages Stream */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-5 py-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-40 text-center px-8">
                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-300">How can I help you build?</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Describe your legal matter or intake goals.</p>
            </div>
        )}

        {messages.map((msg) => (
          <motion.div 
            key={msg.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx("flex gap-3 items-start", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ring-1 mt-0.5",
                msg.role === "user" 
                    ? "bg-white dark:bg-slate-800 ring-slate-200 dark:ring-white/10 text-slate-600 dark:text-slate-400" 
                    : "bg-gradient-to-br from-indigo-500 to-purple-600 ring-indigo-400/50 text-white"
            )}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            <div className={clsx(
                "max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm relative group",
                msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-indigo-500/20"
                    : "bg-white/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-sm backdrop-blur-sm"
            )}>
                {msg.text}
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
            <div className="flex items-center gap-3 ml-12 animate-pulse">
                <div className="w-2 h-2 bg-indigo-400 dark:bg-indigo-500/50 rounded-full" />
                <div className="w-2 h-2 bg-indigo-400 dark:bg-indigo-500/50 rounded-full animation-delay-200" />
                <div className="w-2 h-2 bg-indigo-400 dark:bg-indigo-500/50 rounded-full animation-delay-400" />
            </div>
        )}
      </div>

      {/* 3. Input Area */}
      <div className="p-5 pt-2 flex-none flex flex-col gap-3 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 transition-colors duration-500">
        
        {/* Dynamic Suggestions */}
        {suggestions.length > 0 && !isLoading && (
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar min-h-[32px] items-center mask-fade-right">
                <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 flex-shrink-0 mr-1" />
                </motion.div>
                
                <AnimatePresence mode="popLayout">
                    {suggestions.map((s, i) => (
                        <motion.button 
                            key={`${s}-${i}`}
                            initial={{ opacity: 0, x: -10, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.1 } }}
                            transition={{ 
                                delay: i * 0.08, 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 25 
                            }}
                            onClick={() => setInput(s)}
                            className="flex-none px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-white/20 transition-colors whitespace-nowrap shadow-sm backdrop-blur-sm"
                        >
                            {s}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        )}

        <div className="relative group rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 focus-within:ring-1 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-none">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe changes..."
            className="w-full bg-transparent border-none px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:ring-0 outline-none max-h-32 min-h-[52px] custom-scrollbar leading-relaxed"
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
             <button
                onClick={() => { if(input.trim()) onSubmit(); }}
                disabled={!input.trim() || isLoading}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-0 disabled:scale-75 transition-all duration-200 shadow-md"
             >
                <CornerDownLeft className="w-4 h-4" />
             </button>
          </div>
        </div>
        <div className="text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-600 font-medium">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
}