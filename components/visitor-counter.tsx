'use client'

import { useEffect, useState } from 'react'
import { trackAndGetVisitors } from '@/app/actions/visitors'
import { Users } from 'lucide-react'

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    trackAndGetVisitors().then(setCount)
  }, [])

  if (count === null) return null

  return (
    <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs text-white/80">
      <Users className="h-3 w-3" />
      <span>
        <span className="font-bold text-white">{count.toLocaleString()}</span>
        {' '}unique visitors
      </span>
    </div>
  )
}
