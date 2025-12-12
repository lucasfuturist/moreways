import { describe, it, expect } from 'vitest';
import { normalizeAndHash } from '../../src/identity/svc/identity.svc.hashing';
import { EventPayloadSchema } from '../../src/ingest/types/ingest.types.payload';

describe('Identity Logic', () => {
  it('should normalize email before hashing', () => {
    // Both should produce identical hashes despite casing/spaces
    const hash1 = normalizeAndHash('  Test@Example.com ');
    const hash2 = normalizeAndHash('test@example.com');
    
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 is 64 chars hex
  });

  it('should generate different hashes for different salts', () => {
    // Simulate changing env var
    const originalSalt = process.env.HASH_SECRET;
    
    process.env.HASH_SECRET = 'salt-A';
    const hashA = normalizeAndHash('user@example.com');
    
    process.env.HASH_SECRET = 'salt-B';
    const hashB = normalizeAndHash('user@example.com');
    
    expect(hashA).not.toBe(hashB);
    
    // Restore env
    process.env.HASH_SECRET = originalSalt;
  });
});

describe('Payload Validation', () => {
  it('should accept a valid payload', () => {
    const valid = {
      type: 'pageview',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000', // Valid UUID
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'https://google.com', user_agent: 'bot' }
    };
    
    const result = EventPayloadSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should reject invalid UUIDs', () => {
    const invalid = {
      type: 'pageview',
      anonymousId: 'not-a-uuid', 
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'https://google.com', user_agent: 'bot' }
    };
    
    const result = EventPayloadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject missing consent', () => {
    const invalid = {
      type: 'pageview',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000',
      // Missing consent object
      context: { url: 'https://google.com', user_agent: 'bot' }
    };
    
    const result = EventPayloadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});