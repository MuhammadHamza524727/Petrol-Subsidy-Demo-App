'use server'

import { grok, GROK_SYSTEM_PROMPT, GROK_MODEL } from '@/lib/grok'
import { z } from 'zod'

const PredictionSchema = z.object({
  salary: z.number().positive(),
  vehicleType: z.enum(['motorcycle', 'rickshaw', 'car']),
  monthlyUsage: z.number().positive(),
})

export interface AiPredictionResult {
  eligible: boolean
  explanation: string
  fallback?: boolean
}

const FALLBACK_ELIGIBLE =
  'Aap eligible lagte hain! Aapki income aur vehicle dekh kar AI yahi kehta hai. Please official portal se confirm karein. ⚠️ Yeh ek demo app hai — real government service nahin.'
const FALLBACK_NOT_ELIGIBLE =
  'Aap is waqt eligible nahin lagte. AI ne aapki income aur vehicle consider ki. Please official portal check karein. ⚠️ Yeh ek demo app hai — real government service nahin.'
const FALLBACK_ERROR =
  'Sorry, AI service abhi available nahin — thodi der baad try karein. ⚠️ Yeh ek demo app hai — real government service nahin.'

export async function getAiPrediction(input: {
  salary: number
  vehicleType: string
  monthlyUsage: number
}): Promise<AiPredictionResult> {
  // Validate inputs
  const parsed = PredictionSchema.safeParse(input)
  if (!parsed.success) {
    return { eligible: false, explanation: 'Invalid input — please check your values.', fallback: true }
  }

  const { salary, vehicleType, monthlyUsage } = parsed.data

  // Quick heuristic for eligibility verdict to include in the prompt
  const likelyEligible =
    salary <= 50000 && (vehicleType === 'motorcycle' || vehicleType === 'rickshaw') && monthlyUsage <= 40

  const userMessage = `User details:
- Monthly salary: PKR ${salary.toLocaleString()}
- Vehicle: ${vehicleType}
- Monthly fuel usage: ${monthlyUsage} litres

Based on these details, is this user eligible for the petrol subsidy?
The user is likely ${likelyEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}.
Explain in simple English + Roman Urdu why. Keep it friendly and under 80 words.`

  try {
    const completion = await grok.chat.completions.create({
      model: GROK_MODEL,
      messages: [
        { role: 'system', content: GROK_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const text = completion.choices[0]?.message?.content?.trim() ?? ''
    if (!text) throw new Error('Empty response')

    return { eligible: likelyEligible, explanation: text }
  } catch {
    // Return fallback — never expose raw error to UI
    return {
      eligible: likelyEligible,
      explanation: likelyEligible ? FALLBACK_ELIGIBLE : FALLBACK_NOT_ELIGIBLE,
      fallback: true,
    }
  }
}
