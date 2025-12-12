argueOS Website – Testing Strategy
1. Unit Tests (Logic)
File pattern: src/router/svc/*.test.ts
What to test:
JSON Parsing: Ensure the API gracefully handles malformed JSON from OpenAI.
Intent Mapping: Verify that the "Auto Dealer" string maps correctly to /issue/car-dealer-issues.
Validators: Ensure Lead submission validates email formats strictly.
2. Integration Tests (Router)
File pattern: src/tests/router.integration.test.ts
Strategy:
Mock the OpenAI API.
Send a simulated conversation history.
Assert that the decision logic (Clarify vs. Route) works correctly based on the mock response.
Goal: Verify the "Brain" of the site works without spending API credits.
3. End-to-End (E2E) Tests
Tool: Playwright
Critical Flows to Test:
The Happy Path:
Home Page -> Chat Input -> "Car broken" -> Redirect -> Handshake Page -> "Yes" -> Form Load.
The "Clarification" Path:
Home Page -> Chat Input -> "I want money" -> Bot asks "Why?" -> User replies -> Redirect.
Mobile Responsiveness:
Verify the "Definitions Drawer" opens on mobile tap.
--- END OF FILE 04-website-testing.md ---