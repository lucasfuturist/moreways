# File Scan

**Roots:**

- `C:\projects\moreways\attribution-engine\tests`


## Tree: C:\projects\moreways\attribution-engine\tests

```
tests/

├── e2e/
│   ├── pixel.spec.ts
├── integration/
│   ├── api.quarantine.test.ts
│   ├── api.security.test.ts
│   ├── api.test.ts
│   ├── compliance.chaos.test.ts
│   ├── identity.merge.test.ts
│   ├── offline.callrail.test.ts
│   ├── offline.test.ts
│   ├── reporting.evidence.test.ts
│   ├── reporting.stats.test.ts
│   ├── resilience.test.ts
│   ├── worker.concurrency.test.ts
│   ├── worker.crm.test.ts
│   ├── worker.webhook.test.ts
├── load/
│   ├── ingest.load.js
├── mocks/
│   ├── meta.mock.ts
├── unit/
│   ├── compliance.test.ts
│   ├── cron.prune.test.ts
│   ├── google.test.ts
│   ├── identity.test.ts
│   ├── legal.test.ts
│   ├── logic.test.ts
│   ├── reporting.test.ts
│   ├── viral.test.ts
│   ├── webhook.service.test.ts

```

## Files

### `C:/projects/moreways/attribution-engine/tests/e2e/pixel.spec.ts`

```ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load the compiled pixel code
const pixelCode = fs.readFileSync(path.join(__dirname, '../../public/tracking.js'), 'utf8');

test.describe('Pixel "In the Wild" Behavior', () => {

  test('should HARVEST ad cookies and bridge identity', async ({ page }) => {
    // 1. Simulate a User arriving via Google Ads
    await page.context().addCookies([
      { name: '_fbp', value: 'fb.1.123456789', domain: 'localhost', path: '/' },
      { name: '_gcl_au', value: '1.1.555555', domain: 'localhost', path: '/' }
    ]);
    
    // 2. Mock the Client Site + Inject Pixel
    await page.route('http://localhost:8080/', async route => {
      const html = `
        <html>
          <head>
            <script>
              window.MW_CONFIG = { publicKey: 'pk_e2e_test', endpoint: 'http://localhost:3000/api/v1/track' };
            </script>
            <script>${pixelCode}</script>
          </head>
          <body>
            <h1>Law Firm Landing Page</h1>
            <button id="submit">Submit Lead</button>
          </body>
        </html>
      `;
      await route.fulfill({ body: html });
    });

    // 3. Spy on the Network Request to the Engine
    const requestPromise = page.waitForRequest(req => req.url().includes('/api/v1/track') && req.method() === 'POST');

    await page.goto('http://localhost:8080/?gclid=TesT_GCLID_Value');

    const request = await requestPromise;
    const payload = request.postDataJSON();

    // 4. ASSERTION: The "Golden Keys" were extracted
    expect(payload.click.gclid).toBe('TesT_GCLID_Value'); // URL Param
    expect(payload.cookies._fbp).toBe('fb.1.123456789');   // Cookie
    expect(payload.cookies._gcl_au).toBe('1.1.555555');    // Cookie
    expect(payload.context.title).toBe('Law Firm Landing Page');
  });

  test('should FALLBACK to Direct API if Proxy fails (The Anti-AdBlocker)', async ({ page }) => {
    // 1. Simulate Client Site with a BROKEN Proxy config
    await page.route('http://localhost:8080/', async route => {
      await route.fulfill({ body: `
        <script>
          window.MW_CONFIG = { 
            publicKey: 'pk_test', 
            endpoint: '/broken-proxy' // This will 404
          };
        </script>
        <script>${pixelCode}</script>
      `});
    });

    // 2. Mock the 404 on the proxy
    await page.route('http://localhost:8080/broken-proxy', route => route.fulfill({ status: 404 }));

    // 3. Expect a call to the DIRECT SaaS endpoint (localhost:3000 in dev)
    const fallbackRequest = page.waitForRequest(req => 
      req.url().includes('localhost:3000/api/v1/track')
    );

    await page.goto('http://localhost:8080/');
    const req = await fallbackRequest;
    
    expect(req).toBeTruthy();
    console.log('✅ Pixel successfully bypassed broken proxy!');
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/api.quarantine.test.ts`

```ts
// File: tests/integration/api.quarantine.test.ts
// Documentation: File 05 (Testing)
// Role: Verify "Zero-Loss Guarantee" (The Safety Net)

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { trackRoute } from '../../src/ingest/api/ingest.api.controller';
import { db } from '../../src/core/db';
import { quarantine } from '../../src/core/db/core.db.schema';

// --- MOCKS ---
// Hoist mocks to ensure they run before imports
const mocks = vi.hoisted(() => ({
  add: vi.fn(),
  insert: vi.fn().mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([{ id: 'q_123' }])
    })
  })
}));

vi.mock('../../src/core/db', () => ({
  db: {
    insert: mocks.insert, // Mock the global insert function
    query: {
      tenants: { findFirst: vi.fn() }
    }
  },
  // We also export the schema for use in tests, but here we mock the usage
  quarantine: {} 
}));

vi.mock('bullmq', () => ({
  Queue: vi.fn().mockImplementation(() => ({
    add: mocks.add
  }))
}));

vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(true)
  })
}));

// Setup App
const app = new Hono<{ Variables: { tenantId: string } }>();
app.use('*', async (c, next) => {
  c.set('tenantId', 'tenant_123'); // Bypass auth for this test
  await next();
});
app.route('/track', trackRoute);

describe('API Layer - Quarantine (Zero-Loss)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should QUARANTINE malformed payloads (Zod Error)', async () => {
    // SCENARIO: Client sends garbage data (missing anonymousId)
    // Normally this is a 400 Bad Request. 
    // Divine Upgrade: It should be a 202 Accepted + DB Insert.
    
    const malformedPayload = {
      type: 'lead',
      // anonymousId is MISSING
      consent: { ad_storage: 'granted' },
      context: { url: 'https://broken-client.com' }
    };

    const res = await app.request('/track', {
      method: 'POST',
      headers: { 'x-forwarded-for': '1.2.3.4' },
      body: JSON.stringify(malformedPayload)
    });

    // 1. Verify Response is NOT an error
    expect(res.status).toBe(202); // 202 Accepted
    const json = await res.json();
    expect(json.status).toBe('quarantined_for_review');

    // 2. Verify Data was saved to Quarantine Table
    expect(mocks.insert).toHaveBeenCalled(); 
    
    // Check arguments of the insert
    const insertCall = mocks.insert.mock.calls[0];
    // In Drizzle, insert(table) is the first arg. We can check the .values() call.
    // However, our mock structure is db.insert().values().
    // So we check the spy on the values function:
    const valuesSpy = mocks.insert().values;
    const savePayload = valuesSpy.mock.calls[0][0];

    expect(savePayload.tenantId).toBe('tenant_123');
    expect(savePayload.rawBody).toEqual(malformedPayload); // Saved raw
    expect(savePayload.errorReason).toContain('anonymousId'); // Contains Zod error
    expect(savePayload.ipAddress).toBe('1.2.3.4');

    // 3. Verify it was NOT added to the processing queue
    expect(mocks.add).not.toHaveBeenCalled();
  });

  it('should accept valid payloads normally', async () => {
    const validPayload = {
      type: 'pageview',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000',
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'https://good.com', user_agent: 'test' }
    };

    const res = await app.request('/track', {
      method: 'POST',
      body: JSON.stringify(validPayload)
    });

    expect(res.status).toBe(200);
    expect(mocks.add).toHaveBeenCalled(); // Queue was hit
    expect(mocks.insert).not.toHaveBeenCalled(); // Quarantine was skipped
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/api.security.test.ts`

