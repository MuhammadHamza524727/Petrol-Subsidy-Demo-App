'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDashboardData, type DashboardData } from '@/app/actions/dashboard'
import { QuotaCard } from '@/components/quota-card'
import { TransactionList } from '@/components/transaction-list'
import { UsageChartWrapper } from '@/components/usage-chart-wrapper'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { User } from 'lucide-react'
import type { ChartDataPoint } from '@/components/usage-chart'
import { useLang } from '@/lib/language'

const vehicleIcon: Record<string, string> = {
  motorcycle: '🏍️',
  rickshaw: '🛺',
  car: '🚗',
}

function buildChartData(transactions: DashboardData['transactions']): ChartDataPoint[] {
  // Aggregate litres by day (last 30 days)
  const byDay: Record<string, number> = {}
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
    byDay[key] = 0
  }

  for (const tx of transactions) {
    const key = new Date(tx.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
    if (key in byDay) byDay[key] += tx.litersUsed
  }

  return Object.entries(byDay).map(([date, liters]) => ({
    date,
    liters: parseFloat(liters.toFixed(2)),
  }))
}

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useLang()
  const [data, setData] = useState<DashboardData | null>(null)
  const [cnic, setCnic] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedCnic = sessionStorage.getItem('eligibility_cnic')
    if (!storedCnic) {
      router.replace('/eligibility')
      return
    }
    setCnic(storedCnic)

    getDashboardData(storedCnic).then((res) => {
      if (!res) {
        router.replace('/eligibility')
      } else {
        setData(res)
      }
      setLoading(false)
    })
  }, [router])

  function handleQuotaReset(newRemaining: number) {
    if (!data) return
    setData({ ...data, quota: { ...data.quota, remainingQuota: newRemaining } })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!data) return null

  const chartData = buildChartData(data.transactions)

  return (
    <div className="space-y-5">
      {/* User greeting */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 anim-slide-right delay-0">
        <div className="p-2 bg-teal-100 rounded-full">
          <User className="h-5 w-5 text-teal-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 truncate">
            {t(`Welcome, ${data.user.name}!`, `Assalam o Alaikum, ${data.user.name}!`)}
          </p>
          <p className="text-xs text-slate-500 font-mono truncate">{cnic}</p>
        </div>
        <Badge variant="success" className="shrink-0 text-xs">
          {vehicleIcon[data.user.vehicleType]} {data.user.vehicleType}
        </Badge>
      </div>

      {/* Quota card */}
      <div className="anim-fade-up delay-100">
        <QuotaCard
          cnic={cnic}
          totalQuota={data.quota.totalQuota}
          remainingQuota={data.quota.remainingQuota}
          resetDate={data.quota.resetDate}
          onReset={handleQuotaReset}
        />
      </div>

      {/* Chart */}
      <div className="anim-fade-up delay-200">
        <UsageChartWrapper data={chartData} />
      </div>

      {/* Transactions */}
      <div className="anim-fade-up delay-300">
        <TransactionList transactions={data.transactions} />
      </div>
    </div>
  )
}
