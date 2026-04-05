'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

export interface PredictionInput {
  salary: number
  vehicleType: 'motorcycle' | 'rickshaw' | 'car'
  monthlyUsage: number
}

interface PredictionFormProps {
  onSubmit: (input: PredictionInput) => Promise<void>
}

interface FormErrors {
  salary?: string
  vehicleType?: string
  monthlyUsage?: string
}

function validate(salary: string, vehicleType: string, usage: string): FormErrors {
  const errors: FormErrors = {}
  if (!salary || Number(salary) <= 0) errors.salary = 'Salary daalna zaroori hai (PKR mein)'
  if (!vehicleType) errors.vehicleType = 'Vehicle type select karein'
  if (!usage || Number(usage) <= 0) errors.monthlyUsage = 'Monthly usage daalna zaroori hai'
  return errors
}

export function PredictionForm({ onSubmit }: PredictionFormProps) {
  const [salary, setSalary] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [usage, setUsage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(salary, vehicleType, usage)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    startTransition(async () => {
      await onSubmit({
        salary: Number(salary),
        vehicleType: vehicleType as PredictionInput['vehicleType'],
        monthlyUsage: Number(usage),
      })
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Salary */}
      <div className="space-y-1.5">
        <Label htmlFor="salary" className="text-base font-medium">
          Monthly Salary (PKR)
        </Label>
        <Input
          id="salary"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 35000"
          min={1}
          value={salary}
          onChange={(e) => { setSalary(e.target.value); setErrors((p) => ({ ...p, salary: undefined })) }}
          className={errors.salary ? 'border-red-400' : ''}
        />
        {errors.salary && <p className="text-sm text-red-600">⚠️ {errors.salary}</p>}
        <p className="text-xs text-muted-foreground">Aapki monthly income (takreeban theek hai)</p>
      </div>

      {/* Vehicle type */}
      <div className="space-y-1.5">
        <Label className="text-base font-medium">Vehicle Type</Label>
        <Select
          value={vehicleType}
          onValueChange={(v) => { setVehicleType(v); setErrors((p) => ({ ...p, vehicleType: undefined })) }}
        >
          <SelectTrigger className={errors.vehicleType ? 'border-red-400' : ''}>
            <SelectValue placeholder="Select vehicle..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="motorcycle">🏍️ Motorcycle</SelectItem>
            <SelectItem value="rickshaw">🛺 Rickshaw</SelectItem>
            <SelectItem value="car">🚗 Car</SelectItem>
          </SelectContent>
        </Select>
        {errors.vehicleType && <p className="text-sm text-red-600">⚠️ {errors.vehicleType}</p>}
      </div>

      {/* Monthly usage */}
      <div className="space-y-1.5">
        <Label htmlFor="usage" className="text-base font-medium">
          Monthly Fuel Usage (Litres)
        </Label>
        <Input
          id="usage"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 20"
          min={0.1}
          step={0.5}
          value={usage}
          onChange={(e) => { setUsage(e.target.value); setErrors((p) => ({ ...p, monthlyUsage: undefined })) }}
          className={errors.monthlyUsage ? 'border-red-400' : ''}
        />
        {errors.monthlyUsage && <p className="text-sm text-red-600">⚠️ {errors.monthlyUsage}</p>}
        <p className="text-xs text-muted-foreground">Har mahine kitna petrol use karte hain?</p>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full min-h-[52px] text-base font-bold"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            AI check kar raha hai...
          </>
        ) : (
          'AI se Check Karein →'
        )}
      </Button>
    </form>
  )
}
