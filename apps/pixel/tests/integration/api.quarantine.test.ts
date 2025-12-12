// File: tests/integration/api.quarantine.test.ts
// Documentation: File 05 (Testing)
// Role: Verify "Zero-Loss Guarantee" (The Safety Net)

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { trackRoute } from '../../src/ingest/api/ingest.api.controller';
import { db } from '../../src/core/db';
import { quarantine } from '../../src/core/db/core.db.schema';

// --- MOCKS ---
// Hoist mocks to ensure they run before imports
const mocks = vi.hoisted(() => ({
  add: vi.fn(),
  insert: vi.fn().mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([{ id: 'q_123' }])
    })
  })
}));

vi.mock('../../src/core/db', () => ({
  db: {
    insert: mocks.insert, // Mock the global insert function
    query: {
      tenants: { findFirst: vi.fn() }
    }
  },
  // We also export the schema for use in tests, but here we mock the usage
  quarantine: {} 
}));

vi.mock('bullmq', () => ({
  Queue: vi.fn().mockImplementation(() => ({
    add: mocks.add
  }))
}));

vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(true)
  })
}));

// Setup App
const app = new Hono<{ Variables: { tenantId: string } }>();
app.use('*', async (c, next) => {
  c.set('tenantId', 'tenant_123'); // Bypass auth for this test
  await next();
});
app.route('/track', trackRoute);

describe('API Layer - Quarantine (Zero-Loss)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should QUARANTINE malformed payloads (Zod Error)', async () => {
    // SCENARIO: Client sends garbage data (missing anonymousId)
    // Normally this is a 400 Bad Request. 
    // Divine Upgrade: It should be a 202 Accepted + DB Insert.
    
    const malformedPayload = {
      type: 'lead',
      // anonymousId is MISSING
      consent: { ad_storage: 'granted' },
      context: { url: 'https://broken-client.com' }
    };

    const res = await app.request('/track', {
      method: 'POST',
      headers: { 'x-forwarded-for': '1.2.3.4' },
      body: JSON.stringify(malformedPayload)
    });

    // 1. Verify Response is NOT an error
    expect(res.status).toBe(202); // 202 Accepted
    const json = await res.json();
    expect(json.status).toBe('quarantined_for_review');

    // 2. Verify Data was saved to Quarantine Table
    expect(mocks.insert).toHaveBeenCalled(); 
    
    // Check arguments of the insert
    const insertCall = mocks.insert.mock.calls[0];
    // In Drizzle, insert(table) is the first arg. We can check the .values() call.
    // However, our mock structure is db.insert().values().
    // So we check the spy on the values function:
    const valuesSpy = mocks.insert().values;
    const savePayload = valuesSpy.mock.calls[0][0];

    expect(savePayload.tenantId).toBe('tenant_123');
    expect(savePayload.rawBody).toEqual(malformedPayload); // Saved raw
    expect(savePayload.errorReason).toContain('anonymousId'); // Contains Zod error
    expect(savePayload.ipAddress).toBe('1.2.3.4');

    // 3. Verify it was NOT added to the processing queue
    expect(mocks.add).not.toHaveBeenCalled();
  });

  it('should accept valid payloads normally', async () => {
    const validPayload = {
      type: 'pageview',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000',
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'https://good.com', user_agent: 'test' }
    };

    const res = await app.request('/track', {
      method: 'POST',
      body: JSON.stringify(validPayload)
    });

    expect(res.status).toBe(200);
    expect(mocks.add).toHaveBeenCalled(); // Queue was hit
    expect(mocks.insert).not.toHaveBeenCalled(); // Quarantine was skipped
  });
});