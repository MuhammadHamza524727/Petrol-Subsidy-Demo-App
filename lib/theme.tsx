'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'neon'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'neon') {
      setTheme('neon')
      document.documentElement.setAttribute('data-theme', 'neon')
    }
  }, [])

  function toggleTheme() {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'neon' : 'light'
      localStorage.setItem('theme', next)
      if (next === 'neon') {
        document.documentElement.setAttribute('data-theme', 'neon')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
