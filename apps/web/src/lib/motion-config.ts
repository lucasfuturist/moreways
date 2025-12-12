"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Variants } from "framer-motion";

export function useMotionConfig() {
  const isMobile = useIsMobile();

  if (isMobile) {
    // MOBILE CONFIG
    return {
      isMobile: true,
      fadeProps: {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { duration: 0.3 }
      },
      staggerContainerProps: {
        initial: "visible",
        whileInView: "visible",
        viewport: { once: true },
        variants: {} as Variants // Explicit type assertion
      },
      staggerItemProps: {
        variants: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.3 } }
        } as Variants
      }
    };
  }

  // DESKTOP CONFIG
  return {
    isMobile: false,
    fadeProps: {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-50px" },
      // FIX: 'as const' tells TS this is exactly [number, number, number, number]
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    },
    staggerContainerProps: {
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true, margin: "-50px" },
      variants: {
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      } as Variants
    },
    staggerItemProps: {
      variants: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
      } as Variants
    }
  };
}