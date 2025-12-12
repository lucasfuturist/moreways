import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
import { MetaAdapter } from '../../src/dispatch/svc/adapters/dispatch.adapter.meta';

// Mock DB to return a Tenant with VALID Ad Config (Meta Enabled)
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      tenants: { findFirst: vi.fn().mockResolvedValue({ adConfig: { meta_pixel_id: '123', meta_access_token: 'abc' } }) },
      identities: { findFirst: vi.fn().mockResolvedValue(null) },
    },
    insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: '1' }]) }) }),
    update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue({}) }) })
  }
}));

// Mock Redis
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue('OK')
  })
}));

// Spy on Meta Adapter
vi.spyOn(MetaAdapter, 'send');

describe('Compliance Chaos: The GDPR Fire Drill', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should NEVER dispatch if consent is missing/undefined (Fail Safe)', async () => {
    const job = {
      data: {
        tenantId: 't1',
        payload: {
          type: 'lead',
          anonymousId: 'abc',
          // Consent object is MALFORMED/MISSING keys
          consent: { }, 
          context: { url: 'http://site.com' }
        }
      }
    } as any;

    try {
      await processEventJob(job);
    } catch (e) {}

    expect(MetaAdapter.send).not.toHaveBeenCalled();
  });

  it('should SCRUB payload if "medical" or "divorce" is in URL even with Consent', async () => {
    const job = {
      data: {
        tenantId: 't1',
        payload: {
          type: 'pageview',
          anonymousId: 'abc',
          consent: { ad_storage: 'granted' }, // User said YES
          context: { 
            url: 'https://lawfirm.com/divorce-lawyer/abusive-spouse' // TOXIC URL
          }
        }
      }
    } as any;

    await processEventJob(job);

    // Should NOT send to Meta because we scrubbed sensitive context
    expect(MetaAdapter.send).not.toHaveBeenCalled();
  });
});