"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export interface ChatMessage {
  id: string;
  variant: "agent" | "user";
  content: string;
}

export function useChatRunnerController({ formName, schema }: { formName: string, schema: FormSchemaJsonShape }) {
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isThinking, setIsThinking] = useState(false);

  // Init
  useEffect(() => {
    const initialData: Record<string, any> = {};
    searchParams.forEach((val, key) => initialData[key] = val);
    setFormData(initialData);
    setHistory([{ id: "init", variant: "agent", content: `Hello! I am ${formName}. Let's begin.` }]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, isThinking]);

  const handleAnswer = async (answer: string) => {
    if (!answer.trim()) return;

    // 1. Add User Message
    setHistory(prev => [...prev, { id: Date.now().toString(), variant: "user", content: answer }]);
    setIsThinking(true);

    try {
      // 2. Call API
      const res = await fetch("/api/intake/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schema, currentData: formData, userMessage: answer }),
      });
      
      const json = await res.json();

      // 3. VISUAL LOGGING (Check F12 Console)
      if (json.debugLog) {
        console.group("%c🧠 Simple Engine Logs", "background: #222; color: #bada55");
        json.debugLog.forEach((l: any) => {
            if (l.label === "📄 FULL JSON STATE") {
                console.log("%c📄 FULL JSON STATE:", "color: orange; font-weight: bold;", l.data);
            } else {
                console.log(l.label, l.data);
            }
        });
        console.groupEnd();
      }

      // 4. Update UI
      setFormData(json.updatedData);
      setHistory(prev => [...prev, { id: Date.now().toString(), variant: "agent", content: json.replyMessage }]);

    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return { history, isThinking, handleAnswer, scrollRef };
}