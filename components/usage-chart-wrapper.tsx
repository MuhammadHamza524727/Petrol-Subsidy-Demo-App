'use client'

import dynamic from 'next/dynamic'
import type { ChartDataPoint } from './usage-chart'
import { Skeleton } from '@/components/ui/skeleton'

const UsageChart = dynamic(() => import('./usage-chart').then((m) => m.UsageChart), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[240px] rounded-xl" />,
})

export function UsageChartWrapper({ data }: { data: ChartDataPoint[] }) {
  return <UsageChart data={data} />
}
