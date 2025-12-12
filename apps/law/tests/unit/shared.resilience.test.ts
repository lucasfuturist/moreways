import { describe, it, expect, vi } from 'vitest';
import { withRetry } from '../../src/shared/utils/resilience';

describe('Shared Utility - Resilience (Retry Logic)', () => {

    it('should return value immediately if successful', async () => {
        const mockFn = vi.fn().mockResolvedValue('success');
        
        const result = await withRetry(mockFn);
        
        expect(result).toBe('success');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry transient errors and eventually succeed', async () => {
        const mockFn = vi.fn()
            .mockRejectedValueOnce({ status: 503 }) // Fail 1
            .mockRejectedValueOnce({ status: 429 }) // Fail 2 (Rate Limit)
            .mockResolvedValue('success');          // Success 3

        // Short delay for test speed
        const result = await withRetry(mockFn, 3, 10); 
        
        expect(result).toBe('success');
        expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should give up after max retries are exhausted', async () => {
        const mockFn = vi.fn().mockRejectedValue({ status: 500 });

        await expect(
            withRetry(mockFn, 3, 10)
        ).rejects.toEqual({ status: 500 });

        // Initial + 3 Retries = 4 Calls Total
        expect(mockFn).toHaveBeenCalledTimes(4); 
    });

    it('should NOT retry non-transient errors (e.g. 400 Bad Request)', async () => {
        const mockFn = vi.fn().mockRejectedValue({ status: 400 });

        await expect(
            withRetry(mockFn, 3, 10)
        ).rejects.toEqual({ status: 400 });

        // Should fail immediately without retrying
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});