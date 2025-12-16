"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import type { FormFieldDefinition } from "@/lib/types/argueos-types";
import { getNextFieldKey } from "../logic/schemaIterator";
import { IntakeChatMessage, type MessageVariant } from "./IntakeChatMessage";
import { ReviewOverlay } from "./ReviewOverlay";

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
  if (def.kind === "header") return def.title;
  if (def.title.trim().endsWith("?")) return def.title;
  return `What is the ${def.title}?`;
}

async function consultAgent(field: any, userMessage: any) {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve({
        type: "answer",
        extractedValue: userMessage,
        updates: {},
      });
    }, 500);
  });
}

interface ChatRunnerProps {
  formId: string;
  formName: string;
  schema: any;
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
  formId,
  formName,
  schema,
  formData,
  onDataChange,
  history,
  setHistory,
  textHistory,
  setTextHistory,
  activeFieldKey,
  onFieldFocus,
  onFinished,
}: ChatRunnerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false);

  // Prevent strict-mode double init
  const initializedRef = useRef(false);

  // ✅ Guard to prevent completion spam
  const completionShownRef = useRef(false);

  const addMessage = (msg: Partial<ChatMessage>, text?: string) => {
    const id = Date.now().toString() + Math.random();
    setHistory((prev) => [...prev, { id, variant: "agent", content: "", ...msg } as ChatMessage]);
    if (text) {
      setTextHistory((prev) => [
        ...prev,
        { role: msg.variant === "user" ? "user" : "assistant", text },
      ]);
    }
  };

  // Boot even when history isn't empty (handoff / orchestrator)
  useEffect(() => {
    if (initializedRef.current) return;
    if (!schema) return;

    initializedRef.current = true;

    // Only add intro if truly no prior convo
    if (history.length === 0) {
      const intro = `I'll guide you through the intake process for ${formName}. Please answer the questions as accurately as possible.`;
      addMessage({ variant: "agent", content: intro }, intro);
    }

    // Always pick starting field if not focused yet
    if (!activeFieldKey) {
      const first = getNextFieldKey(schema, formData);
      if (first) onFieldFocus(first);
      else console.warn("ChatRunner: No valid starting field found.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema]);

  const askField = (key: string) => {
    let def = schema.properties?.[key];
    if (!def && Array.isArray(schema.fields)) {
      def = schema.fields.find((f: any) => f.key === key);
    }
    if (!def) return;

    const lastAgentMsg = [...history].reverse().find((m) => m.variant === "agent");
    if (lastAgentMsg?.fieldKey === key) return;

    if (!hasAskedQuestion) setHasAskedQuestion(true);

    if (def.kind === "header") {
      addMessage({ variant: "section", content: def.title });
      setTimeout(() => next(key, formData), 800);
      return;
    }

    const q = getSmartQuestion(def);
    addMessage({ variant: "agent", content: q, fieldKey: key }, q);
  };

  const next = (currentKey: string, data: any) => {
    const nextKey = getNextFieldKey(schema, data, currentKey);
    onFieldFocus(nextKey);
  };

  const showCompletionOptions = () => {
    // Add BOTH messages back-to-back (no delay), so the effect never sees an intermediate state.
    addMessage({
      variant: "agent",
      content: "That's everything I need. Please review your answers or finish your submission.",
    });
    addMessage({ variant: "completion_options", content: null });
  };

  // Main Loop: Ask question OR show submit options
  useEffect(() => {
    if (activeFieldKey) {
      // If we re-enter the form (review edits), allow completion UI to show again later.
      completionShownRef.current = false;
      askField(activeFieldKey);
      return;
    }

    // End-of-form
    if (!hasAskedQuestion || isThinking) return;

    // Prevent duplicates forever
    if (completionShownRef.current) return;

    const lastMsg = history.length > 0 ? history[history.length - 1] : null;
    if (lastMsg?.variant === "completion_options") {
      completionShownRef.current = true;
      return;
    }

    completionShownRef.current = true;
    showCompletionOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFieldKey, hasAskedQuestion, isThinking, history.length]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [history, isThinking]);

  const handleAnswer = async (val: any) => {
    if (!activeFieldKey) return;

    let def = schema.properties?.[activeFieldKey];
    if (!def && Array.isArray(schema.fields)) {
      def = schema.fields.find((f: any) => f.key === activeFieldKey);
    }
    if (!def) return;

    let finalVal = val;
    let updates: Record<string, any> = {};

    const isDirect = ["select", "radio", "checkbox", "date"].includes(def.kind);

    if (!isDirect && typeof val === "string") {
      setIsThinking(true);
      addMessage({ variant: "user", content: val }, val);
      setInputValue("");

      try {
        const res = await consultAgent(def, val);
        setIsThinking(false);
        if (res.updates) updates = res.updates;
        finalVal = res.extractedValue;
      } catch (e) {
        setIsThinking(false);
      }
    } else {
      addMessage({ variant: "user", content: String(val) }, String(val));
      setInputValue("");
    }

    const nextData = { ...formData, ...updates, [activeFieldKey]: finalVal };
    onDataChange(nextData);
    next(activeFieldKey, nextData);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative transition-colors duration-500">
      {isReviewOpen && (
        <ReviewOverlay
          schema={schema}
          data={formData}
          onClose={() => setIsReviewOpen(false)}
          onSubmit={(d) => {
            onDataChange(d);
            setIsReviewOpen(false);
            onFinished();
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto px-4 py-24 scroll-smooth" ref={scrollRef}>
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="popLayout">
            {history.map((msg) => (
              <IntakeChatMessage
                key={msg.id}
                {...msg}
                onReview={() => setIsReviewOpen(true)}
                onSubmit={onFinished}
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
                Processing...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {activeFieldKey && (
        <div className="p-6 flex-none bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent pb-8">
          <div className="max-w-2xl mx-auto relative group">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputValue.trim()) handleAnswer(inputValue);
              }}
              className="relative flex gap-2"
            >
              <input
                className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full px-6 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none shadow-xl transition-all"
                placeholder="Type your answer..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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
