/**
 * tests/mocks/llm.mock
 *
 * Helper LLM clients for unit tests.
 *
 * These simulate vendor responses without making real network calls.
 */

export async function mockLlmClientReturnsValidSchema(
  _prompt: string
): Promise<string> {
  // Return a minimal but valid schema JSON string.
  return JSON.stringify({
    type: "object",
    properties: {
      clientFullName: {
        kind: "text",
        type: "string",
        title: "Client Full Name",
      },
      incidentDate: {
        kind: "date",
        type: "string",
        title: "Date of Incident",
      },
    },
    required: ["clientFullName"],
  });
}

export async function mockLlmClientReturnsInvalidJson(
  _prompt: string
): Promise<string> {
  // Deliberately invalid JSON for error-path tests.
  return "this is not valid json";
}
