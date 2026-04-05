---
id: "001"
title: Petrol Subsidy App Feature Spec
stage: spec
date: 2026-04-05
surface: agent
model: claude-sonnet-4-6
feature: 001-petrol-subsidy-app
branch: 001-petrol-subsidy-app
user: MuhammadHamza524727
command: /sp.specify
labels: ["spec","petrol-subsidy","eligibility","dashboard","qr","chatbot","voice"]
links:
  spec: specs/001-petrol-subsidy-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-petrol-subsidy-app/spec.md
  - specs/001-petrol-subsidy-app/checklists/requirements.md
  - history/prompts/001-petrol-subsidy-app/001-petrol-subsidy-app-spec.spec.prompt.md
tests:
  - null
---

## Prompt

Create a detailed product specification for a demo web app called:

"Petrol Subsidy Demo App (AI-Powered)"

PURPOSE: A demo application that simulates Pakistan's petrol subsidy system for
low-income users. This is NOT an official government app.

TARGET USERS: Motorcycle owners, rickshaw drivers, low-income individuals, low-tech /
low-literacy users.

USER GOALS: Check eligibility for subsidy, understand how subsidy works, track petrol
usage, use QR-based voucher system.

FEATURES:
1. Landing Page - simple explanation, CTA: Check Eligibility
2. CNIC Check - input CNIC, validate format, simulate eligibility
3. AI Prediction - inputs: salary/vehicle type/usage; output: eligibility + explanation
4. Chatbot - FAQ handling, guidance
5. Voice Assistant - convert text to speech
6. Dashboard - monthly quota (20L), remaining fuel, summary
7. QR Code - generate voucher, simulated scan
8. Transactions - logs of usage
9. Charts - usage trends

SUCCESS METRICS: Smooth demo flow, fast UI, clear understanding for users, good visuals
for YouTube.

CONSTRAINTS: Must be simple, must include disclaimer, use mock data where needed.

UX RULES: Mobile-first, large buttons, simple language (English + Roman Urdu).

## Response snapshot

Created feature spec at `specs/001-petrol-subsidy-app/spec.md` on branch `001-petrol-subsidy-app`.

5 user stories defined with priorities P1–P5:
- P1: CNIC Eligibility Check (core MVP)
- P2: AI Eligibility Prediction (Grok API)
- P3: Dashboard + Transaction History + Charts
- P4: QR Voucher System
- P5: AI Chatbot + Voice TTS

16 Functional Requirements (FR-001–FR-016) covering: disclaimer (non-negotiable),
CNIC validation, mock eligibility logic, AI prediction, Dashboard, QR voucher,
Chatbot TTS, server-side API calls, secrets management, mobile-first UX.

8 Success Criteria (SC-001–SC-008) all technology-agnostic and measurable.

Quality checklist at `specs/001-petrol-subsidy-app/checklists/requirements.md` — all items pass.
No [NEEDS CLARIFICATION] markers remain.

## Outcome

- ✅ Impact: Full spec created; 0 clarification blockers; ready for /sp.plan
- 🧪 Tests: No tests at spec stage
- 📁 Files: specs/001-petrol-subsidy-app/spec.md, checklists/requirements.md
- 🔁 Next prompts: /sp.plan to generate architecture and implementation plan
- 🧠 Reflection: Disclaimer principle from constitution correctly carried into FR-001;
  all AI calls enforced server-side in FR-013; CNIC used as mock session ID (assumption documented)

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): quality checklist — all 14 items PASS
- Prompt variant (if applicable): initial spec creation
- Next experiment: /sp.plan for 001-petrol-subsidy-app
