"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, ShieldCheck, AlignLeft, ArrowRight } from "lucide-react";
import { UnifiedRunner } from "./UnifiedRunner";
import { ChatMessage } from "./components/ChatRunner";
import { IntakeChatMessage } from "./components/IntakeChatMessage";

// --- TYPES ---
type OrchestratorMode = "triage" | "handoff" | "runner";

interface IntakeOrchestratorProps {
  initialMessage?: string;
}

export function IntakeOrchestrator({ initialMessage = "Briefly tell me what happened." }: IntakeOrchestratorProps) {
  const [mode, setMode] = useState<OrchestratorMode>("triage");
  
  // -- SHARED STATE --
  // This history array persists across the Triage -> Runner transition
  const [history, setHistory] = useState<ChatMessage[]>([
    { id: "init", variant: "agent", content: initialMessage }
  ]);
  
  // -- TRIAGE STATE --
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // -- HANDOFF STATE --
  const [targetFormSlug, setTargetFormSlug] = useState<string | null>(null);
  const [extractedContext, setExtractedContext] = useState<Record<string, any>>({});

  // Auto-scroll for Triage Phase
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [history, isThinking]);

  // -- TRIAGE LOGIC --
  const handleTriageSubmit = async (text: string) => {
    if (!text.trim()) return;

    // 1. Optimistic UI Update
    const userMsg: ChatMessage = { id: Date.now().toString(), variant: "user", content: text };
    setHistory(prev => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);

    try {
      // 2. Call the Router API
      // We map our ChatMessage format to the format OpenAI expects
      const apiMessages = history.concat(userMsg).map(m => ({
        role: m.variant === "user" ? "user" : "assistant",
        content: typeof m.content === 'string' ? m.content : "..."
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: apiMessages }),
        headers: { "Content-Type": "application/json" }
      });
      
      const json = await res.json();
      const { router_data, message } = json;

      setIsThinking(false);

      if (router_data?.needs_clarification) {
        // CASE A: Need more info
        setHistory(prev => [...prev, { id: Date.now().toString(), variant: "agent", content: message }]);
      } 
      else if (router_data?.router_decision?.form_slug) {
        // CASE B: Routed!
        const { form_slug } = router_data.router_decision;
        const context = router_data.extracted_context || {};
        
        // Add a "System" message to visually mark the transition
        const transitionMsg: ChatMessage = { 
          id: "sys_route", 
          variant: "section", 
          content: `Case Type Identified: ${form_slug.replace(/-/g, ' ').toUpperCase()}` 
        };
        
        setHistory(prev => [...prev, transitionMsg]);
        
        // Prepare state for the switch
        setTargetFormSlug(form_slug);
        setExtractedContext(context);
        setMode("handoff");
        
        // Short artificial delay to let the user read the "Identified" message before the UI shifts
        setTimeout(() => setMode("runner"), 1200);
      } 
      else {
        // Fallback
        setHistory(prev => [...prev, { id: Date.now().toString(), variant: "agent", content: message || "Can you provide more details?" }]);
      }

    } catch (e) {
      console.error(e);
      setIsThinking(false);
      setHistory(prev => [...prev, { id: "err", variant: "system", content: "Connection error. Please try again." }]);
    }
  };

  // --- RENDER: RUNNER MODE ---
  // If we are in "runner" mode, we render the UnifiedRunner.
  // CRITICAL: We pass 'history' so it pre-fills the chat window.
  if (mode === "runner" && targetFormSlug) {
    return (
      <UnifiedRunner
        formId={targetFormSlug}
        initialData={extractedContext}
        initialHistory={history} // <--- The magic glue
        intent={extractedContext.detected_intent || "General Inquiry"}
      />
    );
  }

  // --- RENDER: TRIAGE MODE (Default) ---
  return (
    <div className="flex flex-col md:flex-row h-[85vh] w-full bg-slate-950 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl relative transition-all duration-500">
      
      {/* 1. LEFT SIDEBAR (Placeholder State) */}
      {/* This ensures the layout shape matches the UnifiedRunner so there's no "jump" when switching */}
      <div className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950 flex-none z-20">
         <div className="p-6 border-b border-slate-800 flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-indigo-500" />
             <h3 className="text-xs font-bold text-white uppercase tracking-wider">Intake Triage</h3>
         </div>
         <div className="p-6 space-y-6">
            <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Step</div>
                <div className="flex items-center gap-3 text-white">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-sm font-medium">Case Analysis</span>
                </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400 leading-relaxed">
                    I am analyzing your situation to match you with the correct legal framework.
                </p>
            </div>
         </div>
      </div>

      {/* 2. MAIN CHAT AREA */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden bg-slate-950">
          
          {/* Handoff Overlay (Fade Effect) */}
          <AnimatePresence>
            {mode === "handoff" && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center"
                >
                    <div className="flex flex-col items-center gap-3">
                        <Sparkles className="w-8 h-8 text-indigo-400 animate-spin-slow" />
                        <span className="text-sm font-medium text-white tracking-wide">Loading Case Protocol...</span>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth" ref={scrollRef}>
            <div className="max-w-2xl mx-auto space-y-6">
                <AnimatePresence mode="popLayout">
                    {history.map((msg) => (
                        <IntakeChatMessage key={msg.id} {...msg} />
                    ))}
                    {isThinking && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="flex items-center gap-2 ml-4"
                        >
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 flex-none bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
             <div className="max-w-2xl mx-auto relative">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleTriageSubmit(inputValue); }}
                    className="relative flex gap-2"
                >
                    <input 
                        className="flex-1 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-full px-6 py-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/50 outline-none shadow-xl transition-all"
                        placeholder="Type your response..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        autoFocus
                        disabled={isThinking || mode !== "triage"}
                    />
                    <button 
                        type="submit"
                        disabled={!inputValue.trim() || isThinking || mode !== "triage"}
                        className="absolute right-2 top-2 bottom-2 w-12 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-0 disabled:scale-0 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
             </div>
          </div>

      </div>
    </div>
  );
}