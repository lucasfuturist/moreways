"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Send, ShieldCheck, Lock, Calendar, Phone } from "lucide-react";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { getNextFieldKey } from "@/forms/logic/forms.logic.schemaIterator";
import { IntakeChatMessage, type MessageVariant } from "./components/IntakeChatMessage";
import { ReviewOverlay } from "./components/ReviewOverlay";
import { ThinkingBubble } from "./components/ThinkingBubble";
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

function deriveSchemaSummary(schema: FormSchemaJsonShape) { 
    return Object.keys(schema.properties)
        .slice(0, 10) 
        .map(k => `${schema.properties[k].title} (${schema.properties[k].kind})`)
        .join(", "); 
}

// Extraction Agent (Listening)
async function consultAgent(field: any, userMessage: any, formName: any, history: any, schemaSummary: any, formData: any) {
  try {
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
      if (!res.ok) throw new Error("Agent error");
      return res.json();
  } catch (e) {
      return { type: "answer", extractedValue: userMessage };
  }
}

// Conversation Generator (Talking)
async function generateNaturalQuestionAI(
    nextField: any, 
    prevField: any, 
    prevValue: any, 
    formName: string
) {
    try {
        const res = await fetch("/api/intake/talk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nextField, prevField, prevValue, formName })
        });
        const data = await res.json();
        return data.message || nextField.title;
    } catch (e) {
        return nextField.title; // Fallback to label
    }
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
  
  // Track previous field context for the "Bridge" generation
  const previousFieldRef = useRef<{ title: string, value: any } | null>(null);
  
  const schemaSummary = useMemo(() => deriveSchemaSummary(schema), [schema]);

  const scrollToBottom = () => {
      setTimeout(() => {
          if (scrollRef.current) {
              scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
          }
      }, 100);
  };

  // --- INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
        if (initialized.current || history.length > 0) return;
        initialized.current = true;
        
        // 1. Check for Empty Schema
        const fields = Object.keys(schema.properties || {});
        if (fields.length === 0) {
            addMessage({ variant: "warning", content: "This form is empty." });
            return;
        }

        // 2. Start Field
        let firstKey = activeFieldKey;
        if (!firstKey) {
            firstKey = getNextFieldKey(schema, formData);
            if (firstKey) onFieldFocus(firstKey);
        }

        setIsThinking(true);

        try {
            // 3. AI Intro
            const res = await fetch("/api/ai/generate-intro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formName, schemaSummary: fields.slice(0, 5).join(", ") })
            });
            const data = await res.json();
            const introText = data.intro || `Welcome to the ${formName} intake.`;

            setIsThinking(false);

            if (firstKey) {
                // For the first question, we generate it directly without "previous" context
                const def = schema.properties[firstKey];
                const q = await generateNaturalQuestionAI(def, null, null, formName);
                
                addMessage({ variant: "agent", content: introText });
                setTimeout(() => {
                    addMessage({ variant: "agent", content: q, fieldKey: firstKey }, q);
                }, 500);
            } else {
                addMessage({ variant: "agent", content: introText });
            }

        } catch (err) {
            setIsThinking(false);
            if (firstKey) {
                const def = schema.properties[firstKey];
                addMessage({ variant: "agent", content: `Welcome. Let's start. ${def.title}`, fieldKey: firstKey });
            }
        }
    };
    init();
  }, []);

  // --- REACT TO FIELD CHANGES ---
  useEffect(() => {
    if (activeFieldKey && history.length > 0) {
        const lastMsg = history[history.length - 1];
        if (lastMsg?.fieldKey !== activeFieldKey) {
            askField(activeFieldKey);
            setInputValue("");
        }
    } else if (activeFieldKey === null && history.length > 1 && !isReviewOpen) {
        const lastMsg = history[history.length - 1];
        if (lastMsg?.variant !== 'completion_options' && lastMsg?.variant !== 'review_summary') {
            showCompletionOptions();
        }
    }
  }, [activeFieldKey]);

  useEffect(() => {
    scrollToBottom();
  }, [history, isThinking]);

  // --- HANDLERS ---

  const addMessage = (msg: Partial<ChatMessage>, text?: string) => {
    setHistory(prev => {
        const id = Date.now().toString() + Math.random();
        return [...prev, { id, variant: 'agent', content: '', ...msg } as ChatMessage];
    });
    if (text) setTextHistory(prev => [...prev, { role: msg.variant === 'user' ? 'user' : 'assistant', text }]);
  };

  const askField = async (key: string) => {
    const def = schema.properties[key];
    if (!def) return;
    
    // Header Logic
    if (def.kind === 'header') {
        addMessage({ variant: "section", content: def.title });
        setTimeout(() => next(key, formData), 500);
        return;
    }

    // AI Generation Logic
    setIsThinking(true);
    
    // Retrieve context from ref (set during handleAnswer)
    const prevContext = previousFieldRef.current;
    
    const questionText = await generateNaturalQuestionAI(
        def, 
        prevContext?.title ? { title: prevContext.title } : null, 
        prevContext?.value, 
        formName
    );

    setIsThinking(false);
    addMessage({ variant: "agent", content: questionText, fieldKey: key }, questionText);
  };

  const handleAnswer = async (val: any) => {
    if (!activeFieldKey) return;
    const def = schema.properties[activeFieldKey];
    
    let finalVal = val;
    let updates = {};

    const isDirect = ['select','radio','checkbox','date'].includes(def.kind);

    // 1. Process Answer
    if (!isDirect && typeof val === 'string') {
        setIsThinking(true);
        addMessage({ variant: 'user', content: val }, val);
        setInputValue("");
        
        try {
            const apiHist = [...textHistory, { role: "user" as const, text: val }];
            const res = await consultAgent(def, val, formName, apiHist, schemaSummary, formData);
            setIsThinking(false);

            if (res.updates) updates = res.updates;

            if (res.type === 'question' || res.type === 'chitchat') {
                // Agent wants clarification - no field advance
                if (Object.keys(updates).length > 0) {
                    const merged = { ...formData, ...updates };
                    onDataChange(merged);
                }
                addMessage({ variant: "agent", content: res.replyMessage }, res.replyMessage);
                return; 
            }
            finalVal = res.extractedValue;
        } catch (e) { 
            setIsThinking(false); 
        }
    } else {
        // UI Input: Immediate acceptance
        addMessage({ variant: 'user', content: String(val) }, String(val));
        setInputValue("");
    }

    // 2. Save Context for NEXT Question
    // We store this BEFORE updating the active key, so askField can see what just happened
    previousFieldRef.current = {
        title: def.title,
        value: finalVal
    };

    // 3. Advance
    const nextData = { ...formData, ...updates, [activeFieldKey]: finalVal };
    onDataChange(nextData);
    next(activeFieldKey, nextData);
  };

  const next = (currentKey: string, data: any) => {
      const nextKey = getNextFieldKey(schema, data, currentKey);
      onFieldFocus(nextKey); 
  };

  const showCompletionOptions = () => {
      setIsThinking(true);
      setTimeout(() => {
          setIsThinking(false);
          addMessage({ variant: "agent", content: "That covers everything I need. Take a moment to review your details below." });
          setTimeout(() => addMessage({ variant: "completion_options", content: null }), 400);
      }, 500);
  };

  const currentDef = activeFieldKey ? schema.properties[activeFieldKey] : null;

  const renderInputArea = () => {
      if (!currentDef || isReviewOpen) return null;

      if (currentDef.kind === 'date') {
          return (
              <div className="flex gap-2 items-center w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] px-6 py-4 shadow-xl shadow-indigo-500/5 transition-all animate-in slide-in-from-bottom-2">
                  <div className="text-slate-400 dark:text-slate-500"><Calendar className="w-5 h-5" /></div>
                  <input 
                      type="date"
                      className="flex-1 bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 text-base h-full [color-scheme:light] dark:[color-scheme:dark]"
                      onChange={(e) => handleAnswer(e.target.value)} 
                      autoFocus
                  />
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
                className={`flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] py-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none shadow-xl shadow-indigo-500/5 transition-all resize-none max-h-40 min-h-[60px] leading-relaxed overflow-hidden custom-scrollbar ${currentDef.kind === 'phone' ? 'pl-12 pr-6' : 'px-6'}`}
                placeholder={currentDef.kind === 'phone' ? "(555) 000-0000" : "Type your answer..."}
                value={inputValue}
                onChange={(e) => {
                    let v = e.target.value;
                    if(currentDef.kind === 'phone') v = formatPhoneNumber(v);
                    setInputValue(v);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (inputValue.trim()) handleAnswer(inputValue);
                    }
                }}
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
    <div className="flex flex-col w-full h-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
        
        {/* HEADER */}
        <div className="fixed top-4 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
            <header className="pointer-events-auto w-full max-w-5xl h-16 rounded-full bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl shadow-indigo-500/5 flex items-center justify-between px-6 transition-all duration-500">
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
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                </div>
            </header>
        </div>

        {/* OVERLAYS */}
        {isReviewOpen && (
            <ReviewOverlay 
                schema={schema} 
                data={formData} 
                onClose={() => setIsReviewOpen(false)} 
                onSubmit={(d) => { onDataChange(d); setIsReviewOpen(false); onFinished(); }} 
            />
        )}
        
        {/* GRADIENT MASK */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 pointer-events-none z-20" />

        {/* SCROLL CONTAINER */}
        <div 
            className="flex-1 overflow-y-auto px-4 pt-32 pb-48 scroll-smooth no-scrollbar w-full" 
            ref={scrollRef}
        >
            <div className="max-w-2xl mx-auto min-h-full flex flex-col justify-end">
                <AnimatePresence mode="popLayout">
                    {history.map(msg => (
                        <IntakeChatMessage 
                            key={msg.id} 
                            {...msg} 
                            onReview={() => setIsReviewOpen(true)} 
                            onSubmit={() => onFinished()} 
                        />
                    ))}
                    {isThinking && <ThinkingBubble />}
                </AnimatePresence>
            </div>
        </div>

        {/* INPUT AREA */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex-none bg-gradient-to-t from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent pb-8 z-20 transition-colors duration-500">
            <div className="max-w-2xl mx-auto relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                {renderInputArea()}
            </div>
        </div>
    </div>
  );
}