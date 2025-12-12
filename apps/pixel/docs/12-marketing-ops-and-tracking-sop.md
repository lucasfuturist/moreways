# Marketing Operations & Tracking SOP

**Version:** 1.0
**Status:** Critical
**Owner:** Marketing Ops
**Objective:** Ensure every dollar spent on ads is legally and technically attributable to a specific lead and location.

---

## 1. The Golden Rule: "The Final URL"

**90% of tracking failures happen here.**
Ad networks (Google/Meta) will append tracking parameters (like `?gclid=123`) to your link. If your server redirects the user (even for a simple slash `/` or `http` -> `https`), the parameters are often **stripped** before the pixel loads.

### The Protocol
Always use the **Final Destination URL** in your ads.

*   ❌ **Bad:** `moreways.io` (Relying on browser to add https)
*   ❌ **Bad:** `https://moreways.io/landing` (Missing trailing slash, might redirect)
*   ✅ **Good:** `https://moreways.io/landing/` (Exact resolved path)

### The "Strip Test" (Perform before launching)
1.  Copy your ad link.
2.  Paste it into a browser address bar.
3.  Add `?test=tracking_is_alive` to the end.
4.  Hit Enter.
5.  **Check the address bar immediately.**
    *   If `?test=tracking_is_alive` is still there: **PASSED.**
    *   If the URL is clean (params gone): **FAILED.** Update your server config or ad link.

---

## 2. Google Ads Configuration

We need two things: **Technical Attribution** (GCLID) and **Human Attribution** (Campaign Name/Lawyer Name).

### Step A: Enable Auto-Tagging (The GCLID)
*This connects the lead back to the Google Ads API for offline conversion imports.*

1.  Login to **Google Ads**.
2.  Go to **Admin (Gear Icon)** > **Account Settings**.
3.  Expand **Auto-tagging**.
4.  Check: ✅ **"Tag the URL that people click through from my ad"**.
5.  Click **Save**.

### Step B: The Tracking Template (The Campaign Name)
*This writes the Lawyer/Campaign name into the database for your internal reporting.*

1.  Go to **Campaign Settings** (Select all campaigns or apply at Account Level).
2.  Scroll to **Tracking template**.
3.  Paste the following **Exact String**:

```text
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}
```

*   **Note:** We use `{campaignid}` to avoid URL encoding issues with spaces. If you strictly name your campaigns without spaces (e.g., `Lawyer_Smith_PI`), you can use `{campaignid}`.

---

## 3. Meta (Facebook/Instagram) Configuration

Meta does not have "Auto-tagging." You must explicitly tell it to send data.

### The Protocol
For **EVERY** ad creative you publish:

1.  Navigate to the **Ad Level** (Creative).
2.  Scroll to the **Destination** section.
3.  Locate the **"URL Parameters"** box (Optional section usually).
4.  Paste this **Exact String**:

```text
utm_source=facebook&utm_medium=cpc&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

*   **Why:** Meta dynamically replaces `{{campaign.name}}` with your actual campaign name (e.g., "Injury_Lawyer_Steve"). The Pixel will grab this and save it to the `metadata` column.

---

## 4. Database Verification (The Smoke Test)

Once ads are live, or after you click a test ad, run this SQL query to verify the pipeline is robust.

```sql
SELECT 
  id, 
  created_at, 
  event_type, 
  
  -- 1. PROOF OF GOOGLE LINKAGE
  click_data->>'gclid' as gclid,
  
  -- 2. PROOF OF HUMAN ATTRIBUTION (The Lawyer)
  metadata->>'utm_campaign' as campaign,
  metadata->>'utm_source' as source,
  
  -- 3. PROOF OF LOCATION (Geo Service)
  derived_geo->>'city' as city,
  derived_geo->>'region' as state,
  
  -- 4. PROOF OF STICKINESS
  -- If this is a 'lead' event, did it keep the click data from the 'pageview'?
  click_data->>'gclid' IS NOT NULL as is_attributed

FROM events 
WHERE event_type IN ('pageview', 'lead')
ORDER BY created_at DESC 
LIMIT 10;
```

### Success Criteria
1.  `gclid` column is **not null** for Google clicks.
2.  `campaign` column contains the text name of the campaign.
3.  `city` contains a real city (not "Unknown" or null).
4.  `is_attributed` is **true** for Lead events.

---

## 5. Emergency Troubleshooting

**Scenario:** Leads are coming in, but `utm_campaign` is NULL.

1.  **Check the URL:** Does the browser address bar actually show `utm_campaign=...` when you click the ad?
    *   *No?* -> Go back to **Step 1 (Redirects)** or **Step 2B (Tracking Template)**.
    *   *Yes?* -> The Pixel is failing to parse it. Check `window.location.search` in Console.

**Scenario:** Location is always "United States" (No City).

1.  **Check IP API:** The Geo Service might be rate-limited. Check the server logs for `[Geo] API returned error`.
2.  **Fix:** Upgrade to a paid IP provider token in `dispatch.svc.geo.ts`.

**Scenario:** Leads are tracked, but not sending to Google Ads.

1.  **Check Consent:** Did the user click "Accept Cookies"? If not, the `ad_storage` flag is `denied`, and the system correctly blocked the upload to Google. This is **Working as Designed** (Compliance).