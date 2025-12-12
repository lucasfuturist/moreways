"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, BookOpen, Gavel, Loader2, X, ChevronRight, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

// --- TYPES ---
interface Citation {
  urn: string;
  title: string;
  text: string;
  similarity: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: number;
}

interface LawNode {
  urn: string;
  content_text: string;
  structure_type: string;
}

// --- MAIN COMPONENT ---
export function LegalResearchBot() {
  // Chat State
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Message[]>([
    {
        id: "init",
        role: "assistant",
        content: "I am your Legal Research Assistant. I have access to Massachusetts CMR and Federal statutes. What legal topic are you researching?",
        timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reader State
  const [activeUrn, setActiveUrn] = useState<string | null>(null);
  const [lawContent, setLawContent] = useState<LawNode | null>(null);
  const [isReaderLoading, setIsReaderLoading] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    if (!activeUrn) { // Only scroll if not reading a law
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [history, isLoading, activeUrn]);

  // Fetch Full Law on Click
  const handleOpenLaw = async (urn: string) => {
    setActiveUrn(urn);
    setLawContent(null);
    setIsReaderLoading(true);

    try {
        // [FIX] Use query param (?urn=) instead of path parameter
        const res = await fetch(`/api/lex/node?urn=${encodeURIComponent(urn)}`);
        
        if (!res.ok) throw new Error("Failed to fetch law");
        const json = await res.json();
        setLawContent(json.data);
    } catch (e) {
        console.error(e);
        setLawContent({ 
            urn, 
            content_text: "Error loading full text. Please check the backend connection.", 
            structure_type: "ERROR" 
        });
    } finally {
        setIsReaderLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input, timestamp: Date.now() };
    setHistory(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
        const res = await fetch("/api/chat/legal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [userMsg] })
        });

        if (!res.ok) throw new Error("Search failed");
        
        const data = await res.json();
        
        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.content,
            citations: data.citations,
            timestamp: Date.now()
        };
        
        setHistory(prev => [...prev, botMsg]);

    } catch (err) {
        setHistory(prev => [...prev, {
            id: Date.now().toString(),
            role: "assistant",
            content: "I encountered an error accessing the law library. Please try again.",
            timestamp: Date.now()
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-950 relative overflow-hidden">
        
        {/* --- LEFT: CHAT INTERFACE --- */}
        <div className={clsx(
            "flex-1 flex flex-col transition-all duration-500 ease-in-out",
            activeUrn ? "w-1/2 pr-0 opacity-40 pointer-events-none md:opacity-100 md:pointer-events-auto" : "w-full"
        )}>
            {/* Header */}
            <div className="flex-none p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center gap-3 z-10">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                    <Gavel className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">LexOS Research</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Retrieval Augmented Generation</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth" ref={scrollRef}>
                <AnimatePresence mode="popLayout">
                    {history.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={clsx("flex gap-4 max-w-3xl mx-auto", msg.role === "user" ? "justify-end" : "justify-start")}
                        >
                            {/* Bot Avatar */}
                            {msg.role === "assistant" && (
                                <div className="flex-none w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 mt-1">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            )}

                            <div className={clsx("flex flex-col gap-2 max-w-[90%] md:max-w-[85%]", msg.role === "user" ? "items-end" : "items-start")}>
                                
                                {/* Bubble */}
                                <div className={clsx(
                                    "px-5 py-3.5 text-sm leading-relaxed shadow-sm",
                                    msg.role === "user" 
                                        ? "bg-indigo-600 text-white rounded-[1.25rem] rounded-tr-sm shadow-indigo-500/20" 
                                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-[1.25rem] rounded-tl-sm"
                                )}>
                                    {msg.content.split('\n').map((line, i) => (
                                        <p key={i} className={clsx(line.trim() === "" ? "h-2" : "mb-2 last:mb-0")}>{line}</p>
                                    ))}
                                </div>

                                {/* Citations List */}
                                {msg.citations && msg.citations.length > 0 && (
                                    <div className="flex flex-col gap-2 w-full mt-1">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Sources</span>
                                        {msg.citations.slice(0, 4).map((cite, idx) => (
                                            <button 
                                                key={idx} 
                                                onClick={() => handleOpenLaw(cite.urn)}
                                                className="text-left bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 rounded-lg p-3 group transition-all hover:bg-slate-900 shadow-sm"
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span className="text-xs font-bold text-emerald-400 font-mono truncate">
                                                        {cite.urn.split(':').pop()?.replace(/_/g, ' ').toUpperCase()}
                                                    </span>
                                                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-500 ml-auto transition-colors" />
                                                </div>
                                                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-300">
                                                    {cite.text}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* User Avatar */}
                            {msg.role === "user" && (
                                <div className="flex-none w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mt-1">
                                    <User className="w-4 h-4 text-slate-400" />
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {/* Loader */}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-3xl mx-auto">
                            <div className="flex-none w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mt-1">
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                            <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-[1.25rem] rounded-tl-sm flex items-center gap-2">
                                <span className="text-xs text-slate-400 animate-pulse">Consulting Law Library...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-4 md:p-6 bg-slate-900/80 border-t border-slate-800 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto relative flex items-center bg-slate-950 rounded-full border border-slate-800 focus-within:border-emerald-500/50 transition-colors shadow-lg">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask a legal question..."
                        className="flex-1 bg-transparent px-6 py-4 text-white placeholder:text-slate-500 outline-none rounded-full"
                        disabled={isLoading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="mr-2 p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all disabled:opacity-50 disabled:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        {/* --- RIGHT: LAW READER (Drawer) --- */}
        <AnimatePresence>
            {activeUrn && (
                <motion.div 
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-y-0 right-0 w-full md:w-[600px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
                >
                    {/* Drawer Header */}
                    <div className="flex-none p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/95 backdrop-blur">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-slate-800 rounded-md text-slate-400">
                                <Scale className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-white uppercase tracking-wider truncate">
                                    Official Text
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono truncate">
                                    {activeUrn}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setActiveUrn(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Drawer Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950">
                        {isReaderLoading ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-500">
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                                <p className="text-xs uppercase tracking-widest">Reconstructing Document...</p>
                            </div>
                        ) : lawContent ? (
                            <div className="prose prose-invert prose-sm max-w-none">
                                {/* Simulated Document Typography */}
                                <div className="font-serif text-slate-300 leading-loose whitespace-pre-wrap">
                                    {lawContent.content_text}
                                </div>
                                
                                <div className="mt-12 pt-6 border-t border-slate-800 flex justify-between text-[10px] text-slate-600 uppercase tracking-widest">
                                    <span>Source: {lawContent.structure_type}</span>
                                    <span>Verified by ArgueOS</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 mt-20">
                                <p>Failed to load document content.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}