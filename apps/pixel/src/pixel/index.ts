// File: src/pixel/index.ts
// Version: 1.4 Production (Viral + Aggregator Edition)
// Features: Sticky Attr, Sessions, Fingerprinting, Auto-Form, Hidden Fields, Debug HUD, Viral Clipboard

import { generateUUID, getCookie, getUrlParams } from './lib/pixel.lib.browser';
import { sendEvent } from './lib/pixel.lib.network';

// 1. Initialize State
type PixelState = {
  anonymousId: string;
  sessionId: string;
  consent: { ad_storage: string; analytics_storage: string };
  config: { publicKey: string; endpoint?: string; autoCapture?: boolean };
  campaignData: Record<string, string>;
  formStartTime: number | null;
};

const STATE: PixelState = {
  anonymousId: '',
  sessionId: '',
  consent: { ad_storage: 'denied', analytics_storage: 'denied' }, // Default Safe
  config: { publicKey: '', autoCapture: true },
  campaignData: {},
  formStartTime: null
};

// --- CORE LOGIC (Identity, Persistence, Sessions) ---
function initIdentity() {
  // A. User Identity
  let aid = localStorage.getItem('mw_aid');
  if (!aid) { aid = generateUUID(); localStorage.setItem('mw_aid', aid); }
  STATE.anonymousId = aid;

  // B. Session Management (30-min window)
  const now = Date.now();
  let sid = sessionStorage.getItem('mw_sid');
  const lastActive = parseInt(localStorage.getItem('mw_last_active') || '0', 10);
  
  if (!sid || (now - lastActive > 30 * 60 * 1000)) {
    sid = generateUUID();
    sessionStorage.setItem('mw_sid', sid);
  }
  STATE.sessionId = sid;
  localStorage.setItem('mw_last_active', now.toString());

  // C. Sticky Campaign Data & Viral Refs
  const currentParams = getUrlParams();
  let storedParams = {};
  try {
    const raw = sessionStorage.getItem('mw_campaign');
    if (raw) storedParams = JSON.parse(raw);
  } catch (e) {}

  // Added 'mw_ref' to the sticky list
  const importantKeys = ['gclid', 'fbclid', 'ttclid', 'li_fat_id', 'wbraid', 'gbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'mw_ref'];
  
  const relevantCurrent = Object.keys(currentParams)
    .filter(k => importantKeys.includes(k))
    .reduce((obj, k) => ({ ...obj, [k]: currentParams[k] }), {});

  STATE.campaignData = { ...storedParams, ...relevantCurrent };
  
  if (Object.keys(relevantCurrent).length > 0) {
    sessionStorage.setItem('mw_campaign', JSON.stringify(STATE.campaignData));
  }
}

// --- DEVICE FINGERPRINTING ---
function getDeviceContext() {
  const nav = navigator as any;
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  return {
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    color_depth: window.screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    connection_type: conn ? conn.effectiveType : 'unknown',
    device_memory: nav.deviceMemory || undefined,
    hardware_concurrency: navigator.hardwareConcurrency || undefined
  };
}

// --- PAYLOAD BUILDER ---
function buildPayload(eventType: string, customData = {}) {
  localStorage.setItem('mw_last_active', Date.now().toString());
  const campaigns = STATE.campaignData;
  const device = getDeviceContext();

  return {
    type: eventType,
    anonymousId: STATE.anonymousId,
    timestamp: new Date().toISOString(),
    consent: STATE.consent,
    context: {
      url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      title: document.title,
      session_id: STATE.sessionId,
      ...device
    },
    cookies: {
      _fbp: getCookie('_fbp'),
      _fbc: getCookie('_fbc'),
      _gcl_au: getCookie('_gcl_au'),
      ttclid: getCookie('ttclid') || campaigns['ttclid']
    },
    click: {
      gclid: campaigns['gclid'],
      fbclid: campaigns['fbclid'],
      ttclid: campaigns['ttclid'],
      wbraid: campaigns['wbraid'],
      gbraid: campaigns['gbraid'],
      li_fat_id: campaigns['li_fat_id'],
      mw_ref: campaigns['mw_ref'] // [NEW] Transmit the Viral Ref
    },
    data: {
      ...customData,
      utm_source: campaigns['utm_source'],
      utm_medium: campaigns['utm_medium'],
      utm_campaign: campaigns['utm_campaign'],
    }
  };
}

// =========================================================================
// MODULE: GHOST LEADS (Clipboard)
// =========================================================================
function attachClipboardListeners() {
  document.addEventListener('copy', () => {
    const selection = document.getSelection()?.toString();
    if (!selection || selection.length > 100) return; 

    let type = '';
    if (selection.match(/@/)) type = 'copy_email';
    else if (selection.match(/\d{3}/)) type = 'copy_phone';
    
    if (type) api.track('custom', { event_name: type, content: selection });
  });
}

// =========================================================================
// MODULE: VIRAL CLIPBOARD INJECTION
// =========================================================================
function attachViralClipboard() {
  document.addEventListener('copy', (e) => {
    const selection = document.getSelection();
    // Only intervene if they are NOT selecting specific text (i.e. copying the "page")
    // Note: Most browsers don't trigger 'copy' event on address bar copy, 
    // this captures "Select All + Copy" or programmatic copies.
    // For pure address bar viral tracking, we rely on the URL params existing from the start.
    // This helper covers scenarios where they copy a "Share" link or similar body content.
    if (selection && selection.toString().length > 0) return;

    const url = new URL(window.location.href);
    url.searchParams.set('mw_ref', STATE.anonymousId);
    if (STATE.campaignData.utm_campaign) {
        url.searchParams.set('utm_campaign', STATE.campaignData.utm_campaign);
    }

    if (e.clipboardData) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', url.toString());
    }
  });
}

