"use client";

import React from "react";
import { clsx } from "clsx";
import { 
  FileCode2, Building2, MessageSquare, 
  LifeBuoy, CreditCard, BarChart3 
} from "lucide-react";

export type AdminTab = "forms" | "customers" | "comms" | "support" | "billing" | "analytics";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (t: AdminTab) => void;
  stats: {
    formsCount: number;
    ticketCount: number;
  };
}

export function AdminSidebar({ activeTab, setActiveTab, stats }: AdminSidebarProps) {
  return (
    <div className="flex flex-col gap-2">
      <NavButton 
        active={activeTab === "forms"} 
        onClick={() => setActiveTab("forms")} 
        icon={<FileCode2 className="w-5 h-5" />} 
        label="Form Factory" 
        badge={stats.formsCount} 
      />
      <NavButton 
        active={activeTab === "customers"} 
        onClick={() => setActiveTab("customers")} 
        icon={<Building2 className="w-5 h-5" />} 
        label="Customers" 
        badge={4} 
      />
      <NavButton 
        active={activeTab === "comms"} 
        onClick={() => setActiveTab("comms")} 
        icon={<MessageSquare className="w-5 h-5" />} 
        label="Communications" 
      />
      <NavButton 
        active={activeTab === "support"} 
        onClick={() => setActiveTab("support")} 
        icon={<LifeBuoy className="w-5 h-5" />} 
        label="Tech Support" 
        badge={stats.ticketCount}
        badgeColor="bg-red-500"
      />
      <NavButton 
        active={activeTab === "billing"} 
        onClick={() => setActiveTab("billing")} 
        icon={<CreditCard className="w-5 h-5" />} 
        label="Billing" 
      />
      <NavButton 
        active={activeTab === "analytics"} 
        onClick={() => setActiveTab("analytics")} 
        icon={<BarChart3 className="w-5 h-5" />} 
        label="Platform Stats" 
      />
    </div>
  );
}

function NavButton({ active, onClick, icon, label, badge, badgeColor }: any) {
  return (
    <button 
      onClick={onClick} 
      className={clsx(
        "flex items-center justify-between p-4 rounded-xl border transition-all text-left group",
        active 
          ? "bg-rose-500/10 border-rose-500/50 text-white shadow-[0_0_20px_rgba(225,29,72,0.15)]" 
          : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
      )}
    >
      <span className={clsx("flex items-center gap-3 font-medium text-sm", active ? "text-rose-200" : "")}>
        {React.cloneElement(icon, { className: clsx("w-5 h-5", active ? "text-rose-500" : "text-slate-500") })}
        {label}
      </span>
      {badge !== undefined && (
        <span className={clsx("text-[10px] px-2 py-0.5 rounded text-white", badgeColor || (active ? "bg-rose-500" : "bg-black/40"))}>
          {badge}
        </span>
      )}
    </button>
  );
}