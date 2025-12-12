import { headers } from "next/headers";

interface RateLimitConfig {
  interval: number; // Window size in ms
  limit: number;    // Max requests per window
}

const TRACKER = new Map<string, { count: number; expiresAt: number }>();

// Clean up stale entries every 1 minute
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of TRACKER.entries()) {
    if (val.expiresAt < now) TRACKER.delete(key);
  }
}, 60_000);

export const RateLimiter = {
  /**
   * Check if the current request is allowed.
   * Throws an error if limit exceeded.
   */
  async check(config: RateLimitConfig = { interval: 60_000, limit: 20 }) {
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
    
    const now = Date.now();
    const record = TRACKER.get(ip);

    if (!record || record.expiresAt < now) {
      // New window
      TRACKER.set(ip, { count: 1, expiresAt: now + config.interval });
      return;
    }

    if (record.count >= config.limit) {
      console.warn(`[Security] Rate limit exceeded for IP: ${ip}`);
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    // Increment
    record.count++;
    TRACKER.set(ip, record);
  },

  /**
   * [TESTING ONLY] Clears the internal state.
   */
  _resetForTests() {
    if (process.env.NODE_ENV === 'test') {
        TRACKER.clear();
    }
  }
};