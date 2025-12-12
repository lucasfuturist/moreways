"use client";

import React, { useRef, useState } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export function GlassCard({ 
  children, 
  className, 
  noPadding = false, 
  hoverEffect = true,
  onClick
}: GlassCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !hoverEffect) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={clsx(
        "relative rounded-xl overflow-hidden transition-all duration-300",
        // Base Glass Styles matching Moreways Card
        "bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm",
        hoverEffect && "hover:shadow-xl dark:hover:shadow-none cursor-pointer",
        noPadding ? "" : "p-8",
        className
      )}
    >
      {/* Spotlight Gradient */}
      {hoverEffect && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(14, 165, 233, 0.15), transparent 40%)`,
          }}
        />
      )}
      
      {/* Inner Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}