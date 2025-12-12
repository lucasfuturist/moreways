"use client";

import Script from "next/script";
import { useEffect } from "react";

// Environment variables
const PUBLIC_KEY = process.env.NEXT_PUBLIC_ATTRIBUTION_KEY || "pk_dev_default";
const PIXEL_SOURCE = process.env.NEXT_PUBLIC_PIXEL_URL || "/mwpx.js";
const IS_ENABLED = process.env.NEXT_PUBLIC_PIXEL_ENABLED !== 'false'; 

export function AttributionPixel() {
  
  useEffect(() => {
    if (!IS_ENABLED) return;

    // Cookie Sync Logic (Keep this)
    const syncId = () => {
      try {
        const aid = localStorage.getItem('mw_aid');
        if (aid) {
          document.cookie = `mw_aid=${aid}; Path=/; Max-Age=31536000; SameSite=Lax`;
        }
      } catch (e) {}
    };

    syncId();
    const interval = setInterval(syncId, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!IS_ENABLED) return null;

  return (
    <>
      <Script
        id="moreways-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.MW_CONFIG = {
              publicKey: "${PUBLIC_KEY}",
              endpoint: "/api/telemetry",
              autoCapture: false // <--- CHANGED TO FALSE (RouteObserver handles it now)
            };
          `,
        }}
      />
      <Script 
        src={PIXEL_SOURCE} 
        strategy="afterInteractive" 
        onLoad={() => console.log("🟢 [MW] Pixel Loaded")}
      />
    </>
  );
}