"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { MoreHorizontal } from "lucide-react";

export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface GlassMenuProps {
  items: MenuItem[];
}

export function GlassMenu({ items }: GlassMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-30" ref={menuRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent card click
          setIsOpen(!isOpen);
        }}
        className={clsx(
          "p-1.5 rounded-lg transition-all duration-200",
          isOpen 
            ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
            : "text-shadow-500 hover:text-white hover:bg-white/5"
        )}
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl border border-white/10 bg-violet-950/90 backdrop-blur-2xl shadow-level-3 overflow-hidden ring-1 ring-black/50"
          >
            <div className="p-1 flex flex-col gap-0.5">
              {items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                    item.variant === "danger"
                      ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      : "text-shadow-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {item.icon && <span className="opacity-70">{item.icon}</span>}
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}