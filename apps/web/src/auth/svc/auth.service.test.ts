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