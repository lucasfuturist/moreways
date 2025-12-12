"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const SpotlightCard = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  
  // OPTIMIZATION: Check mobile state
  const isMobile = useIsMobile();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile || !divRef.current) return; // Skip logic on mobile

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    if (isMobile) return;
    setOpacity(1);
  };

  const handleBlur = () => {
    if (isMobile) return;
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      // Mobile: Simple Fade. Desktop: The original slide up.
      initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all duration-300",
        // Only hover shadow on desktop
        "md:hover:shadow-xl",
        className
      )}
    >
      {/* OPTIMIZATION: Only render the heavy spotlight gradient on Desktop */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(14, 165, 233, 0.15), transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};