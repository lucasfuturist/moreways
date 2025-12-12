// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// 1. Mock OpenAI
// We mock the constructor and the method chain .chat.completions.create
const mockCreate = vi.fn();
vi.mock('openai', () => {
  return {
    default: class {
      chat = {
        completions: {
          create: mockCreate
        }
      }
    }
  }
});

// Helper to create fake NextRequests
function createRequest(body: any) {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

describe('AI Router (API)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Default valid key for most tests
    vi.stubEnv('OPENAI_API_KEY', 'mock-key');
  });

  it('should return 503 if API Key is missing', async () => {
    vi.stubEnv('OPENAI_API_KEY', ''); // Unset key
    
    const req = createRequest({ messages: [] });
    const res = await POST(req);
    
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.message).toContain('configuration error');
  });

  it('should handle "Needs Clarification" response correctly', async () => {
    // Mock AI saying: "I need more info"
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            form_type: null,
            needs_clarification: "yes",
            clarification_question: "Did you sign a contract?"
          })
        }
      }]
    });

    const req = createRequest({ messages: [{ role: 'user', content: 'Help' }] });
    const res = await POST(req);
    const data = await res.json();

    // The frontend expects the message to be the clarification question
    expect(data.message).toBe("Did you sign a contract?");
    expect(data.router_data.needs_clarification).toBe("yes");
  });

  it('should handle "Routing" response correctly', async () => {
    // Mock AI saying: "This is a car issue"
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            form_type: "Auto – Dealership or Repair",
            needs_clarification: "no",
            reason: "User mentioned car dealer."
          })
        }
      }]
    });

    const req = createRequest({ messages: [{ role: 'user', content: 'Car broken' }] });
    const res = await POST(req);
    const data = await res.json();

    // The frontend expects a success message constructed by the route
    expect(data.message).toContain("looks like a Auto – Dealership");
    expect(data.router_data.form_type).toBe("Auto – Dealership or Repair");
  });

  it('should handle Malformed JSON gracefully', async () => {
    // Mock AI hallucinating non-JSON output (e.g. server error or drift)
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: "I am not returning JSON today."
        }
      }]
    });

    // The route has a try/catch block around JSON.parse
    const req = createRequest({ messages: [] });
    const res = await POST(req);
    const data = await res.json();

    // Verify it caught the error
    expect(data.message).toBe("System error processing response.");
  });
});