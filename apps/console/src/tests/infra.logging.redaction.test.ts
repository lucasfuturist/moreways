import { describe, it, expect, vi } from "vitest";
import { logger } from "@/infra/logging/infra.svc.logger";

// Mock console.log to inspect output
const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

describe("Infra Logger Redaction", () => {
  it("redacts sensitive keys from metadata", () => {
    const sensitiveData = {
      event: "user_signup",
      email: "test@example.com",
      passwordHash: "secret123",
      safeField: "public_info"
    };

    logger.info("Test Log", sensitiveData);

    expect(consoleSpy).toHaveBeenCalled();
    const args = consoleSpy.mock.calls[0];
    
    // The message should be there
    expect(args[1]).toBe("Test Log");
    
    // The object should be redacted
    const meta = args[2] as any;
    expect(meta.email).toBe("[REDACTED]");
    expect(meta.passwordHash).toBe("[REDACTED]");
    expect(meta.safeField).toBe("public_info");
  });

  it("redacts nested sensitive keys", () => {
    const nested = {
      user: {
        profile: {
          fullName: "John Doe",
          id: "123"
        }
      }
    };

    logger.info("Nested Log", nested);
    
    const meta = consoleSpy.mock.calls[1][2] as any; // Second call
    expect(meta.user.profile.fullName).toBe("[REDACTED]");
    expect(meta.user.profile.id).toBe("123");
  });
});