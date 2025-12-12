"use client";

import { useEffect, useRef } from "react";

export default function AmbientLight() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      containerRef.current.style.setProperty("--x", `${clientX}px`);
      containerRef.current.style.setProperty("--y", `${clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500"
      style={{
        background: `
          radial-gradient(
            600px circle at var(--x, 50%) var(--y, 50%), 
            rgba(99, 102, 241, 0.08), 
            transparent 40%
          )
        `,
      }}
    />
  );
}