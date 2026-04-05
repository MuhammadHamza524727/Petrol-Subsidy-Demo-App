import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const MOCK_STATIONS = ['PSO Gulshan', 'Shell Saddar', 'Total Clifton', 'Caltex DHA', 'Attock Nazimabad']

function randomBetween(min: number, max: number, decimals = 1): number {
  const val = Math.random() * (max - min) + min
  return parseFloat(val.toFixed(decimals))
}

async function seed() {
  console.log('🌱 Seeding database...')

  // Upsert mock user
  const [user] = await db
    .insert(schema.users)
    .values({
      cnic: '42101-1234567-8',
      name: 'Ahmad Khan',
      phone: '0300-1234567',
      vehicleType: 'motorcycle',
      eligibilityStatus: 'eligible',
    })
    .onConflictDoUpdate({
      target: schema.users.cnic,
      set: { eligibilityStatus: 'eligible' },
    })
    .returning()

  console.log('✅ User created:', user.id)

  // Build 30 transactions over the last 30 days
  const now = new Date()
  let remaining = 20.0
  const txRows: (typeof schema.transactions.$inferInsert)[] = []

  for (let i = 29; i >= 0; i--) {
    const txDate = new Date(now)
    txDate.setDate(txDate.getDate() - i)

    // Not every day has a transaction; stop if remaining < 5L to keep some quota visible
    if (Math.random() > 0.35 && remaining > 5) {
      const liters = randomBetween(0.5, 2.0)
      const deduct = Math.min(liters, remaining - 5) // always keep at least 5L
      if (deduct <= 0) continue
      remaining = parseFloat((remaining - deduct).toFixed(2))

      txRows.push({
        userId: user.id,
        litersUsed: deduct.toFixed(2),
        remainingAfter: remaining.toFixed(2),
        stationMock: MOCK_STATIONS[Math.floor(Math.random() * MOCK_STATIONS.length)],
        createdAt: txDate,
      })
    }
  }

  if (txRows.length > 0) {
    await db.insert(schema.transactions).values(txRows)
    console.log(`✅ ${txRows.length} transactions created`)
  }

  // Upsert quota
  await db
    .insert(schema.quota)
    .values({
      userId: user.id,
      totalQuota: '20.00',
      remainingQuota: remaining.toFixed(2),
      resetDate: new Date().toISOString().split('T')[0],
    })
    .onConflictDoUpdate({
      target: schema.quota.userId,
      set: { remainingQuota: remaining.toFixed(2) },
    })

  console.log(`✅ Quota set: remaining = ${remaining}L`)
  console.log('🎉 Seed complete!')
}

seed().catch((e) => {
  console.error('Seed failed:', e)
  process.exit(1)
})
