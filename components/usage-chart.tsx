'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export interface ChartDataPoint {
  date: string   // e.g. "Mar 5"
  liters: number
}

interface UsageChartProps {
  data: ChartDataPoint[]
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm px-3 py-2 text-sm">
        <p className="font-medium text-slate-700">{label}</p>
        <p className="text-teal-600">{payload[0].value}L used</p>
      </div>
    )
  }
  return null
}

export function UsageChart({ data }: UsageChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-slate-400 text-sm">Koi data available nahin</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-slate-500" />
          <CardTitle className="text-base text-slate-700">Usage Trend (Last 30 Days)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}L`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="liters"
              stroke="#0D9488"
              strokeWidth={2}
              fill="url(#usageGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#0D9488' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
