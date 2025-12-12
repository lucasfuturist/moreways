// File: src/reporting/api/reporting.api.stats.ts
// Domain: Reporting
// Role: Aggregate Analytics for Admin Dashboard

import { Hono } from 'hono';
import { db } from '../../core/db';
import { events } from '../../core/db/core.db.schema';
import { sql, and, gte, lte, eq } from 'drizzle-orm';

const app = new Hono<{ Variables: { tenantId: string } }>();

// GET /api/v1/stats/overview?from=2023-01-01&to=2023-02-01
app.get('/overview', async (c) => {
  const tenantId = c.get('tenantId');
  const from = c.req.query('from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const to = c.req.query('to') || new Date().toISOString();

  // 1. Volume Stats (Leads vs Traffic)
  const volume = await db
    .select({
      type: events.type,
      count: sql<number>`cast(count(*) as int)`
    })
    .from(events)
    .where(and(
      eq(events.tenantId, tenantId),
      gte(events.createdAt, new Date(from)),
      lte(events.createdAt, new Date(to))
    ))
    .groupBy(events.type);

  // 2. Revenue by Channel (The ROI view)
  // We extract the "channel" from the clickData or context using a SQL case/json extraction
  // Note: Complex grouping is often better done in a materialized view, but this works for V1.
  
  // Logic: Sum(metadata->value) grouped by derivedGeo->city (Example segmentation)
  // Real ROI attribution requires joining the journey model, but here we do a simple "Last Touch" approximation
  // based on the event's own clickData.
  
  const revenue = await db.execute(sql`
    SELECT 
      COALESCE(click_data->>'gclid', 'organic') as source_id,
      SUM(CAST(metadata->>'value' AS NUMERIC)) as total_revenue,
      COUNT(*) as conversions
    FROM events
    WHERE 
      tenant_id = ${tenantId} 
      AND created_at >= ${new Date(from)} 
      AND created_at <= ${new Date(to)}
      AND (type = 'purchase' OR type = 'offline_conversion')
    GROUP BY 1
    ORDER BY 2 DESC
    LIMIT 10
  `);

  // 3. Quality Control (Bot %)
  const quality = await db
    .select({
      isBot: sql`quality_score->>'is_bot'`,
      count: sql<number>`cast(count(*) as int)`
    })
    .from(events)
    .where(and(
      eq(events.tenantId, tenantId),
      gte(events.createdAt, new Date(from))
    ))
    .groupBy(sql`quality_score->>'is_bot'`);

  return c.json({
    period: { from, to },
    funnel: volume,
    top_sources: revenue,
    traffic_quality: quality
  });
});

export const statsRoute = app;