// File: tests/integration/identity.merge.test.ts
// Documentation: File 05 (Testing)
// Role: Integration test for Cross-Device Merging

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveIdentity } from '../../src/identity/svc/identity.svc.merge';
import { db } from '../../src/core/db';

// Mock DB
vi.mock('../../src/core/db', () => {
  const mockDb: any = {
    query: { identities: { findFirst: vi.fn(), findMany: vi.fn() } },
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn().mockResolvedValue([{id:'new_id'}]) })) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
    transaction: vi.fn((cb) => cb(mockDb)) // Auto-execute transaction callback
  };
  return { db: mockDb };
});

describe('Identity Stitching (Retroactive Attribution)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should MERGE a new anonymous session into an old profile via Email Match', async () => {
    // SCENARIO:
    // 1. Old Identity (ID: 'old_master') exists from 3 weeks ago (has Email Hash).
    // 2. New Session (ID: 'new_session') starts anonymously, then submits SAME Email.
    
    // Step A: Current session lookup (finds the new anonymous session)
    const newSession = { id: 'new_session', emailHash: null, createdAt: new Date() };
    vi.mocked(db.query.identities.findFirst).mockResolvedValue(newSession as any);

    // Step B: Duplicate check (finds the OLD master profile via email match)
    const oldMaster = { id: 'old_master', emailHash: 'hash_123', createdAt: new Date('2023-01-01') };
    // findMany will be called to find duplicates
    vi.mocked(db.query.identities.findMany).mockResolvedValue([oldMaster] as any);

    // Run Logic
    const finalId = await resolveIdentity(
      'tenant_1', 
      'anon_new', 
      'hash_123' // Email hash provided in current payload
    );

    // ASSERTION 1: Should return the OLD ID (Master), not the new one
    expect(finalId).toBe('old_master');

    // ASSERTION 2: Should trigger a database transaction to merge
    expect(db.transaction).toHaveBeenCalled();
    
    // ASSERTION 3: Events should be re-pointed
    // Total Updates = 4
    // 1. Update currentIdentity with new hash (Instant persistence)
    // 2. Transaction: Update events (Re-parenting)
    // 3. Transaction: Update mergedInto (Soft Delete)
    // 4. Transaction: Update master timestamps (Last Seen)
    expect(db.update).toHaveBeenCalledTimes(4); 
  });
});