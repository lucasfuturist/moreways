"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already chosen
    const stored = localStorage.getItem("mw_consent_status");
    if (!stored) {
      // Delay slightly for animation effect
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: 'granted' | 'denied') => {
    setIsVisible(false);
    localStorage.setItem("mw_consent_status", choice);

    // 1. Tell the Pixel
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.consent({
        ad_storage: choice,
        analytics_storage: choice
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] z-[100] p-6 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">We value your privacy</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We use tracking technology to improve our intake routing and route valid claims to attorneys. We do not sell personal data.
                <br/>
                <Link href="/privacy" className="underline text-indigo-400 hover:text-indigo-300">Read Policy</Link>
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => handleConsent('denied')}
              >
                Decline
              </Button>
              <Button 
                className="flex-1 bg-white text-slate-900 hover:bg-slate-200"
                onClick={() => handleConsent('granted')}
              >
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}