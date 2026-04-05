# Pakistan Petrol Subsidy Demo App (AI-Powered)

> ⚠️ **DEMO ONLY** — This is NOT an official government application. All data is simulated for portfolio/demo purposes.

A production-quality demo web application simulating Pakistan's petrol subsidy system, built with Next.js 14, NeonDB, Grok AI, and shadcn/ui.

---

## Features

| Feature | Description |
|---|---|
| **CNIC Eligibility Check** | Enter CNIC → instant mock eligibility result with Roman Urdu explanation |
| **AI Prediction** | Salary + vehicle + usage → Grok AI verdict in simple English + Roman Urdu |
| **Dashboard** | Monthly quota (20L), remaining fuel, usage summary |
| **QR Voucher** | Generate QR code → Simulate Scan → deduct from quota |
| **Usage Charts** | 30-day fuel usage trend via Recharts |
| **AI Chatbot** | FAQ chatbot with Grok AI + Web Speech API TTS |
| **Transaction History** | Full log of all fuel usage events |

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Database**: NeonDB (PostgreSQL) + Drizzle ORM
- **AI**: Grok API (xAI) via OpenAI-compatible SDK
- **Charts**: Recharts
- **QR**: react-qr-code
- **Voice**: Web Speech API (browser-native TTS)
- **Deployment**: Vercel

---

## Setup

### 1. Clone and install
```bash
git clone <repo-url>
cd <repo>
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Add your DATABASE_URL and XAI_API_KEY
```

### 3. Push DB schema + seed
```bash
npm run db:push
npm run db:seed
```

### 4. Run dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Demo Flow

1. **Landing** → tap "Check Eligibility"
2. **CNIC** → enter `42101-1234567-8` → Eligible result
3. **Dashboard** → view quota, transactions, chart
4. **QR Voucher** → generate → Simulate Scan → deduct litres
5. **AI Prediction** → fill form → Grok AI result
6. **Chatbot** → blue bubble (bottom-right) → ask questions

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | NeonDB PostgreSQL connection string |
| `XAI_API_KEY` | Grok API key from [console.x.ai](https://console.x.ai) |

---

## Disclaimer

This application is built for **portfolio and demo purposes only**. It does not connect to any real government database or petrol subsidy system. All eligibility results, user data, and transactions are simulated.
