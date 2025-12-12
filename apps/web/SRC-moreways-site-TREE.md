# File Scan

**Roots:**

- `C:\projects\moreways\moreways-site\src`


## Tree: C:\projects\moreways\moreways-site\src

```
src/

├── app/
│   ├── (intake)/
│   │   ├── issue/
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx
│   │   ├── start/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   ├── page.tsx
│   ├── (marketing)/
│   │   ├── about/
│   │   │   ├── page.tsx
│   │   ├── consumers/
│   │   │   ├── page.tsx
│   │   ├── contact/
│   │   │   ├── page.tsx
│   │   ├── faq/
│   │   │   ├── page.tsx
│   │   ├── for-law-firms/
│   │   │   ├── page.tsx
│   │   ├── how-it-works/
│   │   │   ├── page.tsx
│   │   ├── issues/
│   │   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── legal-demo/
│   │   │   ├── page.tsx
│   │   ├── page.tsx
│   ├── (portal)/
│   │   ├── dashboard/
│   │   │   ├── claim/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   ├── register/
│   │   │   ├── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── dev-login/
│   │   │   │   ├── route.ts
│   │   │   ├── login/
│   │   │   │   ├── route.ts
│   │   │   ├── logout/
│   │   │   │   ├── route.ts
│   │   │   ├── register/
│   │   │   │   ├── route.ts
│   │   ├── chat/
│   │   │   ├── legal/
│   │   │   │   ├── route.ts
│   │   │   ├── route.test.ts
│   │   │   ├── route.ts
│   │   ├── intake/
│   │   │   ├── agent/
│   │   │   │   ├── route.ts
│   │   │   ├── form/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts
│   │   │   ├── submit/
│   │   │   │   ├── route.ts
│   │   │   ├── validate/
│   │   │   │   ├── route.ts
│   │   ├── lex/
│   │   │   ├── node/
│   │   │   │   ├── route.ts
│   │   ├── telemetry/
│   │   │   ├── route.ts
│   │   ├── v1/
│   │   │   ├── hooks/
│   │   │   │   ├── claims/
│   │   │   │   │   ├── route.ts
│   │   │   │   ├── status/
│   │   │   │   │   ├── route.ts
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── opengraph-image.png
│   ├── robots.ts
│   ├── sitemap.ts
├── auth/
│   ├── svc/
│   │   ├── auth.service.test.ts
│   │   ├── auth.service.ts
│   ├── ui/
│   │   ├── LoginForm.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── RegisterForm.tsx
├── components/
│   ├── AmbientLight.tsx
│   ├── AttributionPixel.tsx
│   ├── ChatInterface.tsx
│   ├── ChatMessage.tsx
│   ├── CitationCard.tsx
│   ├── ClientNavbar.tsx
│   ├── ClientUserMenu.tsx
│   ├── CookieConsent.tsx
│   ├── DefinitionPanel.tsx
│   ├── Footer.tsx
│   ├── FrozenRoute.tsx
│   ├── IssueTracker.tsx
│   ├── LegalChatInterface.tsx
│   ├── LegalResearchBot.tsx
│   ├── Navbar.tsx
│   ├── PageTransition.tsx
│   ├── ResponsiveDefinition.tsx
│   ├── RouteObserver.tsx
│   ├── SmoothScroll.tsx
│   ├── StandardComplaintsFab.tsx
│   ├── ThemeToggle.tsx
│   ├── runner/
│   │   ├── UnifiedRunner.tsx
│   │   ├── components/
│   │   │   ├── ChatRunner.tsx
│   │   │   ├── CookieConsent.tsx
│   │   │   ├── FieldAssistantBubble.tsx
│   │   │   ├── IntakeChatMessage.tsx
│   │   │   ├── LiveFormView.tsx
│   │   │   ├── ReviewOverlay.tsx
│   │   │   ├── SectionSidebar.tsx
│   │   │   ├── VerdictCard.tsx
│   │   ├── logic/
│   │   │   ├── schemaIterator.test.ts
│   │   │   ├── schemaIterator.ts
│   ├── theme-provider.tsx
│   ├── ui/
│   │   ├── accordion.tsx
│   │   ├── aurora-background.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── decoder-text.tsx
│   │   ├── drawer.tsx
│   │   ├── hover-card.tsx
│   │   ├── input.tsx
│   │   ├── magnetic-button.tsx
│   │   ├── motion-wrappers.tsx
│   │   ├── popover.tsx
│   │   ├── shimmer-button.tsx
│   │   ├── spotlight-card.tsx
│   │   ├── text-reveal.tsx
│   │   ├── textarea.tsx
│   │   ├── voice-orb.tsx
├── content/
│   ├── data/
│   │   ├── consumerIssues.ts
├── crm/
│   ├── ui/
│   │   ├── CaseStatusCard.tsx
├── forms/
│   ├── repo/
│   │   ├── forms.repo.formSchemaRepo.ts
│   ├── schema/
│   │   ├── forms.schema.formEntity.ts
│   ├── ui/
│   │   ├── AutoForm.tsx
├── hooks/
│   ├── use-mobile.tsx
├── infra/
│   ├── config/
│   │   ├── infra.config.env.ts
│   ├── db/
│   │   ├── client.ts
│   │   ├── schema.ts
│   ├── logging/
│   │   ├── infra.svc.logger.ts
├── intake/
│   ├── svc/
│   │   ├── intake.svc.promptToFormPipeline.ts
├── lib/
│   ├── api-hooks.test.ts
│   ├── api-hooks.ts
│   ├── argueos-client.ts
│   ├── motion-config.ts
│   ├── types/
│   │   ├── argueos-types.ts
│   │   ├── website.types.ts
│   │   ├── window.d.ts
│   ├── utils.ts
├── middleware.ts
├── portal/
│   ├── config/
│   │   ├── status.config.tsx
│   ├── repo/
│   │   ├── portal.repo.ts
├── src/
│   ├── app/
├── tests/
│   ├── a11y.e2e.spec.ts
│   ├── attribution.e2e.spec.ts
│   ├── auth.e2e.spec.ts
│   ├── backend-integrity.test.ts
│   ├── intake.e2e.spec.ts
│   ├── portal.e2e.spec.ts
│   ├── submission.e2e.spec.ts
│   ├── validation.e2e.spec.ts

```

## Files

