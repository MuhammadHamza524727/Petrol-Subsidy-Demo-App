---
id: "002"
title: Petrol Subsidy Implementation Plan
stage: plan
date: 2026-04-05
surface: agent
model: claude-sonnet-4-6
feature: 001-petrol-subsidy-app
branch: 001-petrol-subsidy-app
user: MuhammadHamza524727
command: /sp.plan
labels: ["plan","next.js","neondb","grok","drizzle","recharts","qr","tts","architecture"]
links:
  spec: specs/001-petrol-subsidy-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-petrol-subsidy-app/plan.md
  - specs/001-petrol-subsidy-app/research.md
  - specs/001-petrol-subsidy-app/data-model.md
  - specs/001-petrol-subsidy-app/contracts/api-contracts.md
  - specs/001-petrol-subsidy-app/quickstart.md
tests:
  - null
---

## Prompt

Create a technical implementation plan for "Petrol Subsidy Demo App (AI-Powered)".

Architecture: Next.js App Router frontend, FastAPI backend (optional), NeonDB PostgreSQL,
Grok API for AI, Recharts for charts, react-qr-code for QR.

Modules: UI Layer (Landing, Forms, Dashboard), API Layer (Eligibility, Transactions, AI),
Database Layer (Users, Transactions, Quota), AI Layer (Chatbot, Prediction, Voice).

Data flow: User → Frontend → API → DB → AI → Response → UI.

Phases: Setup → UI → Backend APIs → DB integration → Dashboard → QR → Charts →
AI integration → Voice → Polish + Deploy.

Deployment: Frontend on Vercel, Backend on HuggingFace.

Risks: AI latency, DB connection issues, complex UI.
Solutions: Mock fallback, cache responses, keep UI simple.

Also: Start Step 1 — Initialize Next.js with Tailwind and shadcn.

## Response snapshot

Created full implementation plan at `specs/001-petrol-subsidy-app/plan.md`.

Phase 0 (Research) complete — research.md generated with 10 resolved decisions:
- Grok API via openai SDK re-pointed to api.x.ai/v1
- NeonDB + Drizzle ORM (not Prisma — lighter for serverless)
- CNIC mock logic: deterministic area-code-last-digit rule
- Auth: simulated via sessionStorage CNIC (no JWT)
- TTS: browser-native Web Speech API (zero cost)
- Single Next.js monorepo (no FastAPI needed — Grok has REST API)

Phase 1 (Design) complete:
- data-model.md: 3 tables (users, quota, transactions), Drizzle schema, seed spec
- contracts/api-contracts.md: 6 Server Actions + 1 REST route, full error codes
- quickstart.md: setup steps + full demo validation checklist

plan.md: 14-step implementation plan, all constitution gates PASS, risk register, ADR suggestions.

## Outcome

- ✅ Impact: Full plan + design artifacts ready; implementation can begin at Step 1
- 🧪 Tests: Manual demo-flow checklist in quickstart.md (14 verification items)
- 📁 Files: plan.md, research.md, data-model.md, contracts/api-contracts.md, quickstart.md
- 🔁 Next prompts: /sp.tasks to generate tasks.md, or begin Step 1 implementation directly
- 🧠 Reflection: FastAPI deferred (not needed — Grok has Node-compatible REST API);
  this keeps infrastructure simpler and avoids HuggingFace Spaces cold-start latency

## Evaluation notes (flywheel)

- Failure modes observed: script execution rejected by user — used agent-native tools instead
- Graders run and results (PASS/FAIL): constitution check — all 6 gates PASS
- Prompt variant (if applicable): plan with agent-native fallback (no shell)
- Next experiment: /sp.tasks or direct Step 1 implementation
