'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Fuel, RefreshCw, Loader2 } from 'lucide-react'
import { resetQuota } from '@/app/actions/dashboard'
import { useToast } from '@/hooks/use-toast'

interface QuotaCardProps {
  cnic: string
  totalQuota: number
  remainingQuota: number
  resetDate: string
  onReset: (newRemaining: number) => void
}

export function QuotaCard({ cnic, totalQuota, remainingQuota, resetDate, onReset }: QuotaCardProps) {
  const pct = Math.round((remainingQuota / totalQuota) * 100)
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  function handleReset() {
    startTransition(async () => {
      const res = await resetQuota(cnic)
      if (res.success) {
        onReset(res.newRemainingQuota)
        toast({ title: '✅ Quota reset!', description: `Aapka quota ${res.newRemainingQuota}L ho gaya.`, variant: 'success' })
      }
    })
  }

  const barColor =
    pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-teal-700 to-teal-950 text-white card-lift">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-teal-200" />
            <CardTitle className="text-white text-base">Monthly Quota</CardTitle>
          </div>
          <Badge className="bg-teal-500/40 text-white border-teal-400 text-xs">
            Reset: {resetDate}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Numbers */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold text-white">{remainingQuota}L</p>
            <p className="text-teal-200 text-sm mt-0.5">remaining of {totalQuota}L</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-teal-100">{pct}%</p>
            <p className="text-teal-300 text-xs">bachi hui</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="w-full bg-teal-900/50 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-teal-300">
            <span>0L</span>
            <span>{totalQuota}L</span>
          </div>
        </div>

        {/* Reset button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={isPending}
          className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 min-h-[44px]"
        >
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Resetting...</>
          ) : (
            <><RefreshCw className="h-4 w-4" /> Reset Quota (Demo)</>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
