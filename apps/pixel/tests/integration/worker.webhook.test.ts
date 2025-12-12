// File: tests/integration/worker.webhook.test.ts
// Documentation: File 07 (Integrations)
// Role: Verify Webhook Dispatch Logic

import { describe, it, expect, vi, beforeEach } from 'vitest';

// [FIX] Mock Redis
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue('OK')
  })
}));

import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
import * as WebhookService from '../../src/dispatch/svc/dispatch.svc.webhook';
import { db } from '../../src/core/db';

// --------------------------------------------------------------------------
// MOCK DATABASE & MODULES
// --------------------------------------------------------------------------
vi.mock('../../src/core/db', () => {
  return {
    db: {
      query: {
        identities: { findFirst: vi.fn() },
        tenants: { findFirst: vi.fn() }
      },
      // Mocking Drizzle's chainable syntax: db.insert().values().returning()
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          // We return id: 'id_55' because the code uses .id to get the Identity ID.
          // This mock is reused for Event insertion, so event.id will also be 'id_55', which is fine here.
          returning: vi.fn().mockResolvedValue([{ id: 'id_55' }])
        })
      }),
      // Mocking update syntax: db.update().set().where()
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({})
        })
      })
    }
  };
});

describe('Worker -> Webhook Integration', () => {
  // Spy on the real WebhookService
  const webhookSpy = vi.spyOn(WebhookService, 'sendWebhook').mockResolvedValue(true);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const job = {
    data: {
      tenantId: 'tenant_1',
      payload: {
        type: 'lead',
        anonymousId: 'user_A',
        consent: { ad_storage: 'granted', analytics_storage: 'granted' }, 
        context: { url: 'http://test.com' }
      }
    }
  } as any;

  it('should FIRE webhook if tenant has webhookUrl configured', async () => {
    // 1. Setup DB: Return a tenant WITH a URL
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ 
      id: 'tenant_1',
      webhookUrl: 'https://my-chatbot.com/hook',
      adConfig: {} 
    } as any);

    // 2. Run Worker
    await processEventJob(job);

    // 3. Assert: sendWebhook called with correct URL and Identity ID
    // Note: 'id_55' comes from the mocked insert().returning() above
    expect(webhookSpy).toHaveBeenCalledWith(
      'https://my-chatbot.com/hook',
      expect.anything(), // The event payload
      'id_55'            // The Identity ID
    );
  });

  it('should SKIP webhook if tenant has NO webhookUrl', async () => {
    // 1. Setup DB: Return a tenant WITHOUT a URL
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ 
      id: 'tenant_1',
      webhookUrl: null, 
      adConfig: {} 
    } as any);

    // 2. Run Worker
    await processEventJob(job);

    // 3. Assert: sendWebhook never called
    expect(webhookSpy).not.toHaveBeenCalled();
  });
});