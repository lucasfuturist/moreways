"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const MagneticButton = ({
  children,
  className,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    // Optional: Check if ref.current exists to avoid runtime errors
    if (!ref.current) return;
    
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 }); // 0.15 = magnetic strength
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-colors duration-300 cursor-pointer";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20",
    outline: "border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100",
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      // FIX: Removed `className` from here so the square wrapper doesn't get the shadow/styles
      className="inline-block relative touch-none" 
      onClick={onClick}
    >
      {/* FIX: Applied `className` here so styles respect the rounded corners */}
      <div className={cn(baseStyles, variants[variant], className)}>
        {children}
      </div>
    </motion.div>
  );
};