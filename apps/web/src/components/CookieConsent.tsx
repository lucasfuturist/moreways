"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const stored = localStorage.getItem("mw_consent_status");
    if (!stored) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: 'granted' | 'denied') => {
    setIsVisible(false);
    localStorage.setItem("mw_consent_status", choice);

    // 1. Tell the Pixel immediately
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.consent({
        ad_storage: choice,
        analytics_storage: choice
      });
      console.log(`[Privacy] Consent set to: ${choice}`);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[420px] z-[100]"
        >
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-2xl shadow-black/20 ring-1 ring-black/5">
            
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Cookie className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                  Privacy & Transparency
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We use secure tracking to ensure your claim is routed to the correct attorney. We do not sell personal data to data brokers.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => handleConsent('denied')}
              >
                Decline
              </Button>
              <Button 
                className="flex-1 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                onClick={() => handleConsent('granted')}
              >
                Accept & Continue
              </Button>
            </div>

            <div className="mt-3 text-center">
                <Link href="/privacy" className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline underline-offset-2">
                    Read our full Data Policy
                </Link>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}