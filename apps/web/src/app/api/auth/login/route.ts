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