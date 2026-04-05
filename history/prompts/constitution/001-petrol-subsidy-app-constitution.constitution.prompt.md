---
id: "001"
title: Petrol Subsidy App Constitution Setup
stage: constitution
date: 2026-04-05
surface: agent
model: claude-sonnet-4-6
feature: none
branch: master
user: MuhammadHamza524727
command: /sp.constitution
labels: ["constitution","petrol-subsidy","ai","next.js","neondb","grok"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - history/prompts/constitution/001-petrol-subsidy-app-constitution.constitution.prompt.md
tests:
  - null
---

## Prompt

You are a senior full-stack engineer, AI architect, and product designer.

Your task is to build a production-level demo web application called:

"Petrol Subsidy Demo App (AI-Powered)"

This is a portfolio + YouTube demo project simulating Pakistan's petrol subsidy system.

CORE GOALS: Build a clean, scalable, modern full-stack app. Simulate a government-style
petrol subsidy system. Integrate AI features (chatbot, prediction, voice). Optimize for
demo, UI/UX, and virality (YouTube).

IMPORTANT RULES: This is NOT a real government app. Always include a disclaimer in UI.
Use mock/simulated data where needed. Focus on UX simplicity (low-literacy users).

FEATURES: Landing Page, CNIC Eligibility Check (Mock), AI Eligibility Prediction,
AI Chatbot (English + Urdu mix), Voice Assistant (TTS), Dashboard (quota/remaining fuel),
QR Code System, Transactions History, Charts (Recharts).

TECH STACK: Next.js App Router, Tailwind CSS, shadcn/ui, NeonDB (PostgreSQL),
Grok API (LLM), TTS integration, react-qr-code, Recharts, Vercel deployment.

DATABASE SCHEMA: Users (id, cnic, name, phone, vehicle_type, eligibility_status),
Transactions (id, user_id, liters_used, date), Quota (user_id, total_quota, remaining_quota).

UI/UX RULES: Mobile-first, simple language, big buttons, clean dashboard, accessible.

DEVELOPMENT ORDER (14 steps): Setup → Landing Page → CNIC validation → eligibility mock
→ NeonDB schema → Dashboard → Transactions/Quota → QR Code → Charts → Grok AI →
Chatbot UI → Voice/TTS → Polish → Disclaimer.

AI BEHAVIOR: Simple language, English + Roman Urdu mix.
Example: "Aap eligible hain kyun ke aapki income low hai aur bike use karte hain."

## Response snapshot

Created project constitution at `.specify/memory/constitution.md` v1.0.0.

Six core principles established:
1. Disclaimer-First (NON-NEGOTIABLE) — visible disclaimer on every page and AI output
2. Mobile-First, Accessibility-First UX — shadcn/ui, Tailwind, 44px tap targets, WCAG AA
3. Mock-First Data — no real PII, rule-based CNIC simulation, seeded quota/transactions
4. AI Explainability — simple language + Roman Urdu, Grok called with enforcing system prompt
5. Modular Typed Full-Stack Architecture — strict stack (Next.js, NeonDB, Grok, Recharts, etc.)
6. Secrets & Environment Security — .env.local only, server-side AI calls, .env.example required

Tech stack locked. DB schema documented. 14-step build order enforced in Governance section.

## Outcome

- ✅ Impact: Project constitution ratified at v1.0.0; all 6 principles are declarative and testable
- 🧪 Tests: No tests in this step (constitution setup)
- 📁 Files: .specify/memory/constitution.md created/overwritten
- 🔁 Next prompts: Run /sp.specify to create the feature spec for step 1 (Next.js project setup + Landing Page)
- 🧠 Reflection: All 14 build steps are captured in the Governance section; disclaimer principle is non-negotiable to protect developer from misrepresentation risk

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): no automated graders at this stage
- Prompt variant (if applicable): initial constitution creation
- Next experiment: run /sp.specify for "petrol-subsidy-core" feature to begin step 1
