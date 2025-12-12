"use client";

import React from "react";
import { clsx } from "clsx";
import { GlassCard } from "@/components/ui/GlassCard";

const MOCK_TICKETS = [
    { id: "T-101", subject: "API Integration Error", firm: "Morgan & Morgan", priority: "high", status: "open", time: "10m ago" },
    { id: "T-102", subject: "Add new user request", firm: "Davis Law Group", priority: "low", status: "resolved", time: "2h ago" },
    { id: "T-103", subject: "Intake form typo", firm: "Hamlin Hamlin McGill", priority: "medium", status: "open", time: "4h ago" },
];

export function SupportView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Support Tickets</h2>
        <span className="text-xs font-mono text-slate-500">3 Open</span>
      </div>
      <div className="space-y-3">
        {MOCK_TICKETS.map(ticket => (
          <GlassCard key={ticket.id} noPadding className="p-4 border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className={clsx("w-2 h-2 rounded-full", ticket.priority === "high" ? "bg-red-500 animate-pulse" : ticket.priority === "medium" ? "bg-amber-500" : "bg-blue-500")} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{ticket.subject}</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400 font-mono">{ticket.id}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{ticket.firm} • {ticket.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={clsx("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border", ticket.status === "open" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20")}>
                {ticket.status}
              </span>
              <button className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">Resolve</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}