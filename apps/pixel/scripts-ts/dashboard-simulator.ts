// scripts-ts/dashboard-simulator.ts

import { randomUUID } from 'crypto';

// --- CONFIGURATION ---
// 1. Point this to your local API (which writes to Supabase)
const API_URL = 'http://localhost:3000/api/v1/track';

// 2. MUST match the public_key in your 'tenants' table (See SQL step below)
const PUBLIC_KEY = 'pk_dashboard_demo'; 

// --- DATA POOLS ---
const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0'
];

const REFERRERS = [
  { source: 'google_ads', url: 'https://www.google.com/', gclid: 'CjwKCAjw_GCLID_TEST_' + randomUUID().substring(0,8) },
  { source: 'facebook_ads', url: 'https://l.facebook.com/', fbclid: 'fb.1.' + Date.now() + '.' + randomUUID().substring(0,8) },
  { source: 'linkedin_ads', url: 'https://www.linkedin.com/', li_fat_id: 'li_' + randomUUID().substring(0,8) },
  { source: 'organic_google', url: 'https://www.google.com/', gclid: undefined },
  { source: 'direct', url: '', gclid: undefined }
];

const PAGES = [
  { path: '/', title: 'Home' },
  { path: '/pricing', title: 'Pricing' },
  { path: '/features', title: 'Features' },
  { path: '/blog/attribution-guide', title: 'Blog: Attribution Guide' },
  { path: '/contact', title: 'Contact Us' },
  { path: '/checkout/success', title: 'Order Confirmed' },
];

// --- HELPERS ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- THE SIMULATOR ---
async function sendEvent(payload: any) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-key': PUBLIC_KEY,
        'User-Agent': payload.context.user_agent,
        'x-forwarded-for': payload.context.ip_address
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error(`❌ API Error ${res.status}:`, await res.text());
    }
    return res.ok;
  } catch (e: any) {
    console.error('❌ Network Error:', e.message);
    return false;
  }
}

async function simulateUserJourney() {
  const anonymousId = randomUUID();
  const userAgent = randomItem(USER_AGENTS);
  // Random IP to test your Geo Logic
  const ipAddress = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
  const entryPoint = randomItem(REFERRERS);
  
  // Base Context
  const contextBase = {
    user_agent: userAgent,
    ip_address: ipAddress,
    referrer: entryPoint.url
  };

  // Base Click Data (Populates 'click_data' JSONB column)
  const clickData: any = {};
  if (entryPoint.gclid) clickData.gclid = entryPoint.gclid;
  // @ts-ignore
  if (entryPoint.fbclid) clickData.fbclid = entryPoint.fbclid;
  // @ts-ignore
  if (entryPoint.li_fat_id) clickData.li_fat_id = entryPoint.li_fat_id;

  console.log(`\n👤 New Session: ${entryPoint.source}`);

  // --- EVENT 1: Pageview (Home) ---
  await sendEvent({
    type: 'pageview',
    anonymousId,
    timestamp: new Date().toISOString(),
    consent: { ad_storage: 'granted', analytics_storage: 'granted' },
    context: { ...contextBase, url: `https://demo-site.com${PAGES[0].path}`, title: PAGES[0].title },
    click: clickData,
    _quality: { is_bot: false, score: 100 }
  });

  // 30% Bounce Rate (Stop here)
  if (Math.random() < 0.3) return; 
  await delay(200);

  // --- EVENT 2: Pageview (Browsing) ---
  const secondPage = randomItem(PAGES.slice(1, 4));
  await sendEvent({
    type: 'pageview',
    anonymousId,
    timestamp: new Date().toISOString(),
    consent: { ad_storage: 'granted', analytics_storage: 'granted' },
    context: { ...contextBase, url: `https://demo-site.com${secondPage.path}`, title: secondPage.title, referrer: `https://demo-site.com${PAGES[0].path}` },
    click: clickData
  });

  // Only 40% convert to Lead
  if (Math.random() > 0.4) return;
  await delay(300);

  // --- EVENT 3: Lead (Form Fill) ---
  const email = `test.${randomUUID().substring(0,6)}@example.com`;
  console.log(`   ✨ LEAD: ${email}`);

  await sendEvent({
    type: 'lead',
    anonymousId,
    timestamp: new Date().toISOString(),
    consent: { ad_storage: 'granted', analytics_storage: 'granted' },
    context: { ...contextBase, url: 'https://demo-site.com/contact', title: 'Contact', referrer: `https://demo-site.com${secondPage.path}` },
    click: clickData,
    user: {
      email,
      phone: '+1555000' + Math.floor(Math.random() * 9999)
    },
    data: {
      value: 50,
      currency: 'USD',
      source: 'web_form'
    }
  });

  // Only 20% of Leads purchase
  if (Math.random() > 0.2) return;
  await delay(300);

  // --- EVENT 4: Purchase ($$$) ---
  const revenue = Math.floor(Math.random() * 200) + 50;
  console.log(`   💰 SALE: $${revenue}.00`);
  
  await sendEvent({
    type: 'purchase',
    anonymousId,
    timestamp: new Date().toISOString(),
    consent: { ad_storage: 'granted', analytics_storage: 'granted' },
    context: { ...contextBase, url: 'https://demo-site.com/checkout/success', title: 'Order Confirmed' },
    click: clickData,
    user: { email },
    data: {
      value: revenue,
      currency: 'USD',
      transaction_id: 'txn_' + randomUUID()
    }
  });
}

// --- RUNNER ---
async function run() {
  console.log(`🚀 Starting Traffic Simulation to ${API_URL}`);
  console.log(`🔑 Tenant Key: ${PUBLIC_KEY}`);
  console.log('------------------------------------------------');

  while (true) {
    // Fire a journey
    simulateUserJourney();
    
    // Traffic density: Wait 50ms - 1500ms between users
    await delay(50 + Math.random() * 1500); 
  }
}

run();