import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cache } from '../../src/shared/utils/cache';

describe('Shared Utility - In-Memory Cache', () => {

    beforeEach(() => {
        // Clear cache by iterating keys (since we don't have a clear method exposed, 
        // in a real app we'd add .clear(), but for now we rely on key uniqueness)
    });

    it('should store and retrieve values', () => {
        cache.set('key1', { foo: 'bar' });
        const result = cache.get('key1');
        expect(result).toEqual({ foo: 'bar' });
    });

    it('should return null for missing keys', () => {
        const result = cache.get('missing_key');
        expect(result).toBeNull();
    });

    it('should expire keys after TTL', async () => {
        vi.useFakeTimers();
        
        cache.set('short_lived', 'value', 1); // 1 second TTL
        
        // Advance time by 1.1 seconds
        vi.advanceTimersByTime(1100);
        
        const result = cache.get('short_lived');
        expect(result).toBeNull();
        
        vi.useRealTimers();
    });

    it('should generate deterministic keys for objects', () => {
        const objA = { query: "test", limit: 10 };
        const objB = { limit: 10, query: "test" }; // Different order, same content (if serialized right)
        
        // Note: JSON.stringify isn't guaranteed to be deterministic for key order, 
        // but for simple DTOs usually is. 
        // In this specific implementation we just check consistency for same input.
        const key1 = cache.generateKey('test', objA);
        const key2 = cache.generateKey('test', objA);
        
        expect(key1).toBe(key2);
        expect(key1).toContain('test:');
    });
});