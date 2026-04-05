import Link from 'next/link'
import { Fuel, LayoutDashboard, QrCode, Sparkles } from 'lucide-react'
import { DisclaimerBanner } from '@/components/disclaimer-banner'
import { ChatbotPanel } from '@/components/chatbot-panel'
import { NavActions } from '@/components/nav-actions'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/predict', label: 'AI Check', icon: Sparkles },
  { href: '/qr', label: 'QR Voucher', icon: QrCode },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-teal-700">
            <Fuel className="h-5 w-5" />
            <span className="text-sm sm:text-base">Petrol Subsidy</span>
          </Link>
          <div className="flex items-center gap-1">
            <nav className="flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors min-h-[44px]"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
            </nav>
            <NavActions />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">{children}</main>

      {/* Disclaimer footer */}
      <footer className="mt-auto">
        <DisclaimerBanner />
      </footer>

      {/* Floating AI chatbot — available on all dashboard pages */}
      <ChatbotPanel />
    </div>
  )
}
