"use client";
import React, { useState } from "react";
import { Send, BookOpen } from "lucide-react";
import { CitationCard } from "./CitationCard"; // Assumes you have this from the tree

export function LegalChatInterface() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput("");
    setHistory(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
        const res = await fetch("/api/chat/legal", {
            method: "POST",
            body: JSON.stringify({ messages: [{ role: "user", content: q }] })
        });
        const data = await res.json();
        
        setHistory(prev => [...prev, { 
            role: "assistant", 
            content: data.content,
            citations: data.citations 
        }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.map((msg, i) => (
                <div key={i} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-lg text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border'}`}>
                        {msg.content}
                    </div>
                    {/* Render Citations if available */}
                    {msg.citations && (
                        <div className="grid grid-cols-1 gap-2 w-full max-w-[80%]">
                            {msg.citations.map((c: any, idx: number) => (
                                <div key={idx} className="text-xs bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded border border-indigo-100 dark:border-indigo-800">
                                    <div className="font-bold flex items-center gap-1 text-indigo-700 dark:text-indigo-300">
                                        <BookOpen className="w-3 h-3" /> {c.urn}
                                    </div>
                                    <div className="line-clamp-2 opacity-80 mt-1">{c.text}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {loading && <div className="text-xs text-slate-400 animate-pulse">Consulting the library...</div>}
        </div>
        <div className="p-3 border-t bg-white dark:bg-slate-950 flex gap-2">
            <input 
                className="flex-1 bg-transparent text-sm outline-none" 
                placeholder="Ask a legal question..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
            />
            <button onClick={handleAsk} disabled={loading} className="text-indigo-600"><Send className="w-4 h-4" /></button>
        </div>
    </div>
  );
}