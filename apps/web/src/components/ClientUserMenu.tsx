"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";

interface ClientUserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function ClientUserMenu({ user }: ClientUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initials = user?.name 
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  // Close when clicking outside
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
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      
      // RELIABILITY FIX: Use window.location.href instead of router.push
      // This forces a hard reload, clearing all client-side state and memory,
      // and guarantees the user lands on the homepage without middleware race conditions.
      window.location.href = "/";
      
    } catch (error) {
      console.error("Logout failed", error);
      // Fallback
      window.location.href = "/";
    }
  };

  return (
    <div className="relative z-50 pointer-events-auto" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group focus:outline-none"
      >
        {/* Avatar Circle */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
           <span className="text-xs font-bold text-white">{initials}</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-3 w-60 origin-top-right rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-black/50"
          >
            <div className="px-5 py-4 border-b border-white/5">
              <p className="text-sm font-bold text-white mb-0.5">{user?.name || "Client"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>

            <div className="p-1.5">
              <button
                type="button" // Explicitly set type button to prevent form submission behavior
                onClick={(e) => {
                  e.stopPropagation(); // Prevent bubbling issues
                  handleSignOut();
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-medium text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}