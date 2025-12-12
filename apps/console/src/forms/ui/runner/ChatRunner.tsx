"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, Calendar, Phone, ShieldCheck, Lock, Menu } from "lucide-react";
import type { FormSchemaJsonShape, FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { getNextFieldKey } from "@/forms/logic/forms.logic.schemaIterator";
import { IntakeChatMessage, type MessageVariant } from "./components/IntakeChatMessage";
import { ReviewOverlay } from "./components/ReviewOverlay";
import { generateNaturalQuestion, generateNaturalTransition } from "@/forms/logic/forms.logic.naturalizer";
import { ThemeToggle } from "@/components/ThemeToggle"; 

// --- TYPES ---
export interface ChatMessage {
  id: string;
  variant: MessageVariant;
  content: React.ReactNode;
  label?: string;
  description?: string;
  fieldKey?: string;
  data?: Record<string, any>;
}

export interface SimpleMessage { 
  role: "user" | "assistant"; 
  text: string; 
}

// --- HELPER ---
function deriveSchemaSummary(schema: FormSchemaJsonShape) { 
    return Object.keys(schema.properties)
        .slice(0, 10) 
        .map(k => `${schema.properties[k].title} (${schema.properties[k].kind})`)
        .join(", "); 
}

async function consultAgent(field: any, userMessage: any, formName: any, history: any, schemaSummary: any, formData: any) {
  const res = await fetch("/api/intake/agent", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ 
        fieldKey: field.key,
        field: { ...field, title: field.title, kind: field.kind, description: field.description },
        userMessage, 
        formName, 
        history, 
        schemaSummary, 
        formData 
      }) 
  });
  return res.json();
}

const formatPhoneNumber = (value: string) => {
  const cleaned = ('' + value).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
  }
  return value;
};

// --- COMPONENT ---

interface ChatRunnerProps {
  formId: string;
  formName: string;
  schema: FormSchemaJsonShape;
  formData: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  history: ChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  textHistory: SimpleMessage[];
  setTextHistory: React.Dispatch<React.SetStateAction<SimpleMessage[]>>;
  activeFieldKey: string | null;
  onFieldFocus: (key: string | null) => void;
  onFinished: () => void;
}

