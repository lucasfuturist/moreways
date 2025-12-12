// File: src/dispatch/svc/dispatch.svc.rehydrate.ts
// Domain: Dispatch
// Role: "Time Travel" - Reconstructs a session from history for offline events

import { db } from '../../core/db';
import { events, identities } from '../../core/db/core.db.schema';
import { eq, desc, isNotNull } from 'drizzle-orm';
import { EventPayload } from '../../ingest/types/ingest.types.payload';
import { normalizeAndHash } from '../../identity/svc/identity.svc.hashing';

export async function rehydrateSession(
  tenantId: string,
  identifiers: { email?: string; phone?: string; external_id?: string }
): Promise<Partial<EventPayload> | null> {
  
  // 1. Find Identity by hashed credentials
  const conditions = [];
  if (identifiers.email) conditions.push(eq(identities.emailHash, normalizeAndHash(identifiers.email)));
  if (identifiers.phone) conditions.push(eq(identities.phoneHash, normalizeAndHash(identifiers.phone)));
  if (identifiers.external_id) conditions.push(eq(identities.userId, identifiers.external_id));

  // If no identifiers provided, we can't look up
  if (conditions.length === 0) return null;

  const identity = await db.query.identities.findFirst({
    where: (t, { and, eq, or }) => and(
      eq(t.tenantId, tenantId),
      or(...conditions)
    )
  });

  if (!identity) return null;

  // 2. Find the "Golden Event" (Last Marketing Touch)
  // We want the most recent event that had Click Data (GCLID/FBCLID)
  const recentEvents = await db.query.events.findMany({
    where: eq(events.identityId, identity.id),
    orderBy: [desc(events.createdAt)],
    limit: 20,
    columns: {
      clickData: true,
      contextClient: true,
      contextCookies: true,
      consentPolicy: true,
      derivedGeo: true
    }
  });

  // Find best attribution source (prefer clicks over generic pageviews)
  const attributionEvent = recentEvents.find(e => 
    e.clickData && (e.clickData.gclid || e.clickData.fbclid || e.clickData.li_fat_id)
  ) || recentEvents[0];

  if (!attributionEvent) return null;

  // 3. Reconstruct Payload parts
  // We map the DB schema back to the Zod Payload schema
  return {
    anonymousId: identity.anonymousId,
    // @ts-ignore: Drizzle JSONB types can be tricky, casting safely here as we know the schema matches
    consent: attributionEvent.consentPolicy as any,
    context: {
      url: attributionEvent.contextClient?.page_url || 'https://offline.conversion',
      user_agent: attributionEvent.contextClient?.user_agent || 'Moreways/Offline-Importer',
      ip_address: '0.0.0.0', // Unknown IP for offline
    },
    click: (attributionEvent.clickData as any) || {},
    cookies: (attributionEvent.contextCookies as any) || {},
  };
}