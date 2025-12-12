import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  background?: string;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, children, shimmerColor = "#ffffff", background = "rgba(0, 0, 0, 1)", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-full border border-white/10 px-8 py-4 text-white [background:var(--bg)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_8px_rgba(62,61,117,0.5)] focus:outline-none",
          className
        )}
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--bg": background,
            "--speed": "3s",
            "--cut": "0.1em",
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Sparkle Container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]",
          )}
        >
          {/* The Shimmer Gradient */}
          <div className="absolute inset-0 h-[100cqh] animate-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            <div className="animate-spin-around absolute inset-[-100%] w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        
        {/* Inner Content Wrapper */}
        <span className="relative z-10 flex items-center gap-2 text-sm font-medium tracking-wide">
            {children}
        </span>

        {/* Inner Background to hide the center of the conic gradient */}
        <div className="absolute [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";