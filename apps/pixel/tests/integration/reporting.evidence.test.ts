// File: tests/integration/reporting.evidence.test.ts
// Documentation: File 05 (Testing)
// Role: Verify "The Evidence Locker"

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { evidenceRoute } from '../../src/reporting/api/reporting.api.evidence';
import { db } from '../../src/core/db';

vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      identities: { findFirst: vi.fn() },
      events: { findMany: vi.fn() },
      complianceLogs: { findMany: vi.fn() }
    }
  }
}));

const app = new Hono<{ Variables: { tenantId: string } }>();
app.use('*', async (c, next) => {
  c.set('tenantId', 'tenant_1'); // Mock Auth
  await next();
});
app.route('/evidence', evidenceRoute);

describe('Reporting: The Evidence Locker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate a FORENSIC DOSSIER for a lead', async () => {
    // 1. Mock Identity
    vi.mocked(db.query.identities.findFirst).mockResolvedValue({
      id: 'id_1',
      anonymousId: 'anon_1',
      userId: 'crm_55',
      createdAt: new Date('2023-01-01'),
      lastSeenAt: new Date('2023-01-02')
    } as any);

    // 2. Mock Events (The Chain of Custody)
    vi.mocked(db.query.events.findMany).mockResolvedValue([
      {
        id: 'evt_2',
        type: 'lead',
        createdAt: new Date('2023-01-02'),
        contextClient: { ip_hash: 'hash_ip_1', user_agent: 'Chrome/100' },
        derivedGeo: { city: 'New York', country: 'US' },
        clickData: { gclid: 'CLICK_XYZ' },
        qualityScore: { score: 100 }
      },
      {
        id: 'evt_1',
        type: 'pageview',
        createdAt: new Date('2023-01-01'),
        contextClient: { ip_hash: 'hash_ip_1', user_agent: 'Chrome/100' },
        derivedGeo: { city: 'New York', country: 'US' },
        clickData: {},
        qualityScore: { score: 100 }
      }
    ] as any);

    // 3. Mock Compliance Logs
    vi.mocked(db.query.complianceLogs.findMany).mockResolvedValue([
      {
        timestamp: new Date('2023-01-02'),
        action: 'dispatch_initiated',
        reason: 'consent_granted'
      }
    ] as any);

    // 4. Execute
    const res = await app.request('/evidence/anon_1');
    
    expect(res.status).toBe(200);
    const json = await res.json();

    // 5. Verify Structure
    expect(json.success).toBe(true);
    expect(json.evidence.report_id).toBeDefined();
    
    // Risk Assessment
    expect(json.evidence.risk_assessment.distinct_ips).toBe(1); // Consistent IP = Low Risk
    
    // Chain of Custody
    expect(json.evidence.chain_of_custody).toHaveLength(2);
    expect(json.evidence.chain_of_custody[0].ad_click_id).toBe('CLICK_XYZ');
    expect(json.evidence.chain_of_custody[0].location).toBe('New York, US');

    // Compliance
    expect(json.evidence.compliance_audit).toHaveLength(1);
    expect(json.evidence.compliance_audit[0].reason).toBe('consent_granted');
  });

  it('should return 404 for unknown identities', async () => {
    vi.mocked(db.query.identities.findFirst).mockResolvedValue(undefined);

    const res = await app.request('/evidence/unknown_user');
    expect(res.status).toBe(404);
  });
});