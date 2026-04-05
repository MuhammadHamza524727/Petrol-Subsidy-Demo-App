# Data Model: Petrol Subsidy Demo App (AI-Powered)

**Feature**: `001-petrol-subsidy-app`
**Date**: 2026-04-05
**Source**: `lib/db/schema.ts` (Drizzle ORM)

---

## Entities

### 1. users

Represents a mock subsidy applicant. Created on first CNIC eligibility check.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, default `gen_random_uuid()` | Internal identifier |
| `cnic` | `varchar(15)` | UNIQUE, NOT NULL | Format: XXXXX-XXXXXXX-X |
| `name` | `varchar(100)` | NOT NULL | Mock name (seeded) |
| `phone` | `varchar(15)` | nullable | Mock phone (seeded) |
| `vehicle_type` | `enum` | NOT NULL | Values: `motorcycle`, `rickshaw`, `car` |
| `eligibility_status` | `enum` | NOT NULL, default `pending` | Values: `eligible`, `not_eligible`, `pending` |
| `created_at` | `timestamp` | NOT NULL, default `now()` | Row creation time |

**Relationships**: one-to-one with `quota`; one-to-many with `transactions`.

**Validation rules**:
- `cnic` MUST match regex `^\d{5}-\d{7}-\d$`
- `vehicle_type` MUST be one of the three enum values

---

### 2. quota

One record per user. Tracks monthly fuel allowance.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `user_id` | `uuid` | PRIMARY KEY, FK → users.id | One quota per user |
| `total_quota` | `numeric(5,2)` | NOT NULL, default `20.00` | Litres; default 20L/month |
| `remaining_quota` | `numeric(5,2)` | NOT NULL, default `20.00` | Decremented on QR scan |
| `reset_date` | `date` | NOT NULL, default `current_date` | Date of last reset |

**State transitions**:
- On QR scan: `remaining_quota -= liters_used` (min 0)
- On "Reset Quota": `remaining_quota = total_quota`, `reset_date = now()`

**Validation rules**:
- `remaining_quota` MUST be ≥ 0 and ≤ `total_quota`
- Deduction MUST fail if `liters_used > remaining_quota`

---

### 3. transactions

One record per fuel-use event (each QR scan simulation).

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, default `gen_random_uuid()` | Internal identifier |
| `user_id` | `uuid` | NOT NULL, FK → users.id | Owner |
| `liters_used` | `numeric(5,2)` | NOT NULL, CHECK > 0 | Litres deducted |
| `remaining_after` | `numeric(5,2)` | NOT NULL, CHECK ≥ 0 | Quota after deduction |
| `station_mock` | `varchar(100)` | nullable | Mock station name (for display) |
| `created_at` | `timestamp` | NOT NULL, default `now()` | Event time |

**Ordering**: Always descending by `created_at` for display.

---

## Seed Data

The seed script (`lib/db/seed.ts`) creates:

```
1 mock user:
  cnic: "42101-1234567-8"  (always eligible by mock logic)
  name: "Ahmad Khan"
  phone: "0300-1234567"
  vehicle_type: "motorcycle"
  eligibility_status: "eligible"

1 quota record:
  total_quota: 20.00
  remaining_quota: 8.50
  reset_date: 2026-04-01

30 transactions (March 5 – April 4, 2026):
  liters_used: 0.5 – 3.0 (random)
  station_mock: one of ["PSO Gulshan", "Shell Saddar", "Total Clifton", "Caltex DHA"]
```

---

## Drizzle Schema Snippet (reference)

```typescript
// lib/db/schema.ts
import { pgTable, uuid, varchar, numeric, timestamp, date, pgEnum } from 'drizzle-orm/pg-core'

export const vehicleTypeEnum = pgEnum('vehicle_type', ['motorcycle', 'rickshaw', 'car'])
export const eligibilityStatusEnum = pgEnum('eligibility_status', ['eligible', 'not_eligible', 'pending'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  cnic: varchar('cnic', { length: 15 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 15 }),
  vehicleType: vehicleTypeEnum('vehicle_type').notNull(),
  eligibilityStatus: eligibilityStatusEnum('eligibility_status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const quota = pgTable('quota', {
  userId: uuid('user_id').primaryKey().references(() => users.id),
  totalQuota: numeric('total_quota', { precision: 5, scale: 2 }).notNull().default('20.00'),
  remainingQuota: numeric('remaining_quota', { precision: 5, scale: 2 }).notNull().default('20.00'),
  resetDate: date('reset_date').notNull(),
})

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  litersUsed: numeric('liters_used', { precision: 5, scale: 2 }).notNull(),
  remainingAfter: numeric('remaining_after', { precision: 5, scale: 2 }).notNull(),
  stationMock: varchar('station_mock', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
```
