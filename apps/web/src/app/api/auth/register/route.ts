import { NextResponse } from 'next/server';
import { authService } from '@/auth/svc/auth.service';
import { db } from '@/infra/db/client';
import { users } from '@/infra/db/schema';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    // 1. Get phoneNumber from the request
    const { email, password, name, phoneNumber } = await req.json();
    
    // Check existing
    const existing = await authService.getUser(email);
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await authService.hashPassword(password);
    const userId = randomUUID();

    // 2. Add phoneNumber to the insert statement
    await db.insert(users).values({
      id: userId,
      email,
      passwordHash: hashedPassword,
      name,
      phoneNumber, // Add the new field here
      role: 'client'
    });

    await authService.createSession(userId, 'client');
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}