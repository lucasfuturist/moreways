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