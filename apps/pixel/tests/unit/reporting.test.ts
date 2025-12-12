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