import { NextResponse } from 'next/server';
import { db } from '@/infra/db/client';
import { claims } from '@/infra/db/schema';
import { eq } from 'drizzle-orm';
import { StatusWebhookSchema } from '@/lib/api-hooks';

const API_KEY = process.env.CRM_API_KEY || "dev-key";

export async function POST(req: Request) {
  // 1. Security Check
  const authHeader = req.headers.get('x-api-key');
  if (authHeader !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Validate Payload
    const body = await req.json();
    const payload = StatusWebhookSchema.parse(body);

    // 3. Update Database
    await db.update(claims)
      .set({ 
        status: payload.newStatus,
        updatedAt: new Date(payload.updatedAt),
        // In a real app, we'd add the 'message' to a 'claim_timeline' table here
      })
      .where(eq(claims.id, payload.claimId));

    return NextResponse.json({ success: true, claimId: payload.claimId });
  } catch (e) {
    console.error("Webhook Error:", e);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}