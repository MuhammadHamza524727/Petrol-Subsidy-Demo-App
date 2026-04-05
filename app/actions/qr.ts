'use server'

import { db } from '@/lib/db'
import { users, quota, transactions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const MOCK_STATIONS = [
  'PSO Gulshan',
  'Shell Saddar',
  'Total Clifton',
  'Caltex DHA',
  'Attock Nazimabad',
]

export interface QrVoucherResult {
  qrValue: string
  remainingQuota: number
  error?: string
}

export interface ScanResult {
  success: boolean
  newRemainingQuota: number
  transaction?: {
    id: string
    litersUsed: number
    remainingAfter: number
    stationMock: string
    createdAt: string
  }
  error?: string
}

export async function generateQrVoucher(cnic: string): Promise<QrVoucherResult> {
  try {
    const user = await db.query.users.findFirst({ where: eq(users.cnic, cnic) })
    if (!user) return { qrValue: '', remainingQuota: 0, error: 'USER_NOT_FOUND' }

    const userQuota = await db.query.quota.findFirst({ where: eq(quota.userId, user.id) })
    const remaining = Number(userQuota?.remainingQuota ?? 0)

    if (remaining <= 0) return { qrValue: '', remainingQuota: 0, error: 'QUOTA_EMPTY' }

    const qrValue = JSON.stringify({
      cnic,
      quota: remaining,
      ts: Math.floor(Date.now() / 1000),
    })

    return { qrValue, remainingQuota: remaining }
  } catch {
    return { qrValue: '', remainingQuota: 0, error: 'DB_ERROR' }
  }
}

export async function simulateScan(cnic: string, litersToDeduct: number, stationName?: string): Promise<ScanResult> {
  if (!litersToDeduct || litersToDeduct <= 0) {
    return { success: false, newRemainingQuota: 0, error: 'INVALID_AMOUNT' }
  }

  try {
    const user = await db.query.users.findFirst({ where: eq(users.cnic, cnic) })
    if (!user) return { success: false, newRemainingQuota: 0, error: 'USER_NOT_FOUND' }

    const userQuota = await db.query.quota.findFirst({ where: eq(quota.userId, user.id) })
    const remaining = Number(userQuota?.remainingQuota ?? 0)

    if (litersToDeduct > remaining) {
      return { success: false, newRemainingQuota: remaining, error: 'INSUFFICIENT_QUOTA' }
    }

    const newRemaining = parseFloat((remaining - litersToDeduct).toFixed(2))
    const station = stationName?.trim() || MOCK_STATIONS[Math.floor(Math.random() * MOCK_STATIONS.length)]

    // Update quota
    await db
      .update(quota)
      .set({ remainingQuota: newRemaining.toFixed(2) })
      .where(eq(quota.userId, user.id))

    // Insert transaction
    const [tx] = await db
      .insert(transactions)
      .values({
        userId: user.id,
        litersUsed: litersToDeduct.toFixed(2),
        remainingAfter: newRemaining.toFixed(2),
        stationMock: station,
      })
      .returning()

    return {
      success: true,
      newRemainingQuota: newRemaining,
      transaction: {
        id: tx.id,
        litersUsed: Number(tx.litersUsed),
        remainingAfter: Number(tx.remainingAfter),
        stationMock: station,
        createdAt: tx.createdAt.toISOString(),
      },
    }
  } catch {
    return { success: false, newRemainingQuota: 0, error: 'DB_ERROR' }
  }
}
