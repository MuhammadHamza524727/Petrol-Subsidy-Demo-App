'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Lang = 'en' | 'ur'

interface LangContextType {
  lang: Lang
  toggle: () => void
  t: (en: string, ur: string) => string
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  toggle: () => {},
  t: (en) => en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved) setLang(saved)
  }, [])

  function toggle() {
    setLang((l) => {
      const next = l === 'en' ? 'ur' : 'en'
      localStorage.setItem('lang', next)
      return next
    })
  }

  const t = (en: string, ur: string) => (lang === 'ur' ? ur : en)

  return <LangContext.Provider value={{ lang, toggle, t }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
