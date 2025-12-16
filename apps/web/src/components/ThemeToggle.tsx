"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  
  // 1. Track if the component has mounted on the client
  const [mounted, setMounted] = React.useState(false);

  // 2. Set mounted to true immediately after the first client render
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 3. Render a STABLE placeholder during SSR
  // IMPORTANT: This must match the dimensions/layout of the final button exactly
  // to prevent layout shifts, but contain no theme-specific icons.
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full w-10 h-10 bg-white/5 border border-white/10 text-slate-500"
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative rounded-full w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-all hover:scale-110 active:scale-95"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 absolute" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}