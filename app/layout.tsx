import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { LanguageProvider } from '@/lib/language'
import { ThemeProvider } from '@/lib/theme'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pakistan Petrol Subsidy Demo | AI-Powered',
  description:
    'DEMO app simulating Pakistan petrol subsidy system. Check CNIC eligibility, AI prediction, QR voucher & usage dashboard. NOT an official government service.',
  keywords: ['petrol subsidy', 'pakistan', 'demo', 'AI', 'CNIC', 'eligibility'],
  openGraph: {
    type: 'website',
    title: 'Pakistan Petrol Subsidy Demo App',
    description: 'AI-powered demo of Pakistan petrol subsidy. NOT official. Portfolio project.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Petrol Subsidy Demo App' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pakistan Petrol Subsidy Demo App',
    description: 'AI-powered demo — NOT an official government service.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash: apply neon theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='neon')document.documentElement.setAttribute('data-theme','neon')}catch(e){}`,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