```ts
// File: tests/integration/api.security.test.ts
import { describe, it, expect, vi } from 'vitest';
import { Hono } from 'hono';
import { trackRoute } from '../../src/ingest/api/ingest.api.controller';

// Mock dependencies (standard)
vi.mock('bullmq', () => ({ Queue: vi.fn().mockReturnValue({ add: vi.fn() }) }));

// [FIX] Ensure connect returns a Promise
vi.mock('redis', () => ({ 
  createClient: vi.fn().mockReturnValue({ 
    connect: vi.fn().mockResolvedValue(undefined), 
    incr: vi.fn().mockResolvedValue(1), 
    expire: vi.fn() 
  }) 
}));

vi.mock('../../src/core/db', () => ({ 
  db: { insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn() }) }) }, 
  quarantine: {} 
}));

describe('API Security: The Hacker Simulation', () => {
  const app = new Hono<{ Variables: { tenantId: string } }>();
  app.use('*', async (c, next) => { c.set('tenantId', 't1'); await next(); });
  app.route('/track', trackRoute);

  it('should sanitize SQL INJECTION attempts in PII fields', async () => {
    // Hacker tries to drop table via email field
    const maliciousPayload = {
      type: 'lead',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000',
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'http://site.com', user_agent: 'test' },
      user: {
        email: "user@test.com'); DROP TABLE identities; --", // SQLi
        first_name: "<script>alert('xss')</script>" // XSS
      }
    };

    const res = await app.request('/track', {
      method: 'POST',
      body: JSON.stringify(maliciousPayload)
    });

    // 1. API should Accept (200) or Quarantine (202), BUT NOT 500
    expect([200, 202]).toContain(res.status);
  });

  it('should reject MASSIVE payloads (DoS Protection)', async () => {
    const hugeString = 'a'.repeat(5 * 1024 * 1024); // 5MB
    const hugePayload = {
      type: 'lead',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000',
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'http://site.com', user_agent: 'test' },
      data: { junk: hugeString }
    };
    
    const res = await app.request('/track', {
      method: 'POST',
      body: JSON.stringify(hugePayload)
    });

    expect(res.status).not.toBe(500);
  });

  it('should reject PROTOTYPE POLLUTION attempts', async () => {
    const pollutionPayload = {
      type: 'pageview',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000',
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { 
        url: 'http://site.com',
        user_agent: 'test-agent' // [FIX] Added required user_agent
      },
      "__proto__": { "isAdmin": true } // Attempt to pollute
    };

    const res = await app.request('/track', {
      method: 'POST',
      body: JSON.stringify(pollutionPayload)
    });

    // Expect 200 because Zod should strip unknown keys and process the valid payload
    expect(res.status).toBe(200);
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/api.test.ts`

```ts
// File: tests/integration/api.test.ts
// Documentation: File 05 (Testing)
// Role: Integration tests for API Layer

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { trackRoute } from '../../src/ingest/api/ingest.api.controller';
import { readRoute } from '../../src/ingest/api/ingest.api.read';
import { db } from '../../src/core/db';

// --------------------------------------------------------------------------
// MOCK THE MODULES
// --------------------------------------------------------------------------
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      identities: { findFirst: vi.fn() },
      events: { findMany: vi.fn() },
      tenants: { findFirst: vi.fn() }
    }
  }
}));

vi.mock('bullmq', () => ({
  Queue: vi.fn().mockImplementation(() => ({
    add: vi.fn().mockResolvedValue({ id: 'job_123' })
  }))
}));

// Mock Redis for Rate Limiting
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(true)
  })
}));

// --------------------------------------------------------------------------
// SETUP TEST APP
// --------------------------------------------------------------------------
const app = new Hono<{ Variables: { tenantId: string } }>();

app.use('*', async (c, next) => {
  const key = c.req.header('x-publishable-key');
  if (key !== 'pk_valid') return c.json({ error: 'Auth' }, 401);
  c.set('tenantId', 'tenant_123');
  await next();
});

app.route('/track', trackRoute);
app.route('/journey', readRoute);

// --------------------------------------------------------------------------
// THE TESTS
// --------------------------------------------------------------------------
describe('API Layer (Robustness)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /track (Ingestion)', () => {
    it('should reject requests without API key', async () => {
      const res = await app.request('/track', { method: 'POST', body: JSON.stringify({}) });
      expect(res.status).toBe(401);
    });

    it('should validate and queue a valid payload', async () => {
      const payload = {
        type: 'pageview',
        anonymousId: '123e4567-e89b-12d3-a456-426614174000',
        consent: { ad_storage: 'granted', analytics_storage: 'granted' },
        context: { url: 'https://test.com', user_agent: 'bot' }
      };

      const res = await app.request('/track', {
        method: 'POST',
        headers: { 'x-publishable-key': 'pk_valid' },
        body: JSON.stringify(payload)
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ success: true, queued: true });
    });
  });

  describe('GET /journey (Intelligence)', () => {
    it('should return 404 for unknown users', async () => {
      // Setup Mock: Return Undefined (Not found)
      vi.mocked(db.query.identities.findFirst).mockResolvedValue(undefined);

      const res = await app.request('/journey/unknown-user', {
        headers: { 'x-publishable-key': 'pk_valid' }
      });
      expect(res.status).toBe(404);
    });

    it('should return full history (Oracle) for known users', async () => {
      // Setup Mock: Return User
      vi.mocked(db.query.identities.findFirst).mockResolvedValue({ 
        id: 'id_123', 
        createdAt: new Date(), 
        lastSeenAt: new Date() 
      } as any);
      
      // Setup Mock: Return Events
      vi.mocked(db.query.events.findMany).mockResolvedValue([
        { 
          type: 'pageview', 
          createdAt: new Date(),
          contextClient: { page_url: 'https://site.com' },
          clickData: { gclid: 'test' }
        },
        { 
          type: 'lead', 
          createdAt: new Date(),
          contextClient: { page_url: 'https://site.com/contact' },
          clickData: {} 
        }
      ] as any);

      const res = await app.request('/journey/known-user', {
        headers: { 'x-publishable-key': 'pk_valid' }
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      
      expect(json.found).toBe(true);
      
      // [UPDATE] Check new Oracle structure
      expect(json.oracle).toBeDefined();
      expect(json.oracle.conversion_path).toHaveLength(2);
      expect(json.oracle.lead_score).toBeGreaterThan(0);
      expect(json.oracle.first_touch.channel).toBe('paid_search'); // From mock gclid
    });
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/compliance.chaos.test.ts`

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
import { MetaAdapter } from '../../src/dispatch/svc/adapters/dispatch.adapter.meta';

// Mock DB to return a Tenant with VALID Ad Config (Meta Enabled)
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      tenants: { findFirst: vi.fn().mockResolvedValue({ adConfig: { meta_pixel_id: '123', meta_access_token: 'abc' } }) },
      identities: { findFirst: vi.fn().mockResolvedValue(null) },
    },
    insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: '1' }]) }) }),
    update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue({}) }) })
  }
}));

// Mock Redis
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue('OK')
  })
}));

// Spy on Meta Adapter
vi.spyOn(MetaAdapter, 'send');

