import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const vehicleTypeEnum = pgEnum('vehicle_type', [
  'motorcycle',
  'rickshaw',
  'car',
])

export const eligibilityStatusEnum = pgEnum('eligibility_status', [
  'eligible',
  'not_eligible',
  'pending',
])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  cnic: varchar('cnic', { length: 15 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 15 }),
  vehicleType: vehicleTypeEnum('vehicle_type').notNull(),
  eligibilityStatus: eligibilityStatusEnum('eligibility_status')
    .notNull()
    .default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const quota = pgTable('quota', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  totalQuota: numeric('total_quota', { precision: 5, scale: 2 })
    .notNull()
    .default('20.00'),
  remainingQuota: numeric('remaining_quota', { precision: 5, scale: 2 })
    .notNull()
    .default('20.00'),
  resetDate: date('reset_date').notNull(),
})

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  litersUsed: numeric('liters_used', { precision: 5, scale: 2 }).notNull(),
  remainingAfter: numeric('remaining_after', { precision: 5, scale: 2 }).notNull(),
  stationMock: varchar('station_mock', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Quota = typeof quota.$inferSelect
export type Transaction = typeof transactions.$inferSelect
