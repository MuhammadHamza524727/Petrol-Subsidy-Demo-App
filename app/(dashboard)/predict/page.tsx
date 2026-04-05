'use client'

import { useState } from 'react'
import { Sparkles, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { PredictionForm, type PredictionInput } from '@/components/prediction-form'
import { getAiPrediction, type AiPredictionResult } from '@/app/actions/ai'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export default function PredictPage() {
  const [result, setResult] = useState<AiPredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(input: PredictionInput) {
    setLoading(true)
    setResult(null)
    const res = await getAiPrediction(input)
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-slate-800">AI Eligibility Check</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Apni details daalein — AI bataega ke aap eligible hain ya nahin.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <PredictionForm onSubmit={handleSubmit} />
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-xl border p-6 space-y-3" aria-label="Loading AI result...">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div
          className={`rounded-xl border-2 p-6 space-y-4 ${
            result.eligible ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
          }`}
        >
          <div className="flex items-center gap-3">
            {result.eligible ? (
              <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500 shrink-0" />
            )}
            <div>
              <p className="text-xs text-slate-500 mb-1">AI ka jawab</p>
              <Badge variant={result.eligible ? 'success' : 'destructive'} className="text-sm px-3 py-1 font-semibold">
                {result.eligible ? '✅ Eligible' : '❌ Not Eligible'}
              </Badge>
            </div>
          </div>

          <div className="bg-white/70 rounded-lg p-4 border border-current/10">
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {result.explanation}
            </p>
          </div>

          {result.fallback && (
            <p className="text-xs text-amber-700 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              AI service temporarily unavailable — showing estimated result.
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setResult(null)}
            className="w-full"
          >
            Try Different Values
          </Button>
        </div>
      )}
    </div>
  )
}