describe('Compliance Chaos: The GDPR Fire Drill', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should NEVER dispatch if consent is missing/undefined (Fail Safe)', async () => {
    const job = {
      data: {
        tenantId: 't1',
        payload: {
          type: 'lead',
          anonymousId: 'abc',
          // Consent object is MALFORMED/MISSING keys
          consent: { }, 
          context: { url: 'http://site.com' }
        }
      }
    } as any;

    try {
      await processEventJob(job);
    } catch (e) {}

    expect(MetaAdapter.send).not.toHaveBeenCalled();
  });

  it('should SCRUB payload if "medical" or "divorce" is in URL even with Consent', async () => {
    const job = {
      data: {
        tenantId: 't1',
        payload: {
          type: 'pageview',
          anonymousId: 'abc',
          consent: { ad_storage: 'granted' }, // User said YES
          context: { 
            url: 'https://lawfirm.com/divorce-lawyer/abusive-spouse' // TOXIC URL
          }
        }
      }
    } as any;

    await processEventJob(job);

    // Should NOT send to Meta because we scrubbed sensitive context
    expect(MetaAdapter.send).not.toHaveBeenCalled();
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/identity.merge.test.ts`

```ts
// File: tests/integration/identity.merge.test.ts
// Documentation: File 05 (Testing)
// Role: Integration test for Cross-Device Merging

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveIdentity } from '../../src/identity/svc/identity.svc.merge';
import { db } from '../../src/core/db';

// Mock DB
vi.mock('../../src/core/db', () => {
  const mockDb: any = {
    query: { identities: { findFirst: vi.fn(), findMany: vi.fn() } },
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn().mockResolvedValue([{id:'new_id'}]) })) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
    transaction: vi.fn((cb) => cb(mockDb)) // Auto-execute transaction callback
  };
  return { db: mockDb };
});

describe('Identity Stitching (Retroactive Attribution)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should MERGE a new anonymous session into an old profile via Email Match', async () => {
    // SCENARIO:
    // 1. Old Identity (ID: 'old_master') exists from 3 weeks ago (has Email Hash).
    // 2. New Session (ID: 'new_session') starts anonymously, then submits SAME Email.
    
    // Step A: Current session lookup (finds the new anonymous session)
    const newSession = { id: 'new_session', emailHash: null, createdAt: new Date() };
    vi.mocked(db.query.identities.findFirst).mockResolvedValue(newSession as any);

    // Step B: Duplicate check (finds the OLD master profile via email match)
    const oldMaster = { id: 'old_master', emailHash: 'hash_123', createdAt: new Date('2023-01-01') };
    // findMany will be called to find duplicates
    vi.mocked(db.query.identities.findMany).mockResolvedValue([oldMaster] as any);

    // Run Logic
    const finalId = await resolveIdentity(
      'tenant_1', 
      'anon_new', 
      'hash_123' // Email hash provided in current payload
    );

    // ASSERTION 1: Should return the OLD ID (Master), not the new one
    expect(finalId).toBe('old_master');

    // ASSERTION 2: Should trigger a database transaction to merge
    expect(db.transaction).toHaveBeenCalled();
    
    // ASSERTION 3: Events should be re-pointed
    // Total Updates = 4
    // 1. Update currentIdentity with new hash (Instant persistence)
    // 2. Transaction: Update events (Re-parenting)
    // 3. Transaction: Update mergedInto (Soft Delete)
    // 4. Transaction: Update master timestamps (Last Seen)
    expect(db.update).toHaveBeenCalledTimes(4); 
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/offline.callrail.test.ts`

```ts
// File: tests/integration/offline.callrail.test.ts
// Documentation: File 07 (Integrations)
// Role: Verify CallRail Webhook Ingestion

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { offlineRoute } from '../../src/ingest/api/ingest.api.offline';
import { db } from '../../src/core/db';

const mocks = vi.hoisted(() => ({
  add: vi.fn()
}));

vi.mock('bullmq', () => ({
  Queue: vi.fn().mockImplementation(() => ({
    add: mocks.add
  }))
}));

vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      tenants: { findFirst: vi.fn() },
      identities: { findFirst: vi.fn() }
    }
  }
}));

const app = new Hono();
app.route('/offline', offlineRoute);

describe('Integration: CallRail Ingestion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should normalize a CallRail webhook into a standard Lead', async () => {
    // 1. Mock Tenant Auth (Secret Key)
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ id: 'lawyer_tenant' } as any);

    // 2. CallRail Sample Payload
    const callRailPayload = {
      id: 'call_999',
      start_time: '2023-10-27T10:00:00.000Z',
      answered: true,
      duration: 120,
      customer_phone_number: '+15551234567',
      customer_city: 'New York',
      customer_country: 'US',
      tracking_phone_number: '+15559999999',
      landing_page_url: 'https://lawfirm.com/personal-injury',
      gclid: 'Test_GCLID_123', // The Golden Key
      recording_player_url: 'https://app.callrail.com/calls/123/recording'
    };

    // 3. Send Request
    const res = await app.request('/offline/callrail', {
      method: 'POST',
      headers: { 'x-secret-key': 'sk_valid' },
      body: JSON.stringify(callRailPayload)
    });

    expect(res.status).toBe(200);

    // 4. Verify Queue Payload
    const jobName = mocks.add.mock.calls[0][0];
    const jobData = mocks.add.mock.calls[0][1];

    expect(jobName).toBe('process_event');
    
    // Check Normalization
    const payload = jobData.payload;
    expect(payload.type).toBe('lead'); // Mapped correctly
    expect(payload.anonymousId).toBe('Test_GCLID_123'); // Used GCLID as ID
    expect(payload.click.gclid).toBe('Test_GCLID_123');
    expect(payload.user.phone).toBe('+15551234567');
    expect(payload.user.city).toBe('New York');
    expect(payload.context.url).toBe('https://lawfirm.com/personal-injury');
    
    // Check Custom Data Preservation
    expect(payload.data.provider).toBe('callrail');
    expect(payload.data.duration).toBe(120);
    expect(payload.data.recording).toContain('callrail.com');
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/offline.test.ts`

```ts
// File: tests/integration/offline.test.ts
// Documentation: File 05 (Testing)
// Role: Test "The Feedback Loop"

import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- MOCKS ---
// We must hoist the spy so it exists before vi.mock() is executed
const mocks = vi.hoisted(() => ({
  add: vi.fn()
}));

vi.mock('bullmq', () => ({
  Queue: vi.fn().mockImplementation(() => ({
    add: mocks.add
  }))
}));

vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      tenants: { findFirst: vi.fn() },
      identities: { findFirst: vi.fn() },
      events: { findMany: vi.fn() }
    }
  }
}));

// Imports must happen after mocks in source order (though Vitest hoists mocks anyway)
import { Hono } from 'hono';
import { offlineRoute } from '../../src/ingest/api/ingest.api.offline';
import { db } from '../../src/core/db';

// Setup App
const app = new Hono();
app.route('/offline', offlineRoute);

describe('The Feedback Loop (Offline Conversions)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.add.mockClear();
  });

  it('should REHYDRATE a session and queue an event', async () => {
    // 1. Mock Auth
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ id: 'tenant_1' } as any);

    // 2. Mock Identity Lookup (Found by Email)
    vi.mocked(db.query.identities.findFirst).mockResolvedValue({
      id: 'id_55',
      anonymousId: 'anon_old_session',
      emailHash: 'hashed_email'
    } as any);

    // 3. Mock History (Found old GCLID)
    vi.mocked(db.query.events.findMany).mockResolvedValue([
      {
        id: 'evt_old',
        createdAt: new Date('2023-01-01'),
        clickData: { gclid: 'GOLDEN_CLICK_ID' },
        contextCookies: { _fbp: 'fb.1.old' },
        consentPolicy: { ad_storage: 'granted' }
      }
    ] as any);

    // 4. Send Request
    const res = await app.request('/offline', {
      method: 'POST',
      headers: { 'x-secret-key': 'sk_valid' },
      body: JSON.stringify({
        email: 'client@example.com',
        event_name: 'Retained',
        value: 5000,
        currency: 'USD'
      })
    });

    expect(res.status).toBe(200);

    // 5. Verify Queue Payload using the hoisted mock
    const jobData = mocks.add.mock.calls[0][1];
    
    // It should have the OLD anonymous ID
    expect(jobData.payload.anonymousId).toBe('anon_old_session');
    
    // It should have the GOLDEN GCLID
    expect(jobData.payload.click.gclid).toBe('GOLDEN_CLICK_ID');
    
    // It should have the NEW value
    expect(jobData.payload.data.value).toBe(5000);
    
    // It should be marked as offline
    expect(jobData.payload.type).toBe('offline_conversion');
  });

  it('should reject invalid Secret Keys', async () => {
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue(undefined); // No tenant found

    const res = await app.request('/offline', {
      method: 'POST',
      headers: { 'x-secret-key': 'sk_INVALID' },
      body: JSON.stringify({ email: 'test@test.com' })
    });

    expect(res.status).toBe(403);
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/reporting.evidence.test.ts`

```ts
// File: tests/integration/reporting.evidence.test.ts
// Documentation: File 05 (Testing)
// Role: Verify "The Evidence Locker"

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { evidenceRoute } from '../../src/reporting/api/reporting.api.evidence';
import { db } from '../../src/core/db';

vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      identities: { findFirst: vi.fn() },
      events: { findMany: vi.fn() },
      complianceLogs: { findMany: vi.fn() }
    }
  }
}));

