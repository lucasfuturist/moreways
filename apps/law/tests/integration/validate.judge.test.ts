// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Hoist Spies (Must happen first)
const { mockGetChildren, mockGetNodeByUrn } = vi.hoisted(() => {
  return {
    mockGetChildren: vi.fn(),
    mockGetNodeByUrn: vi.fn()
  };
});

// 2. Mock the Class Module
// We return a real class structure so 'new SupabaseGraphReader()' works.
vi.mock('../../src/infra/supabase/infra.supabase.reader', () => {
  return {
    SupabaseGraphReader: class {
      getChildren = mockGetChildren;
      getNodeByUrn = mockGetNodeByUrn;
    }
  };
});

// 3. Import App (After Mocks)
import request from 'supertest';
import { app } from '../../src/api/server';

describe('AI Judge Integration', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock Law: MA Lemon Law (7 Day Return Rule)
        mockGetChildren.mockResolvedValue([
            {
                urn: 'urn:lex:ma:940cmr:5_04',
                content_text: `
                940 CMR 5.04: Used Car Warranty (Lemon Law).
                (1) If a used motor vehicle fails inspection within seven days of purchase, 
                and the cost of repairs exceeds 10% of the purchase price, 
                the consumer may return the vehicle for a full refund.
                (2) The dealer must be notified within 14 days.
                (3) Refusal to refund is an unfair and deceptive act.
                `
            }
        ]);
    });
    
    it('should identify a Lemon Law violation (Failed Inspection)', async () => {
        const payload = {
            intent: "Auto – Dealership or Repair",
            formData: {
                purchase_date: "2023-10-01",
                inspection_date: "2023-10-04", // 3 days later (< 7)
                inspection_result: "Fail",
                repair_cost_estimate: 2000,
                purchase_price: 15000, // 2000 is > 10% of 15000 (1500)
                dealer_response: "Refused to fix"
            }
        };

        const res = await request(app)
            .post('/api/v1/validate')
            .send(payload);

        console.log("JUDGE VERDICT:", JSON.stringify(res.body, null, 2));

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('LIKELY_VIOLATION');
        
        const summary = res.body.data.analysis.summary.toLowerCase();
        expect(summary).toContain('inspection');
        expect(summary).toContain('refund');
    }, 30000);

    it('should identify a weak case (Statute of Limitations / User Error)', async () => {
        const payload = {
            intent: "Auto – Dealership or Repair",
            formData: {
                purchase_date: "2015-01-01", // Very old
                issue_description: "The paint is fading now.",
            }
        };

        const res = await request(app)
            .post('/api/v1/validate')
            .send(payload);

        expect(res.status).toBe(200);
        expect(res.body.data.status).not.toBe('LIKELY_VIOLATION');
    }, 30000);
});