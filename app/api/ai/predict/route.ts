import { NextRequest, NextResponse } from 'next/server'
import { getAiPrediction } from '@/app/actions/ai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { salary, vehicleType, monthlyUsage } = body

    if (!salary || !vehicleType || !monthlyUsage) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'salary, vehicleType, and monthlyUsage are required' },
        { status: 400 }
      )
    }

    const result = await getAiPrediction({ salary: Number(salary), vehicleType, monthlyUsage: Number(monthlyUsage) })

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: 'AI_UNAVAILABLE', message: 'AI service unavailable — please try again' },
      { status: 503 }
    )
  }
}
