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
 * `<html>`'e `dark` class'ını uygulayan ve seçimi `localStorage`'a yazan tek
 * yer — kaynak uygulamadaki zustand `preferences-store` + `usePreferencesSync`
 * ikilisinin tema kısmının karşılığı, burada ekstra bağımlılık eklememek için
 * tek bir context olarak. "system" seçiliyken işletim sistemi teması
 * değişince de otomatik güncellenir (`matchMedia` change listener).
 *
 * Kaynaktaki gibi FOUC (ilk boyamada kısa süreli yanlış tema) önleyici bir
 * inline script burada da yok — `dark` class'ı ancak bu component mount olup
 * effect çalıştıktan sonra uygulanıyor. İsterseniz `index.html`'e (Next.js'te
 * `<html suppressHydrationWarning>` ile birlikte kendi başlangıç script'inizi)
 * ekleyebilirsiniz, bu hook bunu zorunlu kılmıyor.
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
  if (!ctx) throw new Error('useTheme, ThemeProvider içinde kullanılmalı')
  return ctx
}
