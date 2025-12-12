// src/forms/ui/ai/AssistantPanel.tsx

"use client";

import React, { useState, useEffect } from "react";
import { ChatPanel } from "@/intake/ui/chat/ChatPanel";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface Message { 
    id: string; 
    role: "user" | "assistant"; 
    text: string; 
}

interface AssistantPanelProps {
  formId: string;
  currentSchema: FormSchemaJsonShape;
  onSchemaUpdate: (newSchema: FormSchemaJsonShape, message: string) => void;
  onMinimize: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const DEFAULT_SUGGESTIONS = [
    "Create a Personal Injury Intake",
    "Add contact information block",
    "Include a signature field",
    "Add date of incident"
];

export function AssistantPanel({ 
    formId, 
    currentSchema, 
    onSchemaUpdate, 
    onMinimize,
    messages,
    setMessages
}: AssistantPanelProps) {
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [suggestions, setSuggestions] = useState<string[]>(() => 
    formId === "new" ? DEFAULT_SUGGESTIONS : []
  );
  
  const [hasLoadedContext, setHasLoadedContext] = useState(false);

  useEffect(() => {
    setHasLoadedContext(false);
    if (formId === "new") {
        setSuggestions(DEFAULT_SUGGESTIONS);
    }
  }, [formId]);

  useEffect(() => {
    if (hasLoadedContext) return;

    const hasFields = currentSchema && currentSchema.properties && Object.keys(currentSchema.properties).length > 0;
    
    if (hasFields) {
        refreshSuggestions(currentSchema, messages);
        setHasLoadedContext(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSchema, hasLoadedContext, messages]); 

  const refreshSuggestions = async (schema: FormSchemaJsonShape, history: Message[]) => {
    try {
        const res = await fetch("/api/ai/generate-suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                schema, 
                history: history.map(m => ({ role: m.role, content: m.text })) 
            })
        });
        if (res.ok) {
            const data = await res.json();
            if (data.suggestions && data.suggestions.length > 0) {
                setSuggestions(data.suggestions);
            }
        }
    } catch (e) {
        console.error("Silent suggestion fail", e);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    const userMsgText = input;
    setInput("");
    
    setSuggestions([]);
    
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: userMsgText }]);
    setIsLoading(true);

    try {
        const res = await fetch("/api/intake/forms/from-prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                prompt: userMsgText, 
                organizationId: "org_default_local", 
                currentSchema: currentSchema,
                history: messages.map(m => ({ role: m.role, content: m.text }))
            })
        });

        if (!res.ok) throw new Error("AI Request Failed");
        const data = await res.json();
        
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: "assistant", 
            text: data.message 
        }]);

        if (data.schema) {
            onSchemaUpdate(data.schema, data.message);
            const newHistory = [...messages, 
                { role: "user" as const, text: userMsgText, id: "" }, 
                { role: "assistant" as const, text: data.message, id: "" }
            ];
            refreshSuggestions(data.schema, newHistory);
        } else {
            const newHistory = [...messages, { role: "user" as const, text: userMsgText, id: "" }];
            refreshSuggestions(currentSchema, newHistory);
        }

    } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: "assistant", 
            text: "Sorry, I encountered an error. Please try again." 
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    // [FIX] Changed bg-slate-900/50 to bg-transparent to fix muddy look in Light Mode.
    // Also made border theme-aware.
    <div className="h-full w-full flex flex-col bg-transparent border-r border-slate-200/50 dark:border-white/10">
       <ChatPanel 
          messages={messages}
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onMinimize={onMinimize}
          suggestions={suggestions}
       />
    </div>
  );
}