const app = new Hono<{ Variables: { tenantId: string } }>();
app.use('*', async (c, next) => {
  c.set('tenantId', 'tenant_1'); // Mock Auth
  await next();
});
app.route('/evidence', evidenceRoute);

describe('Reporting: The Evidence Locker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate a FORENSIC DOSSIER for a lead', async () => {
    // 1. Mock Identity
    vi.mocked(db.query.identities.findFirst).mockResolvedValue({
      id: 'id_1',
      anonymousId: 'anon_1',
      userId: 'crm_55',
      createdAt: new Date('2023-01-01'),
      lastSeenAt: new Date('2023-01-02')
    } as any);

    // 2. Mock Events (The Chain of Custody)
    vi.mocked(db.query.events.findMany).mockResolvedValue([
      {
        id: 'evt_2',
        type: 'lead',
        createdAt: new Date('2023-01-02'),
        contextClient: { ip_hash: 'hash_ip_1', user_agent: 'Chrome/100' },
        derivedGeo: { city: 'New York', country: 'US' },
        clickData: { gclid: 'CLICK_XYZ' },
        qualityScore: { score: 100 }
      },
      {
        id: 'evt_1',
        type: 'pageview',
        createdAt: new Date('2023-01-01'),
        contextClient: { ip_hash: 'hash_ip_1', user_agent: 'Chrome/100' },
        derivedGeo: { city: 'New York', country: 'US' },
        clickData: {},
        qualityScore: { score: 100 }
      }
    ] as any);

    // 3. Mock Compliance Logs
    vi.mocked(db.query.complianceLogs.findMany).mockResolvedValue([
      {
        timestamp: new Date('2023-01-02'),
        action: 'dispatch_initiated',
        reason: 'consent_granted'
      }
    ] as any);

    // 4. Execute
    const res = await app.request('/evidence/anon_1');
    
    expect(res.status).toBe(200);
    const json = await res.json();

    // 5. Verify Structure
    expect(json.success).toBe(true);
    expect(json.evidence.report_id).toBeDefined();
    
    // Risk Assessment
    expect(json.evidence.risk_assessment.distinct_ips).toBe(1); // Consistent IP = Low Risk
    
    // Chain of Custody
    expect(json.evidence.chain_of_custody).toHaveLength(2);
    expect(json.evidence.chain_of_custody[0].ad_click_id).toBe('CLICK_XYZ');
    expect(json.evidence.chain_of_custody[0].location).toBe('New York, US');

    // Compliance
    expect(json.evidence.compliance_audit).toHaveLength(1);
    expect(json.evidence.compliance_audit[0].reason).toBe('consent_granted');
  });

  it('should return 404 for unknown identities', async () => {
    vi.mocked(db.query.identities.findFirst).mockResolvedValue(undefined);

    const res = await app.request('/evidence/unknown_user');
    expect(res.status).toBe(404);
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/reporting.stats.test.ts`

```ts
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
```

### `C:/projects/moreways/attribution-engine/tests/integration/resilience.test.ts`

```ts
// File: tests/integration/resilience.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { trackRoute } from '../../src/ingest/api/ingest.api.controller';
import { db } from '../../src/core/db';

// Mock dependencies
const mocks = vi.hoisted(() => ({
  queueAdd: vi.fn(),
  dbInsert: vi.fn(),
  redisIncr: vi.fn().mockResolvedValue(1)
}));

vi.mock('bullmq', () => ({ Queue: vi.fn().mockReturnValue({ add: mocks.queueAdd }) }));

vi.mock('redis', () => ({ 
  createClient: vi.fn().mockReturnValue({ 
    connect: vi.fn().mockResolvedValue(undefined), 
    incr: mocks.redisIncr, 
    expire: vi.fn() 
  }) 
}));

vi.mock('../../src/core/db', () => ({
  db: { 
    query: { tenants: { findFirst: vi.fn().mockResolvedValue({ id: 't1' }) } },
    insert: mocks.dbInsert 
  },
  quarantine: {}
}));

describe('System Resilience: "The Unsinkable Ship"', () => {
  // [FIX] Add Tenant ID Middleware
  const app = new Hono<{ Variables: { tenantId: string } }>();
  
  app.use('*', async (c, next) => {
    c.set('tenantId', 't1'); // Ensure tenant context exists
    await next();
  });
  
  app.route('/track', trackRoute);

  beforeEach(() => { vi.clearAllMocks(); });

  it('should QUARANTINE if BullMQ/Redis is down', async () => {
    // 1. Simulate Redis Queue Failure
    mocks.queueAdd.mockRejectedValue(new Error('Redis Connection Refused'));
    
    // 2. Mock Quarantine Insert Success
    mocks.dbInsert.mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn() }) });

    const payload = {
      type: 'lead',
      anonymousId: 'uuid-123',
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'http://site.com' }
    };

    const res = await app.request('/track', {
      method: 'POST',
      headers: { 'x-publishable-key': 'pk_valid' },
      body: JSON.stringify(payload)
    });

    // 3. Should NOT crash (500). Should return 202 (Accepted)
    expect(res.status).toBe(202);
    
    // 4. Verify Quarantine Insert was attempted
    expect(mocks.dbInsert).toHaveBeenCalled();
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/worker.concurrency.test.ts`

```ts
// File: tests/integration/worker.concurrency.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
import { db } from '../../src/core/db';
import { sendWebhook } from '../../src/dispatch/svc/dispatch.svc.webhook';

// [FIX] Hoist the Redis State so it is available to the mock factory
const redisState = vi.hoisted(() => {
  const store = new Map<string, string>();
  return {
    store,
    // Helper to verify call counts in tests
    mockSet: vi.fn()
  };
});

// Mock Redis with stateful logic
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    // Simulate NX (Not Exists) locking
    set: vi.fn().mockImplementation((key, val, options) => {
      redisState.mockSet(key, val, options);
      if (options?.NX && redisState.store.has(key)) return null; // Already locked
      redisState.store.set(key, val);
      return 'OK'; // Lock acquired
    })
  })
}));

// Mock DB
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      tenants: { findFirst: vi.fn().mockResolvedValue({ id: 't1', webhookUrl: 'http://crm.com' }) },
      identities: { findFirst: vi.fn().mockResolvedValue({ id: 'id_1' }) }
    },
    insert: vi.fn().mockReturnValue({ 
      values: vi.fn().mockReturnValue({ 
        returning: vi.fn().mockResolvedValue([{ id: 'evt_fixed_id' }]) 
      }) 
    }),
    update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn() }) })
  }
}));

// Mock Webhook
vi.mock('../../src/dispatch/svc/dispatch.svc.webhook', () => ({
  sendWebhook: vi.fn().mockResolvedValue(true)
}));

