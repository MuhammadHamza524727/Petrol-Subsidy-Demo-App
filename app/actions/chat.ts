'use server'

import { getGroqClient, GROK_SYSTEM_PROMPT, GROK_MODEL } from '@/lib/grok'

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  response: string
  fallback: boolean
}

const FALLBACK_RESPONSE =
  'Sorry, AI service abhi available nahin — thodi der baad try karein. ⚠️ Yeh ek demo app hai — real government service nahin.'

// Pre-built FAQ answers for common questions (instant, no AI cost)
const FAQ_MAP: { pattern: RegExp; answer: string }[] = [
  {
    pattern: /eligible|qualify|subsidy mil/i,
    answer:
      'Agar aapki monthly income PKR 50,000 se kam hai aur aap motorcycle ya rickshaw use karte hain, to aap eligible ho sakte hain. CNIC check karein confirm karne ke liye. ⚠️ Yeh ek demo app hai — real government service nahin.',
  },
  {
    pattern: /quota|litre|liter|20/i,
    answer:
      'Har eligible user ko 20 litre petrol subsidy milti hai har mahine. Yeh quota har month reset hota hai. ⚠️ Yeh ek demo app hai — real government service nahin.',
  },
  {
    pattern: /qr|scan|voucher/i,
    answer:
      'QR Voucher tab milta hai jab aap eligible ho. Petrol station par QR scan karke subsidy use kar sakte hain. App mein "QR Voucher" section dekhein. ⚠️ Yeh ek demo app hai — real government service nahin.',
  },
  {
    pattern: /reset|month|dobara/i,
    answer:
      'Quota har mahine automatically reset hota hai. Demo mein aap "Reset Quota" button use kar sakte hain. ⚠️ Yeh ek demo app hai — real government service nahin.',
  },
  {
    pattern: /disclaimer|real|official|government|govt/i,
    answer:
      'Yeh app sirf ek DEMO hai — portfolio aur YouTube ke liye banaya gaya hai. Yeh koi real government service nahin hai. Real subsidy ke liye official portal visit karein. ⚠️ Yeh ek demo app hai — real government service nahin.',
  },
]

export async function getChatbotResponse(
  message: string,
  history: ChatTurn[]
): Promise<ChatResponse> {
  // Check FAQ map first (fast, no API call)
  for (const faq of FAQ_MAP) {
    if (faq.pattern.test(message)) {
      return { response: faq.answer, fallback: false }
    }
  }

  // Build messages array for Grok
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: GROK_SYSTEM_PROMPT },
    ...history.slice(-6).map((t) => ({ role: t.role, content: t.content })), // last 6 turns
    { role: 'user', content: message },
  ]

  try {
    const completion = await getGroqClient().chat.completions.create({
      model: GROK_MODEL,
      messages,
      max_tokens: 180,
      temperature: 0.7,
    })

    const text = completion.choices[0]?.message?.content?.trim()
    if (!text) throw new Error('Empty response')

    return { response: text, fallback: false }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    console.error('[chatbot] Groq API error:', errMsg)
    return { response: FALLBACK_RESPONSE, fallback: true }
  }
}
