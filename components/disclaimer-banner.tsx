'use client'

import { AlertTriangle, Languages, Zap, Sun } from 'lucide-react'
import { useLang } from '@/lib/language'
import { useTheme } from '@/lib/theme'
import { Button } from '@/components/ui/button'

export function DisclaimerBanner() {
  const { lang, toggle: toggleLang } = useLang()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
        <p className="text-xs sm:text-sm text-amber-800 font-medium flex-1 min-w-0 truncate">
          ⚠️ <strong>DEMO</strong> —{' '}
          {lang === 'en'
            ? 'Not a real government service.'
            : 'Yeh demo hai. Real service nahin.'}
        </p>

        {/* Language toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLang}
          className="shrink-0 h-7 px-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 gap-1"
          title="Toggle language"
        >
          <Languages className="h-3.5 w-3.5" />
          <span>{lang === 'en' ? 'اردو' : 'EN'}</span>
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="shrink-0 h-7 px-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 gap-1"
          title={theme === 'light' ? 'Switch to Neon Dark' : 'Switch to Light'}
        >
          {theme === 'light' ? (
            <>
              <Zap className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Neon</span>
            </>
          ) : (
            <>
              <Sun className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Light</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
