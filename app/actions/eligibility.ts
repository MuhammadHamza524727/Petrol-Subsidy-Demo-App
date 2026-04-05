'use server'

import { db } from '@/lib/db'
import { users, quota } from '@/lib/db/schema'
import { isValidCnicFormat } from '@/lib/eligibility'
import { checkCnicMockEligibility } from '@/lib/eligibility'
import { eq } from 'drizzle-orm'

export interface EligibilityResponse {
  eligible: boolean
  reason: string
  error?: string
}

export interface RegisterResponse {
  success: boolean
  error?: string
  detail?: string
}

/** Step 1: Check if CNIC is eligible (no DB write yet) */
export async function checkCnicEligibility(cnic: string): Promise<EligibilityResponse> {
  if (!isValidCnicFormat(cnic)) {
    return { eligible: false, reason: '', error: 'INVALID_FORMAT' }
  }
  const result = checkCnicMockEligibility(cnic)
  return { eligible: result.eligible, reason: result.reason }
}

/** Step 2: Register/login user with their own name, phone, vehicle */
export async function registerUser(input: {
  cnic: string
  name: string
  phone: string
  vehicleType: 'motorcycle' | 'rickshaw' | 'car'
}): Promise<RegisterResponse> {
  if (!isValidCnicFormat(input.cnic)) return { success: false, error: 'INVALID_FORMAT' }

  try {
    // Upsert user — if returning user, update name/vehicle they provided
    const [user] = await db
      .insert(users)
      .values({
        cnic: input.cnic,
        name: input.name.trim(),
        phone: input.phone.trim() || null,
        vehicleType: input.vehicleType,
        eligibilityStatus: 'eligible',
      })
      .onConflictDoUpdate({
        target: users.cnic,
        set: {
          name: input.name.trim(),
          phone: input.phone.trim() || null,
          vehicleType: input.vehicleType,
          eligibilityStatus: 'eligible',
        },
      })
      .returning()

    // Create quota only if it doesn't exist (preserve existing quota)
    await db
      .insert(quota)
      .values({
        userId: user.id,
        totalQuota: '20.00',
        remainingQuota: '20.00',
        resetDate: new Date().toISOString().split('T')[0],
      })
      .onConflictDoNothing()

    return { success: true }
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    console.error('[registerUser] DB error:', detail)
    return { success: false, error: 'DB_ERROR', detail }
  }
}
