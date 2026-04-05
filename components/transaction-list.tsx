import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History, Droplets } from 'lucide-react'

export interface Transaction {
  id: string
  litersUsed: number
  remainingAfter: number
  stationMock: string | null
  createdAt: string
}

interface TransactionListProps {
  transactions: Transaction[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-PK', {
    hour: '2-digit', minute: '2-digit',
  })
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            <CardTitle className="text-base text-slate-700">Transaction History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 space-y-2">
            <Droplets className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-slate-500 text-sm">Abhi tak koi transaction nahin hua</p>
            <p className="text-slate-400 text-xs">QR voucher use karein petrol lene ke liye</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            <CardTitle className="text-base text-slate-700">Transaction History</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">{transactions.length} entries</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-slate-800">
                  -{tx.litersUsed}L
                </p>
                <p className="text-xs text-slate-500">
                  {tx.stationMock ?? 'Petrol Station'} · {formatDate(tx.createdAt)}
                </p>
                <p className="text-xs text-slate-400">{formatTime(tx.createdAt)}</p>
              </div>
              <div className="text-right space-y-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {tx.remainingAfter}L left
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
