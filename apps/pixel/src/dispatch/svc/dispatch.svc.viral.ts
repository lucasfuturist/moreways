// File: src/dispatch/svc/dispatch.svc.viral.ts
// Fix: Explicit type narrowing for clickData.mw_ref

import { db } from '../../core/db';
import { events, identities } from '../../core/db/core.db.schema'; 
import { sql, eq } from 'drizzle-orm';

type ViralResult = {
  isViral: boolean;
  originalIdentityId?: string;
};

export async function checkViralStatus(
  tenantId: string,
  currentIdentityId: string,
  clickData?: { gclid?: string; fbclid?: string; mw_ref?: string }
): Promise<ViralResult> {
  
  // 1. Direct Reference Check (The Strongest Signal)
  if (clickData?.mw_ref) {
    // [FIX] Capture in const to satisfy TypeScript strict null checks
    const viralRef = clickData.mw_ref;

    const referrer = await db.query.identities.findFirst({
      where: (t, { and, eq }) => and(
        eq(t.tenantId, tenantId),
        eq(t.anonymousId, viralRef)
      )
    });

    if (referrer) {
      return {
        isViral: true,
        originalIdentityId: referrer.id
      };
    }
  }

  // 2. Collision Check (The "Shared Link" Signal)
  if (!clickData?.gclid && !clickData?.fbclid) {
    return { isViral: false };
  }

  const searchKey = clickData.gclid ? 'gclid' : 'fbclid';
  const searchValue = clickData.gclid || clickData.fbclid;

  // Ensure searchValue is defined before querying (extra safety)
  if (!searchValue) return { isViral: false };

  const previousUsage = await db.query.events.findFirst({
    where: (t, { and, eq, ne }) => and(
      eq(t.tenantId, tenantId),
      ne(t.identityId, currentIdentityId),
      sql`${t.clickData}->>${searchKey} = ${searchValue}`
    ),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
    columns: { identityId: true }
  });

  if (previousUsage && previousUsage.identityId) {
    return {
      isViral: true,
      originalIdentityId: previousUsage.identityId || undefined
    };
  }

  return { isViral: false };
}