// File: src/reporting/svc/reporting.svc.modeler.ts
// Domain: Reporting
// Role: Attribution Modeling & Revenue Calculation
// Upgrade: "Revenue Reality"

import { classifySource } from './reporting.svc.source';

type JourneyPoint = {
  timestamp: Date;
  type: string;
  source: ReturnType<typeof classifySource>;
  url: string;
  value: number; // [NEW] Monetary Value
};

type AttributionResult = {
  first_touch: JourneyPoint | null;
  last_touch: JourneyPoint | null;
  touchpoints: number;
  lead_score: number;
  total_revenue: number; // [NEW] Real $$$
  currency: string;
  customer_journey: JourneyPoint[];
};

export function modelJourney(events: any[]): AttributionResult {
  // 1. Sort Events (Oldest to Newest)
  const sorted = [...events].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  // 2. Map to Journey Points
  const journey: JourneyPoint[] = sorted.map(e => {
    // Extract revenue from metadata (offline_conversion or purchase)
    const rawValue = (e.metadata as any)?.value || 0;
    const value = typeof rawValue === 'number' ? rawValue : 0;

    return {
      timestamp: new Date(e.createdAt),
      type: e.type,
      url: e.contextClient?.page_url || '',
      source: classifySource(e),
      value
    };
  });

  // 3. Calculate Attribution
  const firstTouch = journey.find(j => j.source.channel !== 'direct') || journey[0] || null;
  
  // Last Touch: Find last non-direct source before the conversion/revenue event
  let lastTouch = null;
  
  // Find the most significant conversion event
  const conversionIndex = journey.findIndex(j => j.value > 0 || j.type === 'lead' || j.type === 'purchase');
  const relevantJourney = conversionIndex > -1 ? journey.slice(0, conversionIndex + 1) : journey;

  for (let i = relevantJourney.length - 1; i >= 0; i--) {
    if (relevantJourney[i].source.channel !== 'direct') {
      lastTouch = relevantJourney[i];
      break;
    }
  }
  if (!lastTouch && relevantJourney.length > 0) lastTouch = relevantJourney[relevantJourney.length - 1];

  // 4. Revenue & Scoring
  let score = 0;
  let revenue = 0;
  let currency = 'USD';

  journey.forEach(j => {
    revenue += j.value; // Sum up settlement values / purchases

    if (j.type === 'purchase' || (j.type === 'offline_conversion' && j.value > 0)) score += 100;
    if (j.type === 'lead') score += 50;
    
    // Contextual Scoring
    if (j.url.includes('pricing') || j.url.includes('contact')) score += 10;
    if (j.source.channel === 'paid_search') score += 5;
  });

  // Extract currency from the last revenue event if available
  const lastRevEvent = events.find(e => (e.metadata as any)?.currency);
  if (lastRevEvent) currency = (lastRevEvent.metadata as any).currency;

  return {
    first_touch: firstTouch,
    last_touch: lastTouch,
    touchpoints: journey.length,
    lead_score: score,
    total_revenue: revenue,
    currency,
    customer_journey: journey
  };
}