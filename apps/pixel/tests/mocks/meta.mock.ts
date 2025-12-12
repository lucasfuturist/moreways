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