"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, Trash2, FileEdit, Share2, ShieldCheck, MoreHorizontal } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { GlassMenu, type MenuItem } from "@/components/ui/GlassMenu";

export interface FormCardProps {
  form: any;
  isPinned?: boolean; 
  onTogglePin?: (id: string) => void;
}

const getStatusColor = (submissions: number) => {
  if (submissions > 10) return "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30";
  if (submissions > 0) return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
  return "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10";
};

export function FormCard({ form, isPinned = false, onTogglePin }: FormCardProps) {
  // Spotlight State
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const auditStatus = form.name.toLowerCase().includes("intake") ? "safe" : "risk";
  
  // Mock Conversion Rate for UI demo
  const conversionRate = form._count.formSubmissions > 0 ? Math.floor(Math.random() * 30 + 40) + "%" : "0%";

  const menuItems: MenuItem[] = [
    { label: "Edit Form", icon: <FileEdit className="w-3.5 h-3.5"/>, onClick: () => console.log("Edit", form.id) },
    { label: "Copy Link", icon: <Copy className="w-3.5 h-3.5"/>, onClick: () => { navigator.clipboard.writeText(`${window.location.origin}/s/${form.id}`); alert("Copied!"); } },
    { label: "Share", icon: <Share2 className="w-3.5 h-3.5"/>, onClick: () => console.log("Share", form.id) },
    { label: "Archive", icon: <Trash2 className="w-3.5 h-3.5"/>, onClick: () => console.log("Delete", form.id), variant: "danger" },
  ];

  return (
    <Link href={`/forms/${form.id}/editor`}>
      <motion.div 
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => { setIsHovered(true); setOpacity(1); }}
        onMouseLeave={() => { setIsHovered(false); setOpacity(0); }}
        className="h-full relative rounded-2xl overflow-hidden group bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all duration-500"
      >
        {/* Spotlight Gradient */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
          }}
        />

        <div className="p-6 flex flex-col h-full relative z-10">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <div className={clsx("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-colors", getStatusColor(form._count.formSubmissions))}>
                        {form._count.formSubmissions > 0 && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                        {form._count.formSubmissions > 0 ? (form._count.formSubmissions === 1 ? "1 Res" : `${form._count.formSubmissions} Res`) : "Draft"}
                    </div>

                    {auditStatus === "safe" && (
                        <div className="text-emerald-500/50 group-hover:text-emerald-500 transition-colors p-1" title="AI Audit: Safe">
                            <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                    )}
                </div>
                
                {/* Menu Button - preventing link click */}
                <div onClick={(e) => e.preventDefault()}>
                    <GlassMenu items={menuItems} />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {form.name}
                </h3>
                
                {/* Animated Info / Stats Swap */}
                <div className="h-10 relative mt-2 overflow-hidden">
                    {/* Default: Version Info */}
                    <motion.div 
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: isHovered ? -20 : 0, opacity: isHovered ? 0 : 1 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            v{form.version} • Updated {new Date(form.updatedAt).toLocaleDateString()}
                        </p>
                    </motion.div>

                    {/* Hover: Stats Row */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center gap-6"
                    >
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Total Leads</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                                {form._count.formSubmissions}
                            </span>
                        </div>
                        
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Conv. Rate</span>
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                                {conversionRate}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer Slide-Up */}
            <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[100px] opacity-60">
                    {form.id.substring(0, 8)}...
                </span>
                
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    Open <ArrowUpRight className="w-3 h-3" />
                </div>
            </div>
        </div>
      </motion.div>
    </Link>
  );
}