"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ShieldAlert, ChevronRight } from "lucide-react";

interface UserMenuProps {
  user?: { name?: string | null; email?: string | null; role?: string | null; } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <div className="relative z-50 pointer-events-auto" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
           <span className="text-xs font-bold text-white">U</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-black/50"
          >
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-sm font-medium text-white">{user?.name || "Demo User"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || "lawyer@example.com"}</p>
            </div>

            <div className="p-1.5 flex flex-col gap-0.5">
              
              {/* Context Switcher - Only show "Go to Admin" if NOT currently in Admin */}
              {!isAdminPage && (
                 <button
                    onClick={() => { router.push("/admin"); setIsOpen(false); }}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors group"
                 >
                    <span className="flex items-center gap-2"><ShieldAlert className="w-3.5 h-3.5" /> Super Admin</span>
                    <ChevronRight className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                 </button>
              )}

              {/* [REMOVED] Back to CRM button logic */}

              {!isAdminPage && <div className="h-px bg-white/5 my-1" />}

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-slate-400 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 opacity-70" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}