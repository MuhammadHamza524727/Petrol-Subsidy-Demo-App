'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { XCircle, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EligibilityResult {
  eligible: boolean
  reason: string
}

export default function EligibilityResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<EligibilityResult | null>(null)
  const [cnic, setCnic] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('eligibility_result')
    const storedCnic = sessionStorage.getItem('eligibility_cnic')
    if (!stored) {
      router.replace('/eligibility')
      return
    }
    const parsed: EligibilityResult = JSON.parse(stored)
    // Eligible users should be on /eligibility/signup, not here
    if (parsed.eligible) {
      router.replace('/eligibility/signup')
      return
    }
    setResult(parsed)
    setCnic(storedCnic ?? '')
  }, [router])

  if (!result) return null

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6 anim-fade-up">
      <Link
        href="/eligibility"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Check another CNIC
      </Link>

      {/* Not-eligible result card */}
      <div className="rounded-xl border-2 border-red-300 bg-red-50 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <XCircle className="h-10 w-10 text-red-500 shrink-0" />
          <div>
            <p className="text-sm text-slate-500">Result for</p>
            <p className="font-mono font-semibold text-slate-800">{cnic}</p>
          </div>
        </div>

        <Badge variant="destructive" className="text-sm px-3 py-1 font-semibold">
          ❌ Not Eligible
        </Badge>

        <div className="bg-white/70 rounded-lg p-3 border border-red-200">
          <p className="text-sm leading-relaxed text-slate-700">{result.reason}</p>
        </div>

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Yeh sirf ek demo result hai. Real subsidy ke liye official government portal check karein.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Button asChild variant="outline" size="lg" className="w-full min-h-[52px]">
          <Link href="/eligibility">Check Another CNIC</Link>
        </Button>
        <Button asChild variant="ghost" size="lg" className="w-full min-h-[52px] text-teal-600">
          <Link href="/predict">Try AI Prediction →</Link>
        </Button>
      </div>
    </div>
  )
}
