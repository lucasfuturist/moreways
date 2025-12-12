"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col h-[100vh] items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-700",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            // OPTIMIZATION: Mobile gets a static, simpler background to save battery
            `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,#3b82f6_10%,#a855f7_15%,#6366f1_20%,#a855f7_25%,#6366f1_30%)]
            
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            
            /* MOBILE: Low opacity, No Blur, No Animation */
            opacity-20
            
            /* DESKTOP (md): Blur, Animation, Higher Opacity */
            md:filter md:blur-[10px] md:invert dark:md:invert-0
            md:after:content-[""] md:after:absolute md:after:inset-0 
            md:after:[background-image:var(--white-gradient),var(--aurora)] 
            md:after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            md:after:[background-size:200%,_100%] 
            md:after:animate-aurora md:after:[background-attachment:fixed] md:after:mix-blend-difference
            md:absolute md:-inset-[10px] md:opacity-40 md:dark:opacity-30
            md:will-change-transform`,

            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
        ></div>
      </div>
      {children}
    </div>
  );
};