'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { CnicForm } from '@/components/cnic-form'
import { checkCnicEligibility } from '@/app/actions/eligibility'
import { useLang } from '@/lib/language'

export default function EligibilityPage() {
  const router = useRouter()
  const { t } = useLang()

  async function handleCnicSubmit(cnic: string) {
    const result = await checkCnicEligibility(cnic)

    sessionStorage.setItem('eligibility_cnic', cnic)

    if (result.eligible) {
      // Eligible → go to signup to collect user's own name/phone/vehicle
      sessionStorage.setItem('eligibility_reason', result.reason)
      router.push('/eligibility/signup')
    } else {
      // Not eligible → show result page
      sessionStorage.setItem('eligibility_result', JSON.stringify(result))
      router.push('/eligibility/result')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('Back to Home', 'واپس جائیں')}
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800">
            {t('Check Eligibility', 'اہلیت چیک کریں')}
          </h1>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">
          {t(
            'Enter your CNIC and find out if you qualify for petrol subsidy.',
            'Apna CNIC number daalein aur pata lagaein — kya aap petrol subsidy ke liye eligible hain.'
          )}
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <CnicForm onSubmit={handleCnicSubmit} />
      </div>

      {/* Info note */}
      <p className="text-xs text-center text-muted-foreground">
        {t('Your CNIC is safe. We do not store any real data.', 'Aapka CNIC secure hai. Hum koi real data store nahin karte.')}
      </p>
    </div>
  )
}
