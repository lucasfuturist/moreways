"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import type { FormSchemaJsonShape, FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { getNextFieldKey } from "@/forms/logic/forms.logic.schemaIterator";
import { IntakeChatMessage, type MessageVariant } from "./IntakeChatMessage"; 
import { ReviewOverlay } from "./ReviewOverlay"; 
import { VerdictCard } from "./VerdictCard"; 

// ... (Keep existing interfaces and helper functions like getSmartQuestion, consultAgent) ...
// For brevity, assuming interfaces ChatMessage, SimpleMessage etc are here as before

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

// Stub for client-side field validation/extraction logic
async function consultAgent(field: any, userMessage: any) {
  return new Promise<any>((resolve) => {
      setTimeout(() => {
          resolve({ 
              type: 'answer', 
              extractedValue: userMessage, 
              updates: {} 
          });
      }, 600);
  });
}

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
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  // 1. Init
  useEffect(() => {
    if (history.length === 0) {
        const intro = `I'll guide you through the intake process for ${formName}. Please answer the questions as accurately as possible.`;
        addMessage({ variant: "agent", content: intro }, intro);
        
        if (!activeFieldKey) {
            const first = getNextFieldKey(schema, formData); 
            if(first) onFieldFocus(first);
            else runValidation(); 
        }
    }
  }, []);

  // 2. Scroll
  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }
  }, [history, isThinking]);

  // 3. Logic Loop
  useEffect(() => {
    if (activeFieldKey) {
        askField(activeFieldKey);
    } else if (activeFieldKey === null && history.length > 1 && !isReviewOpen) {
        const lastMsg = history[history.length - 1];
        if (lastMsg?.variant !== 'completion_options' && !hasValidated && !isThinking) {
            runValidation();
        }
    }
  }, [activeFieldKey, hasValidated]);

  const addMessage = (msg: Partial<ChatMessage>, text?: string) => {
    const id = Date.now().toString() + Math.random();
    setHistory(prev => [...prev, { id, variant: 'agent', content: '', ...msg } as ChatMessage]);
    if (text) setTextHistory(prev => [...prev, { role: msg.variant === 'user' ? 'user' : 'assistant', text }]);
  };

  const runValidation = async () => {
      setIsThinking(true);
      setHasValidated(true); 
      // Simulate or call /api/intake/validate here (Client Side)
      await new Promise(r => setTimeout(r, 600));
      showCompletionOptions();
      setIsThinking(false);
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
    
    // Simple mock logic for direct answers
    addMessage({ variant: 'user', content: String(val) }, String(val));
    setInputValue("");
    
    const nextData = { ...formData, [activeFieldKey]: val };
    onDataChange(nextData);
    next(activeFieldKey, nextData);
  };

  const next = (currentKey: string, data: any) => {
      const nextKey = getNextFieldKey(schema, data, currentKey);
      onFieldFocus(nextKey); 
  };

  const showCompletionOptions = () => {
      addMessage({ variant: "agent", content: "That covers everything." });
      setTimeout(() => addMessage({ variant: "completion_options", content: null }), 500);
  };

  const finish = (data: any) => { onFinished(); };

  return (
    // [FIX] Layout: Flex Column, Full Width/Height
    <div className="flex flex-col w-full h-full bg-slate-950 relative">
        {isReviewOpen && (
            <ReviewOverlay 
                schema={schema} 
                data={formData} 
                onClose={() => setIsReviewOpen(false)} 
                onSubmit={(d) => { onDataChange(d); setIsReviewOpen(false); finish(d); }} 
            />
        )}
        
        {/* MESSAGES: Grow to fill available space */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" ref={scrollRef}>
            <div className="max-w-2xl mx-auto min-h-full flex flex-col justify-end">
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-indigo-400 text-xs px-4">
                            <Sparkles className="w-3 h-3 animate-spin" /> Thinking...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* INPUT: Fixed height at bottom */}
        <div className="flex-none bg-slate-900 border-t border-slate-800 p-4">
            <div className="max-w-2xl mx-auto">
                <form onSubmit={(e) => { e.preventDefault(); if(inputValue.trim()) handleAnswer(inputValue); }} className="relative flex gap-2">
                    <input 
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-5 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Type your answer..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" disabled={!inputValue.trim()} className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-full flex items-center justify-center text-white transition-colors">
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
}