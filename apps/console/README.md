# argueOS

argueOS is an **AI-assisted legal intake + CRM platform** designed for modern law firms.  
V1 delivers: **Prompt → AI-Generated Form Schema → Live Preview → Stored Versioning**.

---

## 🚀 Quick Start (Local Dev)

### Prerequisites
- Node.js ≥ 18
- `pnpm`
- Docker (recommended for Postgres)

### Setup

```bash
git clone https://github.com/your-org/argueOS.git
cd argueOS

pnpm install
cp .env.example .env   # then fill in CONSOLE_DATABASE_URL + OPENAI_API_KEY

docker-compose up -d   # starts Postgres
pnpm db:migrate
pnpm dev
````

App runs at:
👉 [http://localhost:3000](http://localhost:3000)

---

## 📚 Core Project Docs

**READ THESE BEFORE WRITING CODE**

| File                                       | Purpose                                                      |
| ------------------------------------------ | ------------------------------------------------------------ |
| **PRODUCT_V1.md**                          | What v1 *is* and *is not*                                    |
| **01-technical-vision-and-conventions.md** | Architecture, naming, folder strategy (**Required Reading**) |
| **DATA_API_SPEC.md**                       | DB schema + primary API endpoint                             |
| **PROMPTS.md**                             | LLM prompt template rules (lives in `/prompts`)              |
| **02-fat-v1-prompt-to-preview-slice.md**   | Field Acceptance Test — defines “DONE”                       |

---

## 🏗 Repo Structure (high-level)

```
/src
  /intake
  /forms
  /crm
  /llm
  /infra
/docs
/prompts
.env.example
```

Architecture follows our enforced **domain × layer** structure
(see: `01-technical-vision-and-conventions.md`).

---

## 🧪 Tests & Quality

Run all tests:

```bash
pnpm test
```

Lint:

```bash
pnpm lint
```

Type safety enforced via:

```bash
pnpm typecheck
```

---

## 🤝 Contributing

We are building *deliberately*.

* Feature branches → PR → CI must pass
* Follow naming & folder conventions exactly
* All code touching LLM output **must validate schema before write**

PRs that violate conventions will be rejected.

---

## 🗺 Roadmap

V1 vertical slice target:

> “Lawyer prompt → AI schema → Stored version → Live preview”

(Full acceptance criteria defined in `02-fat-v1-prompt-to-preview-slice.md`)

---

## 🧠 AI Agents

This repository is **fully compatible with autonomous LLM coding agents**.

Agents must:

1. Read `01-technical-vision-and-conventions.md` FIRST
2. Obey naming rules
3. Never write code that bypasses schema validation
4. Pass FAT checklist

---

## 🛠 Useful Commands

| Action     | Command           |
| ---------- | ----------------- |
| Dev server | `pnpm dev`        |
| DB migrate | `pnpm db:migrate` |
| Run tests  | `pnpm test`       |
| Lint       | `pnpm lint`       |

---

## 🏛 License

Private, all rights reserved (pending)

```

---

