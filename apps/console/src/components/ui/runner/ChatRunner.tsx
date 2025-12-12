"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import type { FormSchemaJson, FormFieldDefinition } from "@/lib/types/argueos-types";
import { getNextFieldKey } from "../logic/schemaIterator"; 
import { IntakeChatMessage, type MessageVariant } from "./IntakeChatMessage"; 
import { ReviewOverlay } from "./ReviewOverlay"; 
import { VerdictCard } from "./VerdictCard"; // [NEW]

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

function getSmartQuestion(def: FormFieldDefinition) { 
    if (def.kind === 'header') return def.title;
    if (def.title.trim().endsWith("?")) {
        return def.title;
    }
    return `What is the ${def.title}?`; 
}

function deriveSchemaSummary(schema: FormSchemaJson) { 
    return Object.keys(schema.properties)
        .map(k => `- [Key: ${k}] ${schema.properties[k].title}`)
        .join("\n"); 
}

async function consultAgent(field: any, userMessage: any) {
  return new Promise<any>((resolve) => {
      setTimeout(() => {
          resolve({ 
              type: 'answer', 
              extractedValue: userMessage, 
              updates: {} 
          });
      }, 1000);
  });
}

interface ChatRunnerProps {
  formId: string;
  formName: string;
  schema: FormSchemaJson;
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
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  
  // [NEW] Validation State
  const [hasValidated, setHasValidated] = useState(false);

  // Initial Greeting
  useEffect(() => {
    if (history.length === 0) {
        const intro = `I'll guide you through the intake process for ${formName}. Please answer the questions as accurately as possible.`;
        addMessage({ variant: "agent", content: intro }, intro);
        
        if (!activeFieldKey) {
            const first = getNextFieldKey(schema, formData); 
            if(first) onFieldFocus(first);
            else runValidation(); // Skip to validation if empty form
        }
    } else {
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "auto" }), 10);
    }
  }, []);

  // Main Loop
  useEffect(() => {
    if (activeFieldKey) {
        askField(activeFieldKey);
    } else if (activeFieldKey === null && history.length > 1 && !isReviewOpen) {
        
        // If form is done, but we haven't validated yet, do it.
        const lastMsg = history[history.length - 1];
        
        // Avoid loops: check if we are already showing options or validating
        if (lastMsg?.variant !== 'completion_options' && !hasValidated && !isThinking) {
            runValidation();
        }
    }
  }, [activeFieldKey, hasValidated]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, isThinking]);

  const addMessage = (msg: Partial<ChatMessage>, text?: string) => {
    const id = Date.now().toString() + Math.random();
    setHistory(prev => [...prev, { id, variant: 'agent', content: '', ...msg } as ChatMessage]);
    if (text) setTextHistory(prev => [...prev, { role: msg.variant === 'user' ? 'user' : 'assistant', text }]);
  };

  // [NEW] Validation Logic
  const runValidation = async () => {
      setIsThinking(true);
      setHasValidated(true); // Lock it so it doesn't run twice
      
      try {
          // 1. Show analyzing status
          // Note: "isThinking" handles the spinner UI already
          
          const res = await fetch("/api/intake/validate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  intent: formName,
                  formData: formData
              })
          });
          
          const json = await res.json();
          
          if (json.data) {
              // 2. Add Verdict Card
              setHistory(prev => [...prev, {
                  id: Date.now().toString(),
                  variant: "agent",
                  content: (
                      <VerdictCard 
                          status={json.data.status}
                          confidence={json.data.confidence_score}
                          summary={json.data.analysis.summary}
                          missing={json.data.analysis.missing_elements}
                          onContinue={showCompletionOptions}
                      />
                  )
              }]);
          } else {
              // Fallback
              showCompletionOptions();
          }
      } catch (e) {
          console.error("Validation error", e);
          showCompletionOptions();
      } finally {
          setIsThinking(false);
      }
  };

  const askField = (key: string) => {
    const def = schema.properties[key];
    if (!def) return;
    
    const lastAgentMsg = [...history].reverse().find(m => m.variant === 'agent');
    if (lastAgentMsg?.fieldKey === key) return;

    if (def.kind === 'header') {
        addMessage({ variant: "section", content: def.title });
        setTimeout(() => next(key, formData), 800);
        return;
    }

    const q = getSmartQuestion(def);
    addMessage({ variant: "agent", content: q, fieldKey: key }, q);
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

        try {
            const res = await consultAgent(def, val);
            setIsThinking(false);

            if (res.updates) updates = res.updates;

            if (res.type === 'question' || res.type === 'chitchat') {
                if (Object.keys(updates).length > 0) {
                    onDataChange({ ...formData, ...updates });
                    addMessage({ variant: "agent", content: "Updated info." });
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
      addMessage({ variant: "agent", content: "Ready to submit." });
      setTimeout(() => addMessage({ variant: "completion_options", content: null }), 500);
  };

  const finish = async (data: any) => { 
      onFinished(); 
  };

  const currentDef = activeFieldKey ? schema.properties[activeFieldKey] : null;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative transition-colors duration-500">
        {isReviewOpen && (
            <ReviewOverlay 
                schema={schema} 
                data={formData} 
                onClose={() => setIsReviewOpen(false)} 
                onSubmit={(d) => { onDataChange(d); setIsReviewOpen(false); finish(d); }} 
            />
        )}
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-24 scroll-smooth" ref={scrollRef}>
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
                            Evaluating...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Input Area (Hidden if no active field) */}
        {activeFieldKey && (
            <div className="p-6 flex-none bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent pb-8">
                <div className="max-w-2xl mx-auto relative group">
                    <form onSubmit={(e) => { e.preventDefault(); if(inputValue.trim()) handleAnswer(inputValue); }} className="relative flex gap-2">
                        <input 
                            className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full px-6 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none shadow-xl transition-all"
                            placeholder="Type your answer..."
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            autoFocus
                        />
                        <button 
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="absolute right-2 top-2 bottom-2 w-12 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-0 disabled:scale-0 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}