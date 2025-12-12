// File: tests/integration/offline.test.ts
// Documentation: File 05 (Testing)
// Role: Test "The Feedback Loop"

import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- MOCKS ---
// We must hoist the spy so it exists before vi.mock() is executed
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
      identities: { findFirst: vi.fn() },
      events: { findMany: vi.fn() }
    }
  }
}));

// Imports must happen after mocks in source order (though Vitest hoists mocks anyway)
import { Hono } from 'hono';
import { offlineRoute } from '../../src/ingest/api/ingest.api.offline';
import { db } from '../../src/core/db';

// Setup App
const app = new Hono();
app.route('/offline', offlineRoute);

describe('The Feedback Loop (Offline Conversions)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.add.mockClear();
  });

  it('should REHYDRATE a session and queue an event', async () => {
    // 1. Mock Auth
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ id: 'tenant_1' } as any);

    // 2. Mock Identity Lookup (Found by Email)
    vi.mocked(db.query.identities.findFirst).mockResolvedValue({
      id: 'id_55',
      anonymousId: 'anon_old_session',
      emailHash: 'hashed_email'
    } as any);

    // 3. Mock History (Found old GCLID)
    vi.mocked(db.query.events.findMany).mockResolvedValue([
      {
        id: 'evt_old',
        createdAt: new Date('2023-01-01'),
        clickData: { gclid: 'GOLDEN_CLICK_ID' },
        contextCookies: { _fbp: 'fb.1.old' },
        consentPolicy: { ad_storage: 'granted' }
      }
    ] as any);

    // 4. Send Request
    const res = await app.request('/offline', {
      method: 'POST',
      headers: { 'x-secret-key': 'sk_valid' },
      body: JSON.stringify({
        email: 'client@example.com',
        event_name: 'Retained',
        value: 5000,
        currency: 'USD'
      })
    });

    expect(res.status).toBe(200);

    // 5. Verify Queue Payload using the hoisted mock
    const jobData = mocks.add.mock.calls[0][1];
    
    // It should have the OLD anonymous ID
    expect(jobData.payload.anonymousId).toBe('anon_old_session');
    
    // It should have the GOLDEN GCLID
    expect(jobData.payload.click.gclid).toBe('GOLDEN_CLICK_ID');
    
    // It should have the NEW value
    expect(jobData.payload.data.value).toBe(5000);
    
    // It should be marked as offline
    expect(jobData.payload.type).toBe('offline_conversion');
  });

  it('should reject invalid Secret Keys', async () => {
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue(undefined); // No tenant found

    const res = await app.request('/offline', {
      method: 'POST',
      headers: { 'x-secret-key': 'sk_INVALID' },
      body: JSON.stringify({ email: 'test@test.com' })
    });

    expect(res.status).toBe(403);
  });
});