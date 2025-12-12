// File: tests/integration/worker.crm.test.ts
// Documentation: File 07 (Integrations)
// Role: Verify CRM Write-Back Logic

import { describe, it, expect, vi, beforeEach } from 'vitest';

// [FIX] Mock Redis before importing processor to pass Idempotency check
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue('OK') // Simulates "Key Set Successfully"
  })
}));

import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
import * as CrmService from '../../src/dispatch/svc/dispatch.svc.crm';
import { db } from '../../src/core/db';

// Mock DB
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      identities: { findFirst: vi.fn() },
      tenants: { findFirst: vi.fn() }
    },
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 'evt_1' }])
      })
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({})
      })
    })
  }
}));

// Mock Geo
vi.mock('../../src/dispatch/svc/dispatch.svc.geo', () => ({
  resolveIpLocation: vi.fn().mockResolvedValue({}),
  checkJurisdiction: vi.fn().mockReturnValue(true)
}));

describe('Worker -> CRM Sync (Closed Loop)', () => {
  // Spy on the real service call
  const crmSpy = vi.spyOn(CrmService, 'sendToCrm').mockResolvedValue();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseJob = {
    data: {
      tenantId: 'tenant_1',
      payload: {
        type: 'pageview',
        anonymousId: 'user_A',
        consent: { ad_storage: 'granted', analytics_storage: 'granted' },
        context: { url: 'http://test.com' }
      }
    }
  } as any;

  it('should NOT sync Pageviews to CRM (Noise Reduction)', async () => {
    // 1. Setup DB
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ id: 'tenant_1' } as any);
    
    // 2. Run Worker with Pageview
    await processEventJob(baseJob);

    // 3. Assert: sendToCrm NOT called
    expect(crmSpy).not.toHaveBeenCalled();
  });

  it('should SYNC Leads to CRM', async () => {
    const leadJob = {
      data: {
        tenantId: 'tenant_1',
        payload: {
          ...baseJob.data.payload,
          type: 'lead', // Change type
          data: { value: 100 }
        }
      }
    } as any;

    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ id: 'tenant_1' } as any);

    await processEventJob(leadJob);

    expect(crmSpy).toHaveBeenCalledTimes(1);
    expect(crmSpy).toHaveBeenCalledWith('tenant_1', 'evt_1', leadJob.data.payload);
  });

  it('should FAIL OPEN if CRM fails (Protecting the Ad Dispatch)', async () => {
    // Scenario: Client's Salesforce is down.
    // Goal: We must still track the event locally and send to Google/Meta. 
    // The CRM failure should be logged but not crash the job.

    const leadJob = {
      data: {
        tenantId: 'tenant_1',
        payload: { ...baseJob.data.payload, type: 'lead' }
      }
    } as any;

    // Mock CRM throwing error
    crmSpy.mockRejectedValueOnce(new Error('Salesforce Down'));

    // Verify processEventJob does NOT throw
    await expect(processEventJob(leadJob)).resolves.not.toThrow();

    // Verify we still tried
    expect(crmSpy).toHaveBeenCalled();
    
    // Check that we still updated the event status in DB (proof flow continued)
    expect(db.update).toHaveBeenCalled();
  });
});