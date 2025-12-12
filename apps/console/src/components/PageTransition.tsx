"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import FrozenRoute from "./FrozenRoute";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // 1. Desktop Only: Initialize Smooth Scroll (Lenis)
    // We skip this on mobile because native touch scrolling is superior.
    if (isMobile) return;
    
    const container = containerRef.current;
    if (!container) return;

    const lenis = new Lenis({
      wrapper: container,
      content: container.firstElementChild as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname, isMobile]);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        ref={containerRef}
        id="scrolling-container"
        
        // 2. UPDATED: Removed 'filter: blur()' completely.
        // We now rely purely on Opacity and Scale. It is much more robust.
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        
        // 3. Exit Animation
        // On Mobile: Instant removal (empty object) to prevent memory spikes.
        // On Desktop: Fade out + slight zoom.
        exit={isMobile ? {} : { opacity: 0, scale: 1.02 }} 
        
        transition={
          isMobile 
            ? { duration: 0.2, ease: "linear" } // Snappy on phones
            : { duration: 0.6, ease: [0.22, 1, 0.36, 1] } // Smooth on desktop
        }
        className="absolute inset-0 w-full h-full overflow-y-auto scroll-smooth"
      >
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  );
}