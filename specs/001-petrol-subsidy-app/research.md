# Research: Petrol Subsidy Demo App (AI-Powered)

**Feature**: `001-petrol-subsidy-app`
**Date**: 2026-04-05
**Status**: Complete — all unknowns resolved

---

## 1. Next.js 14 App Router — Best Practices

**Decision**: Use App Router with Server Components as the default; Client Components
only where interactivity requires it (forms, charts, QR, TTS).

**Rationale**: Server Components reduce client bundle size, enable direct database access
via Server Actions, and keep AI API keys server-side (constitution Principle VI).

**Key patterns**:
- Route segments: `app/(public)/`, `app/(dashboard)/` with layout-based disclaimer
- Server Actions in `app/actions/` for all DB mutations and AI calls
- `use client` only on leaf components that need browser APIs (charts, QR, TTS)

**Alternatives considered**:
- Pages Router: rejected — App Router is the current Next.js standard and better
  for Server Actions.
- Full client-side SPA: rejected — exposes API keys in the browser.

---

## 2. NeonDB + Drizzle ORM Integration

**Decision**: Use `@neondatabase/serverless` driver with Drizzle ORM for type-safe
schema definition and queries.

**Rationale**: Drizzle provides TypeScript-first schema that doubles as documentation,
zero-runtime overhead, and direct SQL when needed. NeonDB's serverless driver works
correctly in Vercel Edge and Node runtimes.

**Key patterns**:
- Schema file: `lib/db/schema.ts` — single source of truth
- DB client: `lib/db/index.ts` — singleton connection via `DATABASE_URL` env var
- Migrations: `drizzle-kit push` for development; `drizzle-kit migrate` for production
- Seed file: `lib/db/seed.ts` — creates mock user + quota + 30 days of transactions

**Alternatives considered**:
- Prisma: heavier, generates more code, slower cold starts on serverless.
- Raw SQL via `@neondatabase/serverless`: valid but no type safety on queries.

---

## 3. Grok API (xAI) — Server-Side Integration

**Decision**: Call xAI's Grok API via the OpenAI-compatible REST endpoint from
Next.js Server Actions. Use `grok-beta` or `grok-2` model.

**Rationale**: xAI provides an OpenAI-compatible API (`https://api.x.ai/v1`), so
the `openai` npm package can be re-pointed to xAI's base URL. This avoids a custom
HTTP client and leverages existing SDK patterns.

**System prompt strategy**:
```
You are a helpful assistant for Pakistan's petrol subsidy demo app.
Always respond in simple English mixed with Roman Urdu.
Keep responses under 100 words.
Always end with: "⚠️ Yeh ek demo app hai — real government service nahin."
Never use technical jargon.
```

**Fallback**: If the API call fails or times out (>8s), return a hardcoded fallback
string rather than exposing the error to the UI.

**Alternatives considered**:
- OpenAI GPT-4o: same integration pattern, but user specified Grok.
- FastAPI microservice for AI: only needed if Grok requires Python SDK; REST API
  works fine from Node.js, so FastAPI is deferred unless needed.

---

## 4. CNIC Mock Eligibility Logic

**Decision**: Deterministic rule based on last digit of the CNIC area code (first 5 digits):
- Last digit of area code 0–4 → Eligible
- Last digit 5–9 → Not Eligible
- Exception: CNICs starting with `42101` (mock "test user") → always Eligible

**Rationale**: Deterministic = consistent demo. The rule is simple enough to explain
on screen. No database lookup needed for this check — pure function.

**Explanation text** (Roman Urdu):
- Eligible: "Aap eligible hain. Aapka area code subsidy zone mein hai."
- Not Eligible: "Aap eligible nahin hain. Aapka area is zone mein nahin aata."

---

## 5. QR Code Generation + Simulated Scan

**Decision**: Use `react-qr-code` for generation (client component). QR value encodes
a JSON string: `{"cnic":"XXXXX-XXXXXXX-X","quota":15,"ts":1712345678}`. Simulated
scan is a UI-only flow — a modal with a litre input that calls a Server Action to
deduct quota.

**Rationale**: Real QR scanning requires camera API and is unnecessary for demo.
A "Simulate Scan" button is more reliable for YouTube recordings.

---

## 6. Recharts — Usage Trend Chart

**Decision**: Use `AreaChart` from Recharts with 30-day mock data. Client Component
wrapped in a `dynamic` import with `ssr: false` to avoid hydration mismatch.

**Data shape**: `[{ date: "2026-03-07", liters: 3 }, ...]` — 30 entries from seed.

---

## 7. TTS (Text-to-Speech)

**Decision**: Use `window.speechSynthesis` (Web Speech API) — zero cost, works in
Chrome/Edge/Safari. Feature-detect on mount; hide speaker button if unavailable.

**Alternatives considered**:
- ElevenLabs: paid, adds billing risk for portfolio project.
- Google TTS API: requires API key; unnecessary complexity.

---

## 8. Authentication Strategy (Simulated)

**Decision**: Store the CNIC in a client-side React state / `sessionStorage` after
eligibility check. Pass it to Server Actions as a parameter. No JWT, no sessions,
no cookies required.

**Rationale**: Real auth is out of scope (constitution Principle III). This keeps the
demo simple and removes infrastructure risk.

---

## 9. Project Structure Decision

**Decision**: Web application structure (single Next.js monorepo).

```
frontend/   → Next.js App Router (all pages, API routes, server actions)
backend/    → NOT needed (all backend logic in Next.js API routes)
fastapi/    → Reserved; only create if Grok requires Python-only SDK
```

Final structure: **single Next.js project** at repo root with `app/`, `lib/`,
`components/`, `public/` directories.

---

## 10. Deployment

**Decision**:
- Vercel: deploy the Next.js app (includes API routes + Server Actions)
- HuggingFace Spaces FastAPI: deferred — only needed if a Python AI microservice
  is required. For this demo, all AI calls go through Next.js Server Actions.

**Environment variables on Vercel**:
- `DATABASE_URL` — NeonDB connection string
- `XAI_API_KEY` — Grok API key
