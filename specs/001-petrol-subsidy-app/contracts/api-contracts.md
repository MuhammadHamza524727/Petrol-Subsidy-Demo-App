# API Contracts: Petrol Subsidy Demo App (AI-Powered)

**Feature**: `001-petrol-subsidy-app`
**Date**: 2026-04-05
**Implementation**: Next.js Server Actions (primary) + API Routes where needed

---

## Server Actions

All server actions live in `app/actions/` and are called directly from Client
Components. They run in Node.js on the server — API keys are never exposed.

---

### `checkCnicEligibility(cnic: string)`

**File**: `app/actions/eligibility.ts`
**Trigger**: CNIC form submission (US1)

**Input**:
```typescript
cnic: string  // must match /^\d{5}-\d{7}-\d$/
```

**Output**:
```typescript
{
  eligible: boolean
  reason: string       // plain language English + Roman Urdu
  userName: string     // mock name for the CNIC
  vehicleType: string  // 'motorcycle' | 'rickshaw' | 'car'
}
```

**Errors**:
- `INVALID_FORMAT` — CNIC does not match regex; return before DB call
- `DB_ERROR` — database unavailable; return user-friendly message

**Mock logic**:
```
if (cnic starts with "42101") → eligible
else if (last digit of first 5-char block) in [0,1,2,3,4] → eligible
else → not_eligible
```

**Side effect**: Creates `users` + `quota` rows if CNIC is new and eligible.

---

### `getAiPrediction(input: PredictionInput)`

**File**: `app/actions/ai.ts`
**Trigger**: AI Prediction form submission (US2)

**Input**:
```typescript
interface PredictionInput {
  salary: number        // positive integer, PKR
  vehicleType: 'motorcycle' | 'rickshaw' | 'car'
  monthlyUsage: number  // positive number, litres
}
```

**Output**:
```typescript
{
  eligible: boolean
  explanation: string  // simple English + Roman Urdu, ≤100 words, with disclaimer
}
```

**Errors**:
- `VALIDATION_ERROR` — any field missing or invalid
- `AI_UNAVAILABLE` — Grok API error; return hardcoded fallback string

**AI call**:
- Endpoint: `POST https://api.x.ai/v1/chat/completions`
- Model: `grok-beta`
- Auth: `Authorization: Bearer ${process.env.XAI_API_KEY}`
- System prompt: enforces simple language, Roman Urdu, ≤100 words, disclaimer

---

### `getDashboardData(cnic: string)`

**File**: `app/actions/dashboard.ts`
**Trigger**: Dashboard page load (US3)

**Input**:
```typescript
cnic: string  // from sessionStorage (passed by client)
```

**Output**:
```typescript
{
  user: { name: string; vehicleType: string; cnic: string }
  quota: { totalQuota: number; remainingQuota: number; resetDate: string }
  transactions: Array<{
    id: string
    litersUsed: number
    remainingAfter: number
    stationMock: string | null
    createdAt: string  // ISO date string
  }>
}
```

**Errors**:
- `USER_NOT_FOUND` — CNIC not in DB; redirect to eligibility check
- `DB_ERROR` — return user-friendly error

---

### `generateQrVoucher(cnic: string)`

**File**: `app/actions/qr.ts`
**Trigger**: "Generate QR Voucher" button tap (US4)

**Input**:
```typescript
cnic: string
```

**Output**:
```typescript
{
  qrValue: string  // JSON: {"cnic":"...","quota":15.5,"ts":1712345678}
  remainingQuota: number
}
```

**Errors**:
- `QUOTA_EMPTY` — remainingQuota is 0; return error, button should be disabled

---

### `simulateScan(cnic: string, litersToDeduct: number)`

**File**: `app/actions/qr.ts`
**Trigger**: "Simulate Scan" confirm button (US4)

**Input**:
```typescript
cnic: string
litersToDeduct: number  // positive, > 0
```

**Output**:
```typescript
{
  success: boolean
  newRemainingQuota: number
  transaction: {
    id: string
    litersUsed: number
    remainingAfter: number
    stationMock: string
    createdAt: string
  }
}
```

**Errors**:
- `INSUFFICIENT_QUOTA` — litersToDeduct > remainingQuota
- `INVALID_AMOUNT` — litersToDeduct ≤ 0

**Side effects**: Decrements `quota.remaining_quota`; inserts `transactions` row.

---

### `resetQuota(cnic: string)`

**File**: `app/actions/dashboard.ts`
**Trigger**: "Reset Quota" button on Dashboard (US3 / FR-016)

**Input**:
```typescript
cnic: string
```

**Output**:
```typescript
{ success: boolean; newRemainingQuota: number }
```

**Side effects**: Sets `quota.remaining_quota = total_quota`, `reset_date = now()`.

---

### `getChatbotResponse(message: string, history: ChatTurn[])`

**File**: `app/actions/chat.ts`
**Trigger**: Chatbot message send (US5)

**Input**:
```typescript
message: string
history: Array<{ role: 'user' | 'assistant'; content: string }>
```

**Output**:
```typescript
{
  response: string   // AI text (simple English + Roman Urdu, with disclaimer)
  fallback: boolean  // true if AI was unavailable and fallback was used
}
```

**Errors**:
- `AI_UNAVAILABLE` — return `{ response: "Sorry, service abhi available nahin — try again later. ⚠️ Yeh ek demo app hai.", fallback: true }`

---

## API Route (REST)

One REST endpoint is needed for any external tooling or future FastAPI bridge:

### `POST /api/ai/predict`

**File**: `app/api/ai/predict/route.ts`
**Purpose**: Alternate entry for AI prediction (e.g., from a FastAPI microservice or
            for testing with curl)

**Request body**:
```json
{
  "salary": 45000,
  "vehicleType": "motorcycle",
  "monthlyUsage": 25
}
```

**Response 200**:
```json
{
  "eligible": true,
  "explanation": "Aap eligible hain. Aapki income aur motorcycle use subsidy ke liye qualify karti hai. ⚠️ Yeh ek demo app hai."
}
```

**Response 400**:
```json
{ "error": "VALIDATION_ERROR", "message": "salary must be a positive number" }
```

**Response 503**:
```json
{ "error": "AI_UNAVAILABLE", "message": "AI service unavailable — please try again" }
```

---

## Error Code Reference

| Code | HTTP | Meaning |
|---|---|---|
| `INVALID_FORMAT` | 400 | CNIC regex mismatch |
| `VALIDATION_ERROR` | 400 | Missing or invalid field |
| `USER_NOT_FOUND` | 404 | CNIC not in database |
| `QUOTA_EMPTY` | 422 | Remaining quota is 0L |
| `INSUFFICIENT_QUOTA` | 422 | Requested deduction > remaining |
| `INVALID_AMOUNT` | 422 | Deduction amount ≤ 0 |
| `AI_UNAVAILABLE` | 503 | Grok API error or timeout |
| `DB_ERROR` | 500 | Database connection failure |
