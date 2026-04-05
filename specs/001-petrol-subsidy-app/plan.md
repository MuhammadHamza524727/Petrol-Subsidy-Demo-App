# Implementation Plan: Petrol Subsidy Demo App (AI-Powered)

**Branch**: `001-petrol-subsidy-app` | **Date**: 2026-04-05
**Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-petrol-subsidy-app/spec.md`

---

## Summary

A production-quality demo web application simulating Pakistan's petrol subsidy system.
The app allows mock users to check CNIC eligibility, get an AI-powered eligibility
prediction (Grok API), view a usage dashboard, generate QR vouchers, and chat with
an AI assistant — all with a mobile-first UI and mandatory disclaimer on every page.

Built as a single Next.js 14 monorepo deployed on Vercel. NeonDB + Drizzle ORM for
data. Grok API called server-side via Server Actions only.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+
**Primary Dependencies**:
- `next` 14+, `react` 18+
- `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`
- `openai` (re-pointed to xAI base URL for Grok)
- `react-qr-code`, `recharts`
- `shadcn/ui` (via `shadcn` CLI), `tailwindcss`
- `zod` (form validation)
- `tsx` (seed script runner)

**Storage**: NeonDB (PostgreSQL, serverless) — tables: `users`, `quota`, `transactions`

**Testing**: Manual demo-flow validation via `quickstart.md` checklist; no automated
test suite required for this demo project.

**Target Platform**: Vercel (serverless functions + CDN), mobile browsers (320px+)

**Project Type**: Single Next.js monorepo (web application)

**Performance Goals**:
- Dashboard renders in < 2 seconds
- AI responses < 5 seconds
- Lighthouse mobile score ≥ 85

**Constraints**:
- All AI calls server-side only (constitution Principle VI)
- No real PII — mock data only (constitution Principle III)
- Disclaimer on every page (constitution Principle I)
- shadcn/ui components only, no custom low-level UI (constitution Principle II)

**Scale/Scope**: Single demo user; no multi-tenancy required

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked post-design.*

| Principle | Gate | Status |
|---|---|---|
| I. Disclaimer-First | Disclaimer present in every route layout and AI response | ✅ PASS — enforced via root layout + action system prompt |
| II. Mobile-First UX | 320px baseline, shadcn/ui only, 44px tap targets | ✅ PASS — all components use shadcn/ui primitives |
| III. Mock-First Data | No real PII; CNIC = deterministic rule; seed data only | ✅ PASS — no government API calls |
| IV. AI Explainability | System prompt enforces simple language + Roman Urdu | ✅ PASS — prompt hardcoded in server action |
| V. Modular Architecture | Next.js App Router, feature route segments, logic in `lib/` | ✅ PASS — structure defined below |
| VI. Secrets Security | All secrets in `.env.local`; `.env.example` committed | ✅ PASS — enforced by project setup |

**Result**: All gates PASS. No violations to document.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-petrol-subsidy-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── api-contracts.md # Phase 1 output
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
app/
├── (public)/
│   ├── layout.tsx           # Public layout with disclaimer banner
│   ├── page.tsx             # Landing page (US1 entry)
│   └── eligibility/
│       ├── page.tsx         # CNIC input form
│       └── result/
│           └── page.tsx     # Eligibility result display
├── (dashboard)/
│   ├── layout.tsx           # Dashboard layout with sidebar + disclaimer footer
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard (quota, transactions, charts)
│   ├── predict/
│   │   └── page.tsx         # AI Prediction form (US2)
│   └── qr/
│       └── page.tsx         # QR Voucher + Simulate Scan (US4)
├── api/
│   └── ai/
│       └── predict/
│           └── route.ts     # REST endpoint for AI prediction
└── actions/
    ├── eligibility.ts       # checkCnicEligibility()
    ├── ai.ts                # getAiPrediction()
    ├── dashboard.ts         # getDashboardData(), resetQuota()
    ├── qr.ts                # generateQrVoucher(), simulateScan()
    └── chat.ts              # getChatbotResponse()

components/
├── ui/                      # shadcn/ui generated components (do not edit)
├── disclaimer-banner.tsx    # Reusable disclaimer (Principle I)
├── cnic-form.tsx            # CNIC input + validation
├── prediction-form.tsx      # AI Prediction form
├── quota-card.tsx           # Quota display widget
├── transaction-list.tsx     # Transaction history list
├── usage-chart.tsx          # Recharts area chart (client component)
├── qr-voucher.tsx           # QR code display + simulate scan (client)
└── chatbot-panel.tsx        # Chat UI + TTS (client component)

lib/
├── db/
│   ├── index.ts             # NeonDB client singleton
│   ├── schema.ts            # Drizzle schema (users, quota, transactions)
│   └── seed.ts              # Mock data seed script
├── eligibility.ts           # CNIC mock logic (pure function)
├── grok.ts                  # Grok API client (openai SDK re-pointed to xAI)
└── utils.ts                 # Shared helpers (date formatting, etc.)

public/
└── og-image.png             # Open Graph image for social sharing

.env.example                 # Placeholder env vars (committed)
.env.local                   # Real secrets (gitignored)
drizzle.config.ts            # Drizzle Kit config
tailwind.config.ts
next.config.ts
package.json
```

