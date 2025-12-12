// File: tests/integration/offline.callrail.test.ts
// Documentation: File 07 (Integrations)
// Role: Verify CallRail Webhook Ingestion

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { offlineRoute } from '../../src/ingest/api/ingest.api.offline';
import { db } from '../../src/core/db';

const mocks = vi.hoisted(() => ({
  add: vi.fn()
}));

vi.mock('bullmq', () => ({
  Queue: vi.fn().mockImplementation(() => ({
    add: mocks.add
  }))
}));

vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      tenants: { findFirst: vi.fn() },
      identities: { findFirst: vi.fn() }
    }
  }
}));

const app = new Hono();
app.route('/offline', offlineRoute);

describe('Integration: CallRail Ingestion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should normalize a CallRail webhook into a standard Lead', async () => {
    // 1. Mock Tenant Auth (Secret Key)
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ id: 'lawyer_tenant' } as any);

    // 2. CallRail Sample Payload
    const callRailPayload = {
      id: 'call_999',
      start_time: '2023-10-27T10:00:00.000Z',
      answered: true,
      duration: 120,
      customer_phone_number: '+15551234567',
      customer_city: 'New York',
      customer_country: 'US',
      tracking_phone_number: '+15559999999',
      landing_page_url: 'https://lawfirm.com/personal-injury',
      gclid: 'Test_GCLID_123', // The Golden Key
      recording_player_url: 'https://app.callrail.com/calls/123/recording'
    };

    // 3. Send Request
    const res = await app.request('/offline/callrail', {
      method: 'POST',
      headers: { 'x-secret-key': 'sk_valid' },
      body: JSON.stringify(callRailPayload)
    });

    expect(res.status).toBe(200);

    // 4. Verify Queue Payload
    const jobName = mocks.add.mock.calls[0][0];
    const jobData = mocks.add.mock.calls[0][1];

    expect(jobName).toBe('process_event');
    
    // Check Normalization
    const payload = jobData.payload;
    expect(payload.type).toBe('lead'); // Mapped correctly
    expect(payload.anonymousId).toBe('Test_GCLID_123'); // Used GCLID as ID
    expect(payload.click.gclid).toBe('Test_GCLID_123');
    expect(payload.user.phone).toBe('+15551234567');
    expect(payload.user.city).toBe('New York');
    expect(payload.context.url).toBe('https://lawfirm.com/personal-injury');
    
    // Check Custom Data Preservation
    expect(payload.data.provider).toBe('callrail');
    expect(payload.data.duration).toBe(120);
    expect(payload.data.recording).toContain('callrail.com');
  });
});