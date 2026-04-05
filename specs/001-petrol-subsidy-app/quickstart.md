# Quickstart: Petrol Subsidy Demo App (AI-Powered)

**Feature**: `001-petrol-subsidy-app`
**Date**: 2026-04-05

---

## Prerequisites

- Node.js 20+
- pnpm (preferred) or npm
- A NeonDB account (free tier) — get connection string from the Neon dashboard
- A Grok / xAI API key — from [console.x.ai](https://console.x.ai)
- Git

---

## Step 1 — Clone and install

```bash
git clone <repo-url>
cd <repo>
pnpm install
```

---

## Step 2 — Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
XAI_API_KEY=xai-xxxxxxxxxxxxxxxxxxxxxxxx
```

Never commit `.env.local`. It is already in `.gitignore`.

---

## Step 3 — Push database schema

```bash
pnpm drizzle-kit push
```

This creates the `users`, `quota`, and `transactions` tables in your NeonDB database.

---

## Step 4 — Seed mock data

```bash
pnpm tsx lib/db/seed.ts
```

This creates one mock eligible user (CNIC `42101-1234567-8`) with 30 days of
transaction history and a starting remaining quota of 8.5L.

---

## Step 5 — Run development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Flow Validation

Run through this checklist to verify the full demo flow works:

- [ ] Landing page loads with hero section and "Check Eligibility" button
- [ ] Disclaimer is visible on landing page without scrolling (mobile 375px width)
- [ ] CNIC input rejects `12345-1234567` (missing last digit) with inline error
- [ ] CNIC `42101-1234567-8` returns "Eligible" with Roman Urdu explanation
- [ ] AI Prediction: salary=30000, vehicle=motorcycle, usage=20 → Eligible
- [ ] AI Prediction: salary=200000, vehicle=car, usage=50 → Not Eligible
- [ ] Dashboard shows quota=20L, remaining=8.5L, 30 transactions, usage chart
- [ ] "Generate QR Voucher" shows a QR code
- [ ] "Simulate Scan" deducts 2L → remaining=6.5L, new transaction appears
- [ ] Deducting more than remaining quota shows "Quota nahin hai" error
- [ ] Chatbot responds in English + Roman Urdu within 5 seconds
- [ ] TTS speaker button reads chatbot response aloud
- [ ] "Reset Quota" restores remaining to 20L
- [ ] Disclaimer is visible in footer of Dashboard page

---

## Deploy to Vercel

```bash
vercel --prod
```

Add environment variables in the Vercel dashboard:
- `DATABASE_URL`
- `XAI_API_KEY`

---

## Common Issues

| Issue | Fix |
|---|---|
| `DATABASE_URL not set` | Add to `.env.local` and restart dev server |
| `XAI_API_KEY not set` | AI features show fallback message — add key to fix |
| Schema not found | Run `pnpm drizzle-kit push` |
| No transactions shown | Run `pnpm tsx lib/db/seed.ts` |
| TTS not working | Chrome/Edge required; Safari partial support |
