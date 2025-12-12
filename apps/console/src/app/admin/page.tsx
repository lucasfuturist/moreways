"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { 
  BarChart3, CreditCard
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { GlobalCommandPalette } from "@/components/ui/GlobalCommandPalette";

import { AdminSidebar, type AdminTab } from "./ui/AdminSidebar";
import { FormFactoryView } from "./views/FormFactoryView";
import { CustomersView } from "./views/CustomersView";
import { CommunicationsView } from "./views/CommunicationsView";
import { SupportView } from "./views/SupportView";

export default function OperationsConsole() {
  // Navigation is now handled by OpsNavbar in ./layout.tsx
  const [activeTab, setActiveTab] = useState<AdminTab>("forms");
  const [forms, setForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch("/api/forms")
      .then((res) => res.json())
      .then((data) => {
        setForms(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => { 
        console.error("Failed to load forms:", err); 
        setIsLoading(false); 
      });
  }, []);

  return (
    <div className="h-full w-full p-6 lg:p-10 overflow-y-auto relative scroll-smooth bg-slate-950 text-slate-200">
      <GlobalCommandPalette />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* --- PAGE TITLE (Simplified, Navbar handles branding) --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Platform Overview</h2>
              <p className="text-slate-400 text-sm">Real-time system metrics and tenant management.</p>
          </div>
        </div>

        {/* --- MAIN LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
            
            {/* 1. SIDEBAR */}
            <div className="hidden lg:flex lg:col-span-1 flex-col gap-2">
                <AdminSidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    stats={{ formsCount: forms.length, ticketCount: 3 }} 
                />
            </div>

            {/* 2. CONTENT AREA */}
            <div className="lg:col-span-3 space-y-6">
                
                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <MetricCard label="MRR" value="$24,500" change="+12%" />
                    <MetricCard label="Total Intakes" value="8,492" change="+340 today" />
                    <MetricCard label="Active Lawyers" value="418" change="Stable" />
                </div>

                {/* Views */}
                {activeTab === "forms" && <FormFactoryView forms={forms} isLoading={isLoading} />}
                {activeTab === "customers" && <CustomersView />}
                {activeTab === "comms" && <CommunicationsView />}
                {activeTab === "support" && <SupportView />}
                
                {(activeTab === "billing" || activeTab === "analytics") && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                        {activeTab === "billing" ? <CreditCard className="w-12 h-12 text-slate-500 mb-4" /> : <BarChart3 className="w-12 h-12 text-slate-500 mb-4" />}
                        <h3 className="text-xl font-bold text-white">{activeTab === "billing" ? "Invoices & Revenue" : "Global Metrics"}</h3>
                        <p className="text-slate-400 mt-2 text-sm max-w-sm">This module is under development.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change }: { label: string; value: string; change: string }) {
    return (
        <GlassCard className="flex flex-col justify-center border-white/10 bg-white/5" noPadding>
            <div className="p-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
                    <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 px-1.5 py-0.5 rounded">{change}</span>
                </div>
            </div>
        </GlassCard>
    );
}