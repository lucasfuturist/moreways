import { NextResponse } from 'next/server';
import { db } from '@/infra/db/client';
import { claims } from '@/infra/db/schema';
import { eq, desc } from 'drizzle-orm';

// SECURE THIS IN PROD: Add an API Key check header
const API_KEY = process.env.CRM_API_KEY || "dev-key";

export async function GET(req: Request) {
  const authHeader = req.headers.get('x-api-key');
  if (authHeader !== API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all "submitted" claims for the CRM to ingest
  const newClaims = await db.select()
    .from(claims)
    .where(eq(claims.status, 'submitted'))
    .orderBy(desc(claims.createdAt));

  return NextResponse.json({ 
    count: newClaims.length,
    data: newClaims.map(c => ({
      ...c,
      // FIX: formData is now 'jsonb' (native object), so we do NOT parse it.
      formData: c.formData || {}, 
    }))
  });
}