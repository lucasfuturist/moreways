"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, CornerDownLeft } from "lucide-react";
import type { FormFieldDefinition, FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface FieldAssistantBubbleProps {
  field: FormFieldDefinition;
  formName: string;
  schema: FormSchemaJsonShape;
  formData: Record<string, any>;
  onClose: () => void;
  onUpdateField: (value: any) => void;
}

export function FieldAssistantBubble({ field, formName, schema, formData, onClose, onUpdateField }: FieldAssistantBubbleProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const schemaSummary = Object.keys(schema.properties)
    .map(k => `- ${schema.properties[k].title}`)
    .join("\n");

  const handleAsk = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setIsThinking(true);
    setResponse(null);

    try {
      const res = await fetch("/api/intake/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            field, 
            userMessage: input, 
            formName, 
            history: [], 
            schemaSummary,
            formData 
        }),
      });
      
      const data = await res.json();
      
      if (data.type === "answer" && data.extractedValue !== undefined) {
          onUpdateField(data.extractedValue);
          setResponse(`I've updated the field to: ${data.extractedValue}`);
          setTimeout(onClose, 1500);
      } else {
          setResponse(data.replyMessage);
      }

    } catch (err) {
        setResponse("Sorry, I couldn't connect to the assistant.");
    } finally {
        setIsThinking(false);
    }
  };

  return (
    <div className="absolute right-0 top-8 z-50 w-80 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
      <div className="bg-white dark:bg-violet-950 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-black/50">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-violet-900/50 px-4 py-3 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wide">AI Assistant</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
            {response ? (
                <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-100 dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/5 animate-in slide-in-from-bottom-2">
                    {response}
                </div>
            ) : (
                <div className="text-xs text-slate-500 text-center py-2">
                    Ask about "{field.title}"...
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleAsk} className="relative">
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. Why is this needed?"
                    disabled={isThinking}
                    className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-teal-500 focus:border-indigo-500 dark:focus:border-teal-500 transition-all outline-none"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || isThinking}
                    className="absolute right-1.5 top-1.5 p-1.5 bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-teal-600/20 text-slate-400 hover:text-indigo-500 dark:hover:text-teal-400 rounded-md transition-all disabled:opacity-30 border border-slate-200 dark:border-transparent shadow-sm"
                >
                    {isThinking ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <CornerDownLeft className="w-3.5 h-3.5" />}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}