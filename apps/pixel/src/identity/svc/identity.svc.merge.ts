// File: src/identity/svc/identity.svc.merge.ts
// Domain: Identity
// Role: Graph Stitching & Retroactive Attribution
// Upgrade: New Service for Identity Merging

import { db } from '../../core/db';
import { identities, events } from '../../core/db/core.db.schema';
import { eq, ne, isNull } from 'drizzle-orm';

export async function resolveIdentity(
  tenantId: string, 
  anonymousId: string, 
  emailHash?: string, 
  phoneHash?: string,
  userId?: string // External ID from payload
): Promise<string> {
  
  // 1. Find the current session identity (by Anonymous ID)
  // We only care about active identities (mergedInto IS NULL)
  let currentIdentity = await db.query.identities.findFirst({
    where: (t, { and, eq, isNull }) => and(
      eq(t.tenantId, tenantId),
      eq(t.anonymousId, anonymousId),
      isNull(t.mergedInto) 
    )
  });

  // If strictly new, create it immediately.
  if (!currentIdentity) {
    const [newId] = await db.insert(identities).values({
      tenantId,
      anonymousId,
      userId,
      emailHash,
      phoneHash
    }).returning();
    currentIdentity = newId;
  } else {
    // If found, update known hashes if we learned something new
    const updates: any = {};
    if (emailHash && !currentIdentity.emailHash) updates.emailHash = emailHash;
    if (phoneHash && !currentIdentity.phoneHash) updates.phoneHash = phoneHash;
    if (userId && !currentIdentity.userId) updates.userId = userId;

    if (Object.keys(updates).length > 0) {
      await db.update(identities)
        .set({ ...updates, lastSeenAt: new Date() })
        .where(eq(identities.id, currentIdentity.id));
    } else {
      // Just touch timestamp
      await db.update(identities)
        .set({ lastSeenAt: new Date() })
        .where(eq(identities.id, currentIdentity.id));
    }
  }

  // 2. RETROACTIVE CHECK: Do we have *other* identities with this Email/Phone?
  // If we don't have strong identifiers, we can't merge.
  if (!emailHash && !phoneHash) return currentIdentity.id;

  const matchConditions: any[] = [];
  // Note: Using raw SQL operator helpers passed by Drizzle's where callback is cleaner, 
  // but here we use the imported operators for clarity in complex logic.
  
  // Logic: Find any identity in this tenant...
  // ... that is NOT the current one ...
  // ... that IS active (not already merged) ...
  // ... that matches Email OR Phone.

  const duplicates = await db.query.identities.findMany({
    where: (t, { and, eq, or, ne, isNull }) => {
       const orConditions = [];
       if (emailHash) orConditions.push(eq(t.emailHash, emailHash));
       if (phoneHash) orConditions.push(eq(t.phoneHash, phoneHash));
       
       return and(
         eq(t.tenantId, tenantId),
         ne(t.id, currentIdentity!.id), 
         isNull(t.mergedInto),
         or(...orConditions)
       );
    },
    orderBy: (t, { asc }) => [asc(t.createdAt)] // Oldest is "Master"
  });

  if (duplicates.length === 0) return currentIdentity.id;

  // 3. MERGE STRATEGY: "Oldest Wins"
  // We want to keep the oldest ID (likely has the Ad Click) 
  // and merge the current (newer) session into it.
  
  const masterIdentity = duplicates[0]; // The oldest one
  const targetId = masterIdentity.id;
  const sourceId = currentIdentity.id;

  console.log(`[Identity] Merging ${sourceId} (New) -> ${targetId} (Master)`);

  await db.transaction(async (tx) => {
    // A. Move all events from Source -> Master
    await tx.update(events)
      .set({ identityId: targetId })
      .where(eq(events.identityId, sourceId));

    // B. Mark Source as Merged (Soft Delete)
    await tx.update(identities)
      .set({ mergedInto: targetId })
      .where(eq(identities.id, sourceId));
      
    // C. Update Master with any new PII from the Source
    // (e.g. Master had Email, Source had Phone -> Master gets Phone)
    const updates: any = { lastSeenAt: new Date() };
    if (phoneHash && !masterIdentity.phoneHash) updates.phoneHash = phoneHash;
    if (emailHash && !masterIdentity.emailHash) updates.emailHash = emailHash;
    if (userId && !masterIdentity.userId) updates.userId = userId;
    
    await tx.update(identities)
      .set(updates)
      .where(eq(identities.id, targetId));
  });

  return targetId;
}