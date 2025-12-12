# argueOS – Data Model & API Specification (v1)

This document defines the core data structures and the primary API endpoint for the v1 vertical slice.

---

## 1. Core Data Model

All tables below (except `organizations`) MUST have an `organization_id` column to enforce multi-tenancy. All tables should include standard `created_at` and `updated_at` timestamps.

### `organizations`
The top-level tenant (a law firm).
*   `id` (PK)
*   `name` (string)

### `users`
Staff members belonging to an organization.
*   `id` (PK)
*   `organization_id` (FK to `organizations.id`)
*   `email` (string, unique)
*   `role` (string, e.g., 'admin', 'staff')
*   `password_hash` (string)

### `form_schemas`
The versioned definition of a form.
*   `id` (PK)
*   `organization_id` (FK to `organizations.id`)
*   `name` (string, e.g., "Personal Injury Intake")
*   `version` (integer)
*   `schema_json` (JSONB) - The actual form schema definition.
*   `is_deprecated` (boolean, default: false)

### `clients`
The law firm's clients.
*   `id` (PK)
*   `organization_id` (FK to `organizations.id`)
*   `full_name` (string)
*   `email` (string)

### `matters`
A specific case or engagement for a client.
*   `id` (PK)
*   `organization_id` (FK to `organizations.id`)
*   `client_id` (FK to `clients.id`)
*   `name` (string, e.g., "Smith v. Jones")
*   `status` (string, e.g., 'open', 'closed')

### `form_submissions`
An instance of a filled-out form.
*   `id` (PK)
*   `organization_id` (FK to `organizations.id`)
*   `form_schema_id` (FK to `form_schemas.id`)
*   `client_id` (FK to `clients.id`)
*   `matter_id` (FK to `matters.id`, nullable)
*   `submission_data` (JSONB) - The key-value pairs of the submitted answers.

---

## 2. API Contract (v1 Vertical Slice)

### Endpoint: `POST /api/intake/forms/from-prompt`

Generates a new `FormSchema` from a natural language prompt.

**Authentication:** Required. The request must be made by an authenticated user.

**Authorization:** The system MUST verify that the authenticated user is a member of the `organizationId` provided in the request body.

**Request Body:**
```json
{
  "prompt": "A detailed intake form for a slip-and-fall case at a commercial property.",
  "organizationId": "org_abc123"
}
Success Response (200 OK):
code
JSON
{
  "formSchemaId": "fs_xyz789",
  "version": 1,
  "schema": {
    "type": "object",
    "properties": {
      "clientName": { "type": "string", "title": "Client Full Name" },
      "incidentDate": { "type": "string", "format": "date", "title": "Date of Incident" }
      // ... other fields
    },
    "required": ["clientName", "incidentDate"]
  }
}
Error Response (4xx/5xx):
Returns a structured error message.
code
JSON
{
  "error": {
    "code": "llm_generation_failed",
    "message": "The model was unable to generate a valid form schema from the prompt provided."
  }
}

### Endpoint: `GET /api/forms/:id`
Fetch a specific form schema by ID.
- **Auth:** Required (Org Scoped).
- **Response:** `FormSchema` object.

### Endpoint: `PUT /api/forms/:id`
Update a form schema (effectively creates a new version).
- **Auth:** Required (Org Scoped).
- **Body:** `{ schema: FormSchemaJsonShape }`
- **Behavior:** 
  1. Fetches current head version.
  2. Increments version number.
  3. Inserts new row with updated JSON.
  4. Returns new `FormSchema`.