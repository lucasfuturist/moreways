import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowUpRight, FileText, Users, Activity } from "lucide-react";
import Link from "next/link";

// --- CLICKABLE METRICS ---
export function MetricsRow({ 
  activeForms, 
  totalResponses, 
  onResetFilter 
}: { 
  activeForms: number, 
  totalResponses: number,
  onResetFilter: () => void 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* 1. Forms -> Reset Filters */}
      <button onClick={onResetFilter} className="text-left group focus:outline-none w-full">
        <GlassCard className="relative group-hover:border-primary/50 transition-colors h-full" hoverEffect={false}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">Active Forms</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-foreground tracking-tight">{activeForms}</h3>
            <span className="text-xs font-medium text-emerald-500 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">+2 this week</span>
          </div>
        </GlassCard>
      </button>

      {/* 2. Responses -> Go to CRM */}
      <Link href="/crm" className="block group w-full">
        <GlassCard className="relative group-hover:border-indigo-500/50 transition-colors h-full" hoverEffect={false}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-indigo-500 transition-colors">Total Responses</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-foreground tracking-tight">{totalResponses}</h3>
            <span className="text-xs font-medium text-indigo-500 flex items-center gap-1 group-hover:underline">
               View Inbox <ArrowUpRight className="w-3 h-3"/>
            </span>
          </div>
        </GlassCard>
      </Link>

      {/* 3. System -> Static */}
      <GlassCard className="relative h-full" hoverEffect={false}>
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">System Status</span>
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-foreground tracking-tight">Operational</h3>
          <span className="text-xs font-mono text-muted-foreground">v1.5.0</span>
        </div>
      </GlassCard>
    </div>
  );
}

export function RecentActivityFeed({ activities = [] }: { activities?: any[] }) {
    return <div />;
}