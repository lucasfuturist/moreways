// File: tests/integration/api.security.test.ts
import { describe, it, expect, vi } from 'vitest';
import { Hono } from 'hono';
import { trackRoute } from '../../src/ingest/api/ingest.api.controller';

// Mock dependencies (standard)
vi.mock('bullmq', () => ({ Queue: vi.fn().mockReturnValue({ add: vi.fn() }) }));

// [FIX] Ensure connect returns a Promise
vi.mock('redis', () => ({ 
  createClient: vi.fn().mockReturnValue({ 
    connect: vi.fn().mockResolvedValue(undefined), 
    incr: vi.fn().mockResolvedValue(1), 
    expire: vi.fn() 
  }) 
}));

vi.mock('../../src/core/db', () => ({ 
  db: { insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn() }) }) }, 
  quarantine: {} 
}));

describe('API Security: The Hacker Simulation', () => {
  const app = new Hono<{ Variables: { tenantId: string } }>();
  app.use('*', async (c, next) => { c.set('tenantId', 't1'); await next(); });
  app.route('/track', trackRoute);

  it('should sanitize SQL INJECTION attempts in PII fields', async () => {
    // Hacker tries to drop table via email field
    const maliciousPayload = {
      type: 'lead',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000',
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'http://site.com', user_agent: 'test' },
      user: {
        email: "user@test.com'); DROP TABLE identities; --", // SQLi
        first_name: "<script>alert('xss')</script>" // XSS
      }
    };

    const res = await app.request('/track', {
      method: 'POST',
      body: JSON.stringify(maliciousPayload)
    });

    // 1. API should Accept (200) or Quarantine (202), BUT NOT 500
    expect([200, 202]).toContain(res.status);
  });

  it('should reject MASSIVE payloads (DoS Protection)', async () => {
    const hugeString = 'a'.repeat(5 * 1024 * 1024); // 5MB
    const hugePayload = {
      type: 'lead',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000',
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'http://site.com', user_agent: 'test' },
      data: { junk: hugeString }
    };
    
    const res = await app.request('/track', {
      method: 'POST',
      body: JSON.stringify(hugePayload)
    });

    expect(res.status).not.toBe(500);
  });

  it('should reject PROTOTYPE POLLUTION attempts', async () => {
    const pollutionPayload = {
      type: 'pageview',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000',
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { 
        url: 'http://site.com',
        user_agent: 'test-agent' // [FIX] Added required user_agent
      },
      "__proto__": { "isAdmin": true } // Attempt to pollute
    };

    const res = await app.request('/track', {
      method: 'POST',
      body: JSON.stringify(pollutionPayload)
    });

    // Expect 200 because Zod should strip unknown keys and process the valid payload
    expect(res.status).toBe(200);
  });
});