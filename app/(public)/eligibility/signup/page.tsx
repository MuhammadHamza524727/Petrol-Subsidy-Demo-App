'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { registerUser } from '@/app/actions/eligibility'
import { CheckCircle2, Loader2, UserPlus } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [cnic, setCnic] = useState('')
  const [reason, setReason] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const c = sessionStorage.getItem('eligibility_cnic')
    const r = sessionStorage.getItem('eligibility_reason')
    if (!c) { router.replace('/eligibility'); return }
    setCnic(c)
    setReason(r ?? '')
  }, [router])

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) e.name = 'Apna poora naam likhein'
    if (!vehicle) e.vehicle = 'Vehicle type select karein'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    startTransition(async () => {
      const res = await registerUser({
        cnic,
        name,
        phone,
        vehicleType: vehicle as 'motorcycle' | 'rickshaw' | 'car',
      })
      if (res.success) {
        sessionStorage.setItem('eligibility_name', name)
        sessionStorage.setItem('eligibility_vehicle', vehicle)
        router.push('/dashboard')
      } else {
        setErrors({ form: 'Registration fail ho gayi — dobara koshish karein' })
      }
    })
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6 anim-fade-up">
      {/* Eligible badge */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800 text-sm">✅ Aap Eligible Hain!</p>
          <p className="text-green-700 text-xs mt-0.5">{reason}</p>
          <p className="text-green-600 text-xs font-mono mt-1">{cnic}</p>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-teal-600" />
          <h1 className="text-xl font-bold text-slate-800">Apna Account Banayein</h1>
        </div>
        <p className="text-sm text-slate-500">
          Apni details daalein — yeh sirf aapke account ke liye hogi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="font-medium">Apna Naam <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              placeholder="e.g. Ali Hassan"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
              className={errors.name ? 'border-red-400' : ''}
            />
            {errors.name && <p className="text-sm text-red-600">⚠️ {errors.name}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="font-medium">Phone Number <span className="text-slate-400 text-xs">(optional)</span></Label>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="0300-1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Vehicle */}
          <div className="space-y-1.5">
            <Label className="font-medium">Vehicle Type <span className="text-red-500">*</span></Label>
            <Select value={vehicle} onValueChange={(v) => { setVehicle(v); setErrors((p) => ({ ...p, vehicle: '' })) }}>
              <SelectTrigger className={errors.vehicle ? 'border-red-400' : ''}>
                <SelectValue placeholder="Apna vehicle select karein..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motorcycle">🏍️ Motorcycle</SelectItem>
                <SelectItem value="rickshaw">🛺 Rickshaw</SelectItem>
                <SelectItem value="car">🚗 Car</SelectItem>
              </SelectContent>
            </Select>
            {errors.vehicle && <p className="text-sm text-red-600">⚠️ {errors.vehicle}</p>}
          </div>

          {errors.form && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">⚠️ {errors.form}</p>
          )}

          <Button type="submit" size="lg" disabled={isPending} className="w-full min-h-[52px] text-base font-bold">
            {isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Account ban raha hai...</>
            ) : (
              'Dashboard Mein Jaayein →'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