// =========================================================================
// MODULE: AUTO-FORM (With Safety Checks & Timing)
// =========================================================================
function attachFormListeners() {
  document.addEventListener('focusin', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      if (!STATE.formStartTime) STATE.formStartTime = Date.now();
    }
  });

  document.addEventListener('submit', (e) => {
    const target = e.target as HTMLFormElement;
    if (!target || target.tagName !== 'FORM') return;

    if (target.getAttribute('data-mw-ignore') === 'true') return;

    const now = Date.now();
    const duration = STATE.formStartTime ? (now - STATE.formStartTime) / 1000 : 0;
    STATE.formStartTime = null; 

    const formData = new FormData(target);
    const captured: Record<string, any> = {};
    const user: Record<string, string> = {};
    const BLOCKLIST = ['password', 'cc', 'card', 'cvv', 'ssn', 'social', 'credit', 'hidden'];

    formData.forEach((value, key) => {
      const k = key.toLowerCase();
      const inputElem = target.querySelector(`[name="${key}"]`);
      if (inputElem && inputElem.getAttribute('data-mw-ignore') === 'true') return;
      if (BLOCKLIST.some(term => k.includes(term))) return;

      if (typeof value === 'string') {
        if (k.includes('email')) user.email = value;
        else if (k.includes('phone') || k.includes('tel') || k.includes('mobile')) user.phone = value;
        else if (k.includes('first') || k.includes('name')) user.first_name = value;
        else captured[key] = value;
      }
    });

    const payload = buildPayload('lead', { 
        ...captured, 
        source: 'auto_form',
        time_to_complete_sec: duration
    });
    (payload as any).user = user;
    sendEvent(payload, STATE.config);
  });
}

// =========================================================================
// MODULE: AGGREGATOR INJECTION (Hidden Fields)
// =========================================================================
function attachHiddenFields() {
  const inject = () => {
    const forms = document.querySelectorAll('form');
    const campaigns = STATE.campaignData;
    
    forms.forEach(form => {
      const addField = (name: string, val: string) => {
        if (!val || form.querySelector(`input[name="${name}"]`)) return;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = val;
        form.appendChild(input);
      };

      addField('mw_gclid', campaigns['gclid'] || '');
      addField('mw_session_id', STATE.sessionId);
      addField('mw_anonymous_id', STATE.anonymousId);
      addField('mw_ref', campaigns['mw_ref'] || ''); // Inject Viral Ref for CRM
      
      addField('utm_campaign', campaigns['utm_campaign'] || '');
      addField('utm_source', campaigns['utm_source'] || '');
      addField('utm_medium', campaigns['utm_medium'] || '');
    });
  };

  inject();
  const observer = new MutationObserver(() => inject());
  observer.observe(document.body, { childList: true, subtree: true });
}

