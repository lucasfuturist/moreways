"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Clock, 
  MessageSquare,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

// Mock Data - Simplified for clarity
const METRICS = [
  { label: "People Waiting", value: "8", subtext: "2 came in today", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
  { label: "Unread Messages", value: "3", subtext: "Needs reply", icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Active Clients", value: "24", subtext: "In progress", icon: Users, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  { label: "Signed Up", value: "142", subtext: "This year", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

export default function CrmDashboard() {
  const router = useRouter();

  return (
    <div className="h-full w-full bg-[#0F172A] text-slate-200 p-8 font-sans relative overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 pr-4"> 
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2 font-heading">Good Morning</h1>
          <p className="text-slate-400">Here is what's happening with your leads today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => router.push('/crm/inbox')}>
            Go to Inbox <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {METRICS.map((metric, i) => (
          <GlassCard key={i} className="relative overflow-hidden group border-white/5" hoverEffect={true}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${metric.bg} ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-sm font-medium text-slate-400">{metric.label}</p>
            <p className="text-xs text-slate-500 mt-1">{metric.subtext}</p>
          </GlassCard>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Recent Leads */}
        <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <button onClick={() => router.push('/crm/inbox')} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View Inbox</button>
            </div>
            
            <div className="space-y-3">
                {[
                    { id: 1, name: "John Smith", action: "Submitted Intake", time: "10m ago", tag: "Potential New Client" },
                    { id: 2, name: "Jane Doe", action: "Sent a message", time: "2h ago", tag: "Needs Reply" },
                    { id: 3, name: "Mike Ross", action: "Signed Agreement", time: "4h ago", tag: "Client" },
                ].map((item) => (
                    <GlassCard key={item.id} noPadding className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer group transition-all" onClick={() => router.push(`/crm/inbox`)}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                                <p className="text-xs text-slate-400">{item.action} • {item.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-medium">{item.tag}</span>
                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="space-y-6">
            <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border-indigo-500/30">
                <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <button onClick={() => router.push('/crm/inbox')} className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-200 transition-colors flex items-center justify-between group">
                        <span>Reply to Messages</span>
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">3</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-200 transition-colors flex items-center justify-between group">
                        <span>Copy Intake Link</span>
                        <span className="text-slate-500 group-hover:text-white text-xs">Copy</span>
                    </button>
                </div>
            </GlassCard>
        </div>
      </div>
    </div>
  );
}