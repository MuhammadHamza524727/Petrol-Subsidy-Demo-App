'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Fuel, QrCode, Sparkles } from 'lucide-react'
import { useLang } from '@/lib/language'

export default function LandingPage() {
  const { t } = useLang()

  const features = [
    {
      icon: CheckCircle,
      title: t('CNIC Check', 'CNIC چیک'),
      desc: t(
        'Enter your CNIC and check eligibility in 30 seconds!',
        'Apna CNIC daal kar eligibility check karein. Sirf 30 seconds!'
      ),
    },
    {
      icon: Sparkles,
      title: t('AI Prediction', 'AI پریڈیکشن'),
      desc: t(
        'AI checks your income & vehicle type to predict eligibility.',
        'AI aapki income aur vehicle dekh kar bataega — eligible ho ya nahin.'
      ),
    },
    {
      icon: QrCode,
      title: t('QR Voucher', 'QR واؤچر'),
      desc: t(
        'Use a QR code at the petrol station to claim your subsidy.',
        'QR code se petrol station par subsidy use karein. Bilkul simple!'
      ),
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white px-4 py-16 sm:py-24 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-center">
            <Fuel className="h-14 w-14 text-blue-200" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            {t('Pakistan Petrol Subsidy', 'پاکستان پیٹرول سبسڈی')}
            <br />
            <span className="text-blue-200">{t('Demo App', 'ڈیمو ایپ')}</span>
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-md mx-auto">
            {t(
              'An AI-powered petrol subsidy system for low-income citizens. Check if you are eligible.',
              'Low-income citizens ke liye petrol subsidy ka AI-powered system. Check karein — kya aap eligible hain?'
            )}
          </p>
          <Button asChild size="lg" className="bg-white text-blue-800 hover:bg-blue-50 font-bold text-base min-h-[52px] px-8">
            <Link href="/eligibility">{t('Check Eligibility →', 'اہلیت چیک کریں ←')}</Link>
          </Button>
          <p className="text-xs text-blue-300 pt-2">
            {t('Free • No registration • Instant result', 'مفت • بغیر رجسٹریشن • فوری نتیجہ')}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12 bg-slate-50">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-xl font-semibold text-center text-slate-800 mb-6">
            {t('How does it work?', 'Kaise kaam karta hai?')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-0 shadow-sm">
                <CardContent className="p-5 space-y-3 text-center">
                  <div className="flex justify-center">
                    <div className="p-2.5 bg-blue-100 rounded-full">
                      <Icon className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="px-4 py-12 text-center bg-white border-t">
        <div className="max-w-sm mx-auto space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {t('Check now', 'Abhi check karein')}
          </h2>
          <p className="text-sm text-slate-500">
            {t(
              'Motorcycle & rickshaw owners — 20 litres subsidy available every month.',
              'Motorcycle ya rickshaw owners — 20 litre subsidy available hai har mahine.'
            )}
          </p>
          <Button asChild size="lg" className="w-full min-h-[52px] text-base font-bold">
            <Link href="/eligibility">{t('Check Eligibility →', 'اہلیت چیک کریں ←')}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