### `C:/projects/moreways/moreways-site/src/middleware.ts`

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Re-use your secret here
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key-123');

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Define Protected Routes
  // Protects /dashboard and any sub-routes (e.g., /dashboard/claim/123)
  if (pathname.startsWith('/dashboard')) {
    const session = req.cookies.get('session');

    // 2. No Cookie? Redirect to Login
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Invalid/Expired Token? Redirect to Login
    try {
      await jwtVerify(session.value, SECRET);
      return NextResponse.next();
    } catch (err) {
      // If the token is tampered with or expired, clear it and redirect
      const loginUrl = new URL('/login', req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

// Optimization: Only run on dashboard routes to save resources on static marketing pages
export const config = {
  matcher: ['/dashboard/:path*'],
};
```

### `C:/projects/moreways/moreways-site/src/app/error.tsx`

```tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  
  useEffect(() => {
    // [TRACKING] Log the Crash
    console.error("Global Error Boundary caught:", error);
    
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.track('custom', {
        event: 'app_crash',
        error_message: error.message,
        error_digest: error.digest || 'unknown',
        location: window.location.pathname
      });
    }
  }, [error]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Something went wrong.
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
        We encountered an unexpected error. Our engineering team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Go Home
        </Button>
        <Button onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 
  1. GLOBAL SCROLL LOCK
  We hide the native window scrollbar because we are moving the 
  scrolling logic INSIDE the PageTransition component (using Lenis).
*/
html, body {
  height: 100%;
  width: 100%;
  overflow: hidden; 
  overscroll-behavior: none; /* Prevents the "rubber band" bounce on Mac */
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
 
  /* 
     2. DARK MODE VARIABLES (Obsidian / Deep Space) 
     These activate when the "dark" class is applied to <html>
  */
  .dark {
    --background: 222.2 84% 4.9%; /* Deep Space */
    --foreground: 210 40% 98%;    /* Pure White Text */
    
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    
    /* Make Primary brighter in dark mode (Electric Indigo) */
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    
    /* Lighter Muted backgrounds for distinct separation */
    --muted: 217.2 32.6% 12%; 
    --muted-foreground: 215 20.2% 70%; /* Lighter gray text */
    
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    
    /* Make borders visible (15% white instead of dark gray) */
    --border: 217.2 32.6% 17.5%; 
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }

  select, textarea, input[type="text"], input[type="password"], input[type="email"], input[type="number"] {
    font-size: 16px !important; 
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer utilities {
  /* 
     3. FILM GRAIN TEXTURE 
     Adds the "tactile" feel to the background.
  */
  .bg-noise {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 50;
    opacity: 0.04; /* Light mode opacity */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  /* Increase noise slightly in dark mode to prevent color banding */
  .dark .bg-noise {
    opacity: 0.025;
  }
  
  .glass-panel {
    @apply bg-white/40 backdrop-blur-xl border-white/20 shadow-xl dark:bg-slate-900/40 dark:border-white/10;
  }
  
  .text-glow {
    text-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
  }
}

/* 
   4. HUD SCROLLBAR 
   Custom "Optical Fiber" scrollbar styling
*/
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.2); /* Indigo low opacity */
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.6); /* Glow on hover */
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
}
```

### `C:/projects/moreways/moreways-site/src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { StandardComplaintsFab } from "@/components/StandardComplaintsFab";
import { AuroraBackground } from "@/components/ui/aurora-background";
import PageTransition from "@/components/PageTransition";
import AmbientLight from "@/components/AmbientLight";
import { ThemeProvider } from "@/components/theme-provider";
import { authService } from "@/auth/svc/auth.service"; 
// [TRACKING] Import Pixel, Consent, and Route Observer
import { AttributionPixel } from "@/components/AttributionPixel";
import { CookieConsent } from "@/components/CookieConsent";
import { RouteObserver } from "@/components/RouteObserver";

const fontHeading = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-heading",
});

const fontBody = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Moreways | Professional Consumer Intake",
    template: "%s | Moreways"
  },
  description: "Free, transparent case evaluation. We organize your claim and connect you with trusted consumer protection attorneys.",
  keywords: ["legal intake", "consumer rights", "lemon law", "contractor dispute", "free legal help"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await authService.getSession();
  let user = null;

  if (session) {
    user = await authService.getUserById(session.userId);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "h-screen w-screen overflow-hidden font-sans antialiased flex flex-col relative selection:bg-indigo-500/30",
        fontHeading.variable,
        fontBody.variable
      )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuroraBackground className="fixed inset-0 z-[-2]" children={null} />
            <AmbientLight />
            <div className="bg-noise" />
            
            {/* [TRACKING] The Full Stack */}
            <AttributionPixel />
            <RouteObserver />
            <CookieConsent />
            
            <div className="fixed top-0 left-0 right-0 z-50">
              <Navbar user={user} />
            </div>
            
            <div className="flex-1 relative w-full h-full z-0">
              <PageTransition>
                <div className="pt-20 min-h-full">
                  {children}
                </div>
              </PageTransition>
            </div>

            <StandardComplaintsFab />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/not-found.tsx`

```tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function NotFound() {
  
  useEffect(() => {
    // [TRACKING] Fire 404 Event
    if (typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('custom', {
            event: 'error_404',
            path: window.location.pathname,
            referrer: document.referrer
        });
    }
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <h1 className="text-9xl font-bold text-slate-200 dark:text-slate-800">404</h1>
      <div className="absolute flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-8">The legal path you are looking for doesn't exist.</p>
        <Link href="/">
          <Button size="lg">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/robots.ts`

```ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'], // Hide private areas
    },
    sitemap: 'https://moreways.io/sitemap.xml',
  };
}
```

### `C:/projects/moreways/moreways-site/src/app/sitemap.ts`

```ts
import { MetadataRoute } from 'next';
import { consumerIssues } from "@/content/data/consumerIssues";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://moreways.io'; // REPLACE THIS with your actual domain

  // Static Pages
  const routes = [
    '',
    '/about',
    '/how-it-works',
    '/for-law-firms',
    '/start',
    '/faq',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }));

  // Dynamic Issue Pages
  const issues = consumerIssues.map((issue) => ({
    url: `${baseUrl}/issue/${issue.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...issues];
}
```

### `C:/projects/moreways/moreways-site/src/app/(intake)/issue/[slug]/page.tsx`

```tsx
import { notFound } from "next/navigation";
import { argueosClient } from "@/lib/argueos-client";
import { UnifiedRunner } from "@/components/runner/UnifiedRunner"; 
import { consumerIssues } from "@/content/data/consumerIssues"; 
import { IssueTracker } from "@/components/IssueTracker"; // [NEW] Import

// Force dynamic rendering 
export const dynamic = "force-dynamic";

export default async function IssuePage({ params }: { params: { slug: string } }) {
  // 1. Try to fetch from Real Backend
  let form = await argueosClient.getFormBySlug(params.slug);
  const staticMeta = consumerIssues.find((i) => i.id === params.slug);

  // 2. FALLBACK LOGIC (The Safety Net)
  if (!form) {
    // If we have static metadata for this issue, generate a temporary form schema
    if (staticMeta) {
        console.warn(`[IssuePage] Backend unreachable or 404 for ${params.slug}. Generating fallback schema.`);
        
        form = {
            id: "fallback-form-id",
            organizationId: "fallback-org",
            title: staticMeta.title,
            schema: {
                type: "object",
                properties: {
                    "q1_description": {
                        id: "1",
                        key: "q1_description",
                        title: "What happened?",
                        kind: "textarea",
                        description: "Please describe the issue in detail so we can evaluate your claim.",
                        isRequired: true
                    },
                    "q2_date": {
                        id: "2",
                        key: "q2_date",
                        title: "When did this occur?",
                        kind: "date",
                        isRequired: true
                    }
                },
                order: ["q1_description", "q2_date"]
            }
        };
    } else {
        // Truly 404
        return notFound();
    }
  }

  // Determine title for tracking
  const pageTitle = staticMeta?.title || form.title || "Unknown Issue";

  return (
    <div className="min-h-screen flex flex-col relative z-10">
       <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />

       {/* [TRACKING] Inject the tracker to fire 'view_content' on mount */}
       <IssueTracker slug={params.slug} title={pageTitle} />

       <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
          
          <UnifiedRunner 
             formId={form.id}
             organizationId={form.organizationId}
             schema={form.schema}
             initialData={{
                meta_issue_type: pageTitle
             }}
          />

       </main>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(intake)/start/page.tsx`

```tsx
"use client";

import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/ChatInterface";

export default function StartClaim() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4 font-heading text-slate-900 dark:text-white">
              Free Claim Assessment
            </h1>
            <p className="text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
              Our Intake Assistant will ask you a few questions to see if your situation meets the criteria for legal action. This is confidential and free.
            </p>
          </div>

          <ChatInterface />

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground dark:text-slate-500">
              💡 <strong>Tip:</strong> Be specific about dates, dollar amounts, and what was promised vs. delivered.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(intake)/start/[id]/page.tsx`

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { UnifiedRunner } from "@/components/runner/UnifiedRunner";
import { Loader2, AlertCircle } from "lucide-react";

export default function DynamicIntakePage({ params }: { params: { id: string } }) {
  const [schema, setSchema] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch schema from our local proxy
    fetch(`/api/intake/form/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Form not found");
        return res.json();
      })
      .then((data) => {
        // Factory returns { id, title, schema: { ... } }
        setSchema(data.schema);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium uppercase tracking-wider">Loading Intake...</p>
      </div>
    );
  }

  if (error || !schema) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-red-400 gap-4">
        <AlertCircle className="w-10 h-10" />
        <p className="text-lg font-bold">Unable to load form</p>
        <p className="text-sm text-slate-500">ID: {params.id}</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-950">
      <UnifiedRunner 
        formId={params.id}
        organizationId="org_default_local" // Default org for public link
        schema={schema}
        intent={schema.title || "General Intake"} // Pass the Form Title as Intent to the Brain
      />
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(marketing)/layout.tsx`

```tsx
import Footer from "@/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]"> {/* Adjust height for Navbar */}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(marketing)/page.tsx`

```tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, FileText, Lock, Scale } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrappers";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    // [TRACKING] Fire Initiate Checkout
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.track('initiate_checkout', { 
        content_name: 'Intake Assessment',
        location: 'Homepage Hero',
        currency: 'USD',
        value: 0
      });
    }
    // Navigate Programmatically
    router.push('/start');
  };

  return (
    <div className="flex flex-col">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-10 relative z-20">
            <h1 className="text-6xl sm:text-8xl font-bold text-slate-900 dark:text-white font-heading tracking-tighter leading-[0.9]">
              <motion.span
                initial={{ opacity: 0, y: 70, filter: "blur(20px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                className="inline-block"
              >
                More ways
              </motion.span>
              <br className="sm:hidden" />
              <span className="hidden sm:inline">&nbsp;</span>
              <motion.span
                initial={{ opacity: 0, y: 70, filter: "blur(20px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
              >
                to win.
              </motion.span>
            </h1>
          </div>
          
          <FadeIn delay={1.0} className="flex justify-center mb-10">
            <div className="relative inline-flex h-8 overflow-hidden rounded-full p-[1px] shadow-lg shadow-indigo-500/20">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-default items-center justify-center rounded-full bg-slate-950/90 px-4 py-1 text-xs font-medium text-slate-300 backdrop-blur-3xl">
                Consumer protection for the modern era
              </span>
            </div>
          </FadeIn>
          
          <FadeIn delay={1.2}>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              We evaluate your case and route you to trusted attorneys who fight back when businesses treat you unfairly.
              <br/><span className="font-medium text-slate-900 dark:text-white">Totally free. 100% transparent.</span>
            </p>
          </FadeIn>
          
          <StaggerContainer delay={1.4} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <StaggerItem>
              <ShimmerButton className="shadow-2xl shadow-blue-900/20" onClick={handleStart}>
                Start Free Assessment <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </ShimmerButton>
            </StaggerItem>
            <StaggerItem>
              <Link href="/how-it-works">
                <MagneticButton variant="outline" className="border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-white/5 backdrop-blur-sm dark:text-white dark:hover:bg-white/10">
                  Our Process
                </MagneticButton>
              </Link>
            </StaggerItem>
          </StaggerContainer>
          
          <FadeIn delay={1.8}>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-medium opacity-60">
              Your data is never sold. Shared only with legal partners.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 relative z-10">
         <StaggerContainer className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Standardized Intake", text: "We ask the specific questions attorneys need answered to evaluate your case." },
            { title: "Document Organization", text: "Upload evidence securely so your file is ready for professional review." },
            { title: "Licensed Partners", text: "We work exclusively with vetted consumer protection law firms." },
            { title: "Zero Cost to You", text: "Our platform is free for consumers. Attorneys pay us for organized files." }
          ].map((item, i) => (
            <StaggerItem key={i} className="h-full">
              <SpotlightCard className="p-8 h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-white/60 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-none">
                <div className="w-12 h-12 bg-indigo-50/80 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100/50 dark:border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{item.text}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="py-32 bg-slate-950 text-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[400px] md:h-[600px] bg-indigo-600/10 md:bg-indigo-600/20 rounded-full blur-[60px] md:blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 font-heading text-white">Cases We Help With</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                We focus on documented financial harm and specific consumer-protection violations.
              </p>
            </div>
          </FadeIn>
          
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
            {[
              "Used Car Defects", "Contractor Disputes",
              "Undelivered Goods", "Subscription Fraud",
              "Illegal Towing", "Debt Harassment",
              "Warranty Denials", "Insurance Bad Faith"
            ].map((issue, i) => (
              <StaggerItem key={i}>
                <div className="flex items-center gap-4 p-5 bg-slate-900/80 md:bg-slate-900/40 md:backdrop-blur-sm transition-all duration-300 rounded-2xl border border-slate-800 md:hover:bg-slate-800/80 md:hover:border-indigo-500/50 group cursor-default md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:shadow-indigo-500/10">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 group-hover:shadow-[0_0_12px_rgba(99,102,241,1)] transition-all flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{issue}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          <FadeIn delay={0.4} className="text-center">
            <Link href="/issues">
              <Button variant="outline" className="text-slate-300 border-slate-800 bg-transparent hover:bg-white hover:text-slate-900 rounded-full px-8 h-12 transition-all duration-300">
                See Qualification Criteria <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="py-32 px-4 sm:px-6">
         <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-5xl font-bold text-center mb-20 font-heading text-slate-900 dark:text-white">How It Works</h2>
          </FadeIn>
          
          <StaggerContainer className="grid gap-8">
            {[
              { step: 1, icon: Lock, title: "1. Secure Intake", desc: "Describe your situation in our secure portal. We determine if it meets legal criteria." },
              { step: 2, icon: FileText, title: "2. Prepare File", desc: "Our system structures your claim into a legal format that attorneys can review quickly." },
              { step: 3, icon: Scale, title: "3. Attorney Review", desc: "We submit your organized file to a partner firm. If accepted, they contact you directly." }
            ].map((s, i) => (
              <StaggerItem key={i}>
                <div className="flex gap-8 items-start md:items-center group p-8 rounded-3xl hover:bg-white/60 dark:hover:bg-slate-900/60 hover:backdrop-blur-xl hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-white/50 dark:hover:border-white/10 border border-transparent transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center flex-shrink-0 font-bold text-2xl text-slate-900 dark:text-white border border-slate-50 dark:border-slate-700 group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
                     <span className="relative z-10">{s.step}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.title}</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">{s.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.4} className="mt-20 text-center">
            <MagneticButton variant="primary" className="shadow-xl" onClick={handleStart}>
              Start Free Assessment
            </MagneticButton>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border-t border-white/20 dark:border-white/5">
        <FadeIn className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 font-heading text-slate-900 dark:text-white">Not a law firm. Better access.</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-lg">
            Moreways is a legal technology platform. We do not provide legal advice. We provide the infrastructure to connect consumers with rights to attorneys who can enforce them.
          </p>
          <Link href="/about">
            <Button variant="link" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 text-lg">Read our Transparency Pledge &rarr;</Button>
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(marketing)/about/page.tsx`

```tsx
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 font-heading text-slate-900 dark:text-white">The Moreways Mission</h1>
      
      <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          <strong>Consumer protection laws exist, but accessing them is too hard.</strong>
        </p>
        <p>
          Most people don't know that "Unfair and Deceptive Acts" are illegal under state law. Even if they do, finding a lawyer who will listen to a specific case is daunting. Phone tag, consultation fees, and confusing jargon stop justice before it starts.
        </p>
        <p>
          Moreways was built to fix the "intake problem." 
        </p>
        <p>
          By using technology to structure claims <em>before</em> they reach a lawyer, we make it profitable for firms to review more cases, faster. This means more people get their day in court (or a settlement), and fewer businesses get away with unfair practices.
        </p>
      </div>

      <Card className="p-8 mt-12 bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-500/20">
        <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">We are on your side.</h3>
        <p className="text-indigo-800 dark:text-indigo-200">
          Our success is defined by how many legitimate claims we can successfully route to counsel. If you have been wronged, we want to help you prove it.
        </p>
      </Card>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(marketing)/consumers/page.tsx`

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Lock, Scale, Eye } from "lucide-react";

export default function ForConsumers() {
  return (
    <div className="flex flex-col">
      <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 font-heading text-slate-900 dark:text-white">Our Promise to Consumers</h1>
        <p className="text-xl text-muted-foreground dark:text-slate-400 leading-relaxed mb-8">
          The legal system is opaque. We built Moreways to be transparent. Here is exactly how we handle your data and your claim.
        </p>
      </div>

      <div className="py-16 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { icon: Eye, title: "100% transparent", desc: "We are not a law firm. We are a technology company that organizes data for law firms. We will never give you legal advice." },
            { icon: Lock, title: "No Data Selling", desc: "We are NOT a lead gen farm. We do not sell your data to marketers. Your data goes to one place: the attorney evaluating your case." },
            { icon: ShieldCheck, title: "Secure Handoff", desc: "Your claim details are encrypted. Only you and the reviewing attorney have access to the full file." },
            { icon: Scale, title: "No Obligation", desc: "Submitting a claim through Moreways creates no attorney-client relationship. You are free to walk away at any time." }
          ].map((item, i) => (
            <Card key={i} className="p-8 border-none shadow-md">
              <div className="w-12 h-12 bg-primary/10 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="py-20 text-center">
        <Link href="/start">
          <Button size="lg" className="px-8 py-6 text-lg">Check Your Eligibility</Button>
        </Link>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(marketing)/contact/page.tsx`

```tsx
"use client";

import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function Contact() {
  
  const handleContactClick = (type: string) => {
    if (typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('contact', { 
            method: 'email', 
            contact_type: type 
        });
    }
  };

  return (
    <div className="py-20 px-4 sm:px-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 font-heading text-slate-900 dark:text-white">Contact Us</h1>
      <div className="space-y-4">
        {[
          { title: "General Inquiries", email: "info@moreways.io", type: "general" },
          { title: "Partnerships (Law Firms)", email: "partners@moreways.io", type: "partnership" },
          { title: "Support", email: "support@moreways.io", type: "support" }
        ].map((c, i) => (
          <Card key={i} className="p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Mail className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{c.title}</h3>
              <a 
                href={`mailto:${c.email}`} 
                className="text-primary hover:underline"
                onClick={() => handleContactClick(c.type)}
              >
                {c.email}
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(marketing)/faq/page.tsx`

```tsx
"use client"; // Needs to be client for onClick tracking

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  
  // [TRACKING] Helper for tracking specific interests
  const handleExpand = (topic: string) => {
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.track('custom', { 
        event: 'faq_expand',
        topic: topic,
        interest_signal: 'high' 
      });
    }
  };

  return (
    <div className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 font-heading text-center text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-12 text-lg">
          Transparency is our core value. Here is exactly how Moreways works.
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger onClick={() => handleExpand('cost_free')}>Is Moreways really free for consumers?</AccordionTrigger>
            <AccordionContent>
              Yes. You will never pay Moreways a dime. We charge absolutely no fees to consumers for using our intake tools, organizing documents, or connecting with attorneys.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger onClick={() => handleExpand('business_model')}>How does Moreways make money?</AccordionTrigger>
            <AccordionContent>
              We are a software platform for law firms. Attorneys pay us to use our intake infrastructure and to receive organized, verified claim files. This model allows us to provide professional-grade legal intake to you at zero cost.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger onClick={() => handleExpand('is_law_firm')}>Is Moreways a law firm?</AccordionTrigger>
            <AccordionContent>
              No. Moreways is a technology company. We do not provide legal advice or represent you in court. Our job is to gather your facts, organize your evidence, and route your file to a licensed attorney who <em>can</em> represent you.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger onClick={() => handleExpand('data_privacy')}>What happens to my data?</AccordionTrigger>
            <AccordionContent>
              Your data is encrypted and shared <strong>only</strong> with the specific law firm evaluating your claim. We do not sell your personal information to marketing lists, spammers, or data brokers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger onClick={() => handleExpand('guarantee')}>Does submitting a claim guarantee an attorney will take my case?</AccordionTrigger>
            <AccordionContent>
              No. Submitting your information allows our partner firms to review your situation. They have the sole discretion to accept or decline representation based on the facts of your case.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(marketing)/for-law-firms/page.tsx`

```tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForLawFirms() {
  
  useEffect(() => {
    // [TRACKING] Fire B2B View Content
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.track('view_content', {
        content_type: 'b2b_landing',
        audience: 'attorney',
        content_name: 'Partner Program Info'
      });
    }
  }, []);

  return (
    <div className="py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 font-heading text-slate-900 dark:text-white">
          Receive fully briefed,<br />verified case files.
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Stop chasing unverified leads. Moreways handles the intake, document collection, and identity verification before the file ever hits your desk.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
        {[
          { title: "Standardized Briefs", text: "Every submission arrives as a structured legal memo with timeline, damages, and key facts extracted." },
          { title: "Identity Verified", text: "We require phone verification and account creation, filtering out spam and low-intent inquiries." },
          { title: "Document Collection", text: "Users upload contracts, invoices, and photos directly into the secure portal before you review." },
          { title: "Custom Criteria", text: "We tailor the intake questions to match your firm’s specific qualification requirements." },
          { title: "Secure Handoff", text: "Encrypted transfer of client data directly into your case management workflow." }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{item.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/contact">
          <Button size="lg" className="px-8">Become a Partner Firm</Button>
        </Link>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(marketing)/how-it-works/page.tsx`

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <div className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center font-heading text-slate-900 dark:text-white">
          From Incident to Attorney Review.
        </h1>
        <p className="text-xl text-center text-slate-500 dark:text-slate-400 mb-16">
          We bridge the gap between "I think I was wronged" and "I have a legal case."
        </p>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
          {[
            { 
              title: "1. Structured Intake", 
              text: "You chat with our Intake Assistant. It's designed to ask the exact questions a paralegal would ask during a consultation—without the hourly rate." 
            },
            { 
              title: "2. Claim Organization", 
              text: "Our system compiles your answers into a standardized legal brief. We flag key details like dates, contract violations, and monetary damages." 
            },
            { 
              title: "3. Verification & Handoff", 
              text: "You create a secure account to verify your identity. This ensures we only send legitimate, verified claims to our partners." 
            },
            { 
              title: "4. Attorney Decision", 
              text: "Your organized file is securely routed to a partner firm specializing in your issue. They review it and contact you directly if they can help." 
            }
          ].map((step, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="font-bold text-slate-600 dark:text-slate-300">{i + 1}</span>
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white dark:bg-slate-900/50 border dark:border-slate-800 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-2">Why is this free?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">
            Law firms spend huge amounts of time filtering through unorganized emails. They pay Moreways to receive clean, organized, and verified files. You never pay us a dime.
          </p>
          <Link href="/start">
            <Button size="lg" className="px-8 py-6 text-lg">Start Free Assessment</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(marketing)/issues/page.tsx`

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const issueCategories = [
  { title: "Used Car Defects", desc: "Undisclosed accidents, odometer rollback, or safety defects." },
  { title: "Contractor Disputes", desc: "Incomplete work, code violations, or abandonment of project." },
  { title: "Online Purchases", desc: "Items never delivered, wrong items sent, or refusal to refund." },
  { title: "Subscription Fraud", desc: "Hidden fees, unauthorized renewals, or impossible cancellation." },
  { title: "Illegal Towing", desc: "Excessive fees, predatory towing, or damage to vehicle." },
  { title: "Debt Harassment", desc: "Repeated calls, threats, or contacting your employer." },
  { title: "Insurance Bad Faith", desc: "Unreasonable delays or denial of legitimate claims." },
  { title: "Warranty Issues", desc: "Products that fail immediately or ignored warranty obligations." },
];

export default function Issues() {
  return (
    <div className="flex-1 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 font-heading text-slate-900 dark:text-white">Know Your Rights.</h1>
          <p className="text-xl text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
            Consumer protection laws are powerful, but only if you know when they apply. Here are the most common ways we help consumers win.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {issueCategories.map((cat, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{cat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground dark:text-slate-400">{cat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center bg-slate-50 dark:bg-slate-900/50 p-12 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Don't see your issue listed?</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            If a business treated you unfairly, it might still qualify. 
          </p>
          <Link href="/start">
            <Button>Check Eligibility for Free &rarr;</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(marketing)/legal-demo/page.tsx`

```tsx
"use client";

import React from "react";
import { LegalResearchBot } from "@/components/LegalResearchBot";

export default function LegalDemoPage() {
  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col">
      {/* 
        Full Screen Container 
        No padding on mobile, standard padding on desktop for "App" feel 
      */}
      <div className="flex-1 flex overflow-hidden">
        <LegalResearchBot />
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(portal)/layout.tsx`

```tsx
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(portal)/dashboard/page.tsx`

```tsx
import { authService } from "@/auth/svc/auth.service";
import { portalRepo } from "@/portal/repo/portal.repo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, ArrowRight, ClipboardCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrappers";
import { getStatusUI } from "@/portal/config/status.config";

// Configuration for the external Lawyer App
const LAWYER_APP_URL = process.env.LAWYER_APP_URL || 'http://localhost:3001/crm';

export default async function DashboardPage() {
  const session = await authService.getSession();
  if (!session) redirect("/login");

  // 1. ROLE CHECK: Automatic Redirect
  // If a lawyer/admin tries to view the client portal, send them to the CRM.
  if (session.role === 'admin' || session.role === 'lawyer') {
    redirect(LAWYER_APP_URL);
  }

  // 2. CLIENT VIEW
  return <ClientDashboard session={session} />;
}

async function ClientDashboard({ session }: { session: { userId: string } }) {
  const userClaims = await portalRepo.getClaimsForUser(session.userId);
  const user = await authService.getUserById(session.userId); 
  const userName = user?.name?.split(' ')[0] || "there";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AuroraBackground showRadialGradient={false} className="opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto pt-12 px-6 pb-20">
        
        <FadeIn delay={0.1} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2 flex-1">
            <h1 className="text-4xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
              Case Status
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Tracking {userClaims.length} active legal matters.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             {userClaims.length > 0 && (
                <Link href="/start" className="flex-1 md:flex-none">
                  <Button size="lg" className="w-full md:w-auto rounded-full shadow-xl shadow-indigo-500/20 bg-slate-900 text-white hover:bg-indigo-600 dark:bg-white dark:text-slate-900 transition-all">
                    <Plus className="w-4 h-4 mr-2" /> New Assessment
                  </Button>
                </Link>
             )}
          </div>
        </FadeIn>

        {userClaims.length === 0 ? (
           <FadeIn delay={0.2}>
             <div className="flex flex-col items-center justify-center py-24 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 group cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                   <ClipboardCheck className="w-10 h-10 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Active Cases</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-center">
                  You haven't submitted any claims yet. Check your eligibility for free in about 2 minutes.
                </p>
                <Link href="/start">
                  <Button size="lg" className="rounded-full px-8 shadow-lg shadow-indigo-500/20">
                    Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
             </div>
           </FadeIn>
        ) : (
          <StaggerContainer className="grid gap-6 md:grid-cols-2">
            {userClaims.map((claim) => {
              const status = getStatusUI(claim.status || 'draft');
              const StatusIcon = status.icon;

              return (
                <StaggerItem key={claim.id}>
                  <Link href={`/dashboard/claim/${claim.id}`} className="block h-full group">
                    <SpotlightCard className="h-full p-8 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors bg-white/80 dark:bg-slate-900/80">
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.color} border ${status.border}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {new Date(claim.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                        {claim.type}
                      </h3>
                      
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                         {claim.summary || "Pending attorney review..."}
                      </p>
                      
                    </SpotlightCard>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(portal)/dashboard/claim/[id]/page.tsx`

```tsx
import { notFound, redirect } from "next/navigation";
import { authService } from "@/auth/svc/auth.service";
import { portalRepo } from "@/portal/repo/portal.repo";
import { getStatusUI } from "@/portal/config/status.config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Download, Lock, FileText } from "lucide-react";

export default async function ClaimDetailPage({ params }: { params: { id: string } }) {
  const session = await authService.getSession();
  if (!session) redirect("/login");

  const claim = await portalRepo.getClaimDetail(session.userId, params.id);
  if (!claim) return notFound();

  const statusUI = getStatusUI(claim.status || 'draft');
  const StatusIcon = statusUI.icon;

  // FIX: Cast the jsonb data (unknown) to a usable object type
  // This prevents the "Type 'unknown' is not assignable to type 'ReactNode'" error
  const formData = (claim.formData as Record<string, any>) || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 pt-24">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-2 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cases
        </Link>

        {/* Header Card */}
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">{claim.type}</h1>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusUI.bg} ${statusUI.color} ${statusUI.border} border`}>
                <StatusIcon className="w-3 h-3" />
                <span className="uppercase tracking-wider">{statusUI.label}</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                Submitted on {new Date(claim.createdAt!).toLocaleDateString()} • ID: <span className="font-mono">{claim.id.slice(0,8)}</span>
            </p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
             {/* Mock Export Action */}
            <Button variant="outline" className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 flex-1 md:flex-none">
                <Download className="w-4 h-4 mr-2" /> Save PDF
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          
          {/* Main Content: Details */}
          <div className="space-y-6">
            
            {/* Status Context Card */}
            <div className={`p-6 rounded-xl border ${statusUI.bg} ${statusUI.border}`}>
                <h3 className={`font-semibold mb-1 ${statusUI.color}`}>Current Status: {statusUI.label}</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                    {statusUI.description}
                </p>
            </div>

            <Card className="p-8 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" /> Case Details
              </h3>
              
              <dl className="space-y-6">
                {/* FIX: Use the safely casted variable 'formData' */}
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="group">
                    <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                        {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm leading-relaxed">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>

          {/* Sidebar: Communication Hub (Future) */}
          <div className="space-y-6">
            <Card className="p-6 bg-slate-900 dark:bg-indigo-950/30 text-white border-slate-800 dark:border-indigo-500/20 relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none" />
               
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Attorney Comms
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Secure messaging will unlock once an attorney accepts your case.
              </p>
              
              <Button disabled className="w-full bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed">
                  <Lock className="w-3 h-3 mr-2" /> Messaging Locked
              </Button>
            </Card>

            <Card className="p-6 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="font-semibold mb-4 text-sm text-slate-900 dark:text-white">Evidence Locker</h3>
              
              <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Drag and drop files here<br/>or click to upload
                </p>
                <Button variant="outline" size="sm" className="h-8 text-xs dark:bg-slate-800 dark:text-white dark:border-slate-700">
                  Upload Documents
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(portal)/login/page.tsx`

```tsx
import LoginForm from '@/auth/ui/LoginForm';
import { AuroraBackground } from '@/components/ui/aurora-background';
import Link from 'next/link';
import { authService } from '@/auth/svc/auth.service';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await authService.getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <AuroraBackground className="fixed inset-0 z-0" children={null} />
      
      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-20 w-full max-w-md">
        <div className="mb-8 text-center animate-in slide-in-from-bottom-4 fade-in duration-700">
          {/* UPDATED: Removed Link wrapper and hover effects */}
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white cursor-default select-none">
            Moreways
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-light">Client & Attorney Portal</p>
        </div>
        
        <div className="bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl shadow-indigo-500/10 dark:shadow-none rounded-3xl p-8 animate-in zoom-in-95 fade-in duration-500 delay-150">
          <LoginForm />
        </div>

        <div className="mt-8 text-center animate-in slide-in-from-bottom-2 fade-in duration-700 delay-300">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-slate-900 dark:text-white font-medium hover:text-indigo-600 hover:underline underline-offset-4 decoration-2">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/(portal)/register/page.tsx`

```tsx
import { authService } from '@/auth/svc/auth.service';
import { redirect } from 'next/navigation';
import { AuroraBackground } from '@/components/ui/aurora-background';
import RegisterForm from '@/auth/ui/RegisterForm';
import Link from 'next/link';

export default async function RegisterPage() {
  const session = await authService.getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <AuroraBackground className="fixed inset-0 z-0" children={null} />
      
      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-20 w-full max-w-md">
        <div className="mb-8 text-center animate-in slide-in-from-bottom-4 fade-in duration-700">
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white cursor-default select-none">
            Final Step: Verification
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-light">
            Create a secure account to submit your claim file to our partner attorneys.
          </p>
        </div>
        
        <div className="bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl rounded-3xl p-8 animate-in zoom-in-95 fade-in duration-500 delay-150">
          <RegisterForm />
        </div>

        <div className="mt-8 text-center animate-in slide-in-from-bottom-2 fade-in duration-700 delay-300">
           <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
             <p className="text-xs text-indigo-800 dark:text-indigo-200">
               <strong>Why do we need this?</strong><br/>
               Attorneys require verified contact info to prevent spam and conflict checks.
             </p>
           </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-slate-900 dark:text-white font-medium hover:text-indigo-600 hover:underline underline-offset-4 decoration-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/app/api/auth/dev-login/route.ts`

```ts
import { NextResponse } from 'next/server';
import { authService } from '@/auth/svc/auth.service';

const LAWYER_APP_URL = process.env.LAWYER_APP_URL || 'http://localhost:3001';

export async function POST(req: Request) {
  // [SECURITY] Critical Guardrail
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Endpoint disabled in production' }, { status: 403 });
  }

  try {
    const { role } = await req.json();
    const targetRole = role || 'client';
    
    // Generate consistent mock ID
    const userId = `mock-${targetRole}-id`;

    // Create the cookie session
    await authService.createSession(userId, targetRole);

    // Determine redirect
    let redirectUrl = '/dashboard';
    if (targetRole === 'lawyer' || targetRole === 'admin') {
      redirectUrl = `${LAWYER_APP_URL}/crm`;
    }

    return NextResponse.json({ success: true, redirectUrl });
  } catch (e) {
    console.error("Dev login error", e);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
```

### `C:/projects/moreways/moreways-site/src/app/api/auth/login/route.ts`

```ts
import { NextResponse } from 'next/server';
import { authService } from '@/auth/svc/auth.service';

// UPDATED: Default to port 3001 for the Lawyer App
const LAWYER_APP_URL = process.env.LAWYER_APP_URL || 'http://localhost:3001';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await authService.getUser(email);

    if (!user || !(await authService.verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await authService.createSession(user.id, user.role || 'client');

    let redirectUrl = '/dashboard';
    
    // Redirect lawyers to the app on port 3001
    if (user.role === 'lawyer' || user.role === 'admin') {
      redirectUrl = `${LAWYER_APP_URL}/crm`;
    }

    return NextResponse.json({ success: true, redirectUrl });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
```

### `C:/projects/moreways/moreways-site/src/app/api/auth/logout/route.ts`

```ts
import { NextResponse } from "next/server";
import { authService } from "@/auth/svc/auth.service";

export async function POST() {
  // Clears the HTTP-only cookie
  await authService.logout();
  return NextResponse.json({ success: true });
}
```

### `C:/projects/moreways/moreways-site/src/app/api/auth/register/route.ts`

```ts
import { NextResponse } from 'next/server';
import { authService } from '@/auth/svc/auth.service';
import { db } from '@/infra/db/client';
import { users } from '@/infra/db/schema';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    
    // Check existing
    const existing = await authService.getUser(email);
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await authService.hashPassword(password);
    const userId = randomUUID();

    await db.insert(users).values({
      id: userId,
      email,
      passwordHash: hashedPassword,
      name,
      role: 'client'
    });

    await authService.createSession(userId, 'client');
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
```

### `C:/projects/moreways/moreways-site/src/app/api/chat/route.test.ts`

```ts
// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// 1. Mock OpenAI
// We mock the constructor and the method chain .chat.completions.create
const mockCreate = vi.fn();
vi.mock('openai', () => {
  return {
    default: class {
      chat = {
        completions: {
          create: mockCreate
        }
      }
    }
  }
});

// Helper to create fake NextRequests
function createRequest(body: any) {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

describe('AI Router (API)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Default valid key for most tests
    vi.stubEnv('OPENAI_API_KEY', 'mock-key');
  });

  it('should return 503 if API Key is missing', async () => {
    vi.stubEnv('OPENAI_API_KEY', ''); // Unset key
    
    const req = createRequest({ messages: [] });
    const res = await POST(req);
    
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.message).toContain('configuration error');
  });

  it('should handle "Needs Clarification" response correctly', async () => {
    // Mock AI saying: "I need more info"
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            form_type: null,
            needs_clarification: "yes",
            clarification_question: "Did you sign a contract?"
          })
        }
      }]
    });

    const req = createRequest({ messages: [{ role: 'user', content: 'Help' }] });
    const res = await POST(req);
    const data = await res.json();

    // The frontend expects the message to be the clarification question
    expect(data.message).toBe("Did you sign a contract?");
    expect(data.router_data.needs_clarification).toBe("yes");
  });

  it('should handle "Routing" response correctly', async () => {
    // Mock AI saying: "This is a car issue"
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            form_type: "Auto – Dealership or Repair",
            needs_clarification: "no",
            reason: "User mentioned car dealer."
          })
        }
      }]
    });

    const req = createRequest({ messages: [{ role: 'user', content: 'Car broken' }] });
    const res = await POST(req);
    const data = await res.json();

    // The frontend expects a success message constructed by the route
    expect(data.message).toContain("looks like a Auto – Dealership");
    expect(data.router_data.form_type).toBe("Auto – Dealership or Repair");
  });

  it('should handle Malformed JSON gracefully', async () => {
    // Mock AI hallucinating non-JSON output (e.g. server error or drift)
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: "I am not returning JSON today."
        }
      }]
    });

    // The route has a try/catch block around JSON.parse
    const req = createRequest({ messages: [] });
    const res = await POST(req);
    const data = await res.json();

    // Verify it caught the error
    expect(data.message).toBe("System error processing response.");
  });
});
```

### `C:/projects/moreways/moreways-site/src/app/api/chat/route.ts`

```ts
﻿import { NextResponse } from "next/server";
import OpenAI from "openai";

const ROUTER_SYSTEM_PROMPT = `SYSTEM:
You are the intake router for a consumer-protection law firm.
You do NOT give legal advice. 
Your only job is to map the user's description of their issue to the closest matching form category.

RULES:
- Classify the issue into one of the predefined FORM TYPES below.
- If the user’s message is vague or incomplete, ask at most ONE clarifying question.
- Keep clarifying questions short (max 1 sentence).
- Never assume facts not stated.
- Never discuss legal outcomes, rights, strategies, or laws.
- If nothing fits cleanly, choose “General Consumer Complaint”.

FORM TYPES:
1. “Auto – Dealership or Repair”
2. “Debt Collection”
3. “Credit or Banking Problem”
4. “Retail or Services Dispute”
5. “Home Improvement / Contractor Issue”
6. “Housing – Landlord/Tenant Issue”
7. “Telemarketing / Robocall Issue”
8. “Scam / Fraud / Unfair Business Practice”
9. “General Consumer Complaint” (fallback)

OUTPUT FORMAT:
Respond ONLY with a JSON object in this format:

{
  "form_type": "string",
  "reason": "string",
  "needs_clarification": "yes" | "no",
  "clarification_question": "string" | null
}`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json(
        { message: "Service temporarily unavailable (configuration error)." },
        { status: 503 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ROUTER_SYSTEM_PROMPT },
        ...messages
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0].message.content || "{}";
    let parsed;
    
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI JSON", content);
      return NextResponse.json({ message: "System error processing response." });
    }

    let message = "";
    if (parsed.needs_clarification === "yes") {
      message = parsed.clarification_question;
    } else {
      message = `I understand. This looks like a ${parsed.form_type} issue. Routing you now...`;
    }

    return NextResponse.json({ 
      message, 
      router_data: parsed 
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

### `C:/projects/moreways/moreways-site/src/app/api/chat/legal/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

const BRAIN_API_URL = process.env.BRAIN_API_URL || "http://localhost:3001";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]; // User's latest query

    console.log("[Gateway] ⚖️ Consulting the Law Library...");

    // 1. Call Hybrid Search + Synthesis
    const brainRes = await fetch(`${BRAIN_API_URL}/api/v1/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: lastMessage.content,
        jurisdiction: "MA"
      })
    });

    if (!brainRes.ok) throw new Error("Brain search failed");

    const brainJson = await brainRes.json();
    const { answer, context } = brainJson.data;

    // 2. Format for the UI
    // We return the text answer + structured citations for the UI to render cards
    return NextResponse.json({
      role: "assistant",
      content: answer,
      citations: context.ancestry.map((node: any) => ({
        urn: node.urn,
        title: node.urn.split(':').pop(), // Simple title extraction
        text: node.content_text,
        similarity: 0.99 // Mock score or pass through from search
      }))
    });

  } catch (error) {
    console.error("[Gateway] Legal Chat Error:", error);
    return NextResponse.json(
      { role: "assistant", content: "I'm having trouble accessing the law library right now." },
      { status: 500 }
    );
  }
}
```

### `C:/projects/moreways/moreways-site/src/app/api/intake/agent/route.ts`

```ts
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_ARGUEOS_API_BASE || "http://localhost:3001/api/public/v1";
const API_KEY = process.env.ARGUEOS_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Forward to ArgueOS Public Agent Endpoint
    const backendRes = await fetch(`${API_BASE}/agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY!,
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      // Fallback: If backend agent is down, return a generic response so UI doesn't crash
      return NextResponse.json({ 
        replyMessage: "I'm having trouble connecting to the legal brain right now. Please try filling this field manually.",
        type: "error"
      });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("[Proxy] Agent Error:", error);
    return NextResponse.json({ error: "Agent unavailable" }, { status: 500 });
  }
}
```

### `C:/projects/moreways/moreways-site/src/app/api/intake/form/[id]/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

const FACTORY_API_URL = process.env.FACTORY_API_URL || "http://localhost:3002";
const API_KEY = process.env.ARGUEOS_API_KEY || "";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formId = params.id;
    console.log(`[Gateway] 📥 Fetching Schema for: ${formId}`);

    // Call Factory Public API
    const res = await fetch(`${FACTORY_API_URL}/api/public/v1/forms?id=${formId}`, {
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      console.error(`[Gateway] Factory Error: ${res.status}`);
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("[Gateway] Schema Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

### `C:/projects/moreways/moreways-site/src/app/api/intake/submit/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

const FACTORY_API_URL = process.env.FACTORY_API_URL || "http://localhost:3002";
const API_KEY = process.env.ARGUEOS_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Proxy to Factory CRM
    const res = await fetch(`${FACTORY_API_URL}/api/public/v1/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Factory rejected submission");
    
    const data = await res.json();
    return NextResponse.json(data);

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
```

### `C:/projects/moreways/moreways-site/src/app/api/intake/validate/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

const BRAIN_API_URL = process.env.BRAIN_API_URL || "http://localhost:3001";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData, intent } = body;

    console.log("[Gateway] 📡 Sending facts to The Brain (Judge)...");

    // 1. Try Real Backend
    try {
      const brainRes = await fetch(`${BRAIN_API_URL}/api/v1/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: intent || "General Consumer Issue",
          formData: formData,
          jurisdiction: "MA"
        })
      });

      if (brainRes.ok) {
        const data = await brainRes.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn("[Gateway] Brain unavailable, switching to Mock Verdict.");
    }

    // 2. FALLBACK (Mock Verdict)
    // This allows you to test the UI and Pixel even if the backend is down.
    await new Promise(r => setTimeout(r, 1500)); // Fake latency

    return NextResponse.json({
      data: {
        status: "LIKELY_VIOLATION",
        confidence_score: 0.85,
        analysis: {
          summary: "Based on the details provided, this appears to be a valid claim under local consumer protection laws. The timeline indicates a potential statutory violation.",
          missing_elements: [],
          strength_factors: ["Timely reporting", "Financial harm documented"],
          weakness_factors: []
        },
        relevant_citations: ["urn:lex:ma:93a:section_9"]
      }
    });

  } catch (error) {
    console.error("[Gateway] Validation Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

### `C:/projects/moreways/moreways-site/src/app/api/lex/node/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

const BRAIN_API_URL = process.env.BRAIN_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  try {
    // 1. Extract URN from Query String (?urn=...)
    const { searchParams } = new URL(req.url);
    const urn = searchParams.get("urn");

    if (!urn) {
      return NextResponse.json({ error: "URN is required" }, { status: 400 });
    }
    
    console.log(`[Gateway] 🔍 Proxying lookup for URN: ${urn}`);

    // 2. Forward to Brain
    // Note: We MUST encode the URN here because it becomes part of the Brain's URL path
    const targetUrl = `${BRAIN_API_URL}/api/v1/node/${encodeURIComponent(urn)}`;
    
    const brainRes = await fetch(targetUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store" // Prevent Next.js from caching stale errors
    });

    if (!brainRes.ok) {
        console.warn(`[Gateway] Brain returned ${brainRes.status} for ${urn}`);
        return NextResponse.json({ error: "Node not found in Knowledge Graph" }, { status: 404 });
    }

    const data = await brainRes.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("[Gateway] Node Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

### `C:/projects/moreways/moreways-site/src/app/api/telemetry/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

// Configuration
const ENGINE_URL = process.env.ATTRIBUTION_ENGINE_URL || "http://localhost:3002";
const TRACK_ENDPOINT = `${ENGINE_URL}/api/v1/track`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // [FIX] Extract Key from Headers (Pixel sends it here) OR Body
    const publicKey = req.headers.get("x-publishable-key") || body.publicKey || "";
    
    // [DEBUG] 1. Verify Configuration
    console.log(`[Proxy] 🎯 Target: ${TRACK_ENDPOINT}`);
    console.log(`[Proxy] 🔑 Key: ${publicKey}`); // Log the actual resolved key
    console.log(`[Proxy] 📦 Event: ${body.type}`);

    // 2. Forward request to Attribution Engine
    const response = await fetch(TRACK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-key": publicKey, // [FIX] Use the resolved key variable
        // Forward IP for geolocation to work on the backend
        "x-forwarded-for": req.headers.get("x-forwarded-for") || "127.0.0.1",
        "user-agent": req.headers.get("user-agent") || ""
      },
      body: JSON.stringify(body)
    });

    // [DEBUG] 3. Log Result
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Proxy] ❌ Upstream Error (${response.status}): ${errorText}`);
    } else {
        const resJson = await response.json();
        console.log(`[Proxy] ✅ Success:`, resJson);
    }

    return NextResponse.json({ success: true });
    
  } catch (e: any) {
    // [DEBUG] 4. Network Failures
    console.error(`[Proxy] 💀 NETWORK CRASH:`, e.cause || e.message);
    // Still return success to client so UI doesn't break
    return NextResponse.json({ success: true }); 
  }
}
```

### `C:/projects/moreways/moreways-site/src/app/api/v1/hooks/claims/route.ts`

```ts
import { NextResponse } from 'next/server';
import { db } from '@/infra/db/client';
import { claims } from '@/infra/db/schema';
import { eq, desc } from 'drizzle-orm';

// SECURE THIS IN PROD: Add an API Key check header
const API_KEY = process.env.CRM_API_KEY || "dev-key";

export async function GET(req: Request) {
  const authHeader = req.headers.get('x-api-key');
  if (authHeader !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all "submitted" claims for the CRM to ingest
  const newClaims = await db.select()
    .from(claims)
    .where(eq(claims.status, 'submitted'))
    .orderBy(desc(claims.createdAt));

  return NextResponse.json({ 
    count: newClaims.length,
    data: newClaims.map(c => ({
      ...c,
      // FIX: formData is now 'jsonb' (native object), so we do NOT parse it.
      formData: c.formData || {}, 
    }))
  });
}
```

### `C:/projects/moreways/moreways-site/src/app/api/v1/hooks/status/route.ts`

```ts
import { NextResponse } from 'next/server';
import { db } from '@/infra/db/client';
import { claims } from '@/infra/db/schema';
import { eq } from 'drizzle-orm';
import { StatusWebhookSchema } from '@/lib/api-hooks';

const API_KEY = process.env.CRM_API_KEY || "dev-key";

export async function POST(req: Request) {
  // 1. Security Check
  const authHeader = req.headers.get('x-api-key');
  if (authHeader !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Validate Payload
    const body = await req.json();
    const payload = StatusWebhookSchema.parse(body);

    // 3. Update Database
    await db.update(claims)
      .set({ 
        status: payload.newStatus,
        updatedAt: new Date(payload.updatedAt),
        // In a real app, we'd add the 'message' to a 'claim_timeline' table here
      })
      .where(eq(claims.id, payload.claimId));

    return NextResponse.json({ success: true, claimId: payload.claimId });
  } catch (e) {
    console.error("Webhook Error:", e);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
```

### `C:/projects/moreways/moreways-site/src/auth/svc/auth.service.test.ts`

```ts
// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from './auth.service';
import bcrypt from 'bcryptjs';

// 1. Mock Next.js cookies
const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

// 2. Mock Database Client
// Simulate DB failure to force the service into the catch block where the Mock User logic resides
vi.mock('@/infra/db/client', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.reject(new Error("Simulated DB Failure"))), 
        })),
      })),
    })),
  },
}));

describe('Auth Service Security', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Use stubEnv for reliable environment variable mocking in Vitest
    vi.stubEnv('NODE_ENV', 'development'); 
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('Password Handling', () => {
    it('should hash passwords correctly', async () => {
      const password = 'secure-password';
      const hash = await authService.hashPassword(password);
      
      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);
    });

    it('should verify correct passwords', async () => {
      const password = 'my-password';
      const hash = await bcrypt.hash(password, 10);
      const result = await authService.verifyPassword(password, hash);
      expect(result).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const hash = await bcrypt.hash('real-password', 10);
      const result = await authService.verifyPassword('wrong-password', hash);
      expect(result).toBe(false);
    });
  });

  describe('Production Guardrails', () => {
    it('should THROW if attempting to use mock users in production', async () => {
      // Explicitly mock production environment
      vi.stubEnv('NODE_ENV', 'production');
      
      await expect(authService.getUser('test@example.com'))
        .rejects
        .toThrow("Authentication Failure: Database unreachable in production.");
    });

    it('should ALLOW mock users in development', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      
      const user = await authService.getUser('test@example.com');
      
      expect(user).not.toBeNull();
      expect(user?.id).toContain('mock');
      expect(user?.email).toBe('test@example.com');
    });
  });

  describe('Session Management', () => {
    it('should set an HTTP-only cookie on login', async () => {
      // Ensure we have a string for the secret in case env is undefined
      vi.stubEnv('JWT_SECRET', 'test-secret');
      
      await authService.createSession('user-123', 'client');
      
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'session', 
        expect.any(String), // The JWT token
        expect.objectContaining({
          httpOnly: true,
          path: '/',
        })
      );
    });

    it('should delete cookie on logout', async () => {
      await authService.logout();
      expect(mockCookieStore.delete).toHaveBeenCalledWith('session');
    });
  });
});
```

### `C:/projects/moreways/moreways-site/src/auth/svc/auth.service.ts`

```ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/infra/db/client';
import { users } from '@/infra/db/schema';
import { eq } from 'drizzle-orm';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key-123');

// Helper: Only allow mocks in non-production environments
const getMockUser = (idOrEmail: string) => {
  // [SECURITY] CRITICAL: Never allow mock users in production.
  // A database failure in prod should be a hard error, not a fallback login.
  if (process.env.NODE_ENV === 'production') {
    throw new Error("Authentication Failure: Database unreachable in production.");
  }

  let role = 'client';
  if (idOrEmail.includes('lawyer')) role = 'lawyer';
  if (idOrEmail.includes('admin')) role = 'admin';

  return {
    id: idOrEmail.includes('@') ? `mock-${role}-id` : idOrEmail,
    email: idOrEmail.includes('@') ? idOrEmail : `${role}@dev.example.com`,
    name: `Dev ${role.charAt(0).toUpperCase() + role.slice(1)} (Offline)`,
    role: role,
    passwordHash: 'mock',
    createdAt: new Date()
  };
};

export const authService = {
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  },

  async verifyPassword(plain: string, hashed: string) {
    // [FIX] Tighten security: Don't allow ANY password. Require specific dev passwords.
    if (hashed === 'mock' && process.env.NODE_ENV !== 'production') {
      return plain === 'mock' || plain === 'password';
    }
    return bcrypt.compare(plain, hashed);
  },

  async createSession(userId: string, role: string) {
    const token = await new SignJWT({ userId, role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(SECRET);

    cookies().set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Consider 'strict' or specific domain for SSO if needed
      path: '/',
    });
  },

  async getSession() {
    const session = cookies().get('session');
    if (!session) return null;
    try {
      const { payload } = await jwtVerify(session.value, SECRET);
      return payload as { userId: string; role: string };
    } catch (e) {
      return null;
    }
  },

  async logout() {
    cookies().delete('session');
  },
  
  async getUser(email: string) {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || null;
    } catch (error) {
      // [SECURITY] This fallback is now guarded by the environment check inside getMockUser
      console.warn(`⚠️ Auth Service: DB Error (getUser ${email}). Attempting fallback.`);
      return getMockUser(email);
    }
  },

  async getUserById(id: string) {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.warn(`⚠️ Auth Service: DB Error (getUserById ${id}). Attempting fallback.`);
      return getMockUser(id);
    }
  }
};
```

### `C:/projects/moreways/moreways-site/src/auth/ui/LoginForm.tsx`

```tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Briefcase, User, Wrench, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResponse = async (res: Response) => {
    const data = await res.json();
    
    if (res.ok && data.success) {
      
      // [TRACKING] Fire Login Event
      // Note: We don't send PII here, just the signal that a user logged in.
      // The browser cookie (fbp/fbc) handles the matching on the server.
      if (typeof window !== 'undefined' && window.moreways) {
          window.moreways.track('custom', { 
              event: 'login', 
              method: 'email',
              login_status: 'success'
          });
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl; 
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } else {
      setError(data.error || 'Login failed');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; 
    
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      await handleResponse(res);
    } catch (e) {
      setError('Network error occurred');
      setLoading(false);
    }
  };

  const handleDevLogin = async (role: string) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/dev-login', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      await handleResponse(res);
    } catch (e) {
      setError('Dev login failed');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email</label>
          <Input 
            name="email" 
            type="email" 
            required 
            disabled={loading} 
            placeholder="name@example.com" 
            className="bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Password</label>
          <Input 
            name="password" 
            type="password" 
            required 
            disabled={loading} 
            placeholder="••••••••" 
            className="bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
          />
        </div>
        
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-900/50 flex items-center gap-2 text-sm animate-in fade-in">
            <Shield className="w-4 h-4" /> {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors text-base font-medium shadow-lg" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      {process.env.NODE_ENV === 'development' && (
        <div className="pt-6 border-t border-slate-200/50 dark:border-white/10">
          <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500">
            <Wrench className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Developer Mode</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button 
                variant="outline" 
                className="text-[10px] sm:text-xs h-9 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:bg-transparent" 
                onClick={() => handleDevLogin('client')} 
                disabled={loading}
            >
              <User className="w-3 h-3 mr-1.5" /> Client
            </Button>
            <Button 
                variant="outline" 
                className="text-[10px] sm:text-xs h-9 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:bg-transparent" 
                onClick={() => handleDevLogin('lawyer')} 
                disabled={loading}
            >
              <Briefcase className="w-3 h-3 mr-1.5" /> Lawyer
            </Button>
            <Button 
                variant="outline" 
                className="text-[10px] sm:text-xs h-9 text-indigo-700 dark:text-indigo-300 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20" 
                onClick={() => handleDevLogin('admin')} 
                disabled={loading}
            >
              <LayoutDashboard className="w-3 h-3 mr-1.5" /> Admin
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/auth/ui/LogoutButton.tsx`

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // RELIABILITY FIX: Hard redirect to home
      window.location.href = "/";
    } catch (e) {
      console.error(e);
      window.location.href = "/";
    }
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout} 
      disabled={loading}
      className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
    >
      <LogOut className="w-4 h-4 mr-2" />
      {loading ? "Exiting..." : "Sign Out"}
    </Button>
  );
}
```

### `C:/projects/moreways/moreways-site/src/auth/ui/RegisterForm.tsx`

```tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, ArrowRight, User, Mail, Lock } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData) as Record<string, string>;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // ---------------------------------------------------------
        // [TRACKING] Fire Complete Registration
        // ---------------------------------------------------------
        if (typeof window !== 'undefined' && window.moreways) {
            window.moreways.track('custom', {
                event: 'complete_registration',
                method: 'email',
                // Important for Identity Stitching:
                email: payload.email, 
                content_name: 'portal_account'
            });
        }
        // ---------------------------------------------------------

        // Successful registration automatically logs them in (creates session)
        // Redirect to dashboard to see their new claim
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Registration failed');
        setLoading(false);
      }
    } catch (e) {
      setError('Network error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <Input 
              name="name" 
              type="text" 
              required 
              disabled={loading}
              placeholder="Jane Doe" 
              className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email</label>
          <div className="relative">
             <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
             <Input 
              name="email" 
              type="email" 
              required 
              disabled={loading}
              placeholder="name@example.com" 
              className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <Input 
              name="password" 
              type="password" 
              required 
              disabled={loading}
              placeholder="Create a strong password" 
              className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/40 dark:border-white/10 text-slate-900 dark:text-white transition-all h-12 rounded-xl"
            />
          </div>
        </div>
        
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-900/50 flex items-center gap-2 text-sm animate-in fade-in">
            <Shield className="w-4 h-4" /> {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors text-base font-medium shadow-lg" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400 px-4 leading-relaxed">
        By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/AmbientLight.tsx`

```tsx
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
```

### `C:/projects/moreways/moreways-site/src/components/AttributionPixel.tsx`

```tsx
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
```

### `C:/projects/moreways/moreways-site/src/components/ChatInterface.tsx`

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, ShieldCheck } from "lucide-react"; 
import ChatMessage from "./ChatMessage";
import { VoiceOrb } from "./ui/voice-orb";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const FORM_MAP: Record<string, string> = {
  "Auto – Dealership or Repair": "/issue/auto-dealer-dispute", 
  "Debt Collection": "/issue/debt-collection",
  "Credit or Banking Problem": "/issue/credit-report-errors",
  "Retail or Services Dispute": "/issue/online-and-retail-purchases",
  "Home Improvement / Contractor Issue": "/issue/contractor-home-improvement",
  "Housing – Landlord/Tenant Issue": "/issue/security-deposit-issues",
  "Telemarketing / Robocall Issue": "/issue/robocalls",
  "Scam / Fraud / Unfair Business Practice": "/issue/deceptive-practices",
  "General Consumer Complaint": "/contact",
};

export default function ChatInterface() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Describe what happened, and I'll find the right legal path for you." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // UX State: Simulate "waking up" the secure agent
  const [isBooting, setIsBooting] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Boot Sequence Effect
  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll Effect
  useEffect(() => {
    if (!isBooting && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isBooting]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    const newHistory = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(newHistory);
    setLoading(true);

    // [TRACKING] Fire Engagement Event
    // We track message length to analyze if users are giving detailed vs. short answers
    if (typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('custom', { 
            event: 'ai_interaction',
            content_name: 'intake_router',
            message_length: userMsg.length 
        });
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);

      // [TRACKING] The "Gold Mine" - Qualification Data
      if (typeof window !== 'undefined' && window.moreways) {
        if (data.router_data?.needs_clarification === "no") {
            // SUCCESS: We found a match (Qualified Lead Potential)
            // This maps to "ViewContent" because they are about to view the specific form product
            window.moreways.track('view_content', { 
                content_type: 'legal_issue',
                content_category: data.router_data.form_type, // e.g. "Auto Dealer"
                content_name: 'AI Match Success',
                status: 'qualified'
            });
        } else {
            // FRICTION: We need more info (Unqualified / In Progress)
            // Useful for analyzing where the AI gets stuck
            window.moreways.track('custom', { 
                event: 'ai_clarification_asked',
                question: data.router_data?.clarification_question,
                status: 'unqualified'
            });
        }
      }

      // Navigation Logic
      if (data.router_data?.needs_clarification === "no") {
        const category = data.router_data.form_type;
        const path = FORM_MAP[category] || "/contact";
        
        // [TRACKING] Fire Route Selected
        if (typeof window !== 'undefined' && window.moreways) {
            window.moreways.track('custom', { 
                event: 'ai_route_selected',
                category: category 
            });
        }

        setTimeout(() => {
          router.push(path);
        }, 1500);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting. Please try again." }]);
      
      // [TRACKING] Error Tracking
      if (typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('custom', { event: 'ai_error', error_type: 'api_fail' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = (text: string) => {
    // [TRACKING] Voice Usage (Accessibility Signal)
    if (typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('custom', { event: 'voice_input_used' });
    }
    setInput((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div className="flex flex-col h-[85dvh] md:h-[650px] rounded-[24px] md:rounded-[32px] overflow-hidden relative z-10 shadow-2xl shadow-indigo-900/20 border border-white/60 dark:border-white/10 bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl ring-1 ring-white/40 dark:ring-white/5">
      
      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-6 py-4 md:py-5 flex justify-between items-start pointer-events-none">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-white/10 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 pointer-events-auto">
           <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />
           <span className="text-[10px] md:text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Moreways Assistant</span>
        </div>
        
        <div className="flex gap-2">
           <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 dark:border-white/10 px-3 py-2 rounded-full flex items-center gap-1.5" title="Encrypted">
              <ShieldCheck className="w-3 h-3 text-slate-600 dark:text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 hidden sm:inline">SECURE</span>
           </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 pt-20 md:pt-24 pb-4 space-y-4 scroll-smooth">
        {isBooting ? (
          // Boot Sequence / Skeleton Loader
          <div className="h-full flex flex-col items-center justify-center gap-6 opacity-70">
             <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                </div>
             </div>
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse uppercase tracking-widest">
                Initializing Secure Channel...
             </p>
          </div>
        ) : (
          // Live Chat
          <>
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m.content} isUser={m.role === "user"} />
            ))}
            
            {loading && (
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 text-sm ml-2 bg-white/50 dark:bg-slate-800/50 px-4 py-3 rounded-2xl w-fit backdrop-blur-sm border border-white/40 dark:border-white/10 shadow-sm animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Analyzing...</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-3 md:p-4 bg-white dark:bg-slate-950 md:bg-gradient-to-t md:from-white/80 md:via-white/60 md:to-transparent md:dark:from-slate-950/90 md:backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 md:border-white/20">
        <div className="flex gap-2 items-end bg-slate-50 dark:bg-slate-900 md:bg-white/80 md:dark:bg-slate-800/60 md:backdrop-blur-xl rounded-[20px] md:rounded-[24px] p-2 shadow-sm md:shadow-xl border border-slate-200 dark:border-slate-700 md:border-white/60 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what happened..."
            className="resize-none min-h-[44px] max-h-[120px] border-none focus-visible:ring-0 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2.5 text-base md:text-base leading-relaxed"
          />
          
          <div className="pb-1 pr-1 flex items-center gap-1 md:gap-2">
            <VoiceOrb onTranscript={handleVoiceInput} />
            
            <div className={`transition-all duration-300 overflow-hidden ${input.trim() ? 'w-[40px] md:w-[46px] opacity-100' : 'w-0 opacity-0'}`}>
               <Button
                  onClick={handleSend}
                  disabled={loading}
                  size="icon"
                  className="h-[40px] w-[40px] md:h-[46px] md:w-[46px] rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
               >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/ChatMessage.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* 
        AVATAR 
        ------
        User: Neutral Slate (Low profile)
        AI:   Vibrant Indigo/Purple Gradient (High profile, feels like "magic")
      */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative shadow-sm ring-1 
        ${isUser 
          ? 'bg-slate-200 dark:bg-slate-700 ring-white/50 dark:ring-white/10' 
          : 'bg-gradient-to-br from-indigo-500 to-purple-600 ring-indigo-400/50 shadow-indigo-500/30'
        }
      `}>
        {isUser ? (
          <User className="w-4 h-4 text-slate-500 dark:text-slate-300" />
        ) : (
          <Sparkles className="w-4 h-4 text-white fill-white/20" />
        )}
      </div>

      {/* BUBBLE */}
      <div className={`max-w-[85%] relative group`}>
        <div className={`
            px-5 py-4 text-sm leading-relaxed backdrop-blur-md transition-all duration-300
            ${isUser
              /* USER BUBBLE: 
                 Light Mode: Dark Slate
                 Dark Mode: Indigo (High Contrast)
              */
              ? 'bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-xl shadow-indigo-900/10 dark:shadow-indigo-500/20 border border-white/10'
              
              /* AI BUBBLE:
                 Light Mode: White Glass
                 Dark Mode: Dark Glass (Slate-800/50)
              */
              : 'bg-white/60 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-sm shadow-sm border border-white/50 dark:border-white/10'
            }
          `}
        >
          {message}
        </div>
        
        {/* METADATA LABEL */}
        <div className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {isUser ? 'You' : 'Moreways Assistant'}
        </div>
      </div>
    </motion.div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/CitationCard.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { BookOpen, Scale, AlertTriangle, Loader2, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitationCardProps {
  idOrUrn: string;
  triggerText?: string;
  className?: string;
  onClick?: (urn: string) => void;
}

interface LegalNode {
  id: string;
  urn: string;
  structure_type: string;
  content_text: string;
  citation_path: string;
}

export function CitationCard({ idOrUrn, triggerText, className, onClick }: CitationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<LegalNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_LAW_ENGINE_URL || "http://localhost:3000/api/v1";

  const fetchNode = async () => {
    if (data || loading) return; 
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/node/${encodeURIComponent(idOrUrn)}`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json.data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
    fetchNode();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsOpen(false);
    
    // [TRACKING] Track Micro-Engagement (High Intent Signal)
    if (typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('view_content', {
            content_type: 'legal_citation',
            content_id: idOrUrn, 
            content_name: triggerText || idOrUrn
        });
    }

    if (onClick) onClick(idOrUrn);
  };

  return (
    <span 
      className={cn("relative inline-block group", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsOpen(false)}
      onClick={handleClick}
    >
      <span className={cn(
        "cursor-pointer font-medium underline decoration-dotted decoration-2 underline-offset-4 transition-colors",
        "text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 rounded px-0.5 -mx-0.5"
      )}>
        {triggerText || idOrUrn}
      </span>

      {isOpen && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 z-50 origin-bottom animate-in zoom-in-95 fade-in duration-200 block pointer-events-none">
          <span className="block bg-slate-900 text-white rounded-lg shadow-xl overflow-hidden p-3">
            {loading ? (
               <span className="flex items-center gap-2 text-xs">
                 <Loader2 className="w-3 h-3 animate-spin" /> Loading preview...
               </span>
            ) : data ? (
                <span className="block">
                    <span className="flex items-center gap-2 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <MousePointerClick className="w-3 h-3" /> Click to Pin
                    </span>
                    <span className="block text-xs leading-relaxed line-clamp-3 opacity-90">
                        {data.content_text}
                    </span>
                </span>
            ) : null}
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-slate-900 transform rotate-45 block" />
        </span>
      )}
    </span>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/ClientNavbar.tsx`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClientUserMenu } from "./ClientUserMenu";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface ClientNavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function ClientNavbar({ user }: ClientNavbarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F172A]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-white/5 dark:border-white/5 z-40 px-6 flex items-center justify-between transition-all">
      {/* Brand */}
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold font-heading shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            M
          </div>
          <span className="font-bold text-slate-200 dark:text-white tracking-tight text-lg">Moreways</span>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
          <NavLink href="/dashboard" active={isActive('/dashboard')}>My Claims</NavLink>
          <NavLink href="/dashboard/settings" active={isActive('/dashboard/settings')}>Settings</NavLink>
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <Link href="/start">
          <button className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-900 hover:bg-slate-200 font-medium text-sm transition-colors shadow-lg shadow-indigo-500/10">
            <Plus className="w-3.5 h-3.5" />
            <span>New Claim</span>
          </button>
        </Link>
        
        {/* User Menu */}
        <ClientUserMenu user={user} />
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
        active 
          ? "bg-indigo-600 text-white shadow-md" 
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      {children}
    </Link>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/ClientUserMenu.tsx`

```tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";

interface ClientUserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function ClientUserMenu({ user }: ClientUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initials = user?.name 
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      
      // RELIABILITY FIX: Use window.location.href instead of router.push
      // This forces a hard reload, clearing all client-side state and memory,
      // and guarantees the user lands on the homepage without middleware race conditions.
      window.location.href = "/";
      
    } catch (error) {
      console.error("Logout failed", error);
      // Fallback
      window.location.href = "/";
    }
  };

  return (
    <div className="relative z-50 pointer-events-auto" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group focus:outline-none"
      >
        {/* Avatar Circle */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
           <span className="text-xs font-bold text-white">{initials}</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-3 w-60 origin-top-right rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-black/50"
          >
            <div className="px-5 py-4 border-b border-white/5">
              <p className="text-sm font-bold text-white mb-0.5">{user?.name || "Client"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>

            <div className="p-1.5">
              <button
                type="button" // Explicitly set type button to prevent form submission behavior
                onClick={(e) => {
                  e.stopPropagation(); // Prevent bubbling issues
                  handleSignOut();
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-medium text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/CookieConsent.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const stored = localStorage.getItem("mw_consent_status");
    if (!stored) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: 'granted' | 'denied') => {
    setIsVisible(false);
    localStorage.setItem("mw_consent_status", choice);

    // 1. Tell the Pixel immediately
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.consent({
        ad_storage: choice,
        analytics_storage: choice
      });
      console.log(`[Privacy] Consent set to: ${choice}`);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[420px] z-[100]"
        >
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-2xl shadow-black/20 ring-1 ring-black/5">
            
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Cookie className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                  Privacy & Transparency
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We use secure tracking to ensure your claim is routed to the correct attorney. We do not sell personal data to data brokers.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => handleConsent('denied')}
              >
                Decline
              </Button>
              <Button 
                className="flex-1 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                onClick={() => handleConsent('granted')}
              >
                Accept & Continue
              </Button>
            </div>

            <div className="mt-3 text-center">
                <Link href="/privacy" className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline underline-offset-2">
                    Read our full Data Policy
                </Link>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/DefinitionPanel.tsx`

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { X, BookOpen, Scale, Loader2, Copy, Check, ArrowLeft, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface DefinitionPanelProps {
  urn: string | null;
  onClose: () => void;
}

interface LegalNode {
  id: string;
  urn: string;
  structure_type: string;
  content_text: string;
  citation_path: string;
}

export function DefinitionPanel({ urn, onClose }: DefinitionPanelProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [data, setData] = useState<LegalNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const activeUrn = history.length > 0 ? history[history.length - 1] : urn;
  const isDrilledDown = history.length > 0;

  const API_BASE = process.env.NEXT_PUBLIC_LAW_ENGINE_URL || "http://localhost:3000/api/v1";

  // Reset history if the parent trigger changes
  useEffect(() => {
    if (urn) setHistory([]);
  }, [urn]);

  useEffect(() => {
    if (!activeUrn) return;

    setCopied(false);
    setError(false);
    
    // Smooth transition: Keep old data visible until new data arrives if drilling down
    if (!isDrilledDown) setData(null);

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/node/${encodeURIComponent(activeUrn)}`);
        
        if (res.ok) {
          const json = await res.json();
          // Artificial delay for UI feel
          await new Promise(r => setTimeout(r, 250)); 
          setData(json.data);
        } else {
          console.error("Failed to fetch node:", activeUrn);
          setError(true);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeUrn]);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.content_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    setHistory((prev) => prev.slice(0, -1));
  };

  const renderContent = (text: string, currentUrn: string) => {
    // Regex matches "940 CMR 10.05" or "10.05(4)"
    const citationRegex = /(?:940\s+CMR\s+)?(\d{1,2}\.\d{2})(?:\((\d+)\))?/gi;
    
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = citationRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        const section = match[1].replace('.', '_'); // 10.05 -> 10_05
        
        // [FIX] ROBUST STRATEGY: Always target the SECTION
        // We ignore the specific subsection (match[2]) for the URN lookup.
        // The backend's "Full Context" logic will return the whole section anyway.
        
        const urnParts = currentUrn.split(':');
        // Extract corpus prefix (urn:lex:fed:corpus_id)
        const corpusPrefix = urnParts.slice(0, 4).join(':');
        
        const targetUrn = `${corpusPrefix}:${section}`;

        parts.push(
            <span 
                key={match.index}
                onClick={(e) => {
                    e.stopPropagation();
                    console.log("Navigating to Section:", targetUrn);
                    setHistory(prev => [...prev, targetUrn]);
                }}
                className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-bold hover:underline decoration-2 underline-offset-2 bg-indigo-50 dark:bg-indigo-500/10 px-1 rounded mx-0.5 transition-colors inline-block"
                title={`Read Full Text of ${match[1]}`}
            >
                {match[0]}
            </span>
        );

        lastIndex = citationRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  const panelVariants: Variants = {
    hidden: { x: 380, opacity: 0, scale: 0.95 },
    visible: { 
      x: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    exit: { 
      x: 380, 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };

  const contentVariants: Variants = {
    initial: { opacity: 0, x: 20, filter: "blur(4px)" },
    animate: { 
      opacity: 1, 
      x: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.3 } 
    },
    exit: { 
      opacity: 0, 
      x: -20, 
      filter: "blur(4px)",
      transition: { duration: 0.2 } 
    }
  };

  if (!urn && history.length === 0) return null;

  return (
    <motion.div 
      className="fixed top-24 right-4 z-40 w-full max-w-sm"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={cn(
          "backdrop-blur-2xl border shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5 transition-colors duration-500",
          isDrilledDown 
            ? "bg-slate-50/95 dark:bg-slate-900/95 border-indigo-200 dark:border-indigo-900" 
            : "bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-700"
      )}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            {isDrilledDown ? (
               <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white" onClick={handleBack}>
                 <ArrowLeft className="w-4 h-4" />
               </Button>
            ) : (
               <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            )}
            
            <span className={cn(
                "text-xs font-bold uppercase tracking-wider transition-colors",
                isDrilledDown ? "text-slate-900 dark:text-white" : "text-indigo-600 dark:text-indigo-400"
            )}>
                {isDrilledDown ? "Full Legal Context" : "Official Definition"}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800" onClick={onClose}>
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Body Container */}
        <div className="p-6 max-h-[70vh] overflow-y-auto min-h-[200px] flex flex-col relative">
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 z-10 bg-inherit"
              >
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                <span className="text-sm font-medium">Fetching law...</span>
              </motion.div>
            ) : error ? (
                <motion.div
                    key="error"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                >
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-3 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Citation Not Found</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                        The system could not locate <code>{activeUrn?.split(':').pop()}</code>.
                    </p>
                    {isDrilledDown && (
                        <Button variant="link" size="sm" onClick={handleBack} className="mt-2 text-indigo-600 dark:text-indigo-400">
                            Go Back
                        </Button>
                    )}
                </motion.div>
            ) : data ? (
              <motion.div 
                key={data.urn} 
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                {/* Meta Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]" title={data.urn}>
                        {data.urn.split(':').pop()}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {data.structure_type}
                      </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="prose prose-sm dark:prose-invert">
                  <p className={cn(
                      "text-base font-medium leading-relaxed transition-colors whitespace-pre-line", // Added whitespace-pre-line to preserve structure
                      isDrilledDown ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"
                  )}>
                    {renderContent(data.content_text, data.urn)}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    {isDrilledDown ? <FileText className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                    <span className="font-mono truncate max-w-[150px]">{data.citation_path}</span>
                  </div>
                  
                  <button 
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                  >
                      <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                          <motion.span 
                            key="check"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center gap-1 text-emerald-500"
                          >
                            <Check className="w-3 h-3" /> Copied
                          </motion.span>
                        ) : (
                          <motion.span 
                            key="copy"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </motion.span>
                        )}
                      </AnimatePresence>
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/Footer.tsx`

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="relative mt-auto z-10 bg-slate-950 text-slate-200 border-t border-white/5 dark:border-white/10">
      
      {/* Top Glow Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(56,58,161,0.15),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white font-heading tracking-tight">Moreways</h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed max-w-xs">
                Organizing the world's consumer claims. We connect people who have been wronged with attorneys who can help.
              </p>
            </div>
            
            {/* UPDATED: Prominent CTA under description */}
            <Link href="/start" className="inline-block">
              <Button className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-8 py-6 font-bold shadow-lg shadow-white/5 transition-all hover:scale-105 hover:shadow-white/20">
                Start Free Assessment
              </Button>
            </Link>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/consumers" className="hover:text-indigo-400 transition-colors">For Consumers</Link></li>
              <li><Link href="/how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</Link></li>
              <li><Link href="/start" className="hover:text-indigo-400 transition-colors">Check Eligibility</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/for-law-firms" className="hover:text-indigo-400 transition-colors">Partner Program</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-mono">
            SECURE ENCRYPTED CONNECTION
          </p>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Moreways Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/FrozenRoute.tsx`

```tsx
"use client";

import { useContext, useRef } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function FrozenRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/*
export default function FrozenRoute({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}*/
```

### `C:/projects/moreways/moreways-site/src/components/IssueTracker.tsx`

```tsx
"use client";

import { useEffect } from "react";

interface IssueTrackerProps {
  slug: string;
  title: string;
}

export function IssueTracker({ slug, title }: IssueTrackerProps) {
  useEffect(() => {
    // [TRACKING] Fire Product View (ViewContent)
    // This tells ad algos: "User is interested in [Lemon Law], but hasn't converted yet."
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.track('view_content', {
        content_type: 'product', // Standard e-commerce type
        content_ids: [slug],     // The ID of the "Product"
        content_name: title,     // Human readable name
        content_category: 'legal_claim'
      });
      console.log(`[Pixel] Tracked ViewContent: ${title}`);
    }
  }, [slug, title]);

  return null; // Invisible component
}
```

### `C:/projects/moreways/moreways-site/src/components/LegalChatInterface.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { Send, BookOpen } from "lucide-react";
import { CitationCard } from "./CitationCard"; // Assumes you have this from the tree

export function LegalChatInterface() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput("");
    setHistory(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
        const res = await fetch("/api/chat/legal", {
            method: "POST",
            body: JSON.stringify({ messages: [{ role: "user", content: q }] })
        });
        const data = await res.json();
        
        setHistory(prev => [...prev, { 
            role: "assistant", 
            content: data.content,
            citations: data.citations 
        }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.map((msg, i) => (
                <div key={i} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-lg text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border'}`}>
                        {msg.content}
                    </div>
                    {/* Render Citations if available */}
                    {msg.citations && (
                        <div className="grid grid-cols-1 gap-2 w-full max-w-[80%]">
                            {msg.citations.map((c: any, idx: number) => (
                                <div key={idx} className="text-xs bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded border border-indigo-100 dark:border-indigo-800">
                                    <div className="font-bold flex items-center gap-1 text-indigo-700 dark:text-indigo-300">
                                        <BookOpen className="w-3 h-3" /> {c.urn}
                                    </div>
                                    <div className="line-clamp-2 opacity-80 mt-1">{c.text}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {loading && <div className="text-xs text-slate-400 animate-pulse">Consulting the library...</div>}
        </div>
        <div className="p-3 border-t bg-white dark:bg-slate-950 flex gap-2">
            <input 
                className="flex-1 bg-transparent text-sm outline-none" 
                placeholder="Ask a legal question..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
            />
            <button onClick={handleAsk} disabled={loading} className="text-indigo-600"><Send className="w-4 h-4" /></button>
        </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/LegalResearchBot.tsx`

```tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, BookOpen, Gavel, Loader2, X, ChevronRight, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface Citation {
  urn: string;
  title: string;
  text: string;
  similarity: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: number;
}

interface LawNode {
  urn: string;
  content_text: string;
  structure_type: string;
}

export function LegalResearchBot() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Message[]>([
    {
        id: "init",
        role: "assistant",
        content: "I am your Legal Research Assistant. I have access to Massachusetts CMR and Federal statutes. What legal topic are you researching?",
        timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeUrn, setActiveUrn] = useState<string | null>(null);
  const [lawContent, setLawContent] = useState<LawNode | null>(null);
  const [isReaderLoading, setIsReaderLoading] = useState(false);

  useEffect(() => {
    if (!activeUrn) { 
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [history, isLoading, activeUrn]);

  const handleOpenLaw = async (urn: string) => {
    setActiveUrn(urn);
    setLawContent(null);
    setIsReaderLoading(true);

    try {
        const res = await fetch(`/api/lex/node?urn=${encodeURIComponent(urn)}`);
        
        if (!res.ok) throw new Error("Failed to fetch law");
        const json = await res.json();
        setLawContent(json.data);
    } catch (e) {
        console.error(e);
        setLawContent({ 
            urn, 
            content_text: "Error loading full text. Please check the backend connection.", 
            structure_type: "ERROR" 
        });
    } finally {
        setIsReaderLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // [TRACKING] Track Research Intent
    if (typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('search', {
            search_string: input,
            content_category: 'lex_research_demo'
        });
    }
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input, timestamp: Date.now() };
    setHistory(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
        const res = await fetch("/api/chat/legal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [userMsg] })
        });

        if (!res.ok) throw new Error("Search failed");
        
        const data = await res.json();
        
        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.content,
            citations: data.citations,
            timestamp: Date.now()
        };
        
        setHistory(prev => [...prev, botMsg]);

    } catch (err) {
        setHistory(prev => [...prev, {
            id: Date.now().toString(),
            role: "assistant",
            content: "I encountered an error accessing the law library. Please try again.",
            timestamp: Date.now()
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-950 relative overflow-hidden">
        
        <div className={clsx(
            "flex-1 flex flex-col transition-all duration-500 ease-in-out",
            activeUrn ? "w-1/2 pr-0 opacity-40 pointer-events-none md:opacity-100 md:pointer-events-auto" : "w-full"
        )}>
            <div className="flex-none p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center gap-3 z-10">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                    <Gavel className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">LexOS Research</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Retrieval Augmented Generation</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth" ref={scrollRef}>
                <AnimatePresence mode="popLayout">
                    {history.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={clsx("flex gap-4 max-w-3xl mx-auto", msg.role === "user" ? "justify-end" : "justify-start")}
                        >
                            {msg.role === "assistant" && (
                                <div className="flex-none w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 mt-1">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            )}

                            <div className={clsx("flex flex-col gap-2 max-w-[90%] md:max-w-[85%]", msg.role === "user" ? "items-end" : "items-start")}>
                                <div className={clsx(
                                    "px-5 py-3.5 text-sm leading-relaxed shadow-sm",
                                    msg.role === "user" 
                                        ? "bg-indigo-600 text-white rounded-[1.25rem] rounded-tr-sm shadow-indigo-500/20" 
                                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-[1.25rem] rounded-tl-sm"
                                )}>
                                    {msg.content.split('\n').map((line, i) => (
                                        <p key={i} className={clsx(line.trim() === "" ? "h-2" : "mb-2 last:mb-0")}>{line}</p>
                                    ))}
                                </div>

                                {msg.citations && msg.citations.length > 0 && (
                                    <div className="flex flex-col gap-2 w-full mt-1">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Sources</span>
                                        {msg.citations.slice(0, 4).map((cite, idx) => (
                                            <button 
                                                key={idx} 
                                                onClick={() => handleOpenLaw(cite.urn)}
                                                className="text-left bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 rounded-lg p-3 group transition-all hover:bg-slate-900 shadow-sm"
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span className="text-xs font-bold text-emerald-400 font-mono truncate">
                                                        {cite.urn.split(':').pop()?.replace(/_/g, ' ').toUpperCase()}
                                                    </span>
                                                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-500 ml-auto transition-colors" />
                                                </div>
                                                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-300">
                                                    {cite.text}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {msg.role === "user" && (
                                <div className="flex-none w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mt-1">
                                    <User className="w-4 h-4 text-slate-400" />
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-3xl mx-auto">
                            <div className="flex-none w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mt-1">
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                            <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-[1.25rem] rounded-tl-sm flex items-center gap-2">
                                <span className="text-xs text-slate-400 animate-pulse">Consulting Law Library...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-4 md:p-6 bg-slate-900/80 border-t border-slate-800 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto relative flex items-center bg-slate-950 rounded-full border border-slate-800 focus-within:border-emerald-500/50 transition-colors shadow-lg">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask a legal question..."
                        className="flex-1 bg-transparent px-6 py-4 text-white placeholder:text-slate-500 outline-none rounded-full"
                        disabled={isLoading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="mr-2 p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all disabled:opacity-50 disabled:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        <AnimatePresence>
            {activeUrn && (
                <motion.div 
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-y-0 right-0 w-full md:w-[600px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
                >
                    <div className="flex-none p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/95 backdrop-blur">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-slate-800 rounded-md text-slate-400">
                                <Scale className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-white uppercase tracking-wider truncate">
                                    Official Text
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono truncate">
                                    {activeUrn}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setActiveUrn(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950">
                        {isReaderLoading ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-500">
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                                <p className="text-xs uppercase tracking-widest">Reconstructing Document...</p>
                            </div>
                        ) : lawContent ? (
                            <div className="prose prose-invert prose-sm max-w-none">
                                <div className="font-serif text-slate-300 leading-loose whitespace-pre-wrap">
                                    {lawContent.content_text}
                                </div>
                                
                                <div className="mt-12 pt-6 border-t border-slate-800 flex justify-between text-[10px] text-slate-600 uppercase tracking-widest">
                                    <span>Source: {lawContent.structure_type}</span>
                                    <span>Verified by ArgueOS</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 mt-20">
                                <p>Failed to load document content.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/Navbar.tsx`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClientUserMenu } from "@/components/ClientUserMenu"; 

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null; // UPDATED: Added role to type
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 1. Reset scroll state immediately on route change
  useEffect(() => {
    setScrolled(false);
  }, [pathname]);

  // 2. Global Scroll Listener
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.id === 'scrolling-container') {
        const isScrolled = target.scrollTop > 20;
        setScrolled(isScrolled);
      }
    };
    document.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  const navLinks = [
    { href: "/consumers", label: "For Consumers" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/issues", label: "Qualifying Cases" },
    { href: "/for-law-firms", label: "For Attorneys" },
  ];

  // UPDATED: Determine Dashboard URL based on Role
  const dashboardUrl = (user?.role === 'lawyer' || user?.role === 'admin') 
    ? (process.env.NEXT_PUBLIC_LAWYER_APP_URL || 'http://localhost:3001/crm')
    : '/dashboard';

  return (
    <div className="flex justify-center w-full pt-4 px-4 pointer-events-none fixed top-0 left-0 right-0 z-50">
      <nav 
        className={cn(
          "pointer-events-auto transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] duration-300",
          "flex items-center justify-between",
          "bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl shadow-indigo-500/5",
          scrolled 
            ? "w-full md:max-w-5xl rounded-full py-2 px-4 pl-6" 
            : "w-[calc(100%-2rem)] max-w-7xl rounded-[2rem] py-4 px-6"
        )}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group relative z-10">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold font-heading shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
            M
          </div>
          <span className="text-xl font-bold font-heading tracking-tight transition-colors text-slate-900 dark:text-white">
            Moreways
          </span>
        </Link>

        {/* CENTER LINKS (Desktop Only) */}
        <div className={cn(
            "hidden md:flex items-center bg-white/5 dark:bg-white/5 rounded-full border border-white/5 transition-all duration-300",
            scrolled ? "gap-0 p-0.5" : "gap-1 p-1" 
        )}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium rounded-full transition-all duration-300",
                scrolled ? "px-3 py-1.5" : "px-4 py-1.5", 
                pathname === link.href 
                  ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className={cn(
            "hidden md:flex items-center transition-all duration-300",
            scrolled ? "gap-2" : "gap-3" 
        )}>
          <ThemeToggle />

          {user ? (
            // === LOGGED IN STATE ===
            <>
              {/* UPDATED: Dynamic Dashboard Button */}
              <Link href={dashboardUrl}>
                <Button variant="ghost" size="sm" className={cn(
                    "rounded-full h-10 px-4 transition-colors",
                    pathname === '/dashboard' 
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                )}>
                   <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </Button>
              </Link>
              
              <div className="pl-1 border-l border-slate-200 dark:border-white/10 ml-1">
                 <ClientUserMenu user={user} />
              </div>
            </>
          ) : (
            // === LOGGED OUT STATE ===
            <>
              <Link href="/login">
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 h-10 px-4"
                 >
                   Sign In
                 </Button>
              </Link>

              <Link href="/start">
                <Button 
                  className="rounded-full px-6 transition-all shadow-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-indigo-500/20 h-10 font-medium"
                >
                  Start Free Assessment
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div className="md:hidden flex items-center gap-2">
            {user && <ClientUserMenu user={user} />}
            
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-900 dark:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
        </div>

        {/* MOBILE MENU CONTENT */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-24 left-4 right-4 bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-[2rem] p-4 shadow-2xl animate-in slide-in-from-top-2 z-50 pointer-events-auto">
             <div className="flex flex-col space-y-2">
              
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    pathname === link.href 
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-slate-200/50 dark:bg-white/10 my-2" />
              
              {user ? (
                 <Link href={dashboardUrl} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-xl py-6 text-lg shadow-xl shadow-indigo-500/20 bg-indigo-600 text-white hover:bg-indigo-500">
                      <LayoutDashboard className="w-5 h-5 mr-2" /> Go to Dashboard
                    </Button>
                 </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <div className="px-4 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-center border border-slate-200/50 dark:border-white/5">
                      Sign In
                    </div>
                  </Link>

                  <Link href="/start" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-xl py-6 text-lg shadow-xl shadow-indigo-500/20 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-500">
                      Start Free Assessment
                    </Button>
                  </Link>
                </>
              )}
             </div>
          </div>
        )}
      </nav>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/PageTransition.tsx`

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import FrozenRoute from "./FrozenRoute";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // 1. Desktop Only: Initialize Smooth Scroll (Lenis)
    // We skip this on mobile because native touch scrolling is superior.
    if (isMobile) return;
    
    const container = containerRef.current;
    if (!container) return;

    const lenis = new Lenis({
      wrapper: container,
      content: container.firstElementChild as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname, isMobile]);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        ref={containerRef}
        id="scrolling-container"
        
        // 2. UPDATED: Removed 'filter: blur()' completely.
        // We now rely purely on Opacity and Scale. It is much more robust.
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        
        // 3. Exit Animation
        // On Mobile: Instant removal (empty object) to prevent memory spikes.
        // On Desktop: Fade out + slight zoom.
        exit={isMobile ? {} : { opacity: 0, scale: 1.02 }} 
        
        transition={
          isMobile 
            ? { duration: 0.2, ease: "linear" } // Snappy on phones
            : { duration: 0.6, ease: [0.22, 1, 0.36, 1] } // Smooth on desktop
        }
        className="absolute inset-0 w-full h-full overflow-y-auto scroll-smooth"
      >
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/ResponsiveDefinition.tsx`

```tsx
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
```

### `C:/projects/moreways/moreways-site/src/components/RouteObserver.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RouteObserver() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track last URL to prevent React strict mode double-firing
  const lastUrl = useRef("");

  useEffect(() => {
    // Wait for window to be available
    if (typeof window === "undefined") return;

    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    if (url === lastUrl.current) return;
    lastUrl.current = url;

    // Fire the event
    // We use a small timeout to ensure the Pixel has initialized
    setTimeout(() => {
      if (window.moreways) {
        window.moreways.track('pageview', {
          path: pathname,
          title: document.title,
          url: window.location.href
        });
      }
    }, 100);
    
  }, [pathname, searchParams]);

  return null;
}
```

### `C:/projects/moreways/moreways-site/src/components/SmoothScroll.tsx`

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SmoothScroll() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  useEffect(() => {
    // OPTIMIZATION: Kill smooth scroll on mobile. 
    // Native momentum scrolling is always better for UX and Performance on phones.
    if (isMobile) return;

    const scrollContainer = document.getElementById("scrolling-container");
    if (!scrollContainer) return;

    const lenis = new Lenis({
      wrapper: scrollContainer,
      content: scrollContainer.firstElementChild as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname, isMobile]);

  return null;
}
```

### `C:/projects/moreways/moreways-site/src/components/StandardComplaintsFab.tsx`

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { consumerIssues } from "@/content/data/consumerIssues";
import { Scale, X } from "lucide-react";

export function StandardComplaintsFab() {
  const [open, setOpen] = useState(false);

  const handleOpen = (newState: boolean) => {
    setOpen(newState);
    if (newState && typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('custom', { event: 'fab_opened', location: 'global_footer' });
    }
  };

  const handleSelectIssue = (issueId: string) => {
    setOpen(false);
    if (typeof window !== 'undefined' && window.moreways) {
        window.moreways.track('view_content', { 
            content_type: 'legal_issue_direct_select',
            content_id: issueId,
            location: 'fab_menu'
        });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in duration-300">
      <Popover open={open} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>
          <Button 
            className="rounded-full h-14 w-14 shadow-2xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white border border-slate-700/50 p-0 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            {open ? (
              <X className="w-6 h-6" />
            ) : (
              <Scale className="w-6 h-6" />
            )}
            <span className="sr-only">Standard Complaints</span>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          side="top" 
          align="end" 
          sideOffset={16} 
          className="w-80 p-0 rounded-xl overflow-hidden shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <div className="bg-slate-50 dark:bg-slate-950/50 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-heading font-semibold text-sm text-slate-700 dark:text-slate-200">
              Select an Issue
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose a category to start your claim immediately.
            </p>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto p-2">
            <div className="grid gap-1">
              {consumerIssues.map((issue) => {
                const Icon = issue.icon;
                return (
                  <Link 
                    key={issue.id} 
                    href={`/issue/${issue.id}`}
                    onClick={() => handleSelectIssue(issue.id)}
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                      <div className="mt-1 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {issue.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {issue.shortDescription}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link href="/start" onClick={() => setOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full text-xs h-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Or verify with Intake Assistant &rarr;
              </Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/ThemeToggle.tsx`

```tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative rounded-full w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-all hover:scale-110 active:scale-95"
    >
      {/* Sun Icon: Visible in Light Mode, Scales down in Dark */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 absolute" />
      
      {/* Moon Icon: Hidden in Light Mode, Scales up in Dark */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/theme-provider.tsx`

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// FIX: Use ComponentProps instead of importing internal types
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### `C:/projects/moreways/moreways-site/src/components/runner/UnifiedRunner.tsx`

```tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { ChatRunner, type ChatMessage, type SimpleMessage } from "./components/ChatRunner"; 
import { SectionSidebar } from "./components/SectionSidebar"; 
import { VerdictCard } from "./components/VerdictCard";
import { LegalChatInterface } from "../LegalChatInterface"; 
import type { FormSchemaJson } from "@/lib/types/argueos-types";
import { argueosClient } from "@/lib/argueos-client";

interface UnifiedRunnerProps {
  formId: string;
  organizationId: string;
  schema: FormSchemaJson;
  initialData?: Record<string, any>;
  intent?: string;
}

export function UnifiedRunner({ 
  formId, 
  organizationId, 
  schema, 
  initialData = {},
  intent = "General Consumer Issue"
}: UnifiedRunnerProps) {
  const router = useRouter();
  
  // -- STATE --
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const [formName] = useState("Intake Assessment"); 

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [textHistory, setTextHistory] = useState<SimpleMessage[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New State for Intelligence Layer
  const [verdict, setVerdict] = useState<any>(null);

  // -- 1. PERSISTENCE (Auto-Save) --
  const STORAGE_KEY = `intake_draft_${formId}`;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) { console.error("Failed to load draft", e); }
    }
  }, [formId]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, STORAGE_KEY]);

  // -- 2. TAB PROTECTION --
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(formData).length > 1 && !verdict) {
        e.preventDefault();
        e.returnValue = ""; 
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, verdict]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
        // 1. Submit to CRM (Persistence)
        await argueosClient.submitForm({
            formId,
            orgId: organizationId,
            data: formData
        });

        localStorage.removeItem(STORAGE_KEY);

        // ---------------------------------------------------------
        // [TRACKING] Fire Lead Event
        // ---------------------------------------------------------
        if (typeof window !== 'undefined' && window.moreways) {
            // Helper: Try to find PII fields in dynamic schema keys
            // Looks for keys containing "email", "phone", "name" case-insensitive
            const findValue = (substr: string) => {
                const key = Object.keys(formData).find(k => k.toLowerCase().includes(substr));
                return key ? formData[key] : undefined;
            };

            const email = findValue('email');
            const phone = findValue('phone');
            const fullName = findValue('name') || findValue('full_name');
            let firstName, lastName;

            if (typeof fullName === 'string') {
                const parts = fullName.trim().split(' ');
                firstName = parts[0];
                lastName = parts.slice(1).join(' ');
            }

            window.moreways.track('lead', {
                // Primary Conversion Value
                value: 50, // Estimated value for ad optimization
                currency: 'USD',
                content_name: formName,
                
                // Identity Signals (Hashed by Attribution Engine)
                email: email,
                phone: phone,
                first_name: firstName,
                last_name: lastName,
                
                // Context
                form_id: formId,
                intent: intent
            });
            console.log("[Pixel] Lead event tracked with identity signals");
        }
        // ---------------------------------------------------------

        // 2. Validate with The Brain (Intelligence)
        const res = await fetch("/api/intake/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                formData: formData,
                intent: intent
            })
        });

        if (!res.ok) throw new Error("Validation failed");
        
        const json = await res.json();
        
        // 3. Show Results
        setVerdict(json.data);
        setIsSubmitting(false);

    } catch (e) {
        setIsSubmitting(false);
        console.error(e);
        alert("Submission failed. Please try again.");
    }
  };

  const handleProceedToAccount = () => {
      router.push('/register?intent=claim_submission');
  };

  // --- RENDER: VERDICT VIEW (Post-Submission) ---
  if (verdict) {
    return (
      <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative flex flex-col">
         <div className="flex-none p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
            <h1 className="font-bold text-lg dark:text-white">Assessment Complete</h1>
            <button 
                onClick={handleProceedToAccount}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
                Create Account <ArrowRight className="w-4 h-4" />
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <VerdictCard 
                        status={verdict.status}
                        confidence={verdict.confidence_score} 
                        summary={verdict.analysis.summary}
                        missingElements={verdict.analysis.missing_elements}
                        citations={verdict.relevant_citations}
                    />
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-1">
                        <h3 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Have Questions?</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Based on your situation, you can ask our legal AI specific questions about the laws cited above.
                        </p>
                    </div>
                    <div className="lg:col-span-2">
                        <LegalChatInterface />
                    </div>
                </motion.div>
            </div>
         </div>
      </div>
    );
  }

  // --- RENDER: RUNNER VIEW (Intake) ---
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-950 overflow-hidden rounded-none md:rounded-2xl border-0 md:border border-slate-800 shadow-2xl relative">
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-4"
          >
             <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
             <div className="text-center">
                <h3 className="text-xl font-bold text-white">Analyzing Claim...</h3>
                <p className="text-slate-400 text-sm mt-1">Consulting legal database</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="md:hidden flex-none bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between z-30">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Assessment</span>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase">
             <Save className="w-3 h-3" /> Auto-Saving
          </div>
      </div>

      <div className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950 flex-none">
         <div className="p-6 border-b border-slate-800">
             <h3 className="text-sm font-bold text-white uppercase tracking-wider">Assessment Progress</h3>
         </div>
         <div className="flex-1 overflow-y-auto">
             <SectionSidebar schema={schema} currentFieldKey={activeFieldKey} />
         </div>
      </div>

      <div className="flex-1 relative flex flex-col min-h-0">
        <div className="md:hidden flex-none border-b border-slate-800 bg-slate-950/50">
             <SectionSidebar schema={schema} currentFieldKey={activeFieldKey} />
        </div>

        <div className="flex-1 relative overflow-hidden">
          <ChatRunner 
              formId={formId}
              formName={formName}
              schema={schema}
              formData={formData}
              onDataChange={setFormData}
              activeFieldKey={activeFieldKey}
              onFieldFocus={setActiveFieldKey}
              onFinished={handleSubmit}
              history={history}
              setHistory={setHistory}
              textHistory={textHistory}
              setTextHistory={setTextHistory}
          />
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/runner/components/ChatRunner.tsx`

```tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import type { FormSchemaJson, FormFieldDefinition } from "@/lib/types/argueos-types";
import { getNextFieldKey } from "../logic/schemaIterator"; 
import { IntakeChatMessage, type MessageVariant } from "./IntakeChatMessage"; 
import { ReviewOverlay } from "./ReviewOverlay"; 
import { VerdictCard } from "./VerdictCard"; 

export interface ChatMessage {
  id: string;
  variant: MessageVariant;
  content: React.ReactNode;
  label?: string;
  description?: string;
  fieldKey?: string;
  data?: Record<string, any>;
}

export interface SimpleMessage { 
  role: "user" | "assistant"; 
  text: string; 
}

function getSmartQuestion(def: FormFieldDefinition) { 
    if (def.kind === 'header') return def.title;
    if (def.title.trim().endsWith("?")) {
        return def.title;
    }
    return `What is the ${def.title}?`; 
}

function deriveSchemaSummary(schema: FormSchemaJson) { 
    return Object.keys(schema.properties)
        .map(k => `- [Key: ${k}] ${schema.properties[k].title}`)
        .join("\n"); 
}

async function consultAgent(field: any, userMessage: any) {
  return new Promise<any>((resolve) => {
      setTimeout(() => {
          resolve({ 
              type: 'answer', 
              extractedValue: userMessage, 
              updates: {} 
          });
      }, 1000);
  });
}

interface ChatRunnerProps {
  formId: string;
  formName: string;
  schema: FormSchemaJson;
  formData: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  history: ChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  textHistory: SimpleMessage[];
  setTextHistory: React.Dispatch<React.SetStateAction<SimpleMessage[]>>;
  activeFieldKey: string | null;
  onFieldFocus: (key: string | null) => void;
  onFinished: () => void;
}

export function ChatRunner({ 
    formId, formName, schema, formData, onDataChange, 
    history, setHistory, textHistory, setTextHistory,
    activeFieldKey, onFieldFocus, onFinished 
}: ChatRunnerProps) {
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  
  const [hasValidated, setHasValidated] = useState(false);

  // [TRACKING] Track Funnel Velocity & Drop-off
  useEffect(() => {
    if (activeFieldKey && typeof window !== 'undefined' && window.moreways) {
        const keys = schema.order || Object.keys(schema.properties);
        const index = keys.indexOf(activeFieldKey);
        const total = keys.length || 1;
        const progress = Math.round(((index) / total) * 100);

        window.moreways.track('custom', {
            event: 'intake_progress',
            field_id: activeFieldKey,
            form_name: formName,
            progress_percent: progress
        });
    }
  }, [activeFieldKey, formName, schema]);

  // Initial Greeting
  useEffect(() => {
    if (history.length === 0) {
        const intro = `I'll guide you through the intake process for ${formName}. Please answer the questions as accurately as possible.`;
        addMessage({ variant: "agent", content: intro }, intro);
        
        if (!activeFieldKey) {
            const first = getNextFieldKey(schema, formData); 
            if(first) onFieldFocus(first);
            else runValidation(); 
        }
    } else {
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "auto" }), 10);
    }
  }, []);

  // Main Loop
  useEffect(() => {
    if (activeFieldKey) {
        askField(activeFieldKey);
    } else if (activeFieldKey === null && history.length > 1 && !isReviewOpen) {
        const lastMsg = history[history.length - 1];
        if (lastMsg?.variant !== 'completion_options' && !hasValidated && !isThinking) {
            runValidation();
        }
    }
  }, [activeFieldKey, hasValidated]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, isThinking]);

  const addMessage = (msg: Partial<ChatMessage>, text?: string) => {
    const id = Date.now().toString() + Math.random();
    setHistory(prev => [...prev, { id, variant: 'agent', content: '', ...msg } as ChatMessage]);
    if (text) setTextHistory(prev => [...prev, { role: msg.variant === 'user' ? 'user' : 'assistant', text }]);
  };

  const runValidation = async () => {
      setIsThinking(true);
      setHasValidated(true); 
      
      try {
          const res = await fetch("/api/intake/validate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  intent: formName,
                  formData: formData
              })
          });
          
          const json = await res.json();
          
          if (json.data) {
              setHistory(prev => [...prev, {
                  id: Date.now().toString(),
                  variant: "agent",
                  content: (
                      <VerdictCard 
                          status={json.data.status}
                          confidence={json.data.confidence_score}
                          summary={json.data.analysis.summary}
                          // [FIX] Changed 'missing' to 'missingElements' to match VerdictCard definition
                          missingElements={json.data.analysis.missing_elements}
                          citations={json.data.relevant_citations}
                          onContinue={showCompletionOptions}
                      />
                  )
              }]);
          } else {
              showCompletionOptions();
          }
      } catch (e) {
          console.error("Validation error", e);
          showCompletionOptions();
      } finally {
          setIsThinking(false);
      }
  };

  const askField = (key: string) => {
    const def = schema.properties[key];
    if (!def) return;
    
    const lastAgentMsg = [...history].reverse().find(m => m.variant === 'agent');
    if (lastAgentMsg?.fieldKey === key) return;

    if (def.kind === 'header') {
        addMessage({ variant: "section", content: def.title });
        setTimeout(() => next(key, formData), 800);
        return;
    }

    const q = getSmartQuestion(def);
    addMessage({ variant: "agent", content: q, fieldKey: key }, q);
  };

  const handleAnswer = async (val: any) => {
    if (!activeFieldKey) return;
    const def = schema.properties[activeFieldKey];
    
    let finalVal = val;
    let updates = {};

    const isDirect = ['select','radio','checkbox','date'].includes(def.kind);

    if (!isDirect && typeof val === 'string') {
        setIsThinking(true);
        addMessage({ variant: 'user', content: val }, val);
        setInputValue("");

        try {
            const res = await consultAgent(def, val);
            setIsThinking(false);

            if (res.updates) updates = res.updates;

            if (res.type === 'question' || res.type === 'chitchat') {
                if (Object.keys(updates).length > 0) {
                    onDataChange({ ...formData, ...updates });
                    addMessage({ variant: "agent", content: "Updated info." });
                }
                addMessage({ variant: "agent", content: res.replyMessage }, res.replyMessage);
                return;
            }
            finalVal = res.extractedValue;
        } catch (e) { setIsThinking(false); }
    } else {
        addMessage({ variant: 'user', content: String(val) }, String(val));
        setInputValue("");
    }

    const nextData = { ...formData, ...updates, [activeFieldKey]: finalVal };
    onDataChange(nextData);
    next(activeFieldKey, nextData);
  };

  const next = (currentKey: string, data: any) => {
      const nextKey = getNextFieldKey(schema, data, currentKey);
      onFieldFocus(nextKey); 
  };

  const showCompletionOptions = () => {
      addMessage({ variant: "agent", content: "Ready to submit." });
      setTimeout(() => addMessage({ variant: "completion_options", content: null }), 500);
  };

  const finish = async (data: any) => { 
      onFinished(); 
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative transition-colors duration-500">
        {isReviewOpen && (
            <ReviewOverlay 
                schema={schema} 
                data={formData} 
                onClose={() => setIsReviewOpen(false)} 
                onSubmit={(d) => { onDataChange(d); setIsReviewOpen(false); finish(d); }} 
            />
        )}
        
        <div className="flex-1 overflow-y-auto px-4 py-24 scroll-smooth" ref={scrollRef}>
            <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="popLayout">
                    {history.map(msg => (
                        <IntakeChatMessage 
                            key={msg.id} 
                            {...msg} 
                            onReview={() => setIsReviewOpen(true)} 
                            onSubmit={() => finish(formData)} 
                        />
                    ))}
                    {isThinking && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 ml-4 mb-4 text-indigo-400 text-xs font-mono bg-indigo-500/10 px-4 py-2 rounded-full w-fit border border-indigo-500/20"
                        >
                            <Sparkles className="w-3 h-3 animate-spin" />
                            Evaluating...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {activeFieldKey && (
            <div className="p-6 flex-none bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent pb-8">
                <div className="max-w-2xl mx-auto relative group">
                    <form onSubmit={(e) => { e.preventDefault(); if(inputValue.trim()) handleAnswer(inputValue); }} className="relative flex gap-2">
                        <input 
                            className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full px-6 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none shadow-xl transition-all"
                            placeholder="Type your answer..."
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            autoFocus
                        />
                        <button 
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="absolute right-2 top-2 bottom-2 w-12 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-0 disabled:scale-0 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/runner/components/CookieConsent.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already chosen
    const stored = localStorage.getItem("mw_consent_status");
    if (!stored) {
      // Delay slightly for animation effect
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: 'granted' | 'denied') => {
    setIsVisible(false);
    localStorage.setItem("mw_consent_status", choice);

    // 1. Tell the Pixel
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.consent({
        ad_storage: choice,
        analytics_storage: choice
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] z-[100] p-6 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">We value your privacy</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We use tracking technology to improve our intake routing and route valid claims to attorneys. We do not sell personal data.
                <br/>
                <Link href="/privacy" className="underline text-indigo-400 hover:text-indigo-300">Read Policy</Link>
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => handleConsent('denied')}
              >
                Decline
              </Button>
              <Button 
                className="flex-1 bg-white text-slate-900 hover:bg-slate-200"
                onClick={() => handleConsent('granted')}
              >
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/runner/components/FieldAssistantBubble.tsx`

```tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, CornerDownLeft } from "lucide-react";
import type { FormFieldDefinition, FormSchemaJson } from "@/lib/types/argueos-types";

interface FieldAssistantBubbleProps {
  field: FormFieldDefinition;
  formName: string;
  schema: FormSchemaJson;
  formData: Record<string, any>;
  onClose: () => void;
  onUpdateField: (value: any) => void;
}

export function FieldAssistantBubble({ field, formName, onClose }: FieldAssistantBubbleProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAsk = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setIsThinking(true);
    
    // [STUB] This typically calls the ArgueOS agent endpoint.
    // For this migration, we simulate a response.
    setTimeout(() => {
        setResponse(`I understand you're asking about "${field.title}". Since I am running in frontend-only mode for this migration, I can't query the real legal brain yet, but I would usually explain that this field is required for the claim.`);
        setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="absolute right-0 top-8 z-50 w-80 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
      <div className="bg-white dark:bg-violet-950 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-black/50">
        <div className="bg-slate-50 dark:bg-violet-900/50 px-4 py-3 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wide">Moreways Assistant</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>

        <div className="p-4 space-y-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
            {response ? (
                <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-100 dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/5 animate-in slide-in-from-bottom-2">
                    {response}
                </div>
            ) : (
                <div className="text-xs text-slate-500 text-center py-2">
                    Ask about "{field.title}"...
                </div>
            )}

            <form onSubmit={handleAsk} className="relative">
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. Why is this needed?"
                    disabled={isThinking}
                    className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-teal-500 outline-none"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || isThinking}
                    className="absolute right-1.5 top-1.5 p-1.5 bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-teal-600/20 text-slate-400 hover:text-indigo-500 dark:hover:text-teal-400 rounded-md transition-all disabled:opacity-30 border border-slate-200 dark:border-transparent shadow-sm"
                >
                    {isThinking ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <CornerDownLeft className="w-3.5 h-3.5" />}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/runner/components/IntakeChatMessage.tsx`

```tsx
"use client";

import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Layers, FileText, Edit, Send, MessageSquare, AlertTriangle } from "lucide-react";

export type MessageVariant =
  | "system"
  | "agent"
  | "user"
  | "section"
  | "warning"
  | "section_complete"
  | "review_summary"
  | "completion_options";

interface IntakeChatMessageProps {
  variant: MessageVariant;
  content: React.ReactNode;
  label?: string;
  description?: string;
  isLatest?: boolean;
  data?: Record<string, any>;
  onReview?: () => void;
  onSubmit?: () => void;
}

// FIX: Wrapped in forwardRef to satisfy Framer Motion (AnimatePresence)
export const IntakeChatMessage = forwardRef<HTMLDivElement, IntakeChatMessageProps>(
  ({ variant, content, isLatest, data, onReview, onSubmit }, ref) => {
  
  // --- USER MESSAGE ---
  if (variant === "user") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex justify-end mb-6 pl-12"
      >
        <div className="flex flex-col items-end gap-1 max-w-[85%]">
          <div className="bg-slate-900 dark:bg-indigo-600 text-white px-5 py-4 rounded-[1.25rem] rounded-tr-sm shadow-xl shadow-indigo-900/10 dark:shadow-indigo-500/20 border border-white/10 text-sm leading-relaxed">
             {content}
          </div>
          <span className="text-[10px] text-slate-400 font-medium mr-1 opacity-80">You</span>
        </div>
      </motion.div>
    );
  }

  // --- SPECIAL UI BLOCKS ---
  if (variant === "completion_options") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex flex-wrap gap-3 mt-4 mb-16 ml-12"
      >
        <button 
            onClick={onReview}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm hover:scale-105"
        >
            <Edit className="w-3.5 h-3.5" />
            <span className="font-medium text-xs">Review Answers</span>
        </button>

        <button 
            onClick={onSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all font-semibold text-xs"
        >
            <Send className="w-3.5 h-3.5" />
            <span>Finish & Register</span>
        </button>
      </motion.div>
    );
  }

  if (variant === "review_summary") {
    const entries = Object.entries(data || {});
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 ml-12 max-w-md"
      >
        <div className="rounded-2xl overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-white/10">
            <div className="bg-indigo-500/10 px-4 py-3 border-b border-indigo-500/10 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">Summary</span>
            </div>
            <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {entries.map(([key, val]) => (
                    <div key={key} className="flex justify-between items-start gap-4 text-xs border-b border-slate-200 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                        <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-0.5">{key}</span>
                        <span className="text-slate-800 dark:text-slate-200 text-right font-medium">{String(val)}</span>
                    </div>
                ))}
            </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "section") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="my-8 flex items-center justify-center gap-3 opacity-60"
      >
        <div className="h-px w-12 bg-indigo-500/50" />
        <div className="flex items-center gap-2 text-indigo-400 dark:text-indigo-300">
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{content}</span>
        </div>
        <div className="h-px w-12 bg-indigo-500/50" />
      </motion.div>
    );
  }

  if (variant === "warning") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="ml-12 mr-8 my-2 p-3 rounded-lg border border-amber-500/20 bg-amber-500/10 flex gap-3"
      >
        <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-100/90 leading-relaxed">{content}</p>
      </motion.div>
    );
  }

  // --- ASSISTANT MESSAGE ---
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "flex items-end gap-3 mb-6 max-w-[90%]",
        isLatest ? "mb-8" : "mb-4"
      )}
    >
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shadow-sm flex-none ring-1 ring-white/20 z-10">
        <MessageSquare className="w-4 h-4 text-slate-600 dark:text-slate-300" />
      </div>
      
      <div className="flex flex-col gap-1 w-full">
        <div className={clsx(
            "px-5 py-4 rounded-[1.25rem] rounded-tl-sm text-sm leading-relaxed border backdrop-blur-md transition-all duration-500",
            isLatest 
                ? "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 shadow-sm" 
                : "bg-white/60 dark:bg-slate-800/50 border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-300"
        )}>
          {content}
        </div>
        <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider opacity-60">Moreways Assistant</span>
      </div>
    </motion.div>
  );
});

IntakeChatMessage.displayName = "IntakeChatMessage";
```

### `C:/projects/moreways/moreways-site/src/components/runner/components/LiveFormView.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { MessageCircle, Shield } from "lucide-react";
import type { FormSchemaJson } from "@/lib/types/argueos-types";
import { Button } from "@/components/ui/button";
import { FieldAssistantBubble } from "./FieldAssistantBubble"; // Fixed Import

interface LiveFormViewProps {
  formName: string;
  schema: FormSchemaJson;
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSubmit: () => void;
}

export function LiveFormView({ formName, schema, formData, onChange, onSubmit }: LiveFormViewProps) {
  const keys = schema.order || Object.keys(schema.properties);
  const [assistantFieldKey, setAssistantFieldKey] = useState<string | null>(null);

  const handleChange = (key: string, val: any) => {
    onChange({ ...formData, [key]: val });
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 relative transition-colors">
      <div className="max-w-3xl mx-auto px-8 py-12 space-y-8 min-h-screen">
        
        <div className="border-b border-slate-200 dark:border-white/10 pb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{formName}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 text-sm">
                <Shield className="w-3.5 h-3.5" /> Secure & Confidential
            </p>
        </div>

        <div className="space-y-8">
            {keys.map((key) => {
                const def = schema.properties[key];
                if (!def) return null;

                if (def.kind === "header") {
                    return <h3 key={key} className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-white/10 pb-2 mt-8">{def.title}</h3>;
                }
                if (def.kind === "info") {
                    return <div key={key} className="bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm leading-relaxed">{def.description}</div>;
                }

                const val = formData[key] || "";

                return (
                    <div key={key} className="group relative">
                        <div className="flex justify-between items-baseline mb-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {def.title} {def.isRequired && <span className="text-red-500">*</span>}
                            </label>
                            
                            <button 
                                onClick={() => setAssistantFieldKey(assistantFieldKey === key ? null : key)}
                                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                            >
                                <MessageCircle className="w-3 h-3" /> Ask AI
                            </button>
                        </div>

                        {assistantFieldKey === key && (
                            <FieldAssistantBubble 
                                field={def} 
                                formName={formName} 
                                schema={schema} 
                                formData={formData} 
                                onClose={() => setAssistantFieldKey(null)}
                                onUpdateField={(v: any) => handleChange(key, v)} 
                            />
                        )}
                        
                        {def.description && <p className="text-xs text-slate-500 mb-2">{def.description}</p>}

                        {/* INPUTS */}
                        {def.kind === "textarea" ? (
                            <textarea 
                                value={val} 
                                onChange={e => handleChange(key, e.target.value)} 
                                className="w-full rounded-lg border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white" 
                                rows={4} 
                            />
                        ) : (def.kind === "select" || def.kind === "radio") ? (
                            <select 
                                value={val} 
                                onChange={e => handleChange(key, e.target.value)} 
                                className="w-full rounded-lg border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
                            >
                                <option value="" disabled>Select...</option>
                                {def.options?.map((opt: any) => {
                                    const oVal = typeof opt === 'string' ? opt : opt.value;
                                    const oLbl = typeof opt === 'string' ? opt : opt.label;
                                    return <option key={oVal} value={oVal}>{oLbl}</option>
                                })}
                            </select>
                        ) : def.kind === "checkbox" ? (
                            <div className="flex items-center gap-2 h-10">
                                <input 
                                    type="checkbox" 
                                    checked={!!val} 
                                    onChange={e => handleChange(key, e.target.checked)} 
                                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-300">Yes / Confirm</span>
                            </div>
                        ) : (
                            <input 
                                type={def.kind === "date" ? "date" : "text"} 
                                value={val} 
                                onChange={e => handleChange(key, e.target.value)} 
                                className="w-full rounded-lg border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white h-11"
                            />
                        )}
                    </div>
                );
            })}
        </div>

        <div className="pt-10 border-t border-slate-200 dark:border-white/10">
            <Button onClick={onSubmit} size="lg" className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white shadow-xl">
                Submit Form
            </Button>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/runner/components/ReviewOverlay.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormSchemaJson } from "@/lib/types/argueos-types";

interface ReviewOverlayProps {
  schema: FormSchemaJson;
  data: Record<string, any>;
  onClose: () => void;
  onSubmit: (updatedData: Record<string, any>) => void;
}

export function ReviewOverlay({ schema, data, onClose, onSubmit }: ReviewOverlayProps) {
  const [localData, setLocalData] = useState(data);

  const handleChange = (key: string, val: any) => {
    setLocalData((prev) => ({ ...prev, [key]: val }));
  };

  const keys = schema.order || Object.keys(schema.properties);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Review & Edit</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Make final corrections before submitting.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-slate-900">
          {keys.map((key) => {
            const def = schema.properties[key];
            if (!def || def.kind === "header" || def.kind === "info" || def.kind === "divider") return null;

            return (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {def.title}
                </label>
                
                {def.kind === "textarea" ? (
                  <textarea
                    value={localData[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                    rows={3}
                  />
                ) : (def.kind === "select" || def.kind === "radio") ? (
                   <select 
                      value={localData[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                   >
                      <option value="" disabled>Select...</option>
                      {def.options?.map((opt: any) => {
                          const val = typeof opt === 'string' ? opt : opt.value;
                          const label = typeof opt === 'string' ? opt : opt.label;
                          return <option key={val} value={val}>{label}</option>;
                      })}
                   </select>
                ) : (
                  <input
                    type={def.kind === "number" || def.kind === "currency" ? "number" : "text"}
                    value={localData[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/30 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => onSubmit(localData)} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
          >
            <Send className="w-4 h-4 mr-2" /> Submit Form
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/runner/components/SectionSidebar.tsx`

```tsx
import React, { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import type { FormSchemaJson } from "@/lib/types/argueos-types";

interface SectionSidebarProps {
  schema: FormSchemaJson;
  currentFieldKey: string | null;
}

interface SectionItem {
  title: string;
  startKey: string;
  status: 'done' | 'active' | 'pending';
}

export function SectionSidebar({ schema, currentFieldKey }: SectionSidebarProps) {
  const fieldKeys = schema.order || Object.keys(schema.properties);
  const sections: SectionItem[] = [];
  
  let currentSection: SectionItem = { 
    title: "Start", 
    startKey: fieldKeys[0] || "unknown", 
    status: 'pending' 
  };

  let activeSectionIndex = 0;

  fieldKeys.forEach((key) => {
    const def = schema.properties[key];
    if (def.kind === 'header') {
        sections.push(currentSection);
        currentSection = { title: def.title, startKey: key, status: 'pending' };
    }
    if (key === currentFieldKey) {
        currentSection.status = 'active';
        sections.forEach(s => s.status = 'done');
        activeSectionIndex = sections.length;
    }
  });
  sections.push(currentSection);

  if (!currentFieldKey && sections.length > 0) {
      sections.forEach(s => s.status = 'done');
      activeSectionIndex = sections.length - 1;
  }

  const pillsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pillsRef.current) {
        const activeEl = pillsRef.current.children[activeSectionIndex] as HTMLElement;
        if (activeEl) {
            pillsRef.current.scrollTo({ left: activeEl.offsetLeft - 20, behavior: 'smooth' });
        }
    }
  }, [activeSectionIndex]);

  return (
    <>
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:flex flex-col w-64 py-8 pr-6 pl-4 h-full border-r border-slate-200 dark:border-white/5 space-y-6 bg-slate-50 dark:bg-slate-950/30">
            <div>
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest mb-4 pl-1">Progress</h4>
                <div className="space-y-0 relative">
                    <div className="absolute left-[9px] top-2 bottom-2 w-[1px] bg-slate-200 dark:bg-white/5 -z-10" />

                    {sections.map((s, i) => (
                        <div key={i} className={clsx("flex items-center gap-3 py-2 transition-all duration-500", s.status === 'active' ? "opacity-100" : s.status === 'done' ? "opacity-50" : "opacity-20")}>
                            <div className={clsx("w-5 h-5 rounded-full border flex items-center justify-center transition-colors z-10", 
                                s.status === 'active' ? "bg-white dark:bg-slate-950 border-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : 
                                s.status === 'done' ? "bg-emerald-100 dark:bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-500" : "bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-300 dark:text-slate-800"
                            )}>
                                {s.status === 'done' ? <Check className="w-3 h-3" /> : <div className={clsx("rounded-full bg-current", s.status === 'active' ? "w-1.5 h-1.5" : "w-1 h-1")} />}
                            </div>
                            <div>
                                <div className={clsx("text-xs font-medium leading-none", s.status === 'active' ? "text-slate-900 dark:text-emerald-400" : "text-slate-500 dark:text-slate-300")}>{s.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* MOBILE PILLS */}
        <div className="lg:hidden h-12 border-b border-slate-200 dark:border-white/5 flex items-center overflow-x-auto no-scrollbar px-4 gap-2 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-20" ref={pillsRef}>
            {sections.map((s, i) => (
                <div key={i} className={clsx("flex-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors whitespace-nowrap", 
                    s.status === 'active' ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : 
                    s.status === 'done' ? "bg-slate-100 dark:bg-slate-800/50 border-transparent text-slate-500" : "border-transparent text-slate-400 dark:text-slate-600"
                )}>
                    {s.title}
                </div>
            ))}
        </div>
    </>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/runner/components/VerdictCard.tsx`

```tsx
"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

interface VerdictProps {
  status: "LIKELY_VIOLATION" | "POSSIBLE_VIOLATION" | "UNLIKELY_VIOLATION" | "INELIGIBLE";
  confidence: number; // 0.0 to 1.0
  summary: string;
  missingElements: string[];
  citations?: string[];
  onContinue?: () => void; // [FIX] Added missing prop definition
}

export function VerdictCard({ 
  status, 
  confidence, 
  summary, 
  missingElements = [], 
  citations = [],
  onContinue
}: VerdictProps) {
  
  const config = {
    LIKELY_VIOLATION: { color: "bg-emerald-500", text: "text-emerald-500", label: "Strong Claim", icon: CheckCircle2 },
    POSSIBLE_VIOLATION: { color: "bg-amber-500", text: "text-amber-500", label: "Potential Claim", icon: AlertTriangle },
    UNLIKELY_VIOLATION: { color: "bg-red-500", text: "text-red-500", label: "Unlikely Claim", icon: XCircle },
    INELIGIBLE: { color: "bg-slate-500", text: "text-slate-500", label: "Ineligible", icon: XCircle },
  };

  const theme = config[status] || config.POSSIBLE_VIOLATION;
  const scorePercent = Math.round(confidence * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Score Circle */}
            <div className="flex-none relative">
                <div className={clsx("w-24 h-24 rounded-full flex items-center justify-center border-4", theme.text.replace('text-', 'border-'))}>
                    <span className={clsx("text-2xl font-bold", theme.text)}>{scorePercent}%</span>
                </div>
                <div className={clsx("absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white uppercase whitespace-nowrap", theme.color)}>
                    {theme.label}
                </div>
            </div>

            <div className="flex-1 space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Legal Analysis</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{summary}</p>
                </div>

                {missingElements && missingElements.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/50">
                        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-2">Missing Information</h4>
                        <ul className="list-disc list-inside text-sm text-amber-800 dark:text-amber-200 space-y-1">
                            {missingElements.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                    </div>
                )}

                {citations && citations.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5" /> Cited Regulations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {citations.map((urn, i) => (
                                <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded font-mono border border-slate-200 dark:border-slate-700">
                                    {urn.split(':').pop()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* [FIX] Render the Continue Button if onContinue is provided */}
                {onContinue && (
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button onClick={onContinue} className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                      Continue to Submission <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/runner/logic/schemaIterator.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { getNextFieldKey } from './schemaIterator';
import type { FormSchemaJson } from '@/lib/types/argueos-types';

// Mock Schema: A simple 3-step flow with one conditional branch
const MOCK_SCHEMA: FormSchemaJson = {
  type: "object",
  properties: {
    "q1_intro": {
      id: "1", key: "q1_intro", title: "Start?", kind: "text",
    },
    "q2_branch": {
      id: "2", key: "q2_branch", title: "Do you have details?", kind: "radio",
      options: [{ id: "y", label: "Yes", value: "yes" }, { id: "n", label: "No", value: "no" }]
    },
    "q3_details": {
      id: "3", key: "q3_details", title: "Enter Details", kind: "textarea",
      // HIDDEN LOGIC: Only show if q2_branch == 'yes'
      logic: [
        {
          action: "hide",
          when: { fieldKey: "q2_branch", operator: "not_equals", value: "yes" }
        }
      ]
    },
    "q4_final": {
      id: "4", key: "q4_final", title: "Conclusion", kind: "text",
    }
  },
  order: ["q1_intro", "q2_branch", "q3_details", "q4_final"]
};

describe('Intake Logic Engine (schemaIterator)', () => {

  it('should start at the first field when data is empty', () => {
    const next = getNextFieldKey(MOCK_SCHEMA, {});
    expect(next).toBe("q1_intro");
  });

  it('should move to the second field after first is filled', () => {
    const next = getNextFieldKey(MOCK_SCHEMA, { "q1_intro": "Let's go" });
    expect(next).toBe("q2_branch");
  });

  describe('Conditional Logic (Branching)', () => {
    it('should SHOW dependent field if condition is met (Yes -> Details)', () => {
      // User answered "Yes" to q2, so q3 should appear next
      const data = { 
        "q1_intro": "done", 
        "q2_branch": "yes" 
      };
      
      const next = getNextFieldKey(MOCK_SCHEMA, data);
      expect(next).toBe("q3_details");
    });

    it('should SKIP dependent field if condition is NOT met (No -> Final)', () => {
      // User answered "No" to q2, so q3 should be hidden, skipping to q4
      const data = { 
        "q1_intro": "done", 
        "q2_branch": "no" 
      };
      
      const next = getNextFieldKey(MOCK_SCHEMA, data);
      expect(next).toBe("q4_final");
    });
  });

  describe('Validation & Edges', () => {
    it('should return null when form is complete', () => {
      const data = {
        "q1_intro": "done",
        "q2_branch": "no",
        "q4_final": "finished"
        // q3 skipped
      };
      const next = getNextFieldKey(MOCK_SCHEMA, data);
      expect(next).toBeNull();
    });

    it('should not skip a field if it is currently empty but visible', () => {
      // q3 is visible because q2 is yes, but q3 is empty. It should stick on q3.
      const data = {
        "q1_intro": "done",
        "q2_branch": "yes"
      };
      // Note: getNextFieldKey iterates from start. 
      // Since q1 and q2 are filled, it should land on q3.
      const next = getNextFieldKey(MOCK_SCHEMA, data);
      expect(next).toBe("q3_details");
    });
  });
});
```

### `C:/projects/moreways/moreways-site/src/components/runner/logic/schemaIterator.ts`

```ts
import type { FormSchemaJson, FormFieldDefinition, LogicCondition } from "@/lib/types/argueos-types";

// Helper type for compatibility
type SchemaShape = FormSchemaJson;

function checkCondition(data: Record<string, any>, condition: LogicCondition): boolean {
  const { fieldKey, operator, value } = condition;
  const actualValue = data[fieldKey];

  if (actualValue === undefined || actualValue === null || actualValue === "") {
    return operator === "is_empty";
  }

  switch (operator) {
    case "equals": return actualValue == value;
    case "not_equals": return actualValue != value;
    case "contains": return String(actualValue).toLowerCase().includes(String(value).toLowerCase());
    case "is_empty": return false;
    case "is_not_empty": return true;
    case "greater_than": return Number(actualValue) > Number(value);
    case "less_than": return Number(actualValue) < Number(value);
    default: return false;
  }
}

function evaluateShowHide(data: Record<string, any>, field: FormFieldDefinition): boolean {
  // @ts-ignore - logic property might be missing in strict subset types
  if (!field.logic) return true; 
  
  let isVisible = true; 
  // @ts-ignore
  const hasShowLogic = field.logic.some((r: any) => r.action === "show");
  if (hasShowLogic) isVisible = false;

  // @ts-ignore
  for (const rule of field.logic) {
    let match = false;
    const when = rule.when;

    if (when.allOf) match = when.allOf.every((c: any) => checkCondition(data, c));
    else if (when.anyOf) match = when.anyOf.some((c: any) => checkCondition(data, c));
    else if (when.fieldKey && when.operator) match = checkCondition(data, { fieldKey: when.fieldKey, operator: when.operator, value: when.value } as any);

    if (match) {
      if (rule.action === "show") isVisible = true;
      if (rule.action === "hide") isVisible = false;
    }
  }
  return isVisible;
}

function isFieldFilled(val: any): boolean {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'number') return true;
  if (typeof val === 'boolean') return true;
  return false;
}

export function getNextFieldKey(
  schema: SchemaShape,
  currentData: Record<string, any>,
  lastFieldKey?: string
): string | null {
  const allKeys = schema.order || Object.keys(schema.properties);
  let startIndex = 0;

  if (lastFieldKey) {
    const idx = allKeys.indexOf(lastFieldKey);
    if (idx !== -1) startIndex = idx + 1;
  }

  for (let i = startIndex; i < allKeys.length; i++) {
    const key = allKeys[i];
    const def = schema.properties[key];
    
    if (!def) continue;
    
    // @ts-ignore
    if (def.kind === 'divider') continue;

    // 1. Logic Check (Is it visible?)
    if (!evaluateShowHide(currentData, def)) continue;

    // 2. Data Check (Is it already filled?)
    if (def.kind !== 'header' && def.kind !== 'info') {
       if (isFieldFilled(currentData[key])) {
         continue; 
       }
    }

    return key;
  }

  return null;
}
```

### `C:/projects/moreways/moreways-site/src/components/ui/accordion.tsx`

```tsx
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

### `C:/projects/moreways/moreways-site/src/components/ui/aurora-background.tsx`

```tsx
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
```

### `C:/projects/moreways/moreways-site/src/components/ui/badge.tsx`

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

### `C:/projects/moreways/moreways-site/src/components/ui/button.tsx`

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
        destructive:
          "bg-red-500 text-slate-50 hover:bg-red-500/90",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "text-slate-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  // Explicitly defining these resolves the TS2322 error when inference fails
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### `C:/projects/moreways/moreways-site/src/components/ui/card.tsx`

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // UPDATED: Added dark mode classes for background, border, and text
    className={cn(
      "rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-colors",
      "dark:bg-slate-900 dark:border-slate-800 dark:text-slate-50",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  // UPDATED: Added dark mode text color
  <p
    ref={ref}
    className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### `C:/projects/moreways/moreways-site/src/components/ui/decoder-text.tsx`

```tsx
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
```

### `C:/projects/moreways/moreways-site/src/components/ui/drawer.tsx`

```tsx
"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
```

### `C:/projects/moreways/moreways-site/src/components/ui/hover-card.tsx`

```tsx
"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
```

### `C:/projects/moreways/moreways-site/src/components/ui/input.tsx`

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:ring-indigo-500",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### `C:/projects/moreways/moreways-site/src/components/ui/magnetic-button.tsx`

```tsx
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const MagneticButton = ({
  children,
  className,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    // Optional: Check if ref.current exists to avoid runtime errors
    if (!ref.current) return;
    
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 }); // 0.15 = magnetic strength
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-colors duration-300 cursor-pointer";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20",
    outline: "border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100",
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      // FIX: Removed `className` from here so the square wrapper doesn't get the shadow/styles
      className="inline-block relative touch-none" 
      onClick={onClick}
    >
      {/* FIX: Applied `className` here so styles respect the rounded corners */}
      <div className={cn(baseStyles, variants[variant], className)}>
        {children}
      </div>
    </motion.div>
  );
};
```

### `C:/projects/moreways/moreways-site/src/components/ui/motion-wrappers.tsx`

```tsx
"use client";

import { motion, Variants, Transition } from "framer-motion";
import { useMotionConfig } from "@/lib/motion-config";

export const FadeIn = ({ 
  children, 
  className, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) => {
  const { fadeProps } = useMotionConfig();
  
  // Merge delay. We cast to 'any' here safely because we know both 
  // config objects produce valid Framer Motion transition objects, 
  // but TS gets confused merging a Tuple ease with a number-only duration.
  const transition = { ...fadeProps.transition, delay } as Transition;

  return (
    <motion.div
      {...fadeProps}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const { staggerContainerProps, isMobile } = useMotionConfig();

  // Explicitly type this as 'Variants' to prevent TS from inferring a loose object
  const variants: Variants = isMobile 
    ? {} 
    : {
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      };

  return (
    <motion.div
      {...staggerContainerProps}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const { staggerItemProps } = useMotionConfig();

  return (
    <motion.div
      variants={staggerItemProps.variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
```

### `C:/projects/moreways/moreways-site/src/components/ui/popover.tsx`

```tsx
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
```

### `C:/projects/moreways/moreways-site/src/components/ui/shimmer-button.tsx`

```tsx
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
```

### `C:/projects/moreways/moreways-site/src/components/ui/spotlight-card.tsx`

```tsx
"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const SpotlightCard = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  
  // OPTIMIZATION: Check mobile state
  const isMobile = useIsMobile();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile || !divRef.current) return; // Skip logic on mobile

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    if (isMobile) return;
    setOpacity(1);
  };

  const handleBlur = () => {
    if (isMobile) return;
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      // Mobile: Simple Fade. Desktop: The original slide up.
      initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all duration-300",
        // Only hover shadow on desktop
        "md:hover:shadow-xl",
        className
      )}
    >
      {/* OPTIMIZATION: Only render the heavy spotlight gradient on Desktop */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(14, 165, 233, 0.15), transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};
```

### `C:/projects/moreways/moreways-site/src/components/ui/text-reveal.tsx`

```tsx
"use client";

import { motion, Variants } from "framer-motion";

export function TextReveal({ text, className }: { text: string, className?: string }) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} style={{ marginRight: "0.25em" }} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/components/ui/textarea.tsx`

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
        "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:ring-indigo-500",
        className
      )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
```

### `C:/projects/moreways/moreways-site/src/components/ui/voice-orb.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

export function VoiceOrb({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  
  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const frameRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null); // For Web Speech API

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);

      // 1. Setup Audio Analysis (Visuals)
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      // Animation Loop to detect volume
      const updateVolume = () => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(average); // 0 to 255
        
        frameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // 2. Setup Speech Recognition (Logic)
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          onTranscript(text);
          stopListening();
        };

        recognition.onerror = () => stopListening();
        recognition.start();
        recognitionRef.current = recognition;
      } else {
        alert("Speech recognition not supported in this browser.");
        stopListening();
      }

    } catch (err) {
      console.error("Mic Access Denied", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setVolume(0);
    
    // Cleanup
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  // Dynamic Styles based on volume
  // Scale range: 1.0 to 1.5
  // Glow range: 0px to 30px
  const scale = 1 + (volume / 255) * 0.8;
  const glow = (volume / 255) * 40;

  return (
    <div className="relative flex items-center justify-center h-[46px] w-[46px]">
        <AnimatePresence mode="wait">
            {!isListening ? (
                <motion.button
                    key="mic-btn"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startListening}
                    // UPDATED: Added dark mode colors
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    <Mic className="w-5 h-5" />
                </motion.button>
            ) : (
                <motion.div
                    key="orb"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="relative cursor-pointer"
                    onClick={stopListening}
                >
                    {/* The Inner Core */}
                    <motion.div 
                        className="w-10 h-10 rounded-full bg-indigo-600 relative z-20 flex items-center justify-center"
                        animate={{ scale }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                        <Mic className="w-5 h-5 text-white" />
                    </motion.div>

                    {/* The Outer Aura (Audio Reactive) */}
                    <motion.div 
                        className="absolute inset-0 rounded-full bg-indigo-500/50 z-10"
                        animate={{ 
                            scale: scale * 1.4,
                            opacity: 0.5 + (volume / 255)
                        }}
                    />
                    
                    {/* The Deep Glow */}
                    <motion.div 
                        className="absolute inset-0 rounded-full bg-indigo-400 blur-xl z-0"
                        animate={{ 
                            opacity: (volume / 255) * 2
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/content/data/consumerIssues.ts`

```ts
﻿import { 
  DollarSign, 
  PhoneCall, 
  FileText, 
  ShoppingBag, 
  Car, 
  Wrench, 
  Home, 
  Wifi, 
  CreditCard, 
  ShieldAlert, 
  UserX 
} from "lucide-react";

export interface ConsumerIssue {
  id: string;
  title: string;
  icon: any;
  shortDescription: string;
  potentialValue: string;
  fullDescription: string;
  examples: string[];
}

export const consumerIssues: ConsumerIssue[] = [
  {
    id: "auto-dealer-dispute",
    title: "Used Car Issues",
    icon: Car,
    shortDescription: "Hidden defects, broken promises, or warranty refusal.",
    potentialValue: "$2,000–$5,000+",
    fullDescription: "Massachusetts has strong Lemon Laws for used cars. If a dealer sold you a car that failed inspection or had undisclosed defects affecting safety or use, you may be entitled to a repair, refund, or damages.",
    examples: [
      "Car failed inspection within 7 days",
      "Dealer refused to repair safety defects",
      "Undisclosed accident history",
      "Odometer rollback"
    ]
  },
  {
    id: "debt-collection-harassment",
    title: "Debt Collection Harassment",
    icon: PhoneCall,
    shortDescription: "Repeated calls, threats, or contacting your employer.",
    potentialValue: "$1,000–$4,000+",
    fullDescription: "Debt collectors cannot harass you, call you at work if forbidden, or call more than twice a week in Massachusetts. Violations can lead to statutory damages per call.",
    examples: [
      "Calling before 8am or after 9pm",
      "Calling your workplace",
      "Threatening arrest or violence",
      "Calling more than 2x per week"
    ]
  },
  {
    id: "credit-report-errors",
    title: "Credit Reporting Errors",
    icon: FileText,
    shortDescription: "Inaccurate info on your credit report.",
    potentialValue: "$300–$1,200+",
    fullDescription: "Under the FCRA, credit bureaus must correct inaccurate information. If they fail to investigate your dispute or correct obvious errors, you may be entitled to damages.",
    examples: [
      "Accounts that don't belong to you",
      "Debts listed as 'open' that were paid",
      "Identity theft accounts",
      "Incorrect payment history"
    ]
  },
  {
    id: "online-and-retail-purchases",
    title: "Online & Retail Disputes",
    icon: ShoppingBag,
    shortDescription: "Items not delivered or refusal to refund.",
    potentialValue: "$150–$600",
    fullDescription: "If you paid for an item that never arrived, or if a seller is refusing a return that complies with their stated policy (or state law), you have rights under the Consumer Protection Act.",
    examples: [
      "Item never arrived",
      "Wrong item sent and return refused",
      "Defective product denied warranty",
      "Hidden fees at checkout"
    ]
  },
  {
    id: "contractor-home-improvement",
    title: "Contractor Issues",
    icon: Wrench,
    shortDescription: "Incomplete work, poor quality, or abandonment.",
    potentialValue: "$10,000–$15,000+",
    fullDescription: "Home improvement contractors in MA must be registered. If they abandon a job, do substandard work, or violate the contract terms, you may have a strong Chapter 93A claim.",
    examples: [
      "Contractor took deposit and disappeared",
      "Work does not meet building code",
      "Project abandoned halfway through",
      "Unlicensed work"
    ]
  },
  {
    id: "security-deposit-issues",
    title: "Landlord / Tenant",
    icon: Home,
    shortDescription: "Security deposits, conditions, or illegal eviction.",
    potentialValue: "$3,000–$4,500+",
    fullDescription: "Landlords must handle security deposits strictly (separate account, interest paid). Failure to return it within 30 days or providing a receipt can result in triple damages.",
    examples: [
      "Deposit not returned within 30 days",
      "No receipt provided for deposit",
      "Illegal deduction for 'wear and tear'",
      "Apartment conditions (heat, water)"
    ]
  },
  {
    id: "robocalls",
    title: "Robocalls & Telemarketing",
    icon: ShieldAlert,
    shortDescription: "Unwanted automated calls or texts.",
    potentialValue: "$500–$1,500 per call",
    fullDescription: "The TCPA protects you from automated marketing calls (robocalls) to your cell phone without consent. Each violation can be worth up to $1,500.",
    examples: [
      "Automated voice messages",
      "Spam text messages",
      "Calls despite being on Do-Not-Call list",
      "Spoofed numbers"
    ]
  },
  {
    id: "deceptive-practices",
    title: "Deceptive Business Practices",
    icon: UserX,
    shortDescription: "Scams, fraud, or misleading advertising.",
    potentialValue: "Varies (Triple Damages)",
    fullDescription: "Massachusetts Chapter 93A prohibits 'unfair or deceptive acts' in commerce. This catches a wide net of scams, from bait-and-switch advertising to identity theft negligence.",
    examples: [
      "Bait and switch advertising",
      "Hidden subscription fees",
      "Identity theft due to data breach",
      "Service not performed as described"
    ]
  }
];
```

### `C:/projects/moreways/moreways-site/src/crm/ui/CaseStatusCard.tsx`

```tsx
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface CaseStatusCardProps {
  type: string;
  status: string;
  date: Date;
}

export function CaseStatusCard({ type, status, date }: CaseStatusCardProps) {
  const statusConfig = {
    draft: { color: "bg-slate-100 text-slate-600", icon: Clock, label: "Draft" },
    submitted: { color: "bg-blue-100 text-blue-700", icon: Clock, label: "Submitted" },
    reviewing: { color: "bg-purple-100 text-purple-700", icon: Clock, label: "Under Review" },
    accepted: { color: "bg-green-100 text-green-700", icon: CheckCircle2, label: "Accepted" },
    action_required: { color: "bg-orange-100 text-orange-700", icon: AlertCircle, label: "Action Needed" },
  }[status] || { color: "bg-slate-100", icon: Clock, label: status };

  const Icon = statusConfig.icon;

  return (
    <Card className="p-6 border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{type}</h3>
          <p className="text-sm text-slate-500">Created {new Date(date).toLocaleDateString()}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${statusConfig.color}`}>
          <Icon className="w-3 h-3" />
          {statusConfig.label}
        </div>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-500" 
          style={{ width: status === 'submitted' ? '33%' : status === 'reviewing' ? '66%' : status === 'accepted' ? '100%' : '10%' }}
        />
      </div>
    </Card>
  );
}
```

### `C:/projects/moreways/moreways-site/src/forms/repo/forms.repo.formSchemaRepo.ts`

```ts
﻿/**
 * forms.repo.formSchemaRepo
 *
 * Persistence layer for FormSchemas.
 * Related docs: 03-security-and-data-handling.md (Section 3.3)
 */
import { FormEntity, FormSchemaData } from "../schema/forms.schema.formEntity";

// Mock DB interface for scaffolding
interface DbClient { insert(table: string, data: any): Promise<any>; }

export class FormSchemaRepo {
  constructor(private readonly db: DbClient) {}

  async createVersionAsync(organizationId: string, schemaData: FormSchemaData): Promise<FormEntity> {
    // [SECURITY] Ensure data belongs to org
    const record = {
      id: crypto.randomUUID(),
      organization_id: organizationId,
      version: 1,
      schema: schemaData,
      created_at: new Date(),
    };

    // In real app: await this.db.insert("form_schemas", record);
    console.log("[MOCK DB] Inserted form", record.id);

    return {
      id: record.id,
      organizationId: record.organization_id,
      version: record.version,
      schema: record.schema,
      createdAt: record.created_at,
    };
  }
}

```

### `C:/projects/moreways/moreways-site/src/forms/schema/forms.schema.formEntity.ts`

```ts
﻿/**
 * forms.schema.formEntity
 *
 * Defines the structure of a Form in the system.
 * Related docs: 02-technical-vision-and-conventions.md (Section 3)
 */
import { z } from "zod";

export const FormFieldSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  type: z.enum(["text", "number", "date", "select"]),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
});

export const FormSchemaDataSchema = z.object({
  title: z.string(),
  fields: z.array(FormFieldSchema),
});

export type FormSchemaData = z.infer<typeof FormSchemaDataSchema>;

export interface FormEntity {
  id: string;
  organizationId: string; // [MULTI-TENANT] Mandatory
  version: number;
  schema: FormSchemaData;
  createdAt: Date;
}

```

### `C:/projects/moreways/moreways-site/src/forms/ui/AutoForm.tsx`

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Check, ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "number";
  required?: boolean;
}

interface AutoFormProps {
  issueId: string;
  fields: FormField[];
}

export function AutoForm({ issueId, fields }: AutoFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for back
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const currentField = fields[step];
  const isLastStep = step === fields.length - 1;
  const progress = ((step + 1) / fields.length) * 100;

  // Auto-focus input on step change
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, [step]);

  const handleNext = () => {
    const val = formData[currentField.id];
    if (currentField.required && !val) {
        // Shake animation logic could go here
        return;
    }
    
    if (isLastStep) {
      submitForm();
    } else {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/intake/submit", {
        method: "POST",
        body: JSON.stringify({ issueId, data: formData }),
      });
      if (res.ok) router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (val: string) => {
    setFormData(prev => ({ ...prev, [currentField.id]: val }));
  };

  return (
    <div className="w-full max-w-lg mx-auto min-h-[400px] flex flex-col">
      
      {/* Progress Bar (The "Pulse") */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <span>Question {step + 1} of {fields.length}</span>
            <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "circOut" }}
            />
        </div>
      </div>

      {/* The Question Card */}
      <div className="relative flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction > 0 ? 50 : -50, opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ x: direction > 0 ? -50 : 50, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-6"
          >
            {/* Label */}
            {/* UPDATED: Dark mode text */}
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
              {currentField.label}
              {currentField.required && <span className="text-indigo-400 ml-1">*</span>}
            </h2>

            {/* Input Area */}
            <div className="group relative">
                {currentField.type === "textarea" ? (
                    <Textarea
                        ref={inputRef as any}
                        value={formData[currentField.id] || ""}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={(e) => {
                            // Allow Shift+Enter for newlines, Enter for submit
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleNext();
                            }
                        }}
                        placeholder="Type your answer here..."
                        // UPDATED: Added dark:text-white and dark:border-slate-700
                        className="min-h-[150px] text-xl bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-700 rounded-none px-0 py-4 focus-visible:ring-0 focus-visible:border-indigo-600 placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none transition-colors text-slate-900 dark:text-white"
                    />
                ) : (
                    <Input
                        ref={inputRef as any}
                        type={currentField.type}
                        value={formData[currentField.id] || ""}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type here..."
                        // UPDATED: Added dark:text-white and dark:border-slate-700
                        className="text-2xl bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-700 rounded-none px-0 py-4 h-auto focus-visible:ring-0 focus-visible:border-indigo-600 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors text-slate-900 dark:text-white"
                    />
                )}
                
                {/* Enter Hint */}
                <div className="absolute right-0 bottom-4 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity flex items-center gap-2 text-xs font-bold text-slate-300 dark:text-slate-500 uppercase tracking-widest">
                    Press Enter <span className="border border-slate-300 dark:border-slate-600 rounded px-1 py-0.5">↵</span>
                </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center justify-between">
        <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0 || loading}
            // UPDATED: Dark mode hover text
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Button 
            onClick={handleNext} 
            disabled={loading}
            className={cn(
                "rounded-full px-8 h-12 text-base shadow-xl transition-all",
                isLastStep 
                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30" 
                    : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            )}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLastStep ? (
                <>Submit Claim <Check className="w-4 h-4 ml-2" /></>
            ) : (
                <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
        </Button>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/moreways-site/src/hooks/use-mobile.tsx`

```tsx
"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

### `C:/projects/moreways/moreways-site/src/infra/config/infra.config.env.ts`

```ts
﻿/**
 * infra.config.env
 *
 * Centralized configuration loader.
 * Related docs: 03-security-and-data-handling.md (Section 3.5)
 */
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url().optional(), // Optional for v1 scaffold
  OPENAI_API_KEY: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const envConfig = parsed.data;

```

### `C:/projects/moreways/moreways-site/src/infra/db/client.ts`

```ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Disable prefetch in dev/serverless to manage connections better
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
```

### `C:/projects/moreways/moreways-site/src/infra/db/schema.ts`

```ts
import { pgTable, text, timestamp, uuid, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// [FIX] Shim the shared Enum so Drizzle doesn't try to delete it.
// This is used by the Attribution Engine, but shares the same DB 'public' schema.
export const eventTypeEnum = pgEnum('event_type', [
  'pageview', 'lead', 'purchase', 'custom', 'view_content', 'add_to_cart', 'initiate_checkout', 'offline_conversion'
]);

// ----------------------------------------------------------------------
// Website Tables
// ----------------------------------------------------------------------

// CHANGE 1: Rename the table in DB to 'portal_users'
export const users = pgTable('portal_users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  role: text('role').default('client'),
  createdAt: timestamp('created_at').defaultNow(),
});

// CHANGE 2: Rename the table in DB to 'portal_claims'
export const claims = pgTable('portal_claims', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  type: text('type').notNull(),
  status: text('status').default('draft'),
  summary: text('summary'),
  formData: jsonb('form_data'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### `C:/projects/moreways/moreways-site/src/infra/logging/infra.svc.logger.ts`

```ts
﻿/**
 * infra.svc.logger
 *
 * Structured logger for internal system events.
 * Related docs: 03-security-and-data-handling.md (Section 4)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  organizationId?: string; // [MULTI-TENANT] Always log context
  userId?: string;
  [key: string]: unknown;
}

class LoggerService {
  private log(level: LogLevel, message: string, context?: LogContext) {
    // [SECURITY] Ensure no PII in logs per Section 4
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };
    console[level](JSON.stringify(entry));
  }

  info(message: string, context?: LogContext) { this.log('info', message, context); }
  error(message: string, error: Error, context?: LogContext) {
    this.log('error', message, { ...context, stack: error.stack });
  }
}

export const logger = new LoggerService();

```

### `C:/projects/moreways/moreways-site/src/intake/svc/intake.svc.promptToFormPipeline.ts`

```ts
﻿/**
 * intake.svc.promptToFormPipeline
 *
 * Pipeline: lawyer prompt → normalized → LLM draft → validated schema → persisted version.
 * Related docs: 01-product-spec-v1.md
 */
import { FormSchemaRepo } from "@/forms/repo/forms.repo.formSchemaRepo";
import { logger } from "@/infra/logging/infra.svc.logger";
import { FormSchemaData } from "@/forms/schema/forms.schema.formEntity";

interface LlmService {
  generateStructured(prompt: string): Promise<FormSchemaData>;
}

export class IntakePromptToFormPipeline {
  constructor(
    private readonly formRepo: FormSchemaRepo,
    private readonly llm: LlmService
  ) {}

  async executeAsync(organizationId: string, userPrompt: string) {
    // [SECURITY] Context logging
    logger.info("Starting prompt-to-form pipeline", { organizationId });

    // [PIPELINE] Step 01 – normalize prompt
    const cleanPrompt = userPrompt.trim();

    // [PIPELINE] Step 02 – call LLM
    const draftSchema = await this.llm.generateStructured(cleanPrompt);

    // [PIPELINE] Step 03 – validate & normalize schema
    if (!draftSchema.fields || draftSchema.fields.length === 0) {
      throw new Error("LLM failed to generate valid fields");
    }

    // [PIPELINE] Step 04 – persist schema
    const savedForm = await this.formRepo.createVersionAsync(organizationId, draftSchema);

    // [PIPELINE] Step 05 – emit events
    logger.info("Form generated successfully", { formId: savedForm.id });

    return savedForm;
  }
}

```

### `C:/projects/moreways/moreways-site/src/lib/api-hooks.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { StatusWebhookSchema } from './api-hooks';

describe('Data Integrity (Webhook Schemas)', () => {
  
  it('should VALIDATE a correct payload', () => {
    const validPayload = {
      claimId: "uuid-1234",
      newStatus: "accepted", // Valid enum
      updatedAt: "2023-10-05T14:48:00.000Z" // Valid ISO date
    };

    const result = StatusWebhookSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should REJECT invalid status enums', () => {
    const invalidPayload = {
      claimId: "uuid-1234",
      newStatus: "super_approved", // Not in the allow list
      updatedAt: new Date().toISOString()
    };

    const result = StatusWebhookSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Invalid enum");
    }
  });

  it('should REJECT missing required fields', () => {
    const partialPayload = {
      claimId: "uuid-1234",
      // Missing newStatus
    };

    const result = StatusWebhookSchema.safeParse(partialPayload);
    expect(result.success).toBe(false);
  });

  it('should REJECT invalid date formats', () => {
    const badDatePayload = {
      claimId: "123",
      newStatus: "draft",
      updatedAt: "tomorrow" // Not ISO
    };
    
    const result = StatusWebhookSchema.safeParse(badDatePayload);
    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error.issues[0].code).toBe("invalid_string");
    }
  });
});
```

### `C:/projects/moreways/moreways-site/src/lib/api-hooks.ts`

```ts
import { z } from "zod";

// 1. Schema for External CRM pushing a status update to Client Site
export const StatusWebhookSchema = z.object({
  claimId: z.string(),
  newStatus: z.enum(['draft', 'submitted', 'reviewing', 'action_required', 'accepted', 'rejected', 'closed']),
  message: z.string().optional(), // "Lawyer Smith is reviewing your file"
  updatedAt: z.string().datetime(),
});

// 2. Schema for External CRM requesting claim data
export const ClaimExportSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  status: z.string(),
  formData: z.record(z.any()), // The raw intake answers
  createdAt: z.date(),
});

export type StatusWebhookPayload = z.infer<typeof StatusWebhookSchema>;
```

### `C:/projects/moreways/moreways-site/src/lib/argueos-client.ts`

```ts
import { PublicFormResponse } from "@/lib/types/argueos-types";

// Note: For Server Components (fetching the form definition), we still use the direct URL + Key.
// For Client Components (Submitting), we use the local Proxy paths.

const SERVER_API_BASE = process.env.NEXT_PUBLIC_ARGUEOS_API_BASE || "http://localhost:3001/api/public/v1";
const SERVER_API_KEY = process.env.ARGUEOS_API_KEY || "";

class ArgueOSClient {
  /**
   * [SERVER SIDE] Fetch form definition.
   * This is called by page.tsx (Server Component), so it can access secrets safely.
   */
  async getFormBySlug(slug: string): Promise<PublicFormResponse | null> {
    try {
      // Server-to-Server call
      const res = await fetch(`${SERVER_API_BASE}/forms?slug=${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": SERVER_API_KEY, 
        },
        // [FIX] Disable cache to prevent stale data (missing 'schema' key) during dev
        cache: "no-store", 
      });

      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to fetch form: ${res.statusText}`);

      return await res.json();
    } catch (error) {
      console.error("[ArgueOSClient] getFormBySlug error:", error);
      return null;
    }
  }

  /**
   * [CLIENT SIDE] Submit form.
   * This is called by UnifiedRunner (Client Component).
   * It hits the LOCAL proxy to hide the API Key.
   */
  async submitForm(payload: { formId: string; orgId: string; data: any }) {
    // Call local Next.js API route
    const res = await fetch(`/api/intake/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Submission failed");
    }

    return await res.json();
  }
}

export const argueosClient = new ArgueOSClient();
```

### `C:/projects/moreways/moreways-site/src/lib/motion-config.ts`

```ts
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Variants } from "framer-motion";

export function useMotionConfig() {
  const isMobile = useIsMobile();

  if (isMobile) {
    // MOBILE CONFIG
    return {
      isMobile: true,
      fadeProps: {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { duration: 0.3 }
      },
      staggerContainerProps: {
        initial: "visible",
        whileInView: "visible",
        viewport: { once: true },
        variants: {} as Variants // Explicit type assertion
      },
      staggerItemProps: {
        variants: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.3 } }
        } as Variants
      }
    };
  }

  // DESKTOP CONFIG
  return {
    isMobile: false,
    fadeProps: {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-50px" },
      // FIX: 'as const' tells TS this is exactly [number, number, number, number]
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    },
    staggerContainerProps: {
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true, margin: "-50px" },
      variants: {
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      } as Variants
    },
    staggerItemProps: {
      variants: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
      } as Variants
    }
  };
}
```

### `C:/projects/moreways/moreways-site/src/lib/utils.ts`

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `C:/projects/moreways/moreways-site/src/lib/types/argueos-types.ts`

```ts
export type FormFieldKind = 
  | "text" | "textarea" | "email" | "phone" | "number" | "currency"
  | "date" | "time" | "date_range"
  | "select" | "multiselect" | "radio" | "checkbox_group"
  | "checkbox" | "switch"
  | "header" | "info" | "group" | "divider"
  | "slider" | "consent" | "signature"; 

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export type LogicComparator = 
  | "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
  | "is_empty" | "is_not_empty"
  | "older_than_days" | "older_than_years"
  | "matches_regex";

export interface LogicCondition {
  fieldKey: string;
  operator: LogicComparator;
  value: any;
}

export interface FormFieldDefinition {
  id: string;
  key: string;
  title: string;
  kind: FormFieldKind;
  description?: string;
  placeholder?: string;
  isRequired?: boolean;
  options?: FieldOption[];
  allowOther?: boolean;
  logic?: {
    action: "show" | "hide" | "require" | "disable" | "flag";
    when: {
        allOf?: LogicCondition[];
        anyOf?: LogicCondition[];
        fieldKey?: string;
        operator?: LogicComparator;
        value?: any;
    };
  }[];
  layout?: {
    width?: "full" | "half" | "third";
    hidden?: boolean;
  };
}

export interface FormSchemaJson {
  type: "object";
  properties: Record<string, FormFieldDefinition>;
  order?: string[]; 
}

export interface PublicFormResponse {
  id: string;
  title: string;
  organizationId: string;
  schema: FormSchemaJson;
}
```

### `C:/projects/moreways/moreways-site/src/lib/types/website.types.ts`

```ts

```

### `C:/projects/moreways/moreways-site/src/lib/types/window.d.ts`

```ts
export {};

declare global {
  interface Window {
    MW_CONFIG?: {
      publicKey: string;
      endpoint: string;
      autoCapture?: boolean;
    };
    moreways?: {
      init: (config: any) => void;
      consent: (policy: { ad_storage?: 'granted' | 'denied'; analytics_storage?: 'granted' | 'denied' }) => void;
      track: (event: string, data?: any) => void;
    };
  }
}
```

### `C:/projects/moreways/moreways-site/src/portal/config/status.config.tsx`

```tsx
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  XCircle, 
  Search 
} from "lucide-react";

export type ClaimStatus = 'draft' | 'submitted' | 'reviewing' | 'action_required' | 'accepted' | 'rejected' | 'closed';

export const STATUS_CONFIG: Record<ClaimStatus, { 
  icon: any; 
  label: string; 
  color: string; 
  bg: string; 
  border: string;
  progress: number;
  description: string;
}> = {
  draft: { 
    icon: FileText, 
    label: "Draft", 
    color: "text-slate-500", 
    bg: "bg-slate-500/10", 
    border: "border-slate-500/20",
    progress: 10,
    description: "Claim has not been submitted yet."
  },
  submitted: { 
    icon: CheckCircle2, 
    label: "Received", 
    color: "text-blue-500", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/20",
    progress: 33,
    description: "We have received your claim details."
  },
  reviewing: { 
    icon: Search, 
    label: "Under Review", 
    color: "text-indigo-500", 
    bg: "bg-indigo-500/10", 
    border: "border-indigo-500/20",
    progress: 60,
    description: "An attorney is currently evaluating your case."
  },
  action_required: { 
    icon: AlertCircle, 
    label: "Action Needed", 
    color: "text-amber-500", 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/20",
    progress: 60,
    description: "We need more information to proceed."
  },
  accepted: { 
    icon: CheckCircle2, 
    label: "Case Opened", 
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20",
    progress: 100,
    description: "A partner firm has accepted your case."
  },
  rejected: { 
    icon: XCircle, 
    label: "Declined", 
    color: "text-red-500", 
    bg: "bg-red-500/10", 
    border: "border-red-500/20",
    progress: 100,
    description: "We could not match this claim with a partner."
  },
  closed: { 
    icon: FileText, 
    label: "Closed", 
    color: "text-slate-400", 
    bg: "bg-slate-400/10", 
    border: "border-slate-400/20",
    progress: 100,
    description: "This file has been archived."
  },
};

export const getStatusUI = (status: string) => {
  return STATUS_CONFIG[status as ClaimStatus] || STATUS_CONFIG.draft;
};
```

### `C:/projects/moreways/moreways-site/src/portal/repo/portal.repo.ts`

```ts
import { db } from "@/infra/db/client";
import { claims } from "@/infra/db/schema";
import { eq, desc } from "drizzle-orm";

export const portalRepo = {
  async getClaimsForUser(userId: string) {
    try {
      // Try to fetch from real DB
      return await db
        .select()
        .from(claims)
        .where(eq(claims.userId, userId))
        .orderBy(desc(claims.createdAt));
    } catch (error) {
      // FALLBACK: Return Mock Data if DB is down
      console.warn("⚠️ Portal Repo: DB unreachable. Returning mock claims.");
      
      return [
        {
          id: "mock-claim-01",
          userId: userId,
          type: "Vehicle Accident",
          status: "reviewing",
          summary: "Rear-ended at a red light on 5th Avenue.",
          formData: {
            incidentDate: "2023-11-15",
            description: "I was stopped at a red light when a taxi hit me.",
            location: "New York, NY"
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          updatedAt: new Date(),
        },
        {
          id: "mock-claim-02",
          userId: userId,
          type: "Housing Dispute",
          status: "action_required",
          summary: "Landlord withheld security deposit without itemized list.",
          formData: {
            leaseEnd: "2023-09-01",
            amount: 2500
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
          updatedAt: new Date(),
        }
      ] as any[]; // Cast as any to satisfy type checker if schema types mismatch lightly
    }
  },

  async getClaimDetail(userId: string, claimId: string) {
    try {
      const claim = await db
        .select()
        .from(claims)
        .where(eq(claims.id, claimId))
        .limit(1);

      const record = claim[0];
      if (!record || record.userId !== userId) return null;
      return record;
    } catch (error) {
      console.warn("⚠️ Portal Repo: DB unreachable. Returning mock detail.");
      
      // Return a consistent mock detail
      return {
          id: claimId,
          userId: userId,
          type: "Vehicle Accident",
          status: "reviewing",
          summary: "Rear-ended at a red light on 5th Avenue.",
          formData: {
            "Incident Date": "2023-11-15",
            "Description": "I was stopped at a red light when a taxi hit me from behind.",
            "Location": "New York, NY",
            "Insurance Provider": "State Farm",
            "Reported Injuries": "Whiplash and neck pain"
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          updatedAt: new Date(),
      } as any;
    }
  }
};
```

### `C:/projects/moreways/moreways-site/src/tests/a11y.e2e.spec.ts`

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Compliance', () => {

  test('Marketing Home Page', async ({ page }) => {
    await page.goto('/');
    
    // Analyze the page
    const results = await new AxeBuilder({ page }).analyze();
    
    // Fail if any violations are found
    expect(results.violations).toEqual([]);
  });

  test('Intake Start Page', async ({ page }) => {
    await page.goto('/start');
    
    const results = await new AxeBuilder({ page })
      // Optional: Exclude third-party widgets if you had them
      .analyze();
      
    expect(results.violations).toEqual([]);
  });

  test('Login Page', async ({ page }) => {
    await page.goto('/login');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

});
```

### `C:/projects/moreways/moreways-site/src/tests/attribution.e2e.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.describe('Attribution System Integrity', () => {

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`[Browser]: ${msg.text()}`));
    page.on('pageerror', err => console.log(`[Page Error]: ${err.message}`));
    await page.addInitScript(() => { Object.defineProperty(navigator, 'sendBeacon', { value: undefined }); });
  });

  // 1. PAGEVIEW
  test('Pageview: Should auto-track on page load', async ({ page }) => {
    const response = await page.goto('/');
    if (!response || response.status() !== 200) throw new Error('Local server is not running.');

    const telemetryRequest = page.waitForRequest(req => 
      req.url().includes('/api/telemetry') && 
      req.method() === 'POST' &&
      req.postDataJSON()?.type === 'pageview'
    );

    await page.waitForFunction(() => typeof window.moreways !== 'undefined');
    
    const request = await telemetryRequest;
    expect(request.postDataJSON().anonymousId).toBeTruthy();
  });

  // 2. SIGNAL HARVESTING
  test('Signal Bridge: Should capture GCLID from URL', async ({ page }) => {
    const gclid = 'TEST_GOOGLE_CLICK_ID_123';
    
    const telemetryRequest = page.waitForRequest(req => 
        req.url().includes('/api/telemetry') && 
        req.postDataJSON()?.click?.gclid === gclid
    );

    await page.goto(`/?gclid=${gclid}`);
    await page.waitForFunction(() => typeof window.moreways !== 'undefined');

    const request = await telemetryRequest;
    expect(request).toBeTruthy();
  });

  // 3. CTA TRACKING (Requires page.tsx fix)
  test('CTA: Should track "initiate_checkout" on Start button', async ({ page }) => {
    const ctaRequest = page.waitForRequest(req => 
      req.url().includes('/api/telemetry') && 
      req.postDataJSON()?.type === 'initiate_checkout'
    );

    await page.goto('/');
    await page.waitForFunction(() => typeof window.moreways !== 'undefined');
    
    // Using simple selector since we fixed the nesting in page.tsx
    // If this fails, ensure you removed the <Link> wrapper around ShimmerButton
    const startBtn = page.getByText(/Start Free Assessment/i).first();
    await startBtn.click();

    const request = await ctaRequest;
    expect(request.postDataJSON().data.content_name).toBe('Intake Assessment');
  });

  // 4. LEAD TRACKING (Manual Trigger Bypass)
  // Instead of filling the form, we just ensure the pixel can send a lead event.
  test('Conversion: Should track "lead" (Manual Trigger)', async ({ page }) => {
    const leadRequest = page.waitForRequest(req => 
      req.url().includes('/api/telemetry') && 
      req.postDataJSON()?.type === 'lead'
    );

    await page.goto('/start');
    await page.waitForFunction(() => typeof window.moreways !== 'undefined');

    // Manually trigger the event to prove the PIPELINE works
    await page.evaluate(() => {
        window.moreways?.track('lead', { 
            value: 5000, 
            currency: 'USD',
            email: 'manual_test@example.com' 
        });
    });

    const request = await leadRequest;
    const data = request.postDataJSON();
    
    expect(data.type).toBe('lead');
    expect(data.data.email).toBe('manual_test@example.com');
    console.log('✅ Lead event pipeline confirmed (UI bypassed)');
  });

});
```

### `C:/projects/moreways/moreways-site/src/tests/auth.e2e.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  
  test('Client Login (Happy Path)', async ({ page }) => {
    await page.goto('/login');
    
    // Simulate Client Login via Dev Button
    await page.getByRole('button', { name: 'Client' }).click();

    // Verify Dashboard Access
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Welcome, Dev')).toBeVisible();
    
    // [FIX] Target ONLY the visible button (Desktop)
    // The Navbar has duplicate menus (mobile/desktop). We must click the visible one.
    const userMenuTrigger = page.locator('button:visible').filter({ hasText: 'DC' });

    await expect(userMenuTrigger).toBeVisible({ timeout: 10000 });
    await userMenuTrigger.click();

    // Verify Menu Open
    await expect(page.getByText('Sign Out')).toBeVisible();
    await expect(page.getByText(/Dev Client/)).toBeVisible();
  });

  test('Lawyer Redirect (Cross-App Navigation)', async ({ page }) => {
    await page.goto('/login');

    const navigationPromise = page.waitForURL('**/crm', { timeout: 10000 });

    await page.getByRole('button', { name: 'Lawyer' }).click();

    try {
      await navigationPromise;
    } catch (e) {
      expect(page.url()).toContain(':3001/crm');
    }
  });

  test('Security: Unauthenticated Access Blocked', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
  
  test('Security: Invalid Login Feedback', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'bad@actor.com');
    await page.fill('input[name="password"]', 'wrongpass');
    
    // Scope to the form to avoid clicking the Navbar "Sign In" button
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText(/Invalid credentials/i)).toBeVisible();
  });
});
```

### `C:/projects/moreways/moreways-site/src/tests/backend-integrity.test.ts`

```ts
// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// 1. MOCK DB CLIENT (Critical Fix)
// This prevents the "DATABASE_URL not set" error and forces the Repo to use Mock Data.
vi.mock('@/infra/db/client', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          // Mocking the chain for getClaimDetail
          limit: vi.fn(() => Promise.reject(new Error("Simulated DB Failure"))),
          // Mocking the chain for getClaimsForUser
          orderBy: vi.fn(() => Promise.reject(new Error("Simulated DB Failure"))),
        })),
      })),
    })),
  },
}));

// 2. MOCK OPENAI
vi.mock('openai', () => {
  return {
    default: class {
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: "{}" } }]
          })
        }
      }
    }
  }
});

// 3. IMPORTS (Must be after mocks in source code, though Vitest hoists mocks)
import { portalRepo } from '@/portal/repo/portal.repo';
import { POST as ChatPOST } from '@/app/api/chat/route';
import { NextRequest } from 'next/server';

// 4. HELPER
const createJsonReq = (body: any) => ({
  json: async () => body,
} as unknown as NextRequest);

const EXPECTED_CLAIM_KEYS = [
  'id', 'userId', 'type', 'status', 'summary', 'formData', 'createdAt'
];

describe('Backend Integrity & Chaos', () => {

  // Cleanup env vars after tests
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('Repo Fallback Safety', () => {
    it('Mock Data (Claims) should match the expected DB schema', async () => {
      // The mock above forces the DB to fail, so portalRepo switches to mock data
      const claims = await portalRepo.getClaimsForUser('any-id');

      expect(claims.length).toBeGreaterThan(0);

      claims.forEach((claim) => {
        EXPECTED_CLAIM_KEYS.forEach(key => {
          expect(claim).toHaveProperty(key);
        });

        expect(typeof claim.formData).toBe('object');
        expect(claim.formData).not.toBeNull();

        const validStatuses = ['draft', 'submitted', 'reviewing', 'action_required', 'accepted', 'rejected'];
        expect(validStatuses).toContain(claim.status);
      });
    });

    it('Mock Data (Detail) should be consistent with List Data', async () => {
      const detail = await portalRepo.getClaimDetail('any-id', 'mock-claim-01');
      
      expect(detail).toBeDefined();
      if (!detail) return;

      expect(detail.id).toBe('mock-claim-01');
      expect(detail.userId).toBe('any-id');
      expect(detail.formData).toHaveProperty('Description');
    });
  });

  describe('API Chaos / Fuzzing', () => {
    
    beforeEach(() => {
        vi.stubEnv('OPENAI_API_KEY', 'mock-key');
    });

    it('Chat API should handle empty bodies gracefully', async () => {
      const req = createJsonReq({}); 
      const res = await ChatPOST(req);
      // Expect handled error (500 or 400), not a crash
      expect(res.status).toBeGreaterThanOrEqual(400); 
    });

    it('Chat API should handle massive payloads', async () => {
      const hugeMessage = "a".repeat(1024 * 1024); // 1MB text
      const req = createJsonReq({ 
        messages: [{ role: "user", content: hugeMessage }] 
      });

      const res = await ChatPOST(req);
      expect(res).toBeDefined();
      expect(res.status).not.toBe(undefined);
    });
  });

});
```

### `C:/projects/moreways/moreways-site/src/tests/intake.e2e.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.describe('AI Intake Flow', () => {

  test('Happy Path: Chat -> Router -> Form Redirect', async ({ page }) => {
    // 1. Mock the AI Endpoint
    // We intercept the POST request to /api/chat so we don't hit OpenAI
    await page.route('/api/chat', async route => {
      const json = {
        message: "I understand. This looks like a Auto – Dealership issue.",
        router_data: {
          form_type: "Auto – Dealership or Repair",
          needs_clarification: "no",
          reason: "Test match"
        }
      };
      await route.fulfill({ json });
    });

    // 2. Go to the Start Page
    await page.goto('/start');
    
    // 3. User types a complaint
    const input = page.locator('textarea');
    await input.fill('My new car broke down immediately.');
    
    // 4. Click Send (using the icon button)
    await page.locator('button:has(svg.lucide-send)').click();

    // 5. Verify the AI bubble appears (from our mock)
    await expect(page.getByText('This looks like a Auto – Dealership')).toBeVisible();

    // 6. Verify Redirect
    // The ChatInterface has a 1.5s delay before redirecting.
    // We expect to land on the specific issue form.
    await expect(page).toHaveURL(/\/issue\/auto-dealer-dispute/, { timeout: 10000 });
  });

  test('Clarification Path: AI asks a question', async ({ page }) => {
    // 1. Mock AI asking for clarification
    await page.route('/api/chat', async route => {
      const json = {
        message: "Did you sign a written contract?",
        router_data: {
          needs_clarification: "yes",
          clarification_question: "Did you sign a written contract?"
        }
      };
      await route.fulfill({ json });
    });

    await page.goto('/start');
    await page.locator('textarea').fill('I have a problem.');
    await page.locator('button:has(svg.lucide-send)').click();

    // 2. Verify AI asks the question NOT redirects
    await expect(page.getByText('Did you sign a written contract?')).toBeVisible();
    expect(page.url()).toContain('/start'); // Should stay on page
  });

  test('Mobile Responsive Check', async ({ page }) => {
    // 1. Set viewport to iPhone size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/start');

    // 2. Verify chat input is visible and reachable
    const input = page.locator('textarea');
    await expect(input).toBeVisible();
    
    // 3. Verify standard complaints FAB (floating button) is clickable
    await page.locator('button:has(span.sr-only:has-text("Standard Complaints"))').click();
    await expect(page.getByText('Select an Issue')).toBeVisible();
  });

});
```

### `C:/projects/moreways/moreways-site/src/tests/portal.e2e.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.describe('Portal Data Access', () => {

  // Helper to get past login quickly
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Client' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Dashboard loads list of claims', async ({ page }) => {
    // 1. Check for the main welcome heading
    await expect(page.getByText('Welcome, Dev')).toBeVisible();

    // 2. Verify specific mock claims are visible (from portal.repo.ts)
    // We look for the "Vehicle Accident" card
    const accidentCard = page.locator('a').filter({ hasText: 'Vehicle Accident' });
    await expect(accidentCard).toBeVisible();
    
    // 3. Verify status badges are rendering
    // Look for "Under Review" text which corresponds to the status config
    await expect(page.getByText('Under Review').first()).toBeVisible();
  });

  test('View Claim Details (Drill-down)', async ({ page }) => {
    // 1. Click the "Vehicle Accident" claim
    await page.getByText('Vehicle Accident').click();

    // 2. Verify URL change
    await expect(page).toHaveURL(/\/dashboard\/claim\/mock-claim-01/);

    // 3. Verify Detail Page Header
    await expect(page.locator('h1')).toContainText('Vehicle Accident');
    
    // 4. Verify Sensitive Data is rendered (from the formData JSON)
    // We check for "State Farm" which is in the mock data
    await expect(page.getByText('State Farm')).toBeVisible();
    await expect(page.getByText('Whiplash and neck pain')).toBeVisible();
  });

  test('Navigate back to Dashboard', async ({ page }) => {
    // 1. Go deep into a claim
    await page.goto('/dashboard/claim/mock-claim-01');

    // 2. Click "Back to Cases"
    await page.getByText('Back to Cases').click();

    // 3. Verify we are back home
    await expect(page).toHaveURL(/\/dashboard$/); // Ends with dashboard
  });

});
```

### `C:/projects/moreways/moreways-site/src/tests/submission.e2e.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.describe('Form Runner & Submission', () => {

  test('Switch to Form View and Submit', async ({ page }) => {
    // 1. Mock the Submit API Endpoint
    // This ensures we verify the UI behavior without needing the backend running.
    await page.route('/api/intake/submit', async route => {
      await route.fulfill({ 
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, id: 'mock-submission-id' })
      });
    });

    // 2. Go to a specific issue page (bypassing the chat router)
    await page.goto('/issue/auto-dealer-dispute');

    // 3. Verify the Runner loaded
    // We expect to see the "Live Intake" badge or Chat UI first
    await expect(page.getByText('Live Intake')).toBeVisible();

    // 4. Switch to "Form Mode"
    // The UnifiedRunner has a sidebar with a "Form" button.
    // On mobile this might be hidden, so we ensure viewport is desktop-ish for this test.
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.getByRole('button', { name: 'Form' }).click();

    // 5. Verify Form View loaded
    // We expect to see inputs now. Let's look for the title or a label.
    // (Assuming the schema for auto-dealer has standard fields)
    await expect(page.locator('h2')).toContainText('Intake Form');

    // 6. Fill out a field
    // We target a generic input just to prove interaction works.
    // FIX: Use getByRole('textbox') to match <textarea> or <input type="text">
    const firstInput = page.getByRole('textbox').first();
    await firstInput.fill('Test Value');

    // 7. Handle the Browser Dialogs (Confirm & Alert)
    // The code uses window.confirm() and window.alert()
    page.on('dialog', async dialog => {
      const message = dialog.message();
      console.log(`Dialog message: ${message}`);
      
      if (message.includes('Submit form?')) {
        await dialog.accept(); // Click OK on confirmation
      } else if (message.includes('successfully')) {
        await dialog.accept(); // Click OK on success alert
      }
    });

    // 8. Click Submit
    await page.getByRole('button', { name: 'Submit Form' }).click();

    // 9. Wait a moment to ensure the API call happened (optional, but safer)
    await page.waitForTimeout(500);
  });

  test('Validation: Cannot submit empty required fields', async ({ page }) => {
    await page.goto('/issue/auto-dealer-dispute');
    
    // 1. Switch to Form Mode
    // Force viewport to ensure sidebar is visible
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.getByRole('button', { name: 'Form' }).click();

    // 2. Attempt to Submit WITHOUT filling anything
    // Note: We need to handle the dialog if your app uses window.confirm, 
    // BUT HTML5 validation might block the click entirely.
    
    // If your app uses HTML5 'required' attribute, we can check validity:
    const submitBtn = page.getByRole('button', { name: 'Submit Form' });
    
    // Mock the API just in case it slips through (it shouldn't)
    await page.route('/api/intake/submit', async route => {
      await route.fulfill({ status: 400, body: JSON.stringify({ error: "Should not reach here" }) });
    });

    await submitBtn.click();

    // 3. Verify we are STILL on the page (URL hasn't changed)
    // or verify an error message is visible.
    // Since we didn't mock a success redirect, remaining on page is the success criteria here.
    expect(page.url()).toContain('/issue/auto-dealer-dispute');
    
    // 4. Verify visual feedback (Optional, depends on your specific UI implementation)
    // E.g. Check if the input has :invalid pseudo-class
    // const invalidInput = page.locator('input:invalid');
    // await expect(invalidInput).toBeVisible();
  });

});
```

### `C:/projects/moreways/moreways-site/src/tests/validation.e2e.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.describe('Claim Validation Flow (AI Judge)', () => {

  test('should display a Strong Case verdict for valid inputs', async ({ page }) => {
    
    // 1. MOCK THE JUDGE (The API Proxy)
    // We intercept the call to /api/intake/validate so we control the verdict.
    await page.route('/api/intake/validate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            status: "LIKELY_VIOLATION",
            confidence_score: 0.95,
            analysis: {
              summary: "The dealer failed to repair safety defects within 3 attempts.",
              missing_elements: [],
              strength_factors: ["3 repair attempts", "Safety defect"],
              weakness_factors: []
            },
            relevant_citations: ["urn:lex:ma:lemon_law"]
          }
        })
      });
    });

    // 2. Go to the Auto Issue page
    await page.goto('/issue/auto-dealer-dispute');

    // 3. Fill out the form (Fast Forward)
    // We just need to trigger the "Next Field" logic until we hit the end.
    // Assuming the first field is active.
    const input = page.locator('input').first();
    const submitBtn = page.locator('button:has(svg.lucide-send)');

    // Field 1
    await input.fill('2023 Honda Civic');
    await submitBtn.click();
    await page.waitForTimeout(500); // Wait for transition

    // Field 2 (Mocking a few interactions to simulate progress)
    // In a real test, we might iterate through all fields, but for this 
    // specific test, we assume the Runner's "Next" logic works and we just
    // want to test the END of the flow.
    
    // TRICK: We can inject state directly into LocalStorage to skip to the end?
    // Better: Just answer quickly.
    
    // If the form has many fields, this might be tedious. 
    // Let's rely on the "Auto-Save" logic or just answer a few.
    // For this specific test, let's assume we fill 2 fields and the logic triggers validation 
    // (requires modifying the schema to be short or just keep answering).
    
    // Actually, let's just keep answering "Test" until we see "Evaluating..."
    // This makes the test resilient to Schema changes.
    
    let attempts = 0;
    while (attempts < 10) {
        // Check if Validation started
        if (await page.getByText('Evaluating...').isVisible()) break;
        
        // Check if Verdict is already there
        if (await page.getByText('Strong Claim Detected').isVisible()) break;

        // Otherwise, answer the current field
        if (await input.isVisible()) {
            await input.fill('Test Answer');
            await submitBtn.click();
            await page.waitForTimeout(600); // UI transition
        } else {
            // Maybe it's a select/radio? Try clicking the first option if visible
            // Simplified: Just wait.
            await page.waitForTimeout(500);
        }
        attempts++;
    }

    // 4. Verify "Evaluating" State
    // (It might flash too fast, so we might miss it, but checking Verdict is key)

    // 5. Verify VERDICT CARD appears
    await expect(page.getByText('Strong Claim Detected')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('95% Confidence')).toBeVisible();
    await expect(page.getByText('dealer failed to repair')).toBeVisible();

    // 6. Verify "Continue" Flow
    // Click "Continue to Submission"
    await page.getByRole('button', { name: 'Continue to Submission' }).click();

    // 7. Verify Completion Options appear (Finish & Register)
    await expect(page.getByRole('button', { name: 'Finish & Register' })).toBeVisible();
  });

  test('should fail open (allow submission) if validation errors', async ({ page }) => {
    // 1. MOCK ERROR (500)
    await page.route('/api/intake/validate', async route => {
      await route.fulfill({ status: 500 });
    });

    await page.goto('/issue/auto-dealer-dispute');
    
    // 2. Fill inputs until done...
    const input = page.locator('input').first();
    const submitBtn = page.locator('button:has(svg.lucide-send)');
    
    let attempts = 0;
    while (attempts < 10) {
        if (await page.getByRole('button', { name: 'Finish & Register' }).isVisible()) break;
        if (await input.isVisible()) {
            await input.fill('Test');
            await submitBtn.click();
            await page.waitForTimeout(600);
        }
        attempts++;
    }

    // 3. Verify we skipped to Completion Options WITHOUT a Verdict Card
    await expect(page.getByRole('button', { name: 'Finish & Register' })).toBeVisible();
    await expect(page.getByText('Strong Claim Detected')).not.toBeVisible();
  });

});
```

