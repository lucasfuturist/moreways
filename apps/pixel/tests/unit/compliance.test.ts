// File: tests/unit/compliance.test.ts
// Documentation: File 04 (Security & Compliance)
// Role: Verifying The "Titanium Gate"

import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mock Redis (Before imports)
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue('OK')
  })
}));

import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
// [FIX] Import the Adapter to assert on it
import { MetaAdapter } from '../../src/dispatch/svc/adapters/dispatch.adapter.meta';

// 2. Mock Database
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      identities: { findFirst: vi.fn().mockResolvedValue(null) }, // Always new user
      tenants: { 
        findFirst: vi.fn().mockResolvedValue({ 
          // Return a config that enables Meta
          adConfig: { meta_pixel_id: '123', meta_access_token: 'abc' } 
        }) 
      }
    },
    insert: vi.fn().mockReturnValue({ 
      values: vi.fn().mockReturnValue({ 
        returning: vi.fn().mockResolvedValue([{ id: 'evt_123' }]) 
      }) 
    }),
    update: vi.fn().mockReturnValue({ 
      set: vi.fn().mockReturnValue({ 
        where: vi.fn().mockResolvedValue({}) 
      }) 
    })
  }
}));

// 3. [FIX] Mock the Meta Adapter Module
// We replace the real implementation with a spy that always succeeds.
vi.mock('../../src/dispatch/svc/adapters/dispatch.adapter.meta', () => ({
  MetaAdapter: {
    key: 'meta_capi',
    // Always say it's enabled so we can test the CONSENT gate logic
    isEnabled: vi.fn().mockReturnValue(true),
    // Mock successful send
    send: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe('The Titanium Gate (Compliance)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Adapter behavior defaults
    (MetaAdapter.isEnabled as any).mockReturnValue(true);
    (MetaAdapter.send as any).mockResolvedValue({ success: true });
  });

  it('should BLOCK dispatch when ad_storage is DENIED', async () => {
    const job = {
      data: {
        tenantId: 'tenant_123',
        payload: {
          type: 'pageview',
          anonymousId: '123e4567-e89b-12d3-a456-426614174000',
          consent: { ad_storage: 'denied', analytics_storage: 'granted' }, // <--- DENIED
          context: { url: 'https://test.com', user_agent: 'test' }
        }
      }
    } as any;

    await processEventJob(job);

    // ASSERTION: The Meta Adapter should NOT have been called
    expect(MetaAdapter.send).not.toHaveBeenCalled();
  });

  it('should ALLOW dispatch when ad_storage is GRANTED', async () => {
    const job = {
      data: {
        tenantId: 'tenant_123',
        payload: {
          type: 'pageview',
          anonymousId: '123e4567-e89b-12d3-a456-426614174000',
          consent: { ad_storage: 'granted', analytics_storage: 'granted' }, // <--- GRANTED
          context: { url: 'https://test.com', user_agent: 'test' }
        }
      }
    } as any;

    await processEventJob(job);

    // ASSERTION: The Meta Adapter SHOULD have been called
    expect(MetaAdapter.send).toHaveBeenCalledTimes(1);
    
    // Verify arguments passed to the adapter
    // The second arg is the config object from DB
    expect(MetaAdapter.send).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pageview' }), 
      expect.objectContaining({ meta_pixel_id: '123' }),
      'evt_123'
    );
  });
});