import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendWebhook } from '../../src/dispatch/svc/dispatch.svc.webhook';

// Mock the global fetch API
const fetchSpy = vi.fn();
global.fetch = fetchSpy;

describe('Webhook Service (HTTP Layer)', () => {
  beforeEach(() => {
    fetchSpy.mockReset();
  });

  it('should POST the correct payload structure', async () => {
    fetchSpy.mockResolvedValue({ ok: true });

    const payload = {
      type: 'lead',
      timestamp: '2023-01-01T00:00:00Z',
      user: { email: 'test@example.com' },
      data: { value: 100 }
    } as any;

    const result = await sendWebhook('https://hooks.slack.com/test', payload, 'identity_123');

    expect(result).toBe(true);
    
    // Check arguments passed to fetch
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://hooks.slack.com/test',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        // Check if body contains our data
        body: expect.stringContaining('"identity_id":"identity_123"')
      })
    );
  });

  it('should fail gracefully on 500 errors (return false)', async () => {
    fetchSpy.mockResolvedValue({ ok: false, status: 500 });

    const result = await sendWebhook('https://bad-api.com', {} as any, 'id');

    expect(result).toBe(false);
    // Should NOT throw an error, just return false
  });

  it('should handle Network/Timeout errors', async () => {
    fetchSpy.mockRejectedValue(new Error('Network Error'));

    const result = await sendWebhook('https://timeout.com', {} as any, 'id');

    expect(result).toBe(false);
  });
});