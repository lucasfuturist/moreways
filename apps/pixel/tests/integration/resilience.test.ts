// File: tests/integration/resilience.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { trackRoute } from '../../src/ingest/api/ingest.api.controller';
import { db } from '../../src/core/db';

// Mock dependencies
const mocks = vi.hoisted(() => ({
  queueAdd: vi.fn(),
  dbInsert: vi.fn(),
  redisIncr: vi.fn().mockResolvedValue(1)
}));

vi.mock('bullmq', () => ({ Queue: vi.fn().mockReturnValue({ add: mocks.queueAdd }) }));

vi.mock('redis', () => ({ 
  createClient: vi.fn().mockReturnValue({ 
    connect: vi.fn().mockResolvedValue(undefined), 
    incr: mocks.redisIncr, 
    expire: vi.fn() 
  }) 
}));

vi.mock('../../src/core/db', () => ({
  db: { 
    query: { tenants: { findFirst: vi.fn().mockResolvedValue({ id: 't1' }) } },
    insert: mocks.dbInsert 
  },
  quarantine: {}
}));

describe('System Resilience: "The Unsinkable Ship"', () => {
  // [FIX] Add Tenant ID Middleware
  const app = new Hono<{ Variables: { tenantId: string } }>();
  
  app.use('*', async (c, next) => {
    c.set('tenantId', 't1'); // Ensure tenant context exists
    await next();
  });
  
  app.route('/track', trackRoute);

  beforeEach(() => { vi.clearAllMocks(); });

  it('should QUARANTINE if BullMQ/Redis is down', async () => {
    // 1. Simulate Redis Queue Failure
    mocks.queueAdd.mockRejectedValue(new Error('Redis Connection Refused'));
    
    // 2. Mock Quarantine Insert Success
    mocks.dbInsert.mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn() }) });

    const payload = {
      type: 'lead',
      anonymousId: 'uuid-123',
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'http://site.com' }
    };

    const res = await app.request('/track', {
      method: 'POST',
      headers: { 'x-publishable-key': 'pk_valid' },
      body: JSON.stringify(payload)
    });

    // 3. Should NOT crash (500). Should return 202 (Accepted)
    expect(res.status).toBe(202);
    
    // 4. Verify Quarantine Insert was attempted
    expect(mocks.dbInsert).toHaveBeenCalled();
  });
});