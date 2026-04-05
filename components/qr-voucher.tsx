'use client'

import { useState, useTransition } from 'react'
import QRCode from 'react-qr-code'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { simulateScan } from '@/app/actions/qr'
import { useToast } from '@/hooks/use-toast'
import { QrCode, ScanLine, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface QrVoucherProps {
  cnic: string
  qrValue: string
  remainingQuota: number
  onScanSuccess: (newRemaining: number, tx: { id: string; litersUsed: number; remainingAfter: number; stationMock: string; createdAt: string }) => void
}

export function QrVoucher({ cnic, qrValue, remainingQuota, onScanSuccess }: QrVoucherProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [liters, setLiters] = useState('')
  const [station, setStation] = useState('')
  const [scanError, setScanError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const isEmpty = remainingQuota <= 0

  function handleOpenScan() {
    setLiters('')
    setStation('')
    setScanError(null)
    setDialogOpen(true)
  }

  function handleScan() {
    const amount = parseFloat(liters)
    if (!amount || amount <= 0) {
      setScanError('Valid amount daalna zaroori hai')
      return
    }
    if (amount > remainingQuota) {
      setScanError(`Sirf ${remainingQuota}L bachi hai — itna nahin de sakte`)
      return
    }

    startTransition(async () => {
      const res = await simulateScan(cnic, amount, station)
      if (res.success && res.transaction) {
        setDialogOpen(false)
        onScanSuccess(res.newRemainingQuota, res.transaction)
        toast({
          title: '✅ Petrol mili!',
          description: `${amount}L deduct ho gayi. Remaining: ${res.newRemainingQuota}L`,
          variant: 'success',
        })
      } else {
        const msg =
          res.error === 'INSUFFICIENT_QUOTA'
            ? 'Quota nahin hai — insufficient quota'
            : 'Scan fail ho gaya — dobara koshish karein'
        setScanError(msg)
      }
    })
  }

  return (
    <div className="space-y-5">
      {/* QR display */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 self-start w-full">
          <QrCode className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-slate-800">QR Voucher</h2>
          <Badge variant="secondary" className="ml-auto text-xs">Demo</Badge>
        </div>

        {isEmpty ? (
          <div className="text-center py-8 space-y-3">
            <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto" />
            <p className="font-medium text-slate-700">Aapka monthly quota khatam ho gaya</p>
            <p className="text-sm text-slate-500">
              Dashboard par "Reset Quota" button use karein (demo ke liye).
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
              <QRCode value={qrValue} size={200} level="M" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-slate-500">Remaining quota</p>
              <p className="text-3xl font-bold text-blue-700">{remainingQuota}L</p>
              <p className="text-xs text-slate-400 font-mono">{cnic}</p>
            </div>
          </>
        )}
      </div>

      {/* Simulate scan button */}
      <Button
        size="lg"
        onClick={handleOpenScan}
        disabled={isEmpty}
        className="w-full min-h-[52px] text-base font-bold gap-2"
      >
        <ScanLine className="h-5 w-5" />
        Simulate Scan (Demo)
      </Button>

      {isEmpty && (
        <p className="text-center text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          ⚠️ Quota nahin — pehle dashboard par reset karein
        </p>
      )}

      {/* Scan dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanLine className="h-5 w-5 text-blue-600" />
              Simulate Petrol Scan
            </DialogTitle>
            <DialogDescription>
              Kitne litre petrol lena chahte hain? (Max: {remainingQuota}L)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="scan-station">Petrol Station / Area</Label>
              <Input
                id="scan-station"
                placeholder="e.g. PSO Saddar, Shell Gulshan..."
                value={station}
                onChange={(e) => setStation(e.target.value)}
              />
              <p className="text-xs text-slate-400">Khali chorain to random station assign hoga</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scan-liters">Litres to Deduct</Label>
              <Input
                id="scan-liters"
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0.5"
                max={remainingQuota}
                placeholder={`e.g. 2 (max ${remainingQuota})`}
                value={liters}
                onChange={(e) => { setLiters(e.target.value); setScanError(null) }}
              />
            </div>
            {scanError && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {scanError}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 min-h-[44px]">
              Cancel
            </Button>
            <Button onClick={handleScan} disabled={isPending} className="flex-1 min-h-[44px] font-bold">
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Scanning...</>
              ) : (
                <><CheckCircle2 className="h-4 w-4" /> Confirm</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
