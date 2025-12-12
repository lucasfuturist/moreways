"use client";

import React from "react";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import "./globals.css";
import { GlobalCommandPalette } from "@/components/ui/GlobalCommandPalette";
import { ThemeProvider } from "@/components/theme-provider";
import { AuroraBackground } from "@/components/ui/aurora-background";
import AmbientLight from "@/components/AmbientLight"; 
import SmoothScroll from "@/components/SmoothScroll"; // [NEW]
import { AdminNavbar } from "@/components/AdminNavbar"; 

const fontHeading = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-heading",
});

const fontBody = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // 1. Routes where the Standard Lawyer/Public Nav should NOT appear
  const isPublicRoute = pathname.startsWith("/s/");
  const isEditorPage = pathname.includes("/new-from-prompt") || pathname.includes("/editor");
  
  // Admin pages use their own dedicated layout/navbar.
  const isAdminRoute = pathname.startsWith("/admin");

  const shouldHideStandardHeader = isPublicRoute || isEditorPage || isAdminRoute;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(
        fontHeading.variable, 
        fontBody.variable, 
        // [FIX] Removed "h-screen w-screen overflow-hidden" to let Lenis control the scroll body naturally
        "min-h-screen bg-slate-950 text-slate-200 antialiased selection:bg-indigo-500/30"
      )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark" 
            enableSystem
            disableTransitionOnChange
        >
            <SmoothScroll />
            <GlobalCommandPalette />
            
            {/* Global Visuals */}
            <AuroraBackground className="fixed inset-0 z-[-2]" showRadialGradient={true} children={null} />
            <AmbientLight />
            <div className="bg-noise" />
            
            {/* Show Standard Lawyer Nav ONLY if not admin/public/editor */}
            {!shouldHideStandardHeader && <AdminNavbar />}

            {/* Main Content Wrapper */}
            <main className={clsx(
              "relative z-10 flex flex-col min-h-screen",
              // Only add padding if the Standard Nav is present.
              // The Admin Layout will handle its own padding.
              !shouldHideStandardHeader && "pt-16" 
            )} id="scrolling-container">
              {children}
            </main>
        </ThemeProvider>
      </body>
    </html>
  );
}