// =========================================================================
// MODULE: OPS HUD (Debug Overlay)
// =========================================================================
function showDebugOverlay() {
  const div = document.createElement('div');
  div.style.cssText = `
    position: fixed; bottom: 10px; right: 10px; 
    background: rgba(0,0,0,0.85); color: #0f0; 
    font-family: monospace; font-size: 12px; 
    padding: 15px; z-index: 99999; border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5); pointer-events: none;
    max-width: 300px; word-break: break-all;
  `;

  const update = () => {
    const c = STATE.campaignData;
    div.innerHTML = `
      <strong>🟢 Moreways Pixel Live</strong><br/>
      <hr style="border:0; border-top:1px solid #555; margin:5px 0;">
      <strong>Lawyer:</strong> ${c.utm_campaign || '⚠️ NONE'}<br/>
      <strong>Source:</strong> ${c.utm_source || 'Direct'}<br/>
      <strong>GCLID:</strong> ${c.gclid ? '✅ Captured' : '❌'}<br/>
      <strong>Viral Ref:</strong> ${c.mw_ref ? '✅ Active' : 'None'}<br/>
      <strong>Session:</strong> ${STATE.sessionId.substring(0, 8)}...<br/>
      <strong>Events:</strong> <span id="mw_evt_cnt">0</span>
    `;
  };

  document.body.appendChild(div);
  update();

  const originalTrack = api.track;
  let count = 0;
  api.track = (event, data) => {
    originalTrack(event, data);
    count++;
    update();
    const span = document.getElementById('mw_evt_cnt');
    if (span) span.innerText = count.toString();
  };
}

// =========================================================================
// MODULE: INTERACTION & SPA
// =========================================================================
function attachHistoryListeners() {
  const push = history.pushState;
  history.pushState = function(...args) { push.apply(this, args); api.track('pageview'); };
  window.addEventListener('popstate', () => api.track('pageview'));
}

function attachScrollListener() {
    const thresholds = [25, 50, 75, 90];
    const fired = new Set<number>();
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const percent = Math.round(((h.scrollTop || document.body.scrollTop) / ((h.scrollHeight || document.body.scrollHeight) - h.clientHeight)) * 100);
      thresholds.forEach(t => {
        if (percent >= t && !fired.has(t)) {
          fired.add(t);
          api.track('view_content', { event_name: 'scroll_depth', depth: t, url: window.location.pathname });
        }
      });
    }, { passive: true });
}

function attachClickListener() {
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;
      let type = '';
      if (target.href.startsWith('tel:')) type = 'click_phone';
      else if (target.href.startsWith('mailto:')) type = 'click_email';
      else if (target.hostname !== window.location.hostname) type = 'click_outbound';
      if (type) api.track('custom', { event_name: type, link_url: target.href });
    }, { passive: true });
}

function attachRageClickListener() {
  let clicks = 0; let lastClickTime = 0; let lastTarget: EventTarget | null = null;
  document.addEventListener('click', (e) => {
    const now = Date.now();
    if (e.target === lastTarget && (now - lastClickTime < 300)) { clicks++; } 
    else { clicks = 1; lastTarget = e.target; }
    lastClickTime = now;
    if (clicks === 4) { 
      api.track('custom', { event_name: 'rage_click', element: (e.target as HTMLElement).tagName });
      clicks = 0; 
    }
  }, { passive: true });
}

function startHeartbeat() {
    let f10 = false;
    const t = setInterval(() => {
        if (document.visibilityState === 'visible' && !f10) {
            api.track('custom', { event_name: 'engagement_10s' });
            f10 = true;
            clearInterval(t);
        }
    }, 10000);
}

// --- PUBLIC API ---
const api = {
  init: (config: { publicKey: string; endpoint?: string; autoCapture?: boolean }) => {
    STATE.config = { ...STATE.config, ...config };
    initIdentity();
    
    // Attach Modules
    if (STATE.config.autoCapture !== false) attachFormListeners();
    attachHiddenFields(); 
    attachHistoryListeners();
    attachScrollListener();
    attachClickListener();
    attachClipboardListeners();
    attachViralClipboard(); // [NEW] Viral Injection
    attachRageClickListener();
    startHeartbeat();

    if (getUrlParams()['mw_debug'] === 'true') showDebugOverlay();

    console.log('[MW] Pixel Active v1.4', config.publicKey);
  },

  consent: (policy: { ad_storage?: string; analytics_storage?: string }) => {
    const newConsent = { ...STATE.consent };
    if (policy.ad_storage) newConsent.ad_storage = policy.ad_storage;
    if (policy.analytics_storage) newConsent.analytics_storage = policy.analytics_storage;
    STATE.consent = newConsent;
  },

  track: (event: string, data?: any) => {
    if (!STATE.config.publicKey) return;
    const payload = buildPayload(event, data);
    
    if (data?.email || data?.phone) {
      (payload as any).user = {
        email: data.email,
        phone: data.phone,
        first_name: data.first_name,
        last_name: data.last_name
      };
    }
    sendEvent(payload, STATE.config);
  }
};

(window as any).moreways = api;

const globalConfig = (window as any).MW_CONFIG;
if (globalConfig) {
  api.init(globalConfig);
  api.track('pageview');
}