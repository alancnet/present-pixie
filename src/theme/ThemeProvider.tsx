import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemeChoice = 'system' | 'light' | 'dark'

interface ThemeContextValue {
  theme: ThemeChoice
  setTheme: (choice: ThemeChoice) => void
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'theme-choice'

function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  if (choice === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.add(prefersDark ? 'dark' : 'light')
  } else {
    root.classList.add(choice)
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeChoice | null
    return saved ?? 'system'
  })

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (localStorage.getItem(STORAGE_KEY) === 'system') {
        applyTheme('system')
      }
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const setTheme = (choice: ThemeChoice) => setThemeState(choice)
  const cycleTheme = () => {
    setThemeState((prev) => (prev === 'system' ? 'dark' : prev === 'dark' ? 'light' : 'system'))
  }

  const value = useMemo(() => ({ theme, setTheme, cycleTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
