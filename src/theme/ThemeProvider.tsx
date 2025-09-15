import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemeChoice = 'system' | 'light' | 'dark'
export type EffectiveTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: ThemeChoice
  setTheme: (choice: ThemeChoice) => void
  cycleTheme: () => void
  effectiveTheme: EffectiveTheme
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
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => {
    if (typeof window === 'undefined') return 'light'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
    // Update effective theme whenever choice changes
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setEffectiveTheme(prefersDark ? 'dark' : 'light')
    } else {
      setEffectiveTheme(theme)
    }
  }, [theme])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (localStorage.getItem(STORAGE_KEY) === 'system') {
        applyTheme('system')
        setEffectiveTheme(mql.matches ? 'dark' : 'light')
      }
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const setTheme = (choice: ThemeChoice) => setThemeState(choice)
  const cycleTheme = () => {
    setThemeState((prev) => (prev === 'system' ? 'dark' : prev === 'dark' ? 'light' : 'system'))
  }

  const value = useMemo(() => ({ theme, setTheme, cycleTheme, effectiveTheme }), [theme, effectiveTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
