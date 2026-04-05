'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Fuel, QrCode, Sparkles } from 'lucide-react'
import { useLang } from '@/lib/language'
import { VisitorCounter } from '@/components/visitor-counter'

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
      delay: 'delay-100',
    },
    {
      icon: Sparkles,
      title: t('AI Prediction', 'AI پریڈیکشن'),
      desc: t(
        'AI checks your income & vehicle type to predict eligibility.',
        'AI aapki income aur vehicle dekh kar bataega — eligible ho ya nahin.'
      ),
      delay: 'delay-200',
    },
    {
      icon: QrCode,
      title: t('QR Voucher', 'QR واؤچر'),
      desc: t(
        'Use a QR code at the petrol station to claim your subsidy.',
        'QR code se petrol station par subsidy use karein. Bilkul simple!'
      ),
      delay: 'delay-300',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-800 to-teal-950 text-white px-4 py-16 sm:py-24 text-center overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Floating icon */}
          <div className="flex justify-center anim-fade-in delay-0">
            <Fuel className="h-14 w-14 text-teal-200 anim-float" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight anim-fade-up delay-100">
            {t('Pakistan Petrol Subsidy', 'پاکستان پیٹرول سبسڈی')}
            <br />
            <span className="text-teal-200">{t('Demo App', 'ڈیمو ایپ')}</span>
          </h1>

          <p className="text-teal-100 text-base sm:text-lg max-w-md mx-auto anim-fade-up delay-200">
            {t(
              'An AI-powered petrol subsidy system for low-income citizens. Check if you are eligible.',
              'Low-income citizens ke liye petrol subsidy ka AI-powered system. Check karein — kya aap eligible hain?'
            )}
          </p>

          <div className="anim-fade-up delay-300">
            <Button
              asChild
              size="lg"
              className="bg-white text-teal-800 hover:bg-teal-50 font-bold text-base min-h-[52px] px-8 hover:scale-105 transition-transform duration-200"
            >
              <Link href="/eligibility">{t('Check Eligibility →', 'اہلیت چیک کریں ←')}</Link>
            </Button>
          </div>

          <p className="text-xs text-teal-300 pt-2 anim-fade-in delay-400">
            {t('Free • No registration • Instant result', 'مفت • بغیر رجسٹریشن • فوری نتیجہ')}
          </p>

          <div className="anim-fade-in delay-500">
            <VisitorCounter />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12 bg-slate-50">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-xl font-semibold text-center text-slate-800 mb-6 anim-fade-up delay-0">
            {t('How does it work?', 'Kaise kaam karta hai?')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, delay }) => (
              <Card key={title} className={`border-0 shadow-sm card-lift anim-fade-up ${delay}`}>
                <CardContent className="p-5 space-y-3 text-center">
                  <div className="flex justify-center">
                    <div className="p-2.5 bg-teal-100 rounded-full transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-teal-700" />
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
        <div className="max-w-sm mx-auto space-y-4 anim-fade-up delay-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {t('Check now', 'Abhi check karein')}
          </h2>
          <p className="text-sm text-slate-500">
            {t(
              'Motorcycle & rickshaw owners — 20 litres subsidy available every month.',
              'Motorcycle ya rickshaw owners — 20 litre subsidy available hai har mahine.'
            )}
          </p>
          <Button
            asChild
            size="lg"
            className="w-full min-h-[52px] text-base font-bold hover:scale-[1.02] transition-transform duration-200"
          >
            <Link href="/eligibility">{t('Check Eligibility →', 'اہلیت چیک کریں ←')}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
