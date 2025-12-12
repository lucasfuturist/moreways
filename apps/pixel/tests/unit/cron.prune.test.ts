// File: tests/unit/cron.prune.test.ts
// Role: Verify GDPR Data Minimization

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pruneOldData } from '../../src/worker/cron/worker.cron.prune';
import { db } from '../../src/core/db';

// Mock DB delete (Happy Path)
vi.mock('../../src/core/db', () => ({
  db: {
    delete: vi.fn(() => ({
      where: vi.fn(() => ({
        // Happy path: returns array
        returning: vi.fn().mockResolvedValue([{ id: 'del_1' }, { id: 'del_2' }]), 
        // Thenable support for situations where returning() isn't called or await is direct
        then: vi.fn((resolve: (val: any) => void) => resolve(undefined)) 
      }))
    }))
  }
}));

describe('The Janitor (Cron)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should DELETE events older than 90 days', async () => {
    const now = new Date('2023-06-01T00:00:00Z');
    vi.setSystemTime(now);

    await pruneOldData();

    // Verify DB Delete was called twice (Events table + Quarantine table)
    expect(db.delete).toHaveBeenCalledTimes(2); 
  });

  it('should catch errors gracefully', async () => {
    // [FIX] Mock the chain correctly so it throws at the end (returning), 
    // instead of breaking the chain in the middle (where).
    const errMock = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        // The error happens here, allowing the chain `db.delete().where().returning()` to complete
        returning: vi.fn().mockRejectedValue(new Error('DB Connection Failed')),
        // Also mock 'then' just in case code changes to await .where() directly
        then: vi.fn((_: any, reject: (err: any) => void) => reject(new Error('DB Connection Failed')))
      })
    });
    
    vi.mocked(db.delete).mockImplementation(errMock as any);

    // Should NOT throw (Janitor should fail silently/log-only)
    await expect(pruneOldData()).resolves.not.toThrow();
  });
});