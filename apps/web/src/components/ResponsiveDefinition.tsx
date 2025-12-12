"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Simple hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

interface ResponsiveDefinitionProps {
  term: string;
  definition: string;
}

export function ResponsiveDefinition({ term, definition }: ResponsiveDefinitionProps) {
  const isMobile = useIsMobile();

  // Mobile View: Bottom Drawer
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <span className="cursor-pointer text-primary font-semibold underline decoration-dotted underline-offset-4 decoration-2 hover:opacity-80 transition-opacity">
            {term} <Info className="inline w-3 h-3 ml-0.5 -mt-3 text-slate-400" />
          </span>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-bold font-heading text-slate-900">{term}</DrawerTitle>
            <DrawerDescription className="text-lg mt-4 text-slate-600 leading-relaxed">
              {definition}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button size="lg" className="w-full">Got it</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop View: Hover Card
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <span className="cursor-help text-primary font-semibold underline decoration-dotted underline-offset-4 decoration-2 hover:opacity-80 transition-opacity">
          {term}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-6 shadow-xl border-slate-200" side="top">
        <div className="space-y-2">
          <h4 className="text-base font-bold text-slate-900">{term}</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            {definition}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}