import { describe, it, expect } from 'vitest';
import { getNextFieldKey } from './schemaIterator';
import type { FormSchemaJson } from '@/lib/types/argueos-types';

// Mock Schema: A simple 3-step flow with one conditional branch
const MOCK_SCHEMA: FormSchemaJson = {
  type: "object",
  properties: {
    "q1_intro": {
      id: "1", key: "q1_intro", title: "Start?", kind: "text",
    },
    "q2_branch": {
      id: "2", key: "q2_branch", title: "Do you have details?", kind: "radio",
      options: [{ id: "y", label: "Yes", value: "yes" }, { id: "n", label: "No", value: "no" }]
    },
    "q3_details": {
      id: "3", key: "q3_details", title: "Enter Details", kind: "textarea",
      // HIDDEN LOGIC: Only show if q2_branch == 'yes'
      logic: [
        {
          action: "hide",
          when: { fieldKey: "q2_branch", operator: "not_equals", value: "yes" }
        }
      ]
    },
    "q4_final": {
      id: "4", key: "q4_final", title: "Conclusion", kind: "text",
    }
  },
  order: ["q1_intro", "q2_branch", "q3_details", "q4_final"]
};

describe('Intake Logic Engine (schemaIterator)', () => {

  it('should start at the first field when data is empty', () => {
    const next = getNextFieldKey(MOCK_SCHEMA, {});
    expect(next).toBe("q1_intro");
  });

  it('should move to the second field after first is filled', () => {
    const next = getNextFieldKey(MOCK_SCHEMA, { "q1_intro": "Let's go" });
    expect(next).toBe("q2_branch");
  });

  describe('Conditional Logic (Branching)', () => {
    it('should SHOW dependent field if condition is met (Yes -> Details)', () => {
      // User answered "Yes" to q2, so q3 should appear next
      const data = { 
        "q1_intro": "done", 
        "q2_branch": "yes" 
      };
      
      const next = getNextFieldKey(MOCK_SCHEMA, data);
      expect(next).toBe("q3_details");
    });

    it('should SKIP dependent field if condition is NOT met (No -> Final)', () => {
      // User answered "No" to q2, so q3 should be hidden, skipping to q4
      const data = { 
        "q1_intro": "done", 
        "q2_branch": "no" 
      };
      
      const next = getNextFieldKey(MOCK_SCHEMA, data);
      expect(next).toBe("q4_final");
    });
  });

  describe('Validation & Edges', () => {
    it('should return null when form is complete', () => {
      const data = {
        "q1_intro": "done",
        "q2_branch": "no",
        "q4_final": "finished"
        // q3 skipped
      };
      const next = getNextFieldKey(MOCK_SCHEMA, data);
      expect(next).toBeNull();
    });

    it('should not skip a field if it is currently empty but visible', () => {
      // q3 is visible because q2 is yes, but q3 is empty. It should stick on q3.
      const data = {
        "q1_intro": "done",
        "q2_branch": "yes"
      };
      // Note: getNextFieldKey iterates from start. 
      // Since q1 and q2 are filled, it should land on q3.
      const next = getNextFieldKey(MOCK_SCHEMA, data);
      expect(next).toBe("q3_details");
    });
  });
});