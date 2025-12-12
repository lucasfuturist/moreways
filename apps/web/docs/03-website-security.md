argueOS Website – Security Policy (v1)
Applies To: Public Marketing Site, Intake Router, Client Login.
1. Public AI Endpoint Protection
The /api/chat endpoint is a public resource costing money per request. It must be protected aggressively.
1.1 Rate Limiting
Limit: 10 requests per IP per minute.
Enforcement: Redis-based sliding window rate limiter (or Vercel KV).
Violation: Return 429 Too Many Requests.
1.2 Prompt Injection Defense
The System Prompt must contain "Jailbreak Defense" instructions.
Output is strictly forced to JSON Mode to prevent the AI from generating executable code or conversational drift.
2. PII Handling in Chat
No Retention: The Router is for routing, not intake.
We do not store the raw chat transcript in a permanent database linked to the user's identity unless they convert to a Lead.
Logs: Application logs must strictly exclude the messages content array. Only log metadata (token usage, intent category).
3. Client Portal Security
No Direct DB Access: The Portal UI must strictly fetch data via server-side API routes.
Tenant Isolation: Even for the client portal, every query must verify session.userId matches the case.clientId.
CSRF: All forms (login, contact) must use CSRF tokens (standard in Next.js/Auth.js).