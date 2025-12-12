"use client";

import { useState, useEffect } from "react";

export function useOs() {
  const [os, setOs] = useState<"mac" | "windows" | "other">("other");
  const [metaKey, setMetaKey] = useState("Ctrl");

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("mac")) {
      setOs("mac");
      setMetaKey("⌘");
    } else if (ua.includes("win")) {
      setOs("windows");
      setMetaKey("Ctrl");
    } else {
      setOs("other");
      setMetaKey("Ctrl");
    }
  }, []);

  return { os, metaKey };
}