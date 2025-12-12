"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Recipient Mock
const RECIPIENTS = [
    { id: 1, name: "Morgan & Morgan", email: "admin@forthepeople.com" },
    { id: 2, name: "Davis Law Group", email: "sarah@davislaw.com" },
    { id: 3, name: "Hamlin Hamlin McGill", email: "howard@hhm.com" },
];

export function CommunicationsView() {
  const [broadcastMode, setBroadcastMode] = useState<"all" | "selected">("all");
  const [commsMessage, setCommsMessage] = useState("");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-panel rounded-2xl overflow-hidden border-white/10 p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-white">Communications Center</h2>
            <p className="text-sm text-slate-400">Broadcast updates or message specific firms directly.</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-lg">
            <button onClick={() => setBroadcastMode("all")} className={clsx("px-3 py-1.5 text-xs font-bold rounded transition-colors", broadcastMode === "all" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white")}>Broadcast All</button>
            <button onClick={() => setBroadcastMode("selected")} className={clsx("px-3 py-1.5 text-xs font-bold rounded transition-colors", broadcastMode === "selected" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white")}>Direct Message</button>
          </div>
        </div>

        {/* Recipient List */}
        {broadcastMode === "selected" && (
          <div className="p-3 bg-black/20 rounded-xl border border-white/5 max-h-40 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] font-bold uppercase text-slate-500 mb-2">Select Recipients</div>
            {RECIPIENTS.map(c => (
              <label key={c.id} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer">
                <input type="checkbox" className="rounded bg-white/10 border-white/20 text-rose-600 focus:ring-0" />
                <span className="text-sm text-slate-300">{c.name}</span>
                <span className="text-xs text-slate-500 ml-auto">{c.email}</span>
              </label>
            ))}
          </div>
        )}

        {/* Composer */}
        <div className="space-y-3">
          <textarea 
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-rose-500 outline-none resize-none"
            placeholder={broadcastMode === "all" ? "Draft a system-wide announcement (e.g. Maintenance Alert)..." : "Draft a private message to selected firms..."}
            value={commsMessage}
            onChange={(e) => setCommsMessage(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Sent as: <span className="text-white">Moreways Support</span></span>
            <Button variant="primary" disabled={!commsMessage.trim()} className="bg-rose-600 hover:bg-rose-500 text-white">
              <Send className="w-4 h-4 mr-2" /> Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}