import { createHash } from 'crypto';

/**
 * A simple In-Memory Cache (LRU-style).
 * In production, replace the internal 'Map' with Redis.
 */
class InMemoryCache {
  private store = new Map<string, { val: any; exp: number }>();
  private readonly TTL_MS = 1000 * 60 * 60; // 1 Hour Default

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.exp) {
      this.store.delete(key);
      return null;
    }
    return entry.val;
  }

  set(key: string, val: any, ttlSec = 3600) {
    // Safety: Prevent memory leaks by capping size
    if (this.store.size > 10000) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey); // Evict oldest
    }

    this.store.set(key, {
      val,
      exp: Date.now() + (ttlSec * 1000)
    });
  }

  // Generate a consistent key for complex objects (like query params)
  generateKey(prefix: string, data: any): string {
    const hash = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    return `${prefix}:${hash}`;
  }
}

export const cache = new InMemoryCache();