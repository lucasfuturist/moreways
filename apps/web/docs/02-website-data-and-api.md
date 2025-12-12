argueOS Website – Data & API Spec (v1)
This document defines the data structures for the Intake Router and Client Portal.
1. Core Entities (Website)
RouterSession
Ephemeral state of a chat conversation.
id (UUID)
session_id (Cookie/LocalStorage ID)
transcript (JSONB) – Full chat history.
detected_intent (String) – e.g., "Auto Dealer", "Debt Collection".
converted (Boolean) – Did they click "Start Claim"?
Lead
A pre-qualified user who has completed the Handshake.
id (UUID)
email (String)
intent_category (String)
summary (Text) – AI generated summary of their issue.
source_url (String) – Which page they converted on.
2. API Contract
Endpoint: POST /api/chat/route
Analyzes user input and decides navigation.
Access: Public (Rate Limited).
Request:
code
JSON
{
  "messages": [
    { "role": "user", "content": "My landlord kept my deposit." }
  ]
}
Response (JSON):
code
JSON
{
  "message": "I understand. This looks like a Housing issue...",
  "router_data": {
    "form_type": "Housing – Landlord/Tenant Issue",
    "needs_clarification": "no",
    "target_path": "/issue/rental-issues"
  }
}
Endpoint: GET /api/portal/status
Fetches active case status for logged-in clients.
Access: Authenticated (Client Role).
Response (JSON):
code
JSON
{
  "cases": [
    {
      "id": "case_123",
      "title": "Smith v. Landlord Corp",
      "status": "In Review",
      "last_update": "2023-10-25T10:00:00Z"
    }
  ]
}
--- END OF FILE 02-website-data-and-api.md ---