**Structure Decision**: Single Next.js monorepo. Route Groups `(public)` and
`(dashboard)` share different layouts (different disclaimer placement). All backend
logic in Server Actions — no FastAPI required since Grok has a REST API compatible
with the `openai` Node SDK.

---

## Phase 0: Research Summary

**Status**: ✅ Complete — see [research.md](./research.md)

Key decisions resolved:
- Grok API accessed via `openai` SDK re-pointed to `https://api.x.ai/v1`
- CNIC eligibility: deterministic rule on area code last digit
- Auth: simulated via `sessionStorage` CNIC (no JWT/cookies)
- TTS: `window.speechSynthesis` (browser-native, zero cost)
- QR: `react-qr-code` client component; scan is UI-only modal
- Charts: Recharts `AreaChart` wrapped in `next/dynamic` with `ssr: false`

---

## Phase 1: Design Artifacts

**Status**: ✅ Complete

- [data-model.md](./data-model.md) — 3 tables, Drizzle schema, seed spec
- [contracts/api-contracts.md](./contracts/api-contracts.md) — 6 server actions + 1 REST route
- [quickstart.md](./quickstart.md) — setup, seed, demo validation checklist

---

## Implementation Phases (Step-by-Step)

### Step 1 — Project Initialization

Set up Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui.

**Deliverables**:
- `package.json` with all dependencies
- `tailwind.config.ts`, `next.config.ts`
- shadcn/ui initialised (`pnpm dlx shadcn@latest init`)
- `.env.example` with `DATABASE_URL`, `XAI_API_KEY`
- `.gitignore` including `.env.local`
- Root `layout.tsx` with font, metadata, and disclaimer banner slot

**Commit**: `feat: step-01 initialize next.js with tailwind and shadcn`

---

### Step 2 — Landing Page

Build the hero section with CTA and disclaimer.

**Deliverables**:
- `app/(public)/page.tsx` — hero, features overview, CTA button
- `components/disclaimer-banner.tsx` — reusable yellow/orange warning bar
- Mobile-first layout verified at 320px and 375px

**Commit**: `feat: step-02 landing page with disclaimer and CTA`

---

### Step 3 — CNIC Input + Validation

Build the CNIC entry form with format validation.

**Deliverables**:
- `app/(public)/eligibility/page.tsx` — CNIC form
- `components/cnic-form.tsx` — controlled input with mask (XXXXX-XXXXXXX-X)
- Zod schema validating regex `^\d{5}-\d{7}-\d$`
- Inline error display on invalid input

**Commit**: `feat: step-03 cnic input form with format validation`

---

### Step 4 — Mock Eligibility Logic + Result Page

Implement the rule-based eligibility function and result display.

**Deliverables**:
- `lib/eligibility.ts` — pure function: CNIC → `{ eligible, reason }`
- `app/actions/eligibility.ts` — Server Action calling the function, creating user/quota rows
- `app/(public)/eligibility/result/page.tsx` — result display (eligible/not eligible card)
- Session storage: stores CNIC on eligible result

**Commit**: `feat: step-04 mock eligibility logic and result page`

---

### Step 5 — NeonDB Schema + Seed

Create the database tables and seed mock data.

**Deliverables**:
- `lib/db/schema.ts` — Drizzle schema (users, quota, transactions)
- `lib/db/index.ts` — NeonDB client singleton
- `drizzle.config.ts` — Drizzle Kit config pointing to NeonDB
- `lib/db/seed.ts` — creates mock user + quota + 30 transactions
- `pnpm drizzle-kit push` documented in quickstart

**Commit**: `feat: step-05 neondb schema and seed data`

---

### Step 6 — Dashboard UI

Build the dashboard layout with quota cards and summary.

**Deliverables**:
- `app/(dashboard)/layout.tsx` — sidebar/nav + disclaimer footer
- `app/(dashboard)/dashboard/page.tsx` — reads CNIC from sessionStorage, calls `getDashboardData()`
- `components/quota-card.tsx` — shows 20L total, remaining, reset date
- `app/actions/dashboard.ts` — `getDashboardData()`, `resetQuota()`

