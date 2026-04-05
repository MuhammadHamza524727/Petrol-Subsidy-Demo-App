'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateQrVoucher } from '@/app/actions/qr'
import { QrVoucher } from '@/components/qr-voucher'
import { TransactionList, type Transaction } from '@/components/transaction-list'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle } from 'lucide-react'

export default function QrPage() {
  const router = useRouter()
  const [cnic, setCnic] = useState('')
  const [qrValue, setQrValue] = useState('')
  const [remaining, setRemaining] = useState(0)
  const [recentTx, setRecentTx] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedCnic = sessionStorage.getItem('eligibility_cnic')
    if (!storedCnic) { router.replace('/eligibility'); return }
    setCnic(storedCnic)

    generateQrVoucher(storedCnic).then((res) => {
      if (res.error === 'USER_NOT_FOUND') { router.replace('/eligibility'); return }
      if (res.error === 'QUOTA_EMPTY') {
        setRemaining(0)
        setQrValue('')
      } else if (res.error) {
        setError('QR load nahin ho saka — please refresh karein')
      } else {
        setQrValue(res.qrValue)
        setRemaining(res.remainingQuota)
      }
      setLoading(false)
    })
  }, [router])

  function handleScanSuccess(
    newRemaining: number,
    tx: { id: string; litersUsed: number; remainingAfter: number; stationMock: string; createdAt: string }
  ) {
    setRemaining(newRemaining)
    // Regenerate QR with updated quota
    generateQrVoucher(cnic).then((res) => {
      if (!res.error) setQrValue(res.qrValue)
    })
    // Prepend new transaction to recent list
    setRecentTx((prev) => [tx, ...prev].slice(0, 5))
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-800">QR Voucher</h1>
        <p className="text-slate-500 text-sm">
          Yeh QR code petrol station par scan karein subsidy use karne ke liye.
        </p>
      </div>

      <QrVoucher
        cnic={cnic}
        qrValue={qrValue}
        remainingQuota={remaining}
        onScanSuccess={handleScanSuccess}
      />

      {/* Recent transactions from this session */}
      {recentTx.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-600 px-1">Recent Scans (This Session)</h2>
          <TransactionList transactions={recentTx} />
        </div>
      )}
    </div>
  )
}
