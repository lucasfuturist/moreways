/**
 * Moreways Attribution Pixel (v1.0)
 * Logic: First-Party Identity & Signal Harvesting
 */
(function(window, document) {
  'use strict';

  var STATE = {
    config: {},
    consent: { ad_storage: 'denied', analytics_storage: 'denied' },
    anonymousId: ''
  };

  // --- 1. Utilities ---

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }

  function getUrlParams() {
    var match,
        pl     = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);
  
    var urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
  }

  // --- 2. Identity Management ---

  function initIdentity() {
    // Persistence: Try to get existing ID from LocalStorage
    var id = localStorage.getItem('mw_aid');
    if (!id) {
      id = generateUUID();
      localStorage.setItem('mw_aid', id);
    }
    STATE.anonymousId = id;
  }

  // --- 3. Transport Layer (The Cloak) ---

  function sendEvent(payload) {
    var url = STATE.config.endpoint || '/api/telemetry';
    
    // Inject Public Key for the Proxy to use
    payload.publicKey = STATE.config.publicKey;

    // Use beacon if available for reliability on page unload, else fetch
    if (navigator.sendBeacon && !payload.data?._forceFetch) {
        // Blob is required to set content-type header in sendBeacon
        var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
    } else {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        }).catch(function(err) {
            console.error('[MW] Tracking failed', err);
        });
    }
  }

  function buildPayload(eventType, data) {
    var params = getUrlParams();
    
    return {
      type: eventType,
      anonymousId: STATE.anonymousId,
      timestamp: new Date().toISOString(),
      consent: STATE.consent,
      context: {
        url: window.location.href,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        title: document.title
      },
      // The "Cookie Bridge" - Harvesting Ad Network IDs
      cookies: {
        _fbp: getCookie('_fbp'),
        _fbc: getCookie('_fbc'),
        _gcl_au: getCookie('_gcl_au'),
        ttclid: getCookie('ttclid') || params.ttclid
      },
      // The "Click Bridge" - Harvesting URL Parameters
      click: {
        gclid: params.gclid,
        fbclid: params.fbclid,
        ttclid: params.ttclid,
        wbraid: params.wbraid,
        gbraid: params.gbraid
      },
      data: data || {}
    };
  }

  // --- 4. Public Interface ---

  var api = {
    init: function(config) {
      STATE.config = config || {};
      initIdentity();
      console.log('[MW] Initialized', STATE.anonymousId);
    },
    
    // Update Consent (Dynamic)
    consent: function(policy) {
      if (policy.ad_storage) STATE.consent.ad_storage = policy.ad_storage;
      if (policy.analytics_storage) STATE.consent.analytics_storage = policy.analytics_storage;
      console.log('[MW] Consent updated', STATE.consent);
    },
    
    // Track Custom Event
    track: function(event, data) {
      if (!STATE.anonymousId) initIdentity();
      var payload = buildPayload(event, data);
      sendEvent(payload);
    }
  };

  // Expose to Window
  window.moreways = api;

  // Auto-Start (bootloader pattern)
  if (window.MW_CONFIG) {
    api.init(window.MW_CONFIG);
    if (window.MW_CONFIG.autoCapture) {
      api.track('pageview');
    }
  }

})(window, document);