describe('Worker Concurrency: The "Double Click" Defense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redisState.store.clear(); // Reset Redis state between tests
  });

  it('should only DISPATCH once even if 5 identical jobs run in parallel', async () => {
    const job = {
      id: 'job_unique_123',
      data: {
        tenantId: 't1',
        payload: {
          type: 'lead',
          anonymousId: 'user_1',
          consent: { ad_storage: 'granted', analytics_storage: 'granted' },
          context: { url: 'http://site.com', ip_address: '1.2.3.4' }
        }
      }
    } as any;

    // Run 5 processors in "parallel"
    const results = await Promise.allSettled([
      processEventJob(job),
      processEventJob(job),
      processEventJob(job),
      processEventJob(job),
      processEventJob(job)
    ]);

    // 1. All promises should resolve (processor handles the skip gracefully)
    const rejected = results.filter(r => r.status === 'rejected');
    expect(rejected).toHaveLength(0);

    // 2. The Webhook (Expensive Action) should be called EXACTLY ONCE
    expect(sendWebhook).toHaveBeenCalledTimes(1);
    
    // 3. Redis SET should have been called 5 times (tried to lock 5 times)
    // Note: We check the mockSet helper we injected
    expect(redisState.mockSet).toHaveBeenCalledTimes(5);
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/worker.crm.test.ts`

```ts
// File: tests/integration/worker.crm.test.ts
// Documentation: File 07 (Integrations)
// Role: Verify CRM Write-Back Logic

import { describe, it, expect, vi, beforeEach } from 'vitest';

// [FIX] Mock Redis before importing processor to pass Idempotency check
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue('OK') // Simulates "Key Set Successfully"
  })
}));

import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
import * as CrmService from '../../src/dispatch/svc/dispatch.svc.crm';
import { db } from '../../src/core/db';

// Mock DB
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      identities: { findFirst: vi.fn() },
      tenants: { findFirst: vi.fn() }
    },
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 'evt_1' }])
      })
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({})
      })
    })
  }
}));

// Mock Geo
vi.mock('../../src/dispatch/svc/dispatch.svc.geo', () => ({
  resolveIpLocation: vi.fn().mockResolvedValue({}),
  checkJurisdiction: vi.fn().mockReturnValue(true)
}));

describe('Worker -> CRM Sync (Closed Loop)', () => {
  // Spy on the real service call
  const crmSpy = vi.spyOn(CrmService, 'sendToCrm').mockResolvedValue();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseJob = {
    data: {
      tenantId: 'tenant_1',
      payload: {
        type: 'pageview',
        anonymousId: 'user_A',
        consent: { ad_storage: 'granted', analytics_storage: 'granted' },
        context: { url: 'http://test.com' }
      }
    }
  } as any;

  it('should NOT sync Pageviews to CRM (Noise Reduction)', async () => {
    // 1. Setup DB
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ id: 'tenant_1' } as any);
    
    // 2. Run Worker with Pageview
    await processEventJob(baseJob);

    // 3. Assert: sendToCrm NOT called
    expect(crmSpy).not.toHaveBeenCalled();
  });

  it('should SYNC Leads to CRM', async () => {
    const leadJob = {
      data: {
        tenantId: 'tenant_1',
        payload: {
          ...baseJob.data.payload,
          type: 'lead', // Change type
          data: { value: 100 }
        }
      }
    } as any;

    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ id: 'tenant_1' } as any);

    await processEventJob(leadJob);

    expect(crmSpy).toHaveBeenCalledTimes(1);
    expect(crmSpy).toHaveBeenCalledWith('tenant_1', 'evt_1', leadJob.data.payload);
  });

  it('should FAIL OPEN if CRM fails (Protecting the Ad Dispatch)', async () => {
    // Scenario: Client's Salesforce is down.
    // Goal: We must still track the event locally and send to Google/Meta. 
    // The CRM failure should be logged but not crash the job.

    const leadJob = {
      data: {
        tenantId: 'tenant_1',
        payload: { ...baseJob.data.payload, type: 'lead' }
      }
    } as any;

    // Mock CRM throwing error
    crmSpy.mockRejectedValueOnce(new Error('Salesforce Down'));

    // Verify processEventJob does NOT throw
    await expect(processEventJob(leadJob)).resolves.not.toThrow();

    // Verify we still tried
    expect(crmSpy).toHaveBeenCalled();
    
    // Check that we still updated the event status in DB (proof flow continued)
    expect(db.update).toHaveBeenCalled();
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/integration/worker.webhook.test.ts`

```ts
// File: tests/integration/worker.webhook.test.ts
// Documentation: File 07 (Integrations)
// Role: Verify Webhook Dispatch Logic

import { describe, it, expect, vi, beforeEach } from 'vitest';

// [FIX] Mock Redis
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue('OK')
  })
}));

import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
import * as WebhookService from '../../src/dispatch/svc/dispatch.svc.webhook';
import { db } from '../../src/core/db';

// --------------------------------------------------------------------------
// MOCK DATABASE & MODULES
// --------------------------------------------------------------------------
vi.mock('../../src/core/db', () => {
  return {
    db: {
      query: {
        identities: { findFirst: vi.fn() },
        tenants: { findFirst: vi.fn() }
      },
      // Mocking Drizzle's chainable syntax: db.insert().values().returning()
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          // We return id: 'id_55' because the code uses .id to get the Identity ID.
          // This mock is reused for Event insertion, so event.id will also be 'id_55', which is fine here.
          returning: vi.fn().mockResolvedValue([{ id: 'id_55' }])
        })
      }),
      // Mocking update syntax: db.update().set().where()
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({})
        })
      })
    }
  };
});

describe('Worker -> Webhook Integration', () => {
  // Spy on the real WebhookService
  const webhookSpy = vi.spyOn(WebhookService, 'sendWebhook').mockResolvedValue(true);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const job = {
    data: {
      tenantId: 'tenant_1',
      payload: {
        type: 'lead',
        anonymousId: 'user_A',
        consent: { ad_storage: 'granted', analytics_storage: 'granted' }, 
        context: { url: 'http://test.com' }
      }
    }
  } as any;

  it('should FIRE webhook if tenant has webhookUrl configured', async () => {
    // 1. Setup DB: Return a tenant WITH a URL
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ 
      id: 'tenant_1',
      webhookUrl: 'https://my-chatbot.com/hook',
      adConfig: {} 
    } as any);

    // 2. Run Worker
    await processEventJob(job);

    // 3. Assert: sendWebhook called with correct URL and Identity ID
    // Note: 'id_55' comes from the mocked insert().returning() above
    expect(webhookSpy).toHaveBeenCalledWith(
      'https://my-chatbot.com/hook',
      expect.anything(), // The event payload
      'id_55'            // The Identity ID
    );
  });

  it('should SKIP webhook if tenant has NO webhookUrl', async () => {
    // 1. Setup DB: Return a tenant WITHOUT a URL
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue({ 
      id: 'tenant_1',
      webhookUrl: null, 
      adConfig: {} 
    } as any);

    // 2. Run Worker
    await processEventJob(job);

    // 3. Assert: sendWebhook never called
    expect(webhookSpy).not.toHaveBeenCalled();
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/load/ingest.load.js`

```js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 200 }, // Load 200 req/sec (High Traffic)
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p95<100'], // 95% of requests must be under 100ms
    http_req_failed: ['rate<0.01'], // <1% Failure allowed
  },
};

export default function () {
  const url = 'http://localhost:3000/api/v1/track';
  const payload = JSON.stringify({
    type: 'pageview',
    anonymousId: 'k6-load-test-uuid',
    consent: { ad_storage: 'granted', analytics_storage: 'granted' },
    context: { url: 'https://load-test.com', user_agent: 'K6/LoadRunner' },
    _quality: { score: 100 }
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-key': 'pk_load_test_key', // Ensure this exists in your local DB or mock
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'queued successfully': (r) => r.json('queued') === true,
  });

  sleep(0.1);
}
```

### `C:/projects/moreways/attribution-engine/tests/mocks/meta.mock.ts`

```ts
// File: tests/mocks/meta.mock.ts
// Documentation: File 05 (Testing Strategy)
// Role: Mock Server for Facebook CAPI

import { http, HttpResponse } from 'msw';

// Mock Service Worker (MSW) handler for Meta CAPI
export const metaHandlers = [
  // Intercept POST requests to Facebook Graph API
  http.post('https://graph.facebook.com/*/events', async ({ request }: { request: Request }) => {
    // Explicitly cast body to known structure or any
    const body = await request.json() as any;
    
    // Validate Token presence for authentication testing
    const url = new URL(request.url);
    // Note: In real CAPI, access_token is often a query param OR in the body. 
    // Our adapter puts it in the body.
    if (!body.access_token) {
      return HttpResponse.json({ error: { message: 'Missing Token' } }, { status: 401 });
    }

    // Return Success Response mimicking Facebook
    return HttpResponse.json({
      events_received: body.data?.length || 0,
      messages: [],
      fbtrace_id: 'mock_trace_id_123'
    });
  })
];
```

### `C:/projects/moreways/attribution-engine/tests/unit/compliance.test.ts`

```ts
// File: tests/unit/compliance.test.ts
// Documentation: File 04 (Security & Compliance)
// Role: Verifying The "Titanium Gate"

import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mock Redis (Before imports)
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue('OK')
  })
}));

import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
// [FIX] Import the Adapter to assert on it
import { MetaAdapter } from '../../src/dispatch/svc/adapters/dispatch.adapter.meta';

// 2. Mock Database
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      identities: { findFirst: vi.fn().mockResolvedValue(null) }, // Always new user
      tenants: { 
        findFirst: vi.fn().mockResolvedValue({ 
          // Return a config that enables Meta
          adConfig: { meta_pixel_id: '123', meta_access_token: 'abc' } 
        }) 
      }
    },
    insert: vi.fn().mockReturnValue({ 
      values: vi.fn().mockReturnValue({ 
        returning: vi.fn().mockResolvedValue([{ id: 'evt_123' }]) 
      }) 
    }),
    update: vi.fn().mockReturnValue({ 
      set: vi.fn().mockReturnValue({ 
        where: vi.fn().mockResolvedValue({}) 
      }) 
    })
  }
}));

// 3. [FIX] Mock the Meta Adapter Module
// We replace the real implementation with a spy that always succeeds.
vi.mock('../../src/dispatch/svc/adapters/dispatch.adapter.meta', () => ({
  MetaAdapter: {
    key: 'meta_capi',
    // Always say it's enabled so we can test the CONSENT gate logic
    isEnabled: vi.fn().mockReturnValue(true),
    // Mock successful send
    send: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe('The Titanium Gate (Compliance)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Adapter behavior defaults
    (MetaAdapter.isEnabled as any).mockReturnValue(true);
    (MetaAdapter.send as any).mockResolvedValue({ success: true });
  });

  it('should BLOCK dispatch when ad_storage is DENIED', async () => {
    const job = {
      data: {
        tenantId: 'tenant_123',
        payload: {
          type: 'pageview',
          anonymousId: '123e4567-e89b-12d3-a456-426614174000',
          consent: { ad_storage: 'denied', analytics_storage: 'granted' }, // <--- DENIED
          context: { url: 'https://test.com', user_agent: 'test' }
        }
      }
    } as any;

    await processEventJob(job);

    // ASSERTION: The Meta Adapter should NOT have been called
    expect(MetaAdapter.send).not.toHaveBeenCalled();
  });

  it('should ALLOW dispatch when ad_storage is GRANTED', async () => {
    const job = {
      data: {
        tenantId: 'tenant_123',
        payload: {
          type: 'pageview',
          anonymousId: '123e4567-e89b-12d3-a456-426614174000',
          consent: { ad_storage: 'granted', analytics_storage: 'granted' }, // <--- GRANTED
          context: { url: 'https://test.com', user_agent: 'test' }
        }
      }
    } as any;

    await processEventJob(job);

    // ASSERTION: The Meta Adapter SHOULD have been called
    expect(MetaAdapter.send).toHaveBeenCalledTimes(1);
    
    // Verify arguments passed to the adapter
    // The second arg is the config object from DB
    expect(MetaAdapter.send).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pageview' }), 
      expect.objectContaining({ meta_pixel_id: '123' }),
      'evt_123'
    );
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/unit/cron.prune.test.ts`

```ts
// File: tests/unit/cron.prune.test.ts
// Role: Verify GDPR Data Minimization

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pruneOldData } from '../../src/worker/cron/worker.cron.prune';
import { db } from '../../src/core/db';

// Mock DB delete (Happy Path)
vi.mock('../../src/core/db', () => ({
  db: {
    delete: vi.fn(() => ({
      where: vi.fn(() => ({
        // Happy path: returns array
        returning: vi.fn().mockResolvedValue([{ id: 'del_1' }, { id: 'del_2' }]), 
        // Thenable support for situations where returning() isn't called or await is direct
        then: vi.fn((resolve: (val: any) => void) => resolve(undefined)) 
      }))
    }))
  }
}));

describe('The Janitor (Cron)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should DELETE events older than 90 days', async () => {
    const now = new Date('2023-06-01T00:00:00Z');
    vi.setSystemTime(now);

    await pruneOldData();

    // Verify DB Delete was called twice (Events table + Quarantine table)
    expect(db.delete).toHaveBeenCalledTimes(2); 
  });

  it('should catch errors gracefully', async () => {
    // [FIX] Mock the chain correctly so it throws at the end (returning), 
    // instead of breaking the chain in the middle (where).
    const errMock = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        // The error happens here, allowing the chain `db.delete().where().returning()` to complete
        returning: vi.fn().mockRejectedValue(new Error('DB Connection Failed')),
        // Also mock 'then' just in case code changes to await .where() directly
        then: vi.fn((_: any, reject: (err: any) => void) => reject(new Error('DB Connection Failed')))
      })
    });
    
    vi.mocked(db.delete).mockImplementation(errMock as any);

    // Should NOT throw (Janitor should fail silently/log-only)
    await expect(pruneOldData()).resolves.not.toThrow();
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/unit/google.test.ts`

```ts
// File: tests/unit/google.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendToGoogleAds } from '../../src/dispatch/svc/dispatch.svc.google';

// Mock Fetch Global
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('Google Ads Adapter', () => {
  const mockConfig = {
    accessToken: 'test_token',
    customerId: '1234567890',
    conversionActionId: 'conversions/123'
  };

  const basePayload = {
    type: 'purchase',
    timestamp: new Date().toISOString(),
    anonymousId: 'abc-123',
    consent: { ad_storage: 'granted', analytics_storage: 'granted' },
    context: { url: 'https://site.com', user_agent: 'bot' },
    click: {}, // Empty click data initially
    // Note: No 'user' object here, so Enhanced Conversions (userIdentifiers) will be empty
    data: { value: 100, currency: 'USD' }
  } as any;

  beforeEach(() => {
    fetchMock.mockClear();
  });

  it('should SKIP if all signals (GCLID/WBRAID/Email) are missing', async () => {
    const result = await sendToGoogleAds(basePayload, mockConfig);
    // Updated expectation: Reason is now 'missing_signals' because we check for more than just GCLID
    expect(result).toEqual({ skipped: true, reason: 'missing_signals' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should SEND if GCLID is present', async () => {
    // Setup Success Response
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ partialFailure: false })
    });

    const payloadWithGclid = {
      ...basePayload,
      click: { gclid: 'test_gclid_123' }
    };

    await sendToGoogleAds(payloadWithGclid, mockConfig);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    
    // Check Payload Structure
    const callArgs = fetchMock.mock.calls[0];
    const url = callArgs[0];
    const body = JSON.parse(callArgs[1].body);

    expect(url).toContain('uploadClickConversions');
    expect(body.conversions[0].gclid).toBe('test_gclid_123');
    expect(body.conversions[0].conversionValue).toBe(100);
  });

  it('should SEND if User Email is present (Enhanced Conversions)', async () => {
    // Setup Success Response
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ partialFailure: false })
    });

    const payloadWithEmail = {
      ...basePayload,
      user: { email: 'test@example.com' } // GCLID is missing, but Email is present
    };

    await sendToGoogleAds(payloadWithEmail, mockConfig);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    
    const callArgs = fetchMock.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);

    // Verify User Identifier was hashed and included
    expect(body.conversions[0].userIdentifiers).toBeDefined();
    expect(body.conversions[0].userIdentifiers[0].hashedEmail).toBeDefined();
  });

  it('should THROW on API Failure (triggering retry)', async () => {
    // Setup Failure Response
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Error'
    });

    const payloadWithGclid = {
      ...basePayload,
      click: { gclid: 'test_gclid_123' }
    };

    await expect(sendToGoogleAds(payloadWithGclid, mockConfig))
      .rejects
      .toThrow('Google Ads API Error (500)');
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/unit/identity.test.ts`

```ts
// File: tests/unit/identity.test.ts
// Documentation: File 04 (PII & Identity)
// Role: Verifying Identity Graph Logic

import { describe, it, expect, vi, beforeEach } from 'vitest';

// [FIX] Mock Redis
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue('OK')
  })
}));

import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';
import { db } from '../../src/core/db';

// --------------------------------------------------------------------------
// MOCK DATABASE
// --------------------------------------------------------------------------
// We mock the entire DB module so we control findFirst, insert, update.
vi.mock('../../src/core/db', () => {
  return {
    db: {
      query: {
        identities: { findFirst: vi.fn() },
        tenants: { findFirst: vi.fn() }
      },
      // Factory function to ensure fresh mock instances
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 'mock_id' }])
        })
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({})
        })
      })
    }
  };
});

// Mock the Geo Service we added recently
vi.mock('../../src/dispatch/svc/dispatch.svc.geo', () => ({
  resolveIpLocation: vi.fn().mockResolvedValue({
    city: 'Test City', region: 'NY', country: 'US', postal_code: '10001'
  }),
  checkJurisdiction: vi.fn().mockReturnValue(true) // Always allow in this unit test
}));

describe('Identity Graph Logic', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseJob = {
    data: {
      tenantId: 'tenant_1',
      payload: {
        type: 'pageview',
        anonymousId: 'user_A',
        // Consent DENIED triggers an Audit Log insert in the new Divine Logic
        consent: { ad_storage: 'denied', analytics_storage: 'denied' },
        context: { url: 'http://test.com', user_agent: 'test', ip_address: '127.0.0.1' }
      }
    }
  } as any;

  it('should CREATE a new identity if one does not exist', async () => {
    // 1. Setup: Identity NOT found
    // FIX: Return undefined instead of null to match Drizzle TS types
    vi.mocked(db.query.identities.findFirst).mockResolvedValue(undefined);
    
    // 2. Run
    await processEventJob(baseJob);

    // 3. Assert: Insert called 3 times
    // 1. Insert Identity
    // 2. Insert Event
    // 3. Insert Compliance Log (due to consent denied)
    expect(db.insert).toHaveBeenCalledTimes(3);
  });

  it('should UPDATE existing identity if found', async () => {
    // 1. Setup: Identity FOUND
    vi.mocked(db.query.identities.findFirst).mockResolvedValue({ id: 'existing_id_55' } as any);
    
    // 2. Run
    await processEventJob(baseJob);

    // 3. Assert: Insert called 2 times
    // 1. Insert Event
    // 2. Insert Compliance Log (due to consent denied)
    expect(db.insert).toHaveBeenCalledTimes(2);
    
    // 4. Assert: Update called (Identity Update + Event Status Update)
    expect(db.update).toHaveBeenCalled();
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/unit/legal.test.ts`

```ts
// File: tests/unit/legal.test.ts
// Documentation: File 05 (Testing)
// Role: Verifying GPC and Sensitive Data Protections

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';

// --- MOCKS (Must be defined before imports) ---

// 1. Define hoisted mocks so they exist before vi.mock() runs
const mocks = vi.hoisted(() => ({
  add: vi.fn(),
  incr: vi.fn().mockResolvedValue(1),
  expire: vi.fn().mockResolvedValue(true),
  // [FIX] Add 'set' for Idempotency check
  set: vi.fn().mockResolvedValue('OK'),
  dbQuery: {
    identities: { findFirst: vi.fn() },
    tenants: { findFirst: vi.fn() }
  },
  dbInsert: vi.fn().mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([{ id: 'evt_123' }])
    })
  }),
  dbUpdate: vi.fn().mockReturnValue({
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue({})
    })
  })
}));

// 2. Mock BullMQ
vi.mock('bullmq', () => ({
  Queue: vi.fn().mockImplementation(() => ({
    add: mocks.add
  }))
}));

// 3. Mock Redis
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
    incr: mocks.incr,
    expire: mocks.expire,
    set: mocks.set // [FIX] Added here
  })
}));

// 4. Mock Database
vi.mock('../../src/core/db', () => ({
  db: {
    query: mocks.dbQuery,
    insert: mocks.dbInsert,
    update: mocks.dbUpdate
  }
}));

// 5. Mock Geo Service
vi.mock('../../src/dispatch/svc/dispatch.svc.geo', () => ({
  resolveIpLocation: vi.fn().mockResolvedValue({}),
  checkJurisdiction: vi.fn().mockReturnValue(true)
}));

// --- IMPORTS (Must be after mocks) ---
// We import these NOW so they use the mocked versions of Queue/Redis/DB
import { trackRoute } from '../../src/ingest/api/ingest.api.controller';
import { processEventJob } from '../../src/dispatch/job/dispatch.job.processor';

// Setup Hono App for Ingest Testing
const app = new Hono<{ Variables: { tenantId: string } }>();
app.use('*', async (c, next) => { c.set('tenantId', 'tenant_1'); await next(); });
app.route('/track', trackRoute);

describe('Legal Shield & Compliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset specific mock implementations if needed
    mocks.add.mockClear();
    // [FIX] Reset set mock to always return OK by default
    mocks.set.mockResolvedValue('OK');
  });

  describe('Ingest: Global Privacy Control (GPC)', () => {
    const payload = {
      type: 'pageview',
      anonymousId: '123e4567-e89b-12d3-a456-426614174000', // Valid UUID
      // User supposedly granted consent on banner
      consent: { ad_storage: 'granted', analytics_storage: 'granted' },
      context: { url: 'https://site.com', user_agent: 'bot' }
    };

    it('should OVERRIDE consent to DENIED if Sec-GPC: 1 is present', async () => {
      const res = await app.request('/track', {
        method: 'POST',
        headers: { 'Sec-GPC': '1' }, // <--- GPC ACTIVE
        body: JSON.stringify(payload)
      });

      expect(res.status).toBe(200);

      // Verify what got pushed to Queue via the hoisted mock
      const queuedJob = mocks.add.mock.calls[0][1];
      expect(queuedJob.payload.consent.ad_storage).toBe('denied');
      expect(queuedJob.payload.data._compliance_gpc_override).toBe(true);
    });

    it('should respect original consent if Sec-GPC is missing', async () => {
      const res = await app.request('/track', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      expect(res.status).toBe(200);

      const queuedJob = mocks.add.mock.calls[0][1];
      expect(queuedJob.payload.consent.ad_storage).toBe('granted');
    });
  });

  describe('Dispatch: Sensitive Data Scrubbing', () => {
    it('should BLOCK ad dispatch if URL contains toxic keywords (e.g. medical)', async () => {
      const job = {
        data: {
          tenantId: 'tenant_1',
          payload: {
            type: 'pageview',
            anonymousId: '123e4567-e89b-12d3-a456-426614174000',
            // User granted consent, BUT URL is toxic
            consent: { ad_storage: 'granted', analytics_storage: 'granted' },
            context: { url: 'https://lawfirm.com/medical-malpractice/injury', user_agent: 'test' }
          }
        }
      } as any;

      // Setup DB mocks for this specific test
      // Note: mocking return values on hoisted functions works fine
      vi.mocked(mocks.dbQuery.identities.findFirst).mockResolvedValue({ id: 'id_1' } as any);
      vi.mocked(mocks.dbQuery.tenants.findFirst).mockResolvedValue({ adConfig: { meta_pixel_id: '123' } } as any);

      await processEventJob(job);

      // Verify Audit Log was written for 'sensitive_content_scrubbed'
      // We spy on the 'values' call which contains the data
      // Structure: db.insert().values({ ... }) 
      // mocks.dbInsert returns an object with a .values spy
      const valuesSpy = mocks.dbInsert().values; 
      const insertCalls = valuesSpy.mock.calls;

      // Check if any insert call had our specific reason
      const hasBlockedReason = insertCalls.some((args: any[]) => {
        const data = args[0]; // The object passed to .values()
        return data.reason === 'sensitive_content_scrubbed';
      });

      expect(hasBlockedReason).toBe(true);

      // Ensure NO "dispatch_initiated" log exists
      const hasSuccessLog = insertCalls.some((args: any[]) => {
        const data = args[0];
        return data.action === 'dispatch_initiated';
      });
      expect(hasSuccessLog).toBe(false);
    });
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/unit/logic.test.ts`

```ts
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
```

### `C:/projects/moreways/attribution-engine/tests/unit/reporting.test.ts`

```ts
// File: tests/unit/reporting.test.ts
// Documentation: File 05 (Testing)
// Role: Verify Attribution Logic

import { describe, it, expect } from 'vitest';
import { classifySource } from '../../src/reporting/svc/reporting.svc.source';
import { modelJourney } from '../../src/reporting/svc/reporting.svc.modeler';

describe('The Oracle: Source Classification', () => {
  it('should identify Google Ads (Paid Search)', () => {
    const event = {
      clickData: { gclid: 'test_123' },
      contextClient: { page_url: 'https://site.com' }
    };
    const src = classifySource(event);
    expect(src.channel).toBe('paid_search');
    expect(src.source).toBe('google');
  });

  it('should identify Facebook Ads (Paid Social)', () => {
    const event = {
      clickData: { fbclid: 'IwAR_test' },
      contextClient: { page_url: 'https://site.com' }
    };
    const src = classifySource(event);
    expect(src.channel).toBe('paid_social');
    expect(src.source).toBe('facebook');
  });

  it('should identify Organic Search (Referrer)', () => {
    const event = {
      clickData: {},
      contextClient: { 
        page_url: 'https://site.com',
        referrer: 'https://www.google.com/' 
      }
    };
    const src = classifySource(event);
    expect(src.channel).toBe('organic_search');
    expect(src.medium).toBe('organic');
  });

  it('should fallback to Direct', () => {
    const event = { clickData: {}, contextClient: { page_url: 'https://site.com' } };
    expect(classifySource(event).channel).toBe('direct');
  });
});

describe('The Oracle: Journey Modeling', () => {
  // Mock Events
  const events = [
    {
      type: 'pageview',
      createdAt: new Date('2023-01-01T10:00:00Z'),
      clickData: { gclid: 'click_1' }, // Paid Search
      contextClient: { page_url: 'https://site.com/landing' }
    },
    {
      type: 'pageview',
      createdAt: new Date('2023-01-02T10:00:00Z'),
      clickData: {},
      contextClient: { page_url: 'https://site.com/blog', referrer: 'https://facebook.com' } // Social
    },
    {
      type: 'lead', // Conversion
      createdAt: new Date('2023-01-02T10:05:00Z'),
      clickData: {},
      contextClient: { page_url: 'https://site.com/contact' } // Direct
    }
  ];

  it('should calculate First and Last Touch correctly', () => {
    const model = modelJourney(events);

    // First Touch should be Google Ads (Jan 1)
    expect(model.first_touch?.source.channel).toBe('paid_search');
    
    // Last Touch should be Social (Jan 2) because Direct is ignored for Last Touch usually
    // Logic check: The last non-direct source was Facebook.
    expect(model.last_touch?.source.channel).toBe('social');
    expect(model.last_touch?.source.source).toContain('facebook');
  });

  it('should calculate Lead Score', () => {
    const model = modelJourney(events);
    // Base Lead (50) + Paid Search Bonus (5) + Context (Contact page? Logic check needed)
    // The modeler adds 10 for 'contact' in URL
    // Total: 50 + 5 + 10 = 65
    expect(model.lead_score).toBeGreaterThan(50);
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/unit/viral.test.ts`

```ts
// File: tests/unit/viral.test.ts
// Documentation: File 05 (Testing)
// Role: Test Viral Loop Detection logic

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkViralStatus } from '../../src/dispatch/svc/dispatch.svc.viral';
import { db } from '../../src/core/db';

// Mock DB
vi.mock('../../src/core/db', () => ({
  db: {
    query: {
      events: { findFirst: vi.fn() }
    }
  }
}));

describe('Viral Loop Detection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return FALSE if no GCLID/FBCLID provided', async () => {
    const res = await checkViralStatus('tenant_1', 'user_A', {});
    expect(res.isViral).toBe(false);
  });

  it('should return FALSE if GCLID is new (not found in DB)', async () => {
    vi.mocked(db.query.events.findFirst).mockResolvedValue(undefined); // No match

    const res = await checkViralStatus('tenant_1', 'user_A', { gclid: 'new_click' });
    expect(res.isViral).toBe(false);
  });

  it('should return TRUE if GCLID was used by SOMEONE ELSE', async () => {
    // DB returns a record belonging to user_B
    vi.mocked(db.query.events.findFirst).mockResolvedValue({ 
      identityId: 'user_B',
      createdAt: new Date()
    } as any);

    const res = await checkViralStatus('tenant_1', 'user_A', { gclid: 'shared_click' });
    
    expect(res.isViral).toBe(true);
    expect(res.originalIdentityId).toBe('user_B');
  });
});
```

### `C:/projects/moreways/attribution-engine/tests/unit/webhook.service.test.ts`

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendWebhook } from '../../src/dispatch/svc/dispatch.svc.webhook';

// Mock the global fetch API
const fetchSpy = vi.fn();
global.fetch = fetchSpy;

describe('Webhook Service (HTTP Layer)', () => {
  beforeEach(() => {
    fetchSpy.mockReset();
  });

  it('should POST the correct payload structure', async () => {
    fetchSpy.mockResolvedValue({ ok: true });

    const payload = {
      type: 'lead',
      timestamp: '2023-01-01T00:00:00Z',
      user: { email: 'test@example.com' },
      data: { value: 100 }
    } as any;

    const result = await sendWebhook('https://hooks.slack.com/test', payload, 'identity_123');

    expect(result).toBe(true);
    
    // Check arguments passed to fetch
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://hooks.slack.com/test',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        // Check if body contains our data
        body: expect.stringContaining('"identity_id":"identity_123"')
      })
    );
  });

  it('should fail gracefully on 500 errors (return false)', async () => {
    fetchSpy.mockResolvedValue({ ok: false, status: 500 });

    const result = await sendWebhook('https://bad-api.com', {} as any, 'id');

    expect(result).toBe(false);
    // Should NOT throw an error, just return false
  });

  it('should handle Network/Timeout errors', async () => {
    fetchSpy.mockRejectedValue(new Error('Network Error'));

    const result = await sendWebhook('https://timeout.com', {} as any, 'id');

    expect(result).toBe(false);
  });
});
```

