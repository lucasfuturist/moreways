// File: tests/unit/legal.test.ts
// Documentation: File 05 (Testing)
// Role: Verifying GPC and Sensitive Data Protections

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';

// --- MOCKS (Must be defined before imports) ---

// 1. Define hoisted mocks so they exist before vi.mock() runs
const mocks = vi.hoisted(() => ({
  add: vi.fn(),
  incr: vi.fn().mockResolvedValue(1),
  expire: vi.fn().mockResolvedValue(true),
  // [FIX] Add 'set' for Idempotency check
  set: vi.fn().mockResolvedValue('OK'),
  dbQuery: {
    identities: { findFirst: vi.fn() },
    tenants: { findFirst: vi.fn() }
  },
  dbInsert: vi.fn().mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([{ id: 'evt_123' }])
    })
  }),
  dbUpdate: vi.fn().mockReturnValue({
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue({})
    })
  })
}));

// 2. Mock BullMQ
vi.mock('bullmq', () => ({
  Queue: vi.fn().mockImplementation(() => ({
    add: mocks.add
  }))
}));

// 3. Mock Redis
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    incr: mocks.incr,
    expire: mocks.expire,
    set: mocks.set // [FIX] Added here
  })
}));

// 4. Mock Database
vi.mock('../../src/core/db', () => ({
  db: {
    query: mocks.dbQuery,
    insert: mocks.dbInsert,
    update: mocks.dbUpdate
  }
}));

// 5. Mock Geo Service
vi.mock('../../src/dispatch/svc/dispatch.svc.geo', () => ({
  resolveIpLocation: vi.fn().mockResolvedValue({}),
  checkJurisdiction: vi.fn().mockReturnValue(true)
}));

// --- IMPORTS (Must be after mocks) ---
// We import these NOW so they use the mocked versions of Queue/Redis/DB
import { trackRoute } from '../../src/ingest/api/ingest.api.controller';
import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';

// Setup Hono App for Ingest Testing
const app = new Hono<{ Variables: { tenantId: string } }>();
app.use('*', async (c, next) => { c.set('tenantId', 'tenant_1'); await next(); });
app.route('/track', trackRoute);

describe('Legal Shield & Compliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset specific mock implementations if needed
    mocks.add.mockClear();
    // [FIX] Reset set mock to always return OK by default
    mocks.set.mockResolvedValue('OK');
  });

  describe('Ingest: Global Privacy Control (GPC)', () => {
    const payload = {
      type: 'pageview',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000', // Valid UUID
      // User supposedly granted consent on banner
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'https://site.com', user_agent: 'bot' }
    };

    it('should OVERRIDE consent to DENIED if Sec-GPC: 1 is present', async () => {
      const res = await app.request('/track', {
        method: 'POST',
        headers: { 'Sec-GPC': '1' }, // <--- GPC ACTIVE
        body: JSON.stringify(payload)
      });

      expect(res.status).toBe(200);

      // Verify what got pushed to Queue via the hoisted mock
      const queuedJob = mocks.add.mock.calls[0][1];
      expect(queuedJob.payload.consent.ad_storage).toBe('denied');
      expect(queuedJob.payload.data._compliance_gpc_override).toBe(true);
    });

    it('should respect original consent if Sec-GPC is missing', async () => {
      const res = await app.request('/track', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      expect(res.status).toBe(200);

      const queuedJob = mocks.add.mock.calls[0][1];
      expect(queuedJob.payload.consent.ad_storage).toBe('granted');
    });
  });

  describe('Dispatch: Sensitive Data Scrubbing', () => {
    it('should BLOCK ad dispatch if URL contains toxic keywords (e.g. medical)', async () => {
      const job = {
        data: {
          tenantId: 'tenant_1',
          payload: {
            type: 'pageview',
            anonymousId: '123e4567-e89b-12d3-a456-426614174000',
            // User granted consent, BUT URL is toxic
            consent: { ad_storage: 'granted', analytics_storage: 'granted' },
            context: { url: 'https://lawfirm.com/medical-malpractice/injury', user_agent: 'test' }
          }
        }
      } as any;

      // Setup DB mocks for this specific test
      // Note: mocking return values on hoisted functions works fine
      vi.mocked(mocks.dbQuery.identities.findFirst).mockResolvedValue({ id: 'id_1' } as any);
      vi.mocked(mocks.dbQuery.tenants.findFirst).mockResolvedValue({ adConfig: { meta_pixel_id: '123' } } as any);

      await processEventJob(job);

      // Verify Audit Log was written for 'sensitive_content_scrubbed'
      // We spy on the 'values' call which contains the data
      // Structure: db.insert().values({ ... }) 
      // mocks.dbInsert returns an object with a .values spy
      const valuesSpy = mocks.dbInsert().values; 
      const insertCalls = valuesSpy.mock.calls;

      // Check if any insert call had our specific reason
      const hasBlockedReason = insertCalls.some((args: any[]) => {
        const data = args[0]; // The object passed to .values()
        return data.reason === 'sensitive_content_scrubbed';
      });

      expect(hasBlockedReason).toBe(true);

      // Ensure NO "dispatch_initiated" log exists
      const hasSuccessLog = insertCalls.some((args: any[]) => {
        const data = args[0];
        return data.action === 'dispatch_initiated';
      });
      expect(hasSuccessLog).toBe(false);
    });
  });
});