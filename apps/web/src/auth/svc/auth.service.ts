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
    // In development, if the DB fails, we still want to allow mock users for UI testing.
    // However, for the registration check, we need to know the true state.
    // This version will re-throw the error, giving a clearer signal to the API route.
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error(`🔴 Auth Service DB Error in getUser(${email}):`, error);
      // Re-throw the error so the calling function knows the DB check failed.
      throw new Error("Database connection failed during user check.");
    }
  },

  async getUserById(id: string) {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      // Log the specific error for easier debugging.
      console.error(`🔴 Auth Service DB Error in getUserById(${id}):`, error);
      
      // Re-throw the error so the calling function (like your RootLayout) 
      // knows the database check failed and doesn't get a fake user.
      throw new Error("Database connection failed during user lookup.");
    }
  }
};