export function ChatRunner({ 
    formId, formName, schema, formData, onDataChange, 
    history, setHistory, textHistory, setTextHistory,
    activeFieldKey, onFieldFocus, onFinished 
}: ChatRunnerProps) {
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialized = useRef(false);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  
  const schemaSummary = useMemo(() => deriveSchemaSummary(schema), [schema]);

  // --- INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
        if (initialized.current || history.length > 0) {
             setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "auto" }), 10);
             return;
        }
        initialized.current = true;
        
        let firstKey = activeFieldKey;
        if (!firstKey) {
            firstKey = getNextFieldKey(schema, formData);
            if (firstKey) onFieldFocus(firstKey);
        }

        setIsThinking(true);

        try {
            const res = await fetch("/api/ai/generate-intro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formName, schemaSummary })
            });
            const data = await res.json();
            const introText = data.intro || "I'm ready to help with the intake.";

            setIsThinking(false);

            if (firstKey) {
                const def = schema.properties[firstKey];
                const q = generateNaturalQuestion(def, false);
                const combinedMessage = `${introText} ${q}`;
                addMessage({ variant: "agent", content: combinedMessage, fieldKey: firstKey }, q);
            } else {
                addMessage({ variant: "agent", content: introText });
            }

        } catch (err) {
            setIsThinking(false);
            if (firstKey) askField(firstKey);
        }
    };
    init();
  }, []);

  useEffect(() => {
    if (activeFieldKey && history.length > 0) {
        const lastMsg = history[history.length - 1];
        if (lastMsg?.fieldKey !== activeFieldKey) {
            askField(activeFieldKey);
            setInputValue("");
        }
    } else if (activeFieldKey === null && history.length > 1 && !isReviewOpen) {
        const lastMsg = history[history.length - 1];
        if (lastMsg?.variant !== 'completion_options') {
            showCompletionOptions();
        }
    }
  }, [activeFieldKey]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, isThinking]);

  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) handleAnswer(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let val = e.target.value;
    if (currentDef?.kind === "phone") {
        val = formatPhoneNumber(val);
    }
    setInputValue(val);
  };

  const addMessage = (msg: Partial<ChatMessage>, text?: string) => {
    setHistory(prev => {
        const last = prev[prev.length - 1];
        if (last && last.content === msg.content && last.variant === msg.variant) return prev;
        const id = Date.now().toString() + Math.random();
        return [...prev, { id, variant: 'agent', content: '', ...msg } as ChatMessage];
    });
    if (text) setTextHistory(prev => [...prev, { role: msg.variant === 'user' ? 'user' : 'assistant', text }]);
  };

  const askField = (key: string) => {
    const def = schema.properties[key];
    if (!def) return;
    
    if (def.kind === 'header') {
        addMessage({ variant: "section", content: def.title });
        setTimeout(() => next(key, formData), 800);
        return;
    }

    const isFirst = history.length <= 1; 
    const q = generateNaturalQuestion(def, isFirst);
    const transition = !isFirst && history[history.length - 1].variant === 'user' ? `${generateNaturalTransition()} ` : "";

    addMessage({ variant: "agent", content: transition + q, fieldKey: key }, q);
  };

  const handleAnswer = async (val: any) => {
    if (!activeFieldKey) return;
    const def = schema.properties[activeFieldKey];
    
    let finalVal = val;
    let updates = {};

    const isDirect = ['select','radio','checkbox','date'].includes(def.kind);

    if (!isDirect && typeof val === 'string') {
        setIsThinking(true);
        addMessage({ variant: 'user', content: val }, val);
        setInputValue("");
        if (inputRef.current) inputRef.current.style.height = "auto";

        try {
            const apiHist = [...textHistory, { role: "user" as const, text: val }];
            const res = await consultAgent(def, val, formName, apiHist, schemaSummary, formData);
            setIsThinking(false);

            if (res.updates) updates = res.updates;

            if (res.type === 'question' || res.type === 'chitchat') {
                if (Object.keys(updates).length > 0) {
                    const merged = { ...formData, ...updates };
                    onDataChange(merged);
                }
                addMessage({ variant: "agent", content: res.replyMessage }, res.replyMessage);
                return; 
            }
            finalVal = res.extractedValue;
        } catch (e) { setIsThinking(false); }
    } else {
        addMessage({ variant: 'user', content: String(val) }, String(val));
        setInputValue("");
    }

    const nextData = { ...formData, ...updates, [activeFieldKey]: finalVal };
    
    onDataChange(nextData);
    next(activeFieldKey, nextData);
  };

  const next = (currentKey: string, data: any) => {
      const nextKey = getNextFieldKey(schema, data, currentKey);
      onFieldFocus(nextKey); 
  };

  const showCompletionOptions = () => {
      addMessage({ variant: "agent", content: "All set. Please review your details." });
      setTimeout(() => addMessage({ variant: "completion_options", content: null }), 500);
  };

  const finish = async (data: any) => {
      onFinished(); 
  };

  const currentDef = activeFieldKey ? schema.properties[activeFieldKey] : null;

  const renderInputArea = () => {
      if (!currentDef) return null;

      if (currentDef.kind === 'date') {
          return (
              <div className="relative flex gap-2 items-center w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] px-6 py-4 shadow-xl shadow-indigo-500/5 transition-all">
                  <div className="text-slate-400 dark:text-slate-500">
                      <Calendar className="w-5 h-5" />
                  </div>
                  <input 
                      type="date"
                      className="flex-1 bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 text-base h-full [color-scheme:light] dark:[color-scheme:dark]"
                      onChange={(e) => handleAnswer(e.target.value)} 
                  />
                  <div className="text-xs text-slate-400 pr-2 uppercase font-bold tracking-wider">Select Date</div>
              </div>
          );
      }

      return (
        <div className="relative flex gap-2 items-end w-full group">
            {currentDef.kind === 'phone' && (
                <div className="absolute left-6 top-5 text-slate-400 pointer-events-none z-10">
                    <Phone className="w-4 h-4" />
                </div>
            )}
            
            <textarea 
                ref={inputRef}
                className={`flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] py-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none shadow-xl shadow-indigo-500/5 transition-all resize-none max-h-40 min-h-[60px] leading-relaxed overflow-hidden ${currentDef.kind === 'phone' ? 'pl-12 pr-6' : 'px-6'}`}
                placeholder={currentDef.kind === 'phone' ? "(555) 000-0000" : "Type your answer..."}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoFocus
                rows={1}
            />
            <button 
                onClick={() => { if(inputValue.trim()) handleAnswer(inputValue); }}
                disabled={!inputValue.trim()}
                className="mb-1.5 w-12 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-0 disabled:scale-0 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
      );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative transition-colors duration-500">
        
        {/* --- NAVBAR: Floating Glass Pill (Matches Marketing Site) --- */}
        <div className="fixed top-4 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
            <header className="pointer-events-auto w-full max-w-5xl h-16 rounded-full bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl shadow-indigo-500/5 flex items-center justify-between px-6 transition-all duration-500">
                
                {/* Left: Brand + Form Name */}
                <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                            {formName || "Intake Form"}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Lock className="w-2.5 h-2.5 text-emerald-500" />
                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Secure</span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                </div>
            </header>
        </div>

        {/* Overlays */}
        {isReviewOpen && (
            <ReviewOverlay 
                schema={schema} 
                data={formData} 
                onClose={() => setIsReviewOpen(false)} 
                onSubmit={(d) => { onDataChange(d); setIsReviewOpen(false); finish(d); }} 
            />
        )}
        
        {/* Top Gradient Mask (Pushed down below Floating Header) */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 pointer-events-none z-20" />

        {/* Scroll Container */}
        <div className="flex-1 overflow-y-auto px-4 pt-32 pb-32 scroll-smooth no-scrollbar" ref={scrollRef}>
            <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="popLayout">
                    {history.map(msg => (
                        <IntakeChatMessage 
                            key={msg.id} 
                            {...msg} 
                            onReview={() => setIsReviewOpen(true)} 
                            onSubmit={() => finish(formData)} 
                        />
                    ))}
                    {isThinking && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 ml-4 mb-4 text-indigo-400 text-xs font-mono bg-indigo-500/10 px-4 py-2 rounded-full w-fit border border-indigo-500/20"
                        >
                            <Sparkles className="w-3 h-3 animate-spin" />
                            Analyzing response...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-6 flex-none bg-gradient-to-t from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent pb-8 z-20 transition-colors duration-500">
            <div className="max-w-2xl mx-auto relative group">
                {/* Glow Effect behind Input */}
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                {renderInputArea()}
            </div>
        </div>
    </div>
  );
}