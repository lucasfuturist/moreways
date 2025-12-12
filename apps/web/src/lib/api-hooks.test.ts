import { describe, it, expect } from 'vitest';
import { StatusWebhookSchema } from './api-hooks';

describe('Data Integrity (Webhook Schemas)', () => {
  
  it('should VALIDATE a correct payload', () => {
    const validPayload = {
      claimId: "uuid-1234",
      newStatus: "accepted", // Valid enum
      updatedAt: "2023-10-05T14:48:00.000Z" // Valid ISO date
    };

    const result = StatusWebhookSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should REJECT invalid status enums', () => {
    const invalidPayload = {
      claimId: "uuid-1234",
      newStatus: "super_approved", // Not in the allow list
      updatedAt: new Date().toISOString()
    };

    const result = StatusWebhookSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Invalid enum");
    }
  });

  it('should REJECT missing required fields', () => {
    const partialPayload = {
      claimId: "uuid-1234",
      // Missing newStatus
    };

    const result = StatusWebhookSchema.safeParse(partialPayload);
    expect(result.success).toBe(false);
  });

  it('should REJECT invalid date formats', () => {
    const badDatePayload = {
      claimId: "123",
      newStatus: "draft",
      updatedAt: "tomorrow" // Not ISO
    };
    
    const result = StatusWebhookSchema.safeParse(badDatePayload);
    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error.issues[0].code).toBe("invalid_string");
    }
  });
});