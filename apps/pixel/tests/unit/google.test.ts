// File: tests/unit/google.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendToGoogleAds } from '../../src/dispatch/svc/dispatch.svc.google';

// Mock Fetch Global
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('Google Ads Adapter', () => {
  const mockConfig = {
    accessToken: 'test_token',
    customerId: '1234567890',
    conversionActionId: 'conversions/123'
  };

  const basePayload = {
    type: 'purchase',
    timestamp: new Date().toISOString(),
    anonymousId: 'abc-123',
    consent: { ad_storage: 'granted', analytics_storage: 'granted' },
    context: { url: 'https://site.com', user_agent: 'bot' },
    click: {}, // Empty click data initially
    // Note: No 'user' object here, so Enhanced Conversions (userIdentifiers) will be empty
    data: { value: 100, currency: 'USD' }
  } as any;

  beforeEach(() => {
    fetchMock.mockClear();
  });

  it('should SKIP if all signals (GCLID/WBRAID/Email) are missing', async () => {
    const result = await sendToGoogleAds(basePayload, mockConfig);
    // Updated expectation: Reason is now 'missing_signals' because we check for more than just GCLID
    expect(result).toEqual({ skipped: true, reason: 'missing_signals' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should SEND if GCLID is present', async () => {
    // Setup Success Response
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ partialFailure: false })
    });

    const payloadWithGclid = {
      ...basePayload,
      click: { gclid: 'test_gclid_123' }
    };

    await sendToGoogleAds(payloadWithGclid, mockConfig);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    
    // Check Payload Structure
    const callArgs = fetchMock.mock.calls[0];
    const url = callArgs[0];
    const body = JSON.parse(callArgs[1].body);

    expect(url).toContain('uploadClickConversions');
    expect(body.conversions[0].gclid).toBe('test_gclid_123');
    expect(body.conversions[0].conversionValue).toBe(100);
  });

  it('should SEND if User Email is present (Enhanced Conversions)', async () => {
    // Setup Success Response
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ partialFailure: false })
    });

    const payloadWithEmail = {
      ...basePayload,
      user: { email: 'test@example.com' } // GCLID is missing, but Email is present
    };

    await sendToGoogleAds(payloadWithEmail, mockConfig);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    
    const callArgs = fetchMock.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);

    // Verify User Identifier was hashed and included
    expect(body.conversions[0].userIdentifiers).toBeDefined();
    expect(body.conversions[0].userIdentifiers[0].hashedEmail).toBeDefined();
  });

  it('should THROW on API Failure (triggering retry)', async () => {
    // Setup Failure Response
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Error'
    });

    const payloadWithGclid = {
      ...basePayload,
      click: { gclid: 'test_gclid_123' }
    };

    await expect(sendToGoogleAds(payloadWithGclid, mockConfig))
      .rejects
      .toThrow('Google Ads API Error (500)');
  });
});