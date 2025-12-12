// File: tests/integration/api.test.ts
// Documentation: File 05 (Testing)
// Role: Integration tests for API Layer

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { trackRoute } from '../../src/ingest/api/ingest.api.controller';
import { readRoute } from '../../src/ingest/api/ingest.api.read';
import { db } from '../../src/core/db';

// --------------------------------------------------------------------------
// MOCK THE MODULES
// --------------------------------------------------------------------------
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      identities: { findFirst: vi.fn() },
      events: { findMany: vi.fn() },
      tenants: { findFirst: vi.fn() }
    }
  }
}));

vi.mock('bullmq', () => ({
  Queue: vi.fn().mockImplementation(() => ({
    add: vi.fn().mockResolvedValue({ id: 'job_123' })
  }))
}));

// Mock Redis for Rate Limiting
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(true)
  })
}));

// --------------------------------------------------------------------------
// SETUP TEST APP
// --------------------------------------------------------------------------
const app = new Hono<{ Variables: { tenantId: string } }>();

app.use('*', async (c, next) => {
  const key = c.req.header('x-publishable-key');
  if (key !== 'pk_valid') return c.json({ error: 'Auth' }, 401);
  c.set('tenantId', 'tenant_123');
  await next();
});

app.route('/track', trackRoute);
app.route('/journey', readRoute);

// --------------------------------------------------------------------------
// THE TESTS
// --------------------------------------------------------------------------
describe('API Layer (Robustness)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /track (Ingestion)', () => {
    it('should reject requests without API key', async () => {
      const res = await app.request('/track', { method: 'POST', body: JSON.stringify({}) });
      expect(res.status).toBe(401);
    });

    it('should validate and queue a valid payload', async () => {
      const payload = {
        type: 'pageview',
        anonymousId: '123e4567-e89b-12d3-a456-426614174000',
        consent: { ad_storage: 'granted', analytics_storage: 'granted' },
        context: { url: 'https://test.com', user_agent: 'bot' }
      };

      const res = await app.request('/track', {
        method: 'POST',
        headers: { 'x-publishable-key': 'pk_valid' },
        body: JSON.stringify(payload)
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ success: true, queued: true });
    });
  });

  describe('GET /journey (Intelligence)', () => {
    it('should return 404 for unknown users', async () => {
      // Setup Mock: Return Undefined (Not found)
      vi.mocked(db.query.identities.findFirst).mockResolvedValue(undefined);

      const res = await app.request('/journey/unknown-user', {
        headers: { 'x-publishable-key': 'pk_valid' }
      });
      expect(res.status).toBe(404);
    });

    it('should return full history (Oracle) for known users', async () => {
      // Setup Mock: Return User
      vi.mocked(db.query.identities.findFirst).mockResolvedValue({ 
        id: 'id_123', 
        createdAt: new Date(), 
        lastSeenAt: new Date() 
      } as any);
      
      // Setup Mock: Return Events
      vi.mocked(db.query.events.findMany).mockResolvedValue([
        { 
          type: 'pageview', 
          createdAt: new Date(),
          contextClient: { page_url: 'https://site.com' },
          clickData: { gclid: 'test' }
        },
        { 
          type: 'lead', 
          createdAt: new Date(),
          contextClient: { page_url: 'https://site.com/contact' },
          clickData: {} 
        }
      ] as any);

      const res = await app.request('/journey/known-user', {
        headers: { 'x-publishable-key': 'pk_valid' }
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      
      expect(json.found).toBe(true);
      
      // [UPDATE] Check new Oracle structure
      expect(json.oracle).toBeDefined();
      expect(json.oracle.conversion_path).toHaveLength(2);
      expect(json.oracle.lead_score).toBeGreaterThan(0);
      expect(json.oracle.first_touch.channel).toBe('paid_search'); // From mock gclid
    });
  });
});