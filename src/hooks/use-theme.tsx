'use client'

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'spechy-ui-theme'
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

function applyTheme(theme: Theme) {
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia(DARK_MEDIA_QUERY).matches)
  document.documentElement.classList.toggle('dark', isDark)
}

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * The single place that applies the `dark` class to `<html>` and writes the choice to
 * `localStorage` — implemented as one plain context to avoid adding a state-management
 * dependency. While "system" is selected it also updates automatically when the OS
 * theme changes (`matchMedia` change listener).
 *
 * There's no FOUC-prevention inline script here (the brief flash of the wrong theme on
 * first paint) — the `dark` class is only applied once this component mounts and its
 * effect runs. You can add your own bootstrap script to `index.html` (or, in Next.js,
 * `<html suppressHydrationWarning>` plus your own startup script) if you need one; this
 * hook doesn't require it.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme())

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return

    const query = window.matchMedia(DARK_MEDIA_QUERY)
    const handleChange = () => applyTheme('system')
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [theme])

  function setTheme(next: Theme) {
    window.localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
