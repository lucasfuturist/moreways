"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Reduced entropy: Cleaner characters (no @#$%)
const GLYPHS = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";

export function DecoderText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    
    const interval = setInterval(() => {
      // Logic: 
      // 1. Slice the target text up to current index (i)
      // 2. Add 2 random characters at the end (the "leading edge")
      // 3. Unless we are at the end of the string
      
      const scrambled = text
        .split("")
        .map((char, index) => {
            if (index < i) {
                return text[index]; // Resolved character
            }
            if (index <= i + 2) { 
                // The "Leash": Only scramble the next 2 chars
                return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
            return ""; // Hide the rest
        })
        .join("");
        
      setDisplayText(scrambled);
      
      i += 3/5; // Speed control: Higher denominator = slower type speed

      if (i >= text.length) {
        clearInterval(interval);
        setDisplayText(text); // Ensure final state is clean
      }
    }, 30); // Frame rate (30ms)

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>;
}