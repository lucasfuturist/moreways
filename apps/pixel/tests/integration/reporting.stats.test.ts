// File: tests/integration/reporting.stats.test.ts
// Role: Verify Partner Dashboard Aggregations

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { statsRoute } from '../../src/reporting/api/reporting.api.stats';
import { db } from '../../src/core/db';

// [FIX] Use vi.hoisted to ensure variable exists before imports/mocks run
const mocks = vi.hoisted(() => ({
  execute: vi.fn()
}));

vi.mock('../../src/core/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          groupBy: vi.fn()
        }))
      }))
    })),
    execute: mocks.execute
  }
}));

const app = new Hono();
app.route('/stats', statsRoute);

describe('Reporting: Partner Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return AGGREGATE STATS for the overview', async () => {
    // 1. Mock the specific chain for volume stats
    const mockVolume = [{ type: 'lead', count: 10 }, { type: 'pageview', count: 1000 }];
    const mockQuality = [{ isBot: false, count: 900 }, { isBot: true, count: 100 }];
    
    // We mock the implementations of the chains based on the file's logic structure
    const selectMock = db.select as any;
    selectMock.mockImplementationOnce(() => ({ // Volume query
      from: () => ({ where: () => ({ groupBy: async () => mockVolume }) })
    })).mockImplementationOnce(() => ({ // Quality query
      from: () => ({ where: () => ({ groupBy: async () => mockQuality }) })
    }));

    // 2. Mock Raw SQL Execution (Revenue Query)
    mocks.execute.mockResolvedValue([
      { source_id: 'google', total_revenue: 50000, conversions: 5 },
      { source_id: 'facebook', total_revenue: 12000, conversions: 2 }
    ]);

    // 3. Request
    const res = await app.request('/stats/overview?from=2023-01-01&to=2023-01-31', {
      headers: { 'x-secret-key': 'admin_key' } 
    });

    // 4. Verify
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.funnel).toHaveLength(2);
    expect(json.top_sources[0].source_id).toBe('google');
    expect(json.top_sources[0].total_revenue).toBe(50000);
    expect(json.traffic_quality).toBeDefined();
  });
});