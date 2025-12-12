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