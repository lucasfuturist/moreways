"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { ShieldAlert, Activity, Users } from "lucide-react";
import { UserMenu } from "@/components/ui/UserMenu";

export function OpsNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 px-6 flex items-center justify-between border-b border-rose-500/10 bg-[#0A0A0A]/90 backdrop-blur-xl">
      
      {/* Left: Brand & Title */}
      <div className="flex items-center gap-8">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-rose-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] group-hover:bg-rose-500 transition-colors">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide font-heading uppercase">Ops Center</h1>
            <span className="text-[10px] text-rose-500 font-mono">System Admin</span>
          </div>
        </Link>

        {/* Admin Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <OpsLink href="/admin" active={isActive("/admin")} icon={<Activity className="w-3.5 h-3.5" />}>
            Control Tower
          </OpsLink>
          <OpsLink href="/admin/users" active={isActive("/admin/users")} icon={<Users className="w-3.5 h-3.5" />}>
            User Directory
          </OpsLink>
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* [REMOVED] "Switch to App" button */}

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}

function OpsLink({ href, active, icon, children }: { href: string; active: boolean; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all",
        active 
          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
          : "text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}