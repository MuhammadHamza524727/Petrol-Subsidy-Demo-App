---
description: "Task list for Petrol Subsidy Demo App (AI-Powered)"
---

# Tasks: Petrol Subsidy Demo App (AI-Powered)

**Feature**: `001-petrol-subsidy-app`
**Input**: Design documents from `/specs/001-petrol-subsidy-app/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/api-contracts.md ✅

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks grouped by user story for independent implementation and testing.

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1–US5)
- All file paths are relative to the repository root

---

## Phase 1: Setup

**Purpose**: Project initialization — creates the skeleton all user stories build on.

- [x] T001 Initialize Next.js 14 project with TypeScript and App Router at repo root: `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`
- [x] T002 Install project dependencies: `pnpm add drizzle-orm @neondatabase/serverless drizzle-kit openai react-qr-code recharts zod tsx`
- [x] T003 [P] Install shadcn/ui and initialize: `pnpm dlx shadcn@latest init` — select Default style, Slate base color, CSS variables
- [x] T004 [P] Add shadcn/ui components needed across all stories: `pnpm dlx shadcn@latest add button input card badge toast skeleton sheet dialog`
- [x] T005 Create `.env.example` at repo root with placeholders:
  ```
  DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
  XAI_API_KEY=xai-xxxxxxxxxxxxxxxxxxxxxxxx
  ```
- [x] T006 Add `.env.local` to `.gitignore` (verify not already present)
- [x] T007 Create directory structure:
  - `app/(public)/eligibility/result/`
  - `app/(dashboard)/dashboard/`
  - `app/(dashboard)/predict/`
  - `app/(dashboard)/qr/`
  - `app/api/ai/predict/`
  - `app/actions/`
  - `components/ui/` (already created by shadcn)
  - `lib/db/`
- [x] T008 Create `drizzle.config.ts` at repo root:
  ```typescript
  import { defineConfig } from 'drizzle-kit'
  export default defineConfig({
    schema: './lib/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: { url: process.env.DATABASE_URL! },
  })
  ```
- [x] T009 Create `components/disclaimer-banner.tsx` — reusable orange warning bar with text "⚠️ Yeh ek DEMO app hai — Real government service nahin. Data simulated hai."

**Checkpoint**: `pnpm dev` runs without errors at localhost:3000.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before any user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T010 Create `lib/db/schema.ts` with full Drizzle schema — `vehicleTypeEnum`, `eligibilityStatusEnum`, `users`, `quota`, `transactions` tables exactly as specified in `specs/001-petrol-subsidy-app/data-model.md`
- [x] T011 Create `lib/db/index.ts` — NeonDB client singleton:
  ```typescript
  import { neon } from '@neondatabase/serverless'
  import { drizzle } from 'drizzle-orm/neon-http'
  import * as schema from './schema'
  const sql = neon(process.env.DATABASE_URL!)
  export const db = drizzle(sql, { schema })
  ```
- [x] T012 Create `lib/grok.ts` — OpenAI SDK client re-pointed to xAI:
  ```typescript
  import OpenAI from 'openai'
  export const grok = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  })
  export const GROK_SYSTEM_PROMPT = `You are a helpful assistant for Pakistan's petrol subsidy demo app.
  Always respond in simple English mixed with Roman Urdu.
  Keep responses under 100 words.
  Always end with: "⚠️ Yeh ek demo app hai — real government service nahin."
  Never use technical jargon.`
  ```
- [x] T013 Create `lib/eligibility.ts` — pure CNIC mock eligibility function:
  ```typescript
  export function checkCnicMockEligibility(cnic: string): { eligible: boolean; reason: string; name: string; vehicleType: string }
  // Logic: if starts with "42101" → eligible; else last digit of first 5 chars ∈ [0-4] → eligible
  // Returns mock name and vehicle type based on CNIC
  ```
- [x] T014 Create `lib/db/seed.ts` — seed script creating mock user (CNIC: 42101-1234567-8), quota (remaining: 8.50L), and 30 transactions (March 6 – April 4, 2026) with mock station names as specified in `specs/001-petrol-subsidy-app/data-model.md`
- [x] T015 Create `app/(public)/layout.tsx` — public layout wrapping pages with `<DisclaimerBanner />` in header
- [x] T016 Create `app/(dashboard)/layout.tsx` — dashboard layout with nav links (Dashboard, Predict, QR, Chat) and `<DisclaimerBanner />` in sticky footer
- [x] T017 Run `pnpm drizzle-kit push` against NeonDB and then `pnpm tsx lib/db/seed.ts` to verify DB + seed work

**Checkpoint**: DB tables exist, seed data inserted, both layouts render at their routes.

---

## Phase 3: User Story 1 — CNIC Eligibility Check (Priority: P1) 🎯 MVP

**Goal**: User enters CNIC on Landing Page → eligibility result with explanation.

**Independent Test**: Enter CNIC `42101-1234567-8` → see "Eligible" result with Roman Urdu text and disclaimer. Enter `99999-9999999-9` → see "Not Eligible". Enter `1234` → see inline validation error.

### Implementation for User Story 1

- [x] T018 [US1] Create `app/(public)/page.tsx` — Landing Page: hero section ("Pakistan Petrol Subsidy Demo"), 3-feature overview cards, large "Check Eligibility →" button linking to `/eligibility`, disclaimer from `<DisclaimerBanner />` in hero
- [x] T019 [US1] Create `components/cnic-form.tsx` — controlled CNIC input with auto-hyphen mask (XXXXX-XXXXXXX-X format), Zod validation (`/^\d{5}-\d{7}-\d$/`), inline error display, submit button (min 44px height)
- [x] T020 [US1] Create `app/actions/eligibility.ts` — `checkCnicEligibility(cnic: string)` Server Action: validate format, call `lib/eligibility.ts`, upsert `users` + `quota` rows in DB if new eligible CNIC, return `{ eligible, reason, userName, vehicleType }`
- [x] T021 [US1] Create `app/(public)/eligibility/page.tsx` — renders `<CnicForm />`, on submit calls `checkCnicEligibility()`, stores CNIC in `sessionStorage` on success, redirects to `/eligibility/result`
- [x] T022 [US1] Create `app/(public)/eligibility/result/page.tsx` — reads result from search params or sessionStorage, displays Eligible (green card) or Not Eligible (red card), shows `reason` text, shows disclaimer, "Go to Dashboard →" button if eligible

**Checkpoint**: Full US1 flow works independently. Disclaimer visible on both pages.

---

## Phase 4: User Story 2 — AI Eligibility Prediction (Priority: P2)

**Goal**: User fills salary + vehicle + usage form → AI returns eligibility verdict in English + Roman Urdu.

**Independent Test**: salary=30000, vehicle=motorcycle, usage=20 → Eligible response with Roman Urdu. salary=200000, vehicle=car, usage=50 → Not Eligible. Empty form submission → inline errors, no API call.

### Implementation for User Story 2

- [x] T023 [P] [US2] Create `components/prediction-form.tsx` — form with three fields: salary (number input, PKR label), vehicle type (Select: motorcycle/rickshaw/car), monthly usage (number input, litres label); Zod validation; all fields required; submit disabled while loading
- [x] T024 [P] [US2] Create `app/actions/ai.ts` — `getAiPrediction({ salary, vehicleType, monthlyUsage })` Server Action: validate inputs, call `grok.chat.completions.create()` with `GROK_SYSTEM_PROMPT` + user message, parse response, return `{ eligible: boolean, explanation: string }`; catch errors and return hardcoded fallback
- [x] T025 [US2] Create `app/(dashboard)/predict/page.tsx` — renders `<PredictionForm />`, calls `getAiPrediction()` on submit, shows result card with eligible/not-eligible badge, explanation text, disclaimer; loading skeleton while waiting
- [x] T026 [US2] Create `app/api/ai/predict/route.ts` — REST endpoint `POST /api/ai/predict` calling the same `getAiPrediction` logic, returns JSON `{ eligible, explanation }` or error with code

**Checkpoint**: US2 works independently from the `/predict` dashboard route. Fallback message shown when XAI_API_KEY is not set.

---

## Phase 5: User Story 3 — Dashboard + Transactions + Charts (Priority: P3)

**Goal**: Eligible user sees quota card, transaction list, usage trend chart; can reset quota.

**Independent Test**: Navigate to `/dashboard` with mock CNIC in sessionStorage → quota card shows 20L / 8.5L remaining, transaction list shows 30 entries, area chart renders usage trend.

### Implementation for User Story 3

- [x] T027 [P] [US3] Create `components/quota-card.tsx` — card showing total quota (20L), remaining quota (progress bar + number), reset date, "Reset Quota" button
- [x] T028 [P] [US3] Create `components/transaction-list.tsx` — scrollable list of transactions: each row shows date (formatted), litres used, remaining after, mock station name; empty state: "Abhi tak koi transaction nahin hua" with an icon
- [x] T029 [P] [US3] Create `components/usage-chart.tsx` — Recharts `AreaChart` wrapped in `next/dynamic` with `ssr: false`; data: transactions aggregated by day (last 30); responsive container; tooltip showing date + litres
- [x] T030 [US3] Create `app/actions/dashboard.ts` — `getDashboardData(cnic: string)`: query `users` JOIN `quota` + `transactions` ordered by `created_at DESC`, return typed object; `resetQuota(cnic: string)`: set `remaining_quota = total_quota`, update `reset_date = now()`
- [x] T031 [US3] Create `app/(dashboard)/dashboard/page.tsx` — reads CNIC from sessionStorage (redirect to `/eligibility` if missing), calls `getDashboardData()`, renders `<QuotaCard />`, `<TransactionList />`, `<UsageChart />`; "Reset Quota" button calls `resetQuota()` and refreshes data

**Checkpoint**: US3 fully renders with seeded mock data. Chart renders without SSR error. Disclaimer in footer.

---

## Phase 6: User Story 4 — QR Voucher System (Priority: P4)

**Goal**: User generates QR voucher, taps "Simulate Scan", enters litres → quota decrements + transaction logged.

**Independent Test**: Dashboard present (US3). Generate QR → QR code displays. Simulate Scan 2L → remaining decreases by 2, new transaction appears. Attempt to scan more than remaining → error message.

### Implementation for User Story 4

- [x] T032 [P] [US4] Create `app/actions/qr.ts` — `generateQrVoucher(cnic)`: reads remaining quota, returns `{ qrValue: JSON string, remainingQuota }`; `simulateScan(cnic, litersToDeduct)`: validates amount ≤ remaining, decrements `quota.remaining_quota`, inserts `transactions` row with random mock station, returns updated quota + new transaction
- [x] T033 [US4] Create `components/qr-voucher.tsx` — client component: renders `react-qr-code` with `qrValue` prop; shows remaining quota below QR; "Simulate Scan" button opens Dialog; Dialog contains litre input (numeric, min 0.5, max remaining); confirm button calls `simulateScan()`; disabled state + message when quota = 0
- [x] T034 [US4] Create `app/(dashboard)/qr/page.tsx` — reads CNIC from sessionStorage, calls `generateQrVoucher()`, renders `<QrVoucher />`; on successful scan: shows toast "✅ X litres deducted", updates displayed quota; on INSUFFICIENT_QUOTA error: shows toast "❌ Quota nahin hai — insufficient quota"

**Checkpoint**: Full QR flow works. Quota at 0 disables the button. Error and success toasts display correctly.

---

## Phase 7: User Story 5 — AI Chatbot + Voice TTS (Priority: P5)

**Goal**: Floating chatbot panel answers subsidy FAQs in English + Roman Urdu; speaker icon reads responses aloud.

**Independent Test**: Click chat button → panel opens. Type "eligibility kya hai?" → response in ≤5 seconds with Roman Urdu phrase and disclaimer. Click speaker icon → audio plays. Close and reopen → history cleared.

### Implementation for User Story 5

- [x] T035 [P] [US5] Create `app/actions/chat.ts` — `getChatbotResponse(message, history)` Server Action: prepend `GROK_SYSTEM_PROMPT`, send conversation history to Grok, return `{ response, fallback: false }`; on error return `{ response: "Sorry, service abhi available nahin — try again later. ⚠️ Yeh ek demo app hai.", fallback: true }`
- [x] T036 [US5] Create `components/chatbot-panel.tsx` — client component:
  - State: `messages: ChatTurn[]`, `input: string`, `isOpen: boolean`, `isSpeaking: boolean`
  - Floating button (bottom-right): chat bubble icon, opens/closes panel
  - Panel: message list (user + bot bubbles), text input, send button
  - Each bot message: speaker icon button (`window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))`); feature-detect on mount (`'speechSynthesis' in window`), hide icon if false
  - On send: append user message, call `getChatbotResponse()`, append bot response
  - Loading indicator (typing dots) while waiting

**Checkpoint**: US5 fully works. TTS plays on click. Fallback message displays when AI unavailable. Speaker button hidden in Firefox if Web Speech API unsupported.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Demo-quality finishing touches across all user stories.

- [ ] T037 Add loading skeletons to `app/(dashboard)/dashboard/page.tsx` using `shadcn/ui Skeleton` — quota card skeleton, transaction list skeleton (5 rows), chart placeholder
- [ ] T038 [P] Add `shadcn/ui Toaster` to `app/layout.tsx` root layout and verify toast notifications work for QR scan success/error and quota reset
- [ ] T039 [P] Create `public/og-image.png` — 1200×630px banner image with app name and "Demo — Not Official" watermark (can be a simple colored card with text)
- [ ] T040 [P] Add Open Graph meta tags to `app/layout.tsx`: title, description, og:image pointing to `/og-image.png`
- [ ] T041 Audit disclaimer presence: manually verify `<DisclaimerBanner />` renders on `/`, `/eligibility`, `/eligibility/result`, `/dashboard`, `/predict`, `/qr` — fix any missing instances
- [ ] T042 Run Lighthouse mobile audit on Landing Page and Dashboard; fix any issues causing score < 85 (common: image sizing, unused JS, CLS from chart)
- [ ] T043 [P] Test full demo flow per `specs/001-petrol-subsidy-app/quickstart.md` checklist — mark each item complete; log any bugs
- [ ] T044 Create `README.md` at repo root with: project description, demo disclaimer, setup instructions (link to quickstart.md), tech stack list, screenshot placeholder
- [ ] T045 Configure Vercel deployment: `vercel.json` if needed, add `DATABASE_URL` and `XAI_API_KEY` as environment variables in Vercel dashboard, run `vercel --prod`

**Checkpoint**: All 14 quickstart checklist items pass. Disclaimer visible on all pages. Lighthouse ≥ 85.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — first story, no inter-story dependency
- **Phase 4 (US2)**: Depends on Phase 2 — independent of US1 (shares `lib/grok.ts` from Phase 2)
- **Phase 5 (US3)**: Depends on Phase 2 + US1 (needs a user in the DB); can use seeded data independently
- **Phase 6 (US4)**: Depends on Phase 5 (US3) — needs Dashboard to display updated quota
- **Phase 7 (US5)**: Depends on Phase 2 — `lib/grok.ts` already exists; independent of other stories
- **Phase 8 (Polish)**: Depends on all user stories being complete

### Within Each User Story

- Server Actions before page components (actions called by pages)
- Shared components before pages that use them
- Tasks marked [P] within a story can run in parallel

### Parallel Opportunities

- T003 + T004 (shadcn init + components): parallel after T002
- T010 + T012 + T013 (schema, grok, eligibility lib): parallel in Phase 2
- T023 + T024 (prediction form + action): parallel in US2
- T027 + T028 + T029 (quota card, tx list, chart): parallel in US3
- T032 + T033 (QR actions + component): parallel in US4
- T035 + T036 can partially overlap (action before component but independent files)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T009)
2. Complete Phase 2: Foundational (T010–T017) — CRITICAL
3. Complete Phase 3: User Story 1 (T018–T022)
4. **STOP and VALIDATE**: Enter CNIC, see result, disclaimer visible
5. Demo-able at this point as minimal proof of concept

### Incremental Delivery

1. Setup + Foundational → skeleton + DB ready
2. US1 (T018–T022) → CNIC eligibility MVP — demo-able ✅
3. US2 (T023–T026) → AI prediction added — demo-able ✅
4. US3 (T027–T031) → Dashboard + history + charts — demo-able ✅
5. US4 (T032–T034) → QR voucher system — demo-able ✅
6. US5 (T035–T036) → Chatbot + voice — demo-able ✅
7. Phase 8 → Polish + deploy → YouTube-ready ✅

---

## Notes

- Total tasks: **45**
- Tasks by phase: Setup=9, Foundational=8, US1=5, US2=4, US3=5, US4=3, US5=2, Polish=9
- [P] parallelizable tasks: 16
- Every user story has a clear independent test described above
- No test tasks generated (not requested)
- Commit message pattern: `feat: step-XX <description>` as specified in constitution
