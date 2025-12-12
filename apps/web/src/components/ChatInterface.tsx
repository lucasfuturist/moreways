// src/components/ChatInterface.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, ShieldCheck } from "lucide-react"; 
import ChatMessage from "./ChatMessage";
import { VoiceOrb } from "./ui/voice-orb";
import { PublicFormResponse } from "@/lib/types/argueos-types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  onFormRouted: (form: PublicFormResponse) => void;
}

const FORM_MAP: Record<string, string> = {
  "Auto – Dealership or Repair": "auto-dealer-dispute", 
  "Debt Collection": "debt-collection-harassment",
  "Credit or Banking Problem": "credit-report-errors",
  "Retail or Services Dispute": "online-and-retail-purchases",
  "Home Improvement / Contractor Issue": "contractor-home-improvement",
  "Housing – Landlord/Tenant Issue": "security-deposit-issues",
  "Telemarketing / Robocall Issue": "robocalls",
  "Scam / Fraud / Unfair Business Practice": "deceptive-practices",
  "General Consumer Complaint": "general-complaint",
};

export default function ChatInterface({ onFormRouted }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Describe what happened, and I'll find the right legal path for you." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isBooting && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isBooting]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    const newHistory = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);

      // THIS IS THE NEW LOGIC THAT REPLACES THE REDIRECT
      if (data.router_data?.needs_clarification === "no") {
        const category = data.router_data.form_type;
        const slug = FORM_MAP[category] || "general-complaint";
        
        const schemaRes = await fetch(`/api/intake/get-schema-by-slug?slug=${slug}`);
        if (!schemaRes.ok) {
            throw new Error(`Schema not found for slug: ${slug}`);
        }
        const formSchema: PublicFormResponse = await schemaRes.json();
        
        // Call the parent function instead of redirecting
        setTimeout(() => {
          onFormRouted(formSchema);
        }, 1500);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = (text: string) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text));
  };

  // The JSX is the same, so I'll omit it for brevity, but it's part of the full file replacement.
  return (
    <div className="flex flex-col h-[85dvh] md:h-[650px] rounded-[24px] md:rounded-[32px] overflow-hidden relative z-10 shadow-2xl shadow-indigo-900/20 border border-white/60 dark:border-white/10 bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl ring-1 ring-white/40 dark:ring-white/5">
      
      <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-6 py-4 md:py-5 flex justify-between items-start pointer-events-none">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-white/10 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 pointer-events-auto">
           <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />
           <span className="text-[10px] md:text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Moreways Assistant</span>
        </div>
        
        <div className="flex gap-2">
           <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 dark:border-white/10 px-3 py-2 rounded-full flex items-center gap-1.5" title="Encrypted">
              <ShieldCheck className="w-3 h-3 text-slate-600 dark:text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 hidden sm:inline">SECURE</span>
           </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 pt-20 md:pt-24 pb-4 space-y-4 scroll-smooth">
        {isBooting ? (
          <div className="h-full flex flex-col items-center justify-center gap-6 opacity-70">
             <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                </div>
             </div>
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse uppercase tracking-widest">
                Initializing Secure Channel...
             </p>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m.content} isUser={m.role === "user"} />
            ))}
            
            {loading && (
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 text-sm ml-2 bg-white/50 dark:bg-slate-800/50 px-4 py-3 rounded-2xl w-fit backdrop-blur-sm border border-white/40 dark:border-white/10 shadow-sm animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Analyzing...</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-3 md:p-4 bg-white dark:bg-slate-950 md:bg-gradient-to-t md:from-white/80 md:via-white/60 md:to-transparent md:dark:from-slate-950/90 md:backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 md:border-white/20">
        <div className="flex gap-2 items-end bg-slate-50 dark:bg-slate-900 md:bg-white/80 md:dark:bg-slate-800/60 md:backdrop-blur-xl rounded-[20px] md:rounded-[24px] p-2 shadow-sm md:shadow-xl border border-slate-200 dark:border-slate-700 md:border-white/60 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what happened..."
            className="resize-none min-h-[44px] max-h-[120px] border-none focus-visible:ring-0 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2.5 text-base md:text-base leading-relaxed"
          />
          
          <div className="pb-1 pr-1 flex items-center gap-1 md:gap-2">
            <VoiceOrb onTranscript={handleVoiceInput} />
            
            <div className={`transition-all duration-300 overflow-hidden ${input.trim() ? 'w-[40px] md:w-[46px] opacity-100' : 'w-0 opacity-0'}`}>
               <Button
                  onClick={handleSend}
                  disabled={loading}
                  size="icon"
                  className="h-[40px] w-[40px] md:h-[46px] md:w-[46px] rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
               >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}