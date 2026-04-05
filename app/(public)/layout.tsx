import { DisclaimerBanner } from '@/components/disclaimer-banner'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DisclaimerBanner />
      <main className="flex-1">{children}</main>
    </div>
  )
}
