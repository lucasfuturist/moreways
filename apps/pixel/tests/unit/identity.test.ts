// File: tests/unit/identity.test.ts
// Documentation: File 04 (PII & Identity)
// Role: Verifying Identity Graph Logic

import { describe, it, expect, vi, beforeEach } from 'vitest';

// [FIX] Mock Redis
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue('OK')
  })
}));

import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
import { db } from '../../src/core/db';

// --------------------------------------------------------------------------
// MOCK DATABASE
// --------------------------------------------------------------------------
// We mock the entire DB module so we control findFirst, insert, update.
vi.mock('../../src/core/db', () => {
  return {
    db: {
      query: {
        identities: { findFirst: vi.fn() },
        tenants: { findFirst: vi.fn() }
      },
      // Factory function to ensure fresh mock instances
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 'mock_id' }])
        })
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({})
        })
      })
    }
  };
});

// Mock the Geo Service we added recently
vi.mock('../../src/dispatch/svc/dispatch.svc.geo', () => ({
  resolveIpLocation: vi.fn().mockResolvedValue({
    city: 'Test City', region: 'NY', country: 'US', postal_code: '10001'
  }),
  checkJurisdiction: vi.fn().mockReturnValue(true) // Always allow in this unit test
}));

describe('Identity Graph Logic', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseJob = {
    data: {
      tenantId: 'tenant_1',
      payload: {
        type: 'pageview',
        anonymousId: 'user_A',
        // Consent DENIED triggers an Audit Log insert in the new Divine Logic
        consent: { ad_storage: 'denied', analytics_storage: 'denied' },
        context: { url: 'http://test.com', user_agent: 'test', ip_address: '127.0.0.1' }
      }
    }
  } as any;

  it('should CREATE a new identity if one does not exist', async () => {
    // 1. Setup: Identity NOT found
    // FIX: Return undefined instead of null to match Drizzle TS types
    vi.mocked(db.query.identities.findFirst).mockResolvedValue(undefined);
    
    // 2. Run
    await processEventJob(baseJob);

    // 3. Assert: Insert called 3 times
    // 1. Insert Identity
    // 2. Insert Event
    // 3. Insert Compliance Log (due to consent denied)
    expect(db.insert).toHaveBeenCalledTimes(3);
  });

  it('should UPDATE existing identity if found', async () => {
    // 1. Setup: Identity FOUND
    vi.mocked(db.query.identities.findFirst).mockResolvedValue({ id: 'existing_id_55' } as any);
    
    // 2. Run
    await processEventJob(baseJob);

    // 3. Assert: Insert called 2 times
    // 1. Insert Event
    // 2. Insert Compliance Log (due to consent denied)
    expect(db.insert).toHaveBeenCalledTimes(2);
    
    // 4. Assert: Update called (Identity Update + Event Status Update)
    expect(db.update).toHaveBeenCalled();
  });
});