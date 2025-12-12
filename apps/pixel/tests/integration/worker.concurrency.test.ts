// File: tests/integration/worker.concurrency.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
import { db } from '../../src/core/db';
import { sendWebhook } from '../../src/dispatch/svc/dispatch.svc.webhook';

// [FIX] Hoist the Redis State so it is available to the mock factory
const redisState = vi.hoisted(() => {
  const store = new Map<string, string>();
  return {
    store,
    // Helper to verify call counts in tests
    mockSet: vi.fn()
  };
});

// Mock Redis with stateful logic
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    // Simulate NX (Not Exists) locking
    set: vi.fn().mockImplementation((key, val, options) => {
      redisState.mockSet(key, val, options);
      if (options?.NX && redisState.store.has(key)) return null; // Already locked
      redisState.store.set(key, val);
      return 'OK'; // Lock acquired
    })
  })
}));

// Mock DB
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      tenants: { findFirst: vi.fn().mockResolvedValue({ id: 't1', webhookUrl: 'http://crm.com' }) },
      identities: { findFirst: vi.fn().mockResolvedValue({ id: 'id_1' }) }
    },
    insert: vi.fn().mockReturnValue({ 
      values: vi.fn().mockReturnValue({ 
        returning: vi.fn().mockResolvedValue([{ id: 'evt_fixed_id' }]) 
      }) 
    }),
    update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn() }) })
  }
}));

// Mock Webhook
vi.mock('../../src/dispatch/svc/dispatch.svc.webhook', () => ({
  sendWebhook: vi.fn().mockResolvedValue(true)
}));

describe('Worker Concurrency: The "Double Click" Defense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redisState.store.clear(); // Reset Redis state between tests
  });

  it('should only DISPATCH once even if 5 identical jobs run in parallel', async () => {
    const job = {
      id: 'job_unique_123',
      data: {
        tenantId: 't1',
        payload: {
          type: 'lead',
          anonymousId: 'user_1',
          consent: { ad_storage: 'granted', analytics_storage: 'granted' },
          context: { url: 'http://site.com', ip_address: '1.2.3.4' }
        }
      }
    } as any;

    // Run 5 processors in "parallel"
    const results = await Promise.allSettled([
      processEventJob(job),
      processEventJob(job),
      processEventJob(job),
      processEventJob(job),
      processEventJob(job)
    ]);

    // 1. All promises should resolve (processor handles the skip gracefully)
    const rejected = results.filter(r => r.status === 'rejected');
    expect(rejected).toHaveLength(0);

    // 2. The Webhook (Expensive Action) should be called EXACTLY ONCE
    expect(sendWebhook).toHaveBeenCalledTimes(1);
    
    // 3. Redis SET should have been called 5 times (tried to lock 5 times)
    // Note: We check the mockSet helper we injected
    expect(redisState.mockSet).toHaveBeenCalledTimes(5);
  });
});