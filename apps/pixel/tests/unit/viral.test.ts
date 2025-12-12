// File: tests/unit/viral.test.ts
// Documentation: File 05 (Testing)
// Role: Test Viral Loop Detection logic

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkViralStatus } from '../../src/dispatch/svc/dispatch.svc.viral';
import { db } from '../../src/core/db';

// Mock DB
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      events: { findFirst: vi.fn() }
    }
  }
}));

describe('Viral Loop Detection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return FALSE if no GCLID/FBCLID provided', async () => {
    const res = await checkViralStatus('tenant_1', 'user_A', {});
    expect(res.isViral).toBe(false);
  });

  it('should return FALSE if GCLID is new (not found in DB)', async () => {
    vi.mocked(db.query.events.findFirst).mockResolvedValue(undefined); // No match

    const res = await checkViralStatus('tenant_1', 'user_A', { gclid: 'new_click' });
    expect(res.isViral).toBe(false);
  });

  it('should return TRUE if GCLID was used by SOMEONE ELSE', async () => {
    // DB returns a record belonging to user_B
    vi.mocked(db.query.events.findFirst).mockResolvedValue({ 
      identityId: 'user_B',
      createdAt: new Date()
    } as any);

    const res = await checkViralStatus('tenant_1', 'user_A', { gclid: 'shared_click' });
    
    expect(res.isViral).toBe(true);
    expect(res.originalIdentityId).toBe('user_B');
  });
});