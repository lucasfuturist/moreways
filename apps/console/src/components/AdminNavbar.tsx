"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/ui/UserMenu";
import { cn } from "@/lib/utils";
import { Menu, X, ShieldAlert, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 z-50 px-6 flex items-center justify-between transition-all duration-300">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/crm" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-500 transition-colors">
              <span className="font-bold">M</span>
            </div>
            <span className="font-bold text-slate-200 tracking-tight font-heading">Moreways</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/crm" active={isActive('/crm')}>
               <LayoutDashboard className="w-4 h-4 mr-2 opacity-70" /> CRM
            </NavLink>
            
            {/* [REMOVED] "My Forms" link - Forms are now Admin-only */}
            
            {/* Vertical Divider */}
            <div className="w-px h-6 bg-white/10 mx-2" />

            <NavLink href="/admin" active={isActive('/admin')}>
               <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" /> Ops Center
            </NavLink>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <UserMenu />
          
          {/* Mobile Hamburger Trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 -mr-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                style={{ top: "64px" }}
            />
            
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-16 left-0 right-0 z-50 bg-[#0F172A] border-b border-white/10 p-4 md:hidden shadow-2xl"
            >
              <nav className="flex flex-col gap-2">
                <MobileNavLink href="/crm" active={isActive('/crm')}>CRM Dashboard</MobileNavLink>
                <MobileNavLink href="/crm/inbox" active={isActive('/crm/inbox')}>Inbox</MobileNavLink>
                <div className="h-px bg-white/10 my-1" />
                <MobileNavLink href="/admin" active={isActive('/admin')}>
                    <span className="flex items-center text-rose-400"><ShieldAlert className="w-4 h-4 mr-2" /> Ops Center</span>
                </MobileNavLink>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center",
        active 
          ? "bg-white/10 text-white shadow-sm ring-1 ring-white/5" 
          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className={cn(
        "block px-4 py-3 rounded-xl text-base font-medium transition-all",
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" 
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      )}
    >
      {children}
    </Link>
  );
}