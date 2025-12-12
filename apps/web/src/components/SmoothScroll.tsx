"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SmoothScroll() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  useEffect(() => {
    // OPTIMIZATION: Kill smooth scroll on mobile. 
    // Native momentum scrolling is always better for UX and Performance on phones.
    if (isMobile) return;

    const scrollContainer = document.getElementById("scrolling-container");
    if (!scrollContainer) return;

    const lenis = new Lenis({
      wrapper: scrollContainer,
      content: scrollContainer.firstElementChild as HTMLElement,
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

  return null;
}