**Commit**: `feat: step-06 dashboard layout and quota display`

---

### Step 7 — Transactions + Quota Logic

Add transaction history list and reset quota functionality.

**Deliverables**:
- `components/transaction-list.tsx` — scrollable list, date/litres/remaining
- Empty state: "Abhi tak koi transaction nahin hua"
- "Reset Quota" button wired to `resetQuota()` Server Action
- Optimistic UI update after reset

**Commit**: `feat: step-07 transaction history and reset quota`

---

### Step 8 — QR Code System

Generate QR voucher and simulate scan flow.

**Deliverables**:
- `app/(dashboard)/qr/page.tsx`
- `components/qr-voucher.tsx` — `react-qr-code` display (client component)
- Simulate Scan modal: litre input → calls `simulateScan()` → updates quota
- Disabled state when quota = 0 with message
- `app/actions/qr.ts` — `generateQrVoucher()`, `simulateScan()`

**Commit**: `feat: step-08 qr voucher generation and simulate scan`

---

### Step 9 — Recharts Analytics

Add the usage trend chart.

**Deliverables**:
- `components/usage-chart.tsx` — Recharts `AreaChart`, client component,
  `dynamic` import with `ssr: false`
- Data: last 30 transactions aggregated by day
- Tooltip showing date + litres used
- Responsive container for mobile

**Commit**: `feat: step-09 usage trend chart with recharts`

---

### Step 10 — Grok AI Integration

Wire up Grok API for eligibility prediction.

**Deliverables**:
- `lib/grok.ts` — `openai` SDK configured with `baseURL: "https://api.x.ai/v1"`
- `app/actions/ai.ts` — `getAiPrediction()` with system prompt
- `app/(dashboard)/predict/page.tsx` — prediction form
- `components/prediction-form.tsx` — salary + vehicle + usage inputs
- `app/api/ai/predict/route.ts` — REST endpoint

**Commit**: `feat: step-10 grok ai eligibility prediction`

---

### Step 11 — AI Chatbot UI

Build the chatbot panel.

**Deliverables**:
- `components/chatbot-panel.tsx` — message list, input bar, send button (client)
- `app/actions/chat.ts` — `getChatbotResponse()` with conversation history
- Floating "Chat" button on dashboard pages
- Fallback response when AI unavailable

**Commit**: `feat: step-11 ai chatbot panel`

---

### Step 12 — Voice TTS

Add text-to-speech to chatbot responses.

**Deliverables**:
- Speaker button on each chatbot response bubble
- Feature detection: `'speechSynthesis' in window` — hide button if false
- `window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))`
- Stop speaking when new message arrives or panel closes

**Commit**: `feat: step-12 voice tts for chatbot responses`

---

### Step 13 — UI Polish

Final UI pass for demo quality.

**Deliverables**:
- Loading skeletons on Dashboard and Prediction pages
- Toast notifications for scan success / error (shadcn `Toaster`)
- Smooth page transitions
- OG meta tags + favicon
- Mobile test at 320px, 375px, 414px

**Commit**: `feat: step-13 ui polish loading states and toasts`

---

### Step 14 — Disclaimer Audit + Deploy Prep

Final compliance pass and production deployment.

**Deliverables**:
- Verify disclaimer present on every route (manual checklist)
- `public/og-image.png` created
- Vercel deployment configured with env vars
- `README.md` with demo video link and setup instructions
- Quickstart checklist validated end-to-end

**Commit**: `feat: step-14 disclaimer audit and deploy prep`

---

## Complexity Tracking

> No constitution violations detected — no entries required.

---

## Risk Register

| Risk | Blast Radius | Mitigation |
|---|---|---|
| Grok API latency > 5s | AI prediction + chatbot unusable | 8s server-side timeout; hardcoded fallback response |
| NeonDB cold-start on Vercel | Dashboard slow on first load | NeonDB serverless driver uses HTTP (no TCP cold-start); enable connection pooling |
| TTS unsupported in target browser | Voice feature broken | Feature-detect on mount; hide button silently |
| QR library SSR mismatch | Hydration error on server | Wrap `react-qr-code` in `dynamic()` with `ssr: false` |
| CNIC treated as real data | Legal / privacy risk | Mock logic only; no government API; prominent disclaimer |

---

## Architectural Decisions

📋 **Architectural decision detected**: Single Next.js monorepo vs Next.js + FastAPI split — Document reasoning and tradeoffs? Run `/sp.adr single-nextjs-monorepo`

📋 **Architectural decision detected**: Grok API via OpenAI SDK re-pointed to xAI vs custom HTTP client — Document? Run `/sp.adr grok-via-openai-sdk`
