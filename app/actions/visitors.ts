'use server'

import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { visitors } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function trackAndGetVisitors(): Promise<number> {
  try {
    const h = headers()
    // Get real IP from Vercel/proxy headers
    const ip =
      h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      h.get('x-real-ip') ||
      'unknown'

    // Insert IP — silently skip if already exists (unique constraint)
    await db.insert(visitors).values({ ip }).onConflictDoNothing()

    // Return total unique visitor count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(visitors)

    return count ?? 0
  } catch {
    return 0
  }
}
