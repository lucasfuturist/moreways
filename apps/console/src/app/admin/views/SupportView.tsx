"use client";

import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@supabase/supabase-js";
import { GlassCard } from "@/components/ui/GlassCard";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface Ticket {
  id: string;
  subject: string;
  firm: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  time: string; // ISO date
}

export function SupportView() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
        try {
            // [AUTH] Attach token to request
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || "";

            const res = await fetch("/api/admin/support", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            if (Array.isArray(data)) setTickets(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    load();
  }, []);

  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Tickets...</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Support Tickets</h2>
        <span className="text-xs font-mono text-slate-500">{openCount} Open</span>
      </div>
      
      <div className="space-y-3">
        {tickets.map(ticket => (
          <GlassCard key={ticket.id} noPadding className="p-4 border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className={clsx("w-2 h-2 rounded-full", 
                ticket.priority === "critical" ? "bg-purple-500 animate-ping" : 
                ticket.priority === "high" ? "bg-red-500" : 
                ticket.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
              )} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{ticket.subject}</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400 font-mono truncate max-w-[80px]">{ticket.id}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                    {ticket.firm} • {formatDistanceToNow(new Date(ticket.time))} ago
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={clsx("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border", 
                ticket.status === "open" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                ticket.status === "in_progress" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                "bg-slate-500/10 text-slate-400 border-slate-500/20"
              )}>
                {ticket.status.replace("_", " ")}
              </span>
              <button className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">View</button>
            </div>
          </GlassCard>
        ))}
        {tickets.length === 0 && (
            <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-slate-500">
                No tickets found.
            </div>
        )}
      </div>
    </div>
  );
}