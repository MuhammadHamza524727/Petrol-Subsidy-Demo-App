'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface CnicFormProps {
  onSubmit: (cnic: string) => Promise<void>
}

// Auto-format CNIC input → XXXXX-XXXXXXX-X
function formatCnic(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length <= 5) return digits
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`
}

function validateCnic(cnic: string): string | null {
  if (!cnic) return 'CNIC daalna zaroori hai'
  if (!/^\d{5}-\d{7}-\d$/.test(cnic))
    return 'Format sahi nahin — example: 42101-1234567-8'
  return null
}

export function CnicForm({ onSubmit }: CnicFormProps) {
  const [cnic, setCnic] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCnic(e.target.value)
    setCnic(formatted)
    if (error) setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validateCnic(cnic)
    if (err) {
      setError(err)
      return
    }
    startTransition(async () => {
      await onSubmit(cnic)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cnic" className="text-base font-medium">
          CNIC Number
        </Label>
        <Input
          id="cnic"
          name="cnic"
          type="text"
          inputMode="numeric"
          placeholder="42101-1234567-8"
          value={cnic}
          onChange={handleChange}
          maxLength={15}
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby={error ? 'cnic-error' : undefined}
          className={error ? 'border-red-400 focus-visible:ring-red-400' : ''}
        />
        {error && (
          <p id="cnic-error" className="text-sm text-red-600 flex items-center gap-1">
            <span aria-hidden>⚠️</span> {error}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Format: XXXXX-XXXXXXX-X (13 digits with hyphens)
        </p>
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
            Checking...
          </>
        ) : (
          'Check Eligibility →'
        )}
      </Button>
    </form>
  )
}
