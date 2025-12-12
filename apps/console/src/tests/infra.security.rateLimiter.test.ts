import { describe, it, expect, vi, beforeEach } from "vitest";
import { RateLimiter } from "@/infra/security/security.svc.rateLimiter";

// Mock headers() from next/headers
vi.mock("next/headers", () => ({
  headers: () => ({
    get: (key: string) => (key === "x-forwarded-for" ? "127.0.0.1" : null),
  }),
}));

describe("Infra Security: RateLimiter", () => {
  beforeEach(() => {
    // [FIX] Clean slate before each test
    RateLimiter._resetForTests();
  });

  it("allows requests within the limit", async () => {
    const config = { interval: 1000, limit: 5 };
    
    // Make 5 requests (Limit is 5, so 1 initial + 4 increments = 5 total calls)
    // Actually, check() logic is:
    // 1st call: count=1
    // 2nd call: count=2
    // ...
    // 5th call: count=5
    // 6th call: count >= limit (5) -> Throw
    
    for (let i = 0; i < 5; i++) {
      await expect(RateLimiter.check(config)).resolves.not.toThrow();
    }
  });

  it("blocks requests exceeding the limit", async () => {
    const config = { interval: 1000, limit: 3 };
    
    // 1st (Count 1)
    await RateLimiter.check(config);
    // 2nd (Count 2)
    await RateLimiter.check(config);
    // 3rd (Count 3)
    await RateLimiter.check(config);

    // 4th (Count 3 >= Limit 3 -> Throw)
    // Wait... if logic is `count >= limit`, then when count reaches 3, the NEXT check fails?
    // Let's trace:
    // Call 1: New record. count=1. OK.
    // Call 2: count=1 < 3. count becomes 2. OK.
    // Call 3: count=2 < 3. count becomes 3. OK.
    // Call 4: count=3 >= 3. ERROR.
    
    await expect(RateLimiter.check(config)).rejects.toThrow("RATE_LIMIT_EXCEEDED");
  });
});