// File: src/identity/svc/identity.svc.hashing.ts
// Documentation: File 04 (PII Handling)
// Domain: Identity
// Role: PII Normalization & SHA-256 Hashing

import { createHash } from 'crypto';

export function normalizeAndHash(value: string): string {
  if (!value) return '';
  
  // 1. Normalize (Trim + Lowercase)
  const clean = value.trim().toLowerCase();
  
  // 2. Add Salt (Prevent Rainbow Table attacks)
  const salt = process.env.HASH_SECRET || 'dev-salt';
  
  // 3. Hash
  return createHash('sha256').update(clean + salt).digest('hex');
}