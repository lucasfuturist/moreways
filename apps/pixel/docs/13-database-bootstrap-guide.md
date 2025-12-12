# Database Bootstrap & Optimization Guide (v1.0)

**Target:** Supabase (PostgreSQL)
**Objective:** Prepare the database for high-volume ingestion and instant analytics reporting.

---

## Phase 1: Performance Tuning (Run First)

Since we store data in `JSONB` columns, we need specific indexes to make queries fast. Without these, looking up a `gclid` will scan the entire table (slow).

**Copy/Paste into Supabase SQL Editor:**

```sql
-- 1. Click ID Indexes (Crucial for Attribution Matching)
-- Allows finding "Which user clicked gclid=XYZ?" instantly.
CREATE INDEX IF NOT EXISTS idx_events_click_gclid ON events ((click_data->>'gclid'));
CREATE INDEX IF NOT EXISTS idx_events_click_fbclid ON events ((click_data->>'fbclid'));
CREATE INDEX IF NOT EXISTS idx_events_click_ttclid ON events ((click_data->>'ttclid'));

-- 2. Session & Journey Indexes
-- Allows grouping events by session for the "User Journey" view.
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events ((context_client->>'session_id'));

-- 3. Campaign Metadata Indexes
-- Allows filtering dashboards by "Lawyer Name" (utm_campaign).
CREATE INDEX IF NOT EXISTS idx_events_meta_campaign ON events ((metadata->>'utm_campaign'));
CREATE INDEX IF NOT EXISTS idx_events_meta_source ON events ((metadata->>'utm_source'));

-- 4. Identity Graph Indexes
-- Essential for merging anonymous users with known emails.
CREATE INDEX IF NOT EXISTS idx_identities_email_hash ON identities (email_hash);
CREATE INDEX IF NOT EXISTS idx_identities_phone_hash ON identities (phone_hash);
CREATE INDEX IF NOT EXISTS idx_identities_user_id ON identities (user_id); -- Links to portal_users
```

---

## Phase 2: The Analytics View (The "God Mode")

This creates a virtual table called `analytics_attribution_feed`. It flattens the complex JSON data into simple columns. Use this for your admin dashboard.

**Copy/Paste into Supabase SQL Editor:**

```sql
CREATE OR REPLACE VIEW "analytics_attribution_feed" AS
SELECT 
  e.id AS event_id,
  e.created_at,
  e.tenant_id,
  e.event_type,
  
  -- IDENTITY (Who?)
  i.anonymous_id,
  i.user_id AS internal_user_id, -- Links to your portal_users table
  
  -- ATTRIBUTION (Where from?)
  -- Logic: Prefer Click ID, then specific metadata, then UTMs
  COALESCE(e.click_data->>'gclid', e.metadata->>'gclid') as gclid,
  COALESCE(e.click_data->>'fbclid', e.metadata->>'fbclid') as fbclid,
  COALESCE(e.metadata->>'utm_source', 'direct') as source,
  COALESCE(e.metadata->>'utm_medium', 'none') as medium,
  COALESCE(e.metadata->>'utm_campaign', 'none') as campaign,
  COALESCE(e.metadata->>'utm_content', 'none') as content,
  
  -- GEO (Where physically?)
  COALESCE(e.derived_geo->>'city', 'Unknown') as city,
  COALESCE(e.derived_geo->>'region', 'Unknown') as state,
  
  -- CONTEXT (Device/Session)
  e.context_client->>'session_id' as session_id,
  e.context_client->>'page_url' as url,
  e.context_client->>'user_agent' as user_agent,
  
  -- VALUE (Money)
  COALESCE((e.metadata->>'value')::numeric, 0) as value,
  COALESCE(e.metadata->>'currency', 'USD') as currency

FROM events e
LEFT JOIN identities i ON e.identity_id = i.id;
```

---

## Phase 3: Seed Your Tenant (Launch Config)

This creates the API keys you will use in your Pixel code and Server Env.

**⚠️ ACTION REQUIRED:** Replace the `YOUR_...` placeholders below before running!

```sql
INSERT INTO tenants (
  name, 
  public_key, 
  secret_key, 
  ad_config, 
  geo_config,
  webhook_url
) VALUES (
  'Moreways Production',       -- Name of your workspace
  'pk_live_mw_v1_launch',      -- << PUT THIS IN YOUR PIXEL (window.MW_CONFIG)
  'sk_live_mw_v1_server',      -- << PUT THIS IN YOUR .ENV (Server Side)
  '{
    "meta_pixel_id": "REPLACE_WITH_FB_PIXEL_ID", 
    "meta_access_token": "REPLACE_WITH_FB_CAPI_TOKEN",
    "google_conversion_action_id": "REPLACE_WITH_GADS_CONVERSION_ID"
  }'::jsonb,
  '{
    "allowed_countries": ["US", "CA"],
    "allowed_regions": [] 
  }'::jsonb,
  'https://your-crm-webhook-url.com/incoming' -- Optional: Where to send leads
);
```

---

## Phase 4: Verification

Run this query to make sure everything is ready.

```sql
-- 1. Check Tenant
SELECT * FROM tenants WHERE public_key = 'pk_live_mw_v1_launch';

-- 2. Check View (Should return 0 rows but no error)
SELECT * FROM analytics_attribution_feed LIMIT 1;
```
