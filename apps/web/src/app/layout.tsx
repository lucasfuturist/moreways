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