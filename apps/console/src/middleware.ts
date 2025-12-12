import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  
  // CSP: Whitelist sources. 
  // 'self' allows scripts from own origin.
  // 'unsafe-inline' and 'unsafe-eval' are often needed for React in Dev, 
  // but in Prod should be stricter.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader.replace(/\s{2,}/g, " ").trim());

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Strict Headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "DENY"); // Prevents Clickjacking
  response.headers.set("X-Content-Type-Options", "nosniff"); // Prevents MIME sniffing
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set("Content-Security-Policy", cspHeader.replace(/\s{2,}/g, " ").trim());

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api/auth (NextAuth)
     * 2. /_next/ (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};