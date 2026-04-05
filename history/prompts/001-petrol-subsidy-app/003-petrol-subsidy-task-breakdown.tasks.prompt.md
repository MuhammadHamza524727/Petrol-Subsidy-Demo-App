---
id: "003"
title: Petrol Subsidy Task Breakdown
stage: tasks
date: 2026-04-05
surface: agent
model: claude-sonnet-4-6
feature: 001-petrol-subsidy-app
branch: 001-petrol-subsidy-app
user: MuhammadHamza524727
command: /sp.tasks
labels: ["tasks","petrol-subsidy","next.js","drizzle","grok","recharts","qr","tts"]
links:
  spec: specs/001-petrol-subsidy-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-petrol-subsidy-app/tasks.md
  - history/prompts/001-petrol-subsidy-app/003-petrol-subsidy-task-breakdown.tasks.prompt.md
tests:
  - null
---

## Prompt

Break the project into detailed actionable tasks.

SETUP: Create Next.js app, install Tailwind, setup shadcn/ui, setup project structure.
FRONTEND: Build landing page, CNIC input form, eligibility result UI, dashboard layout.
BACKEND: Create API routes, eligibility logic (mock), transactions API.
DATABASE: Setup NeonDB, create Users/Transactions/Quota tables, connect DB.
DASHBOARD: Show quota, remaining fuel, transactions.
QR SYSTEM: Generate QR code, simulate scan, deduct fuel.
CHARTS: Install Recharts, show usage graph.
AI: Integrate Grok API, build chatbot UI, add eligibility explanation.
VOICE: Add TTS, play audio.
FINAL: Add disclaimer, improve UI, deploy.

## Response snapshot

Created `specs/001-petrol-subsidy-app/tasks.md` with 45 tasks across 8 phases.

Task distribution:
- Phase 1 Setup: T001–T009 (9 tasks)
- Phase 2 Foundational: T010–T017 (8 tasks) — BLOCKING
- Phase 3 US1 CNIC Eligibility: T018–T022 (5 tasks) — MVP
- Phase 4 US2 AI Prediction: T023–T026 (4 tasks)
- Phase 5 US3 Dashboard+Charts: T027–T031 (5 tasks)
- Phase 6 US4 QR Voucher: T032–T034 (3 tasks)
- Phase 7 US5 Chatbot+TTS: T035–T036 (2 tasks)
- Phase 8 Polish+Deploy: T037–T045 (9 tasks)

16 parallelizable tasks identified. No test tasks (not requested).
MVP = Phases 1+2+3 (22 tasks) → CNIC eligibility demo-able independently.

## Outcome

- ✅ Impact: 45 fully specified tasks; each has exact file path; immediately executable by LLM
- 🧪 Tests: No test tasks generated (not requested in spec)
- 📁 Files: specs/001-petrol-subsidy-app/tasks.md
- 🔁 Next prompts: /sp.implement to execute tasks, or start with T001 directly
- 🧠 Reflection: US5 (chatbot+TTS) has only 2 tasks because grok.ts and disclaimer
  infrastructure is shared from Phase 2; incremental delivery is very clean

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): all 45 tasks have checkbox + ID + file path + story label
- Prompt variant (if applicable): tasks from design artifacts (no shell scripts)
- Next experiment: /sp.implement or begin T001 manually
