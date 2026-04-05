'use server'

import { db } from '@/lib/db'
import { users, quota, transactions } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export interface DashboardData {
  user: { name: string; vehicleType: string; cnic: string }
  quota: { totalQuota: number; remainingQuota: number; resetDate: string }
  transactions: Array<{
    id: string
    litersUsed: number
    remainingAfter: number
    stationMock: string | null
    createdAt: string
  }>
}

export async function getDashboardData(cnic: string): Promise<DashboardData | null> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.cnic, cnic),
    })
    if (!user) return null

    const userQuota = await db.query.quota.findFirst({
      where: eq(quota.userId, user.id),
    })

    const txList = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, user.id))
      .orderBy(desc(transactions.createdAt))
      .limit(50)

    return {
      user: { name: user.name, vehicleType: user.vehicleType, cnic: user.cnic },
      quota: {
        totalQuota: Number(userQuota?.totalQuota ?? 20),
        remainingQuota: Number(userQuota?.remainingQuota ?? 20),
        resetDate: userQuota?.resetDate ?? new Date().toISOString().split('T')[0],
      },
      transactions: txList.map((tx) => ({
        id: tx.id,
        litersUsed: Number(tx.litersUsed),
        remainingAfter: Number(tx.remainingAfter),
        stationMock: tx.stationMock,
        createdAt: tx.createdAt.toISOString(),
      })),
    }
  } catch {
    return null
  }
}

export async function resetQuota(cnic: string): Promise<{ success: boolean; newRemainingQuota: number }> {
  try {
    const user = await db.query.users.findFirst({ where: eq(users.cnic, cnic) })
    if (!user) return { success: false, newRemainingQuota: 0 }

    const userQuota = await db.query.quota.findFirst({ where: eq(quota.userId, user.id) })
    const total = Number(userQuota?.totalQuota ?? 20)

    await db
      .update(quota)
      .set({
        remainingQuota: total.toFixed(2),
        resetDate: new Date().toISOString().split('T')[0],
      })
      .where(eq(quota.userId, user.id))

    return { success: true, newRemainingQuota: total }
  } catch {
    return { success: false, newRemainingQuota: 0 }
  }
}
