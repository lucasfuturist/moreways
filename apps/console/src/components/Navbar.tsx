"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClientUserMenu } from "@/components/ClientUserMenu"; 

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null; // UPDATED: Added role to type
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 1. Reset scroll state immediately on route change
  useEffect(() => {
    setScrolled(false);
  }, [pathname]);

  // 2. Global Scroll Listener
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.id === 'scrolling-container') {
        const isScrolled = target.scrollTop > 20;
        setScrolled(isScrolled);
      }
    };
    document.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  const navLinks = [
    { href: "/consumers", label: "For Consumers" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/issues", label: "Qualifying Cases" },
    { href: "/for-law-firms", label: "For Attorneys" },
  ];

  // UPDATED: Determine Dashboard URL based on Role
  const dashboardUrl = (user?.role === 'lawyer' || user?.role === 'admin') 
    ? (process.env.NEXT_PUBLIC_LAWYER_APP_URL || 'http://localhost:3001/crm')
    : '/dashboard';

  return (
    <div className="flex justify-center w-full pt-4 px-4 pointer-events-none fixed top-0 left-0 right-0 z-50">
      <nav 
        className={cn(
          "pointer-events-auto transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] duration-300",
          "flex items-center justify-between",
          "bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl shadow-indigo-500/5",
          scrolled 
            ? "w-full md:max-w-5xl rounded-full py-2 px-4 pl-6" 
            : "w-[calc(100%-2rem)] max-w-7xl rounded-[2rem] py-4 px-6"
        )}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group relative z-10">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold font-heading shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
            M
          </div>
          <span className="text-xl font-bold font-heading tracking-tight transition-colors text-slate-900 dark:text-white">
            Moreways
          </span>
        </Link>

        {/* CENTER LINKS (Desktop Only) */}
        <div className={cn(
            "hidden md:flex items-center bg-white/5 dark:bg-white/5 rounded-full border border-white/5 transition-all duration-300",
            scrolled ? "gap-0 p-0.5" : "gap-1 p-1" 
        )}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium rounded-full transition-all duration-300",
                scrolled ? "px-3 py-1.5" : "px-4 py-1.5", 
                pathname === link.href 
                  ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className={cn(
            "hidden md:flex items-center transition-all duration-300",
            scrolled ? "gap-2" : "gap-3" 
        )}>
          <ThemeToggle />

          {user ? (
            // === LOGGED IN STATE ===
            <>
              {/* UPDATED: Dynamic Dashboard Button */}
              <Link href={dashboardUrl}>
                <Button variant="ghost" size="sm" className={cn(
                    "rounded-full h-10 px-4 transition-colors",
                    pathname === '/dashboard' 
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                )}>
                   <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </Button>
              </Link>
              
              <div className="pl-1 border-l border-slate-200 dark:border-white/10 ml-1">
                 <ClientUserMenu user={user} />
              </div>
            </>
          ) : (
            // === LOGGED OUT STATE ===
            <>
              <Link href="/login">
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 h-10 px-4"
                 >
                   Sign In
                 </Button>
              </Link>

              <Link href="/start">
                <Button 
                  className="rounded-full px-6 transition-all shadow-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-indigo-500/20 h-10 font-medium"
                >
                  Start Free Assessment
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div className="md:hidden flex items-center gap-2">
            {user && <ClientUserMenu user={user} />}
            
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-900 dark:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
        </div>

        {/* MOBILE MENU CONTENT */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-24 left-4 right-4 bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-[2rem] p-4 shadow-2xl animate-in slide-in-from-top-2 z-50 pointer-events-auto">
             <div className="flex flex-col space-y-2">
              
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    pathname === link.href 
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-slate-200/50 dark:bg-white/10 my-2" />
              
              {user ? (
                 <Link href={dashboardUrl} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-xl py-6 text-lg shadow-xl shadow-indigo-500/20 bg-indigo-600 text-white hover:bg-indigo-500">
                      <LayoutDashboard className="w-5 h-5 mr-2" /> Go to Dashboard
                    </Button>
                 </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <div className="px-4 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-center border border-slate-200/50 dark:border-white/5">
                      Sign In
                    </div>
                  </Link>

                  <Link href="/start" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-xl py-6 text-lg shadow-xl shadow-indigo-500/20 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-500">
                      Start Free Assessment
                    </Button>
                  </Link>
                </>
              )}
             </div>
          </div>
        )}
      </nav>
    </div>
  );
}