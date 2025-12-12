"use client";

import React from "react";
import { motion } from "framer-motion";

export function ThinkingBubble() {
  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut" as const
  };

  return (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 5, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        // Quick exit to allow next message to supplant position immediately
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
        className="flex mb-6 ml-2" 
    >
        <div className="px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/5 rounded-2xl rounded-tl-sm shadow-sm backdrop-blur-sm flex gap-1.5 items-center w-fit">
            <motion.div 
                className="w-1.5 h-1.5 bg-indigo-500/60 dark:bg-indigo-400/60 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ ...dotTransition, delay: 0 }}
            />
            <motion.div 
                className="w-1.5 h-1.5 bg-indigo-500/60 dark:bg-indigo-400/60 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ ...dotTransition, delay: 0.15 }}
            />
            <motion.div 
                className="w-1.5 h-1.5 bg-indigo-500/60 dark:bg-indigo-400/60 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ ...dotTransition, delay: 0.3 }}
            />
        </div>
    </motion.div>
  );
}