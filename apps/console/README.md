# MoreWays Console

The **MoreWays Console** is an AI-native legal intake and case management platform. It combines a natural-language "Form Architect" with a conversational intake engine and automated legal merit assessment to streamline the bridge between potential clients and legal professionals.

## 🚀 Core Capabilities

*   **AI Form Architect:** Build complex, versioned legal forms using natural language prompts. The system generates structured JSON schemas, including conditional logic and PII (Personally Identifiable Information) detection.
*   **Conversational Intake (ChatRunner):** Transform any static form into an intelligent, multi-turn chat conversation. The AI agent performs "Deep Listening" to extract data, handle side-loaded information, and clarify ambiguous answers.
*   **Automated Claim Assessment:** Integrated "Magistrate" AI service that evaluates submissions for legal merit, providing scores, executive summaries, and prima facie element analysis.
*   **Secure CRM & Inbox:** A workspace for legal teams to review submissions, export professional legal memos, and manage "Matters" (cases) with field-level encryption (FLE) for sensitive client data.
*   **Developer-First Infrastructure:** Built-in simulation engines for user personas, robust audit logging, and a comprehensive suite of E2E and unit tests.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
*   **Language:** TypeScript
*   **Database & ORM:** [Prisma](https://www.prisma.io/) with PostgreSQL (via Supabase)
*   **Authentication:** Supabase Auth
*   **AI/LLM:** OpenAI (GPT-4o / GPT-4 Turbo)
*   **UI/UX:** Tailwind CSS, Framer Motion (Animations), Radix UI (Primitives), Lucide React (Icons)
*   **Testing:** Vitest (Unit/Integration), Playwright (E2E)

## 📁 Project Structure

```text
src/
├── admin/      # Operations Center for managing tenants and support
├── app/        # Next.js App Router (Routes and API Endpoints)
├── auth/       # Identity management and session handling
├── components/ # Shared UI library (Glassmorphism, Page Transitions)
├── crm/        # Lead management, Case/Matter tracking, and Legal Memos
├── forms/      # The "Grand Unified Schema" logic and Form Builder UI
├── infra/      # Core services: Encryption, Rate Limiting, Logging, DB Client
├── intake/     # The "Architect" pipeline (Prompt -> Schema generation)
├── lib/        # Shared utility functions
├── llm/        # AI Service layer (Prompt builders, JSON parsers, Agent logic)
└── tests/      # Comprehensive testing suite (E2E, Fuzz, Unit)
```

## 🚦 Getting Started

### Prerequisites
*   Node.js (v18+)
*   pnpm (recommended) or npm
*   A running PostgreSQL instance (or Supabase project)

### Installation
1.  **Clone the repo:**
    ```bash
    git clone https://github.com/moreways-ecosystem/console.git
    cd console
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Environment Setup:**
    Copy `.env.example` to `.env.local` and fill in:
    *   `DATABASE_URL`: Prisma connection string
    *   `OPENAI_API_KEY`: For the Form Architect and Intake Agent
    *   `ENCRYPTION_KEY`: 32-character hex string for PII protection

4.  **Database Migration:**
    ```bash
    npx prisma migrate dev
    ```

5.  **Run Development Server:**
    ```bash
    pnpm dev
    ```

## 🧪 Testing & Development

*   **Unit/Integration Tests:** `pnpm test` (Uses Vitest)
*   **E2E Smoke Tests:** `npx playwright test`
*   **Seed Development Data:** Hit the internal endpoint `/api/dev/seed` to populate a test organization and sample forms.
*   **Simulation:** Use the "Auto-Fill Engine" in the form previewer to test how different user personas (e.g., "Anxious," "Corporate") interact with your generated forms.

## 🔐 Security & Compliance

*   **PII Redaction:** The `infra.svc.logger` automatically redacts sensitive keys from system logs.
*   **At-Rest Encryption:** Sensitive form fields are protected using **AES-256-GCM** via the `EncryptionService` before hitting the database.
*   **Audit Trails:** Every access to PII-decrypted data is logged to an immutable audit trail for compliance.
*   **Honeypots:** Public form submissions include hidden fields to mitigate automated bot spam.

## 📄 License

Internal MoreWays Ecosystem Property. See `CONTRIBUTING.md` for guidelines.