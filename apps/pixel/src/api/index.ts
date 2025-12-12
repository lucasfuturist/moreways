// File: src/api/index.ts

import 'dotenv-safe/config';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono, Context, Next } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { runMigrations } from '../core/db/migrate';
import { trackRoute } from '../ingest/api/ingest.api.controller';
import { readRoute } from '../ingest/api/ingest.api.read';
import { privacyRoute } from '../privacy/api/privacy.api.erasure';
import { offlineRoute } from '../ingest/api/ingest.api.offline';
import { evidenceRoute } from '../reporting/api/reporting.api.evidence';
import { statsRoute } from '../reporting/api/reporting.api.stats';
import { db } from '../core/db';
import { tenants } from '../core/db/core.db.schema';
import { eq } from 'drizzle-orm';

type AppVariables = { tenantId: string };
const app = new Hono<{ Variables: AppVariables }>();

app.use('*', logger());

// [FIX] Explicit CORS to allow local testing
app.use('*', cors({
  origin: '*', // Allow all for testing
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-publishable-key', 'x-secret-key']
}));

app.get('/health', (c: Context) => c.json({ status: 'ok', timestamp: new Date() }));

// Auth Middlewares
const publicKeyAuth = async (c: Context, next: Next) => {
  const publicKey = c.req.header('x-publishable-key');
  if (!publicKey) return c.json({ error: 'Missing x-publishable-key header' }, 401);
  
  try {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.publicKey, publicKey),
      columns: { id: true }
    });
    if (!tenant) return c.json({ error: 'Invalid Public Key' }, 403);
    c.set('tenantId', tenant.id);
    await next();
  } catch (e: any) {
    console.error('Auth DB Error:', e);
    return c.json({ error: 'Auth Service Unavailable' }, 500);
  }
};

const secretKeyAuth = async (c: Context, next: Next) => {
  const secretKey = c.req.header('x-secret-key');
  if (!secretKey) return c.json({ error: 'Missing x-secret-key' }, 401);
  
  try {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.secretKey, secretKey),
      columns: { id: true }
    });
    if (!tenant) return c.json({ error: 'Invalid Secret Key' }, 403);
    c.set('tenantId', tenant.id);
    await next();
  } catch (e: any) {
    console.error('Auth DB Error:', e);
    return c.json({ error: 'Auth Service Unavailable' }, 500);
  }
};

app.use('*', secureHeaders({
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  xXssProtection: '1; mode=block',
  strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
  crossOriginResourcePolicy: 'cross-origin', 
  contentSecurityPolicy: { defaultSrc: ["'self'", "'unsafe-inline'"] }
}));

// Routes
app.use('/api/v1/track/*', publicKeyAuth);
app.route('/api/v1/track', trackRoute);
app.use('/api/v1/journey/*', publicKeyAuth);
app.route('/api/v1/journey', readRoute);
app.use('/api/v1/privacy/*', secretKeyAuth);
app.route('/api/v1/privacy/erasure', privacyRoute);
app.use('/api/v1/stats/*', secretKeyAuth);
app.route('/api/v1/stats', statsRoute);
app.route('/api/v1/offline', offlineRoute);
app.use('/api/v1/evidence/*', secretKeyAuth);
app.route('/api/v1/evidence', evidenceRoute);

// Serve Static Files
app.use('/*', serveStatic({ root: './public' }));

const port = Number(process.env.PORT) || 3003;

async function startServer() {
  try {
    console.log('📦 Attempting Database Migrations...');
    await runMigrations();
    console.log('✅ Migrations applied successfully');
  } catch (err: any) {
    console.error('⚠️ Migration Network Error (Skipping):', err.message);
  }

  console.log(`🚀 Attribution Engine running on port ${port}`);
  
  serve({ 
    fetch: app.fetch, 
    port: port,
    hostname: '0.0.0.0' 
  });
}

startServer().catch((err) => {
  console.error('❌ Critical Server Error:', err);
  process.exit(1);
});