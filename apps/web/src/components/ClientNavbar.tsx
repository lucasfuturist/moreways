"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClientUserMenu } from "./ClientUserMenu";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface ClientNavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function ClientNavbar({ user }: ClientNavbarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F172A]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-white/5 dark:border-white/5 z-40 px-6 flex items-center justify-between transition-all">
      {/* Brand */}
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold font-heading shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            M
          </div>
          <span className="font-bold text-slate-200 dark:text-white tracking-tight text-lg">Moreways</span>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
          <NavLink href="/dashboard" active={isActive('/dashboard')}>My Claims</NavLink>
          <NavLink href="/dashboard/settings" active={isActive('/dashboard/settings')}>Settings</NavLink>
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <Link href="/start">
          <button className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-900 hover:bg-slate-200 font-medium text-sm transition-colors shadow-lg shadow-indigo-500/10">
            <Plus className="w-3.5 h-3.5" />
            <span>New Claim</span>
          </button>
        </Link>
        
        {/* User Menu */}
        <ClientUserMenu user={user} />
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
        active 
          ? "bg-indigo-600 text-white shadow-md" 
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      {children}
    </Link>
  );
}