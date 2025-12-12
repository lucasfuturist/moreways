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