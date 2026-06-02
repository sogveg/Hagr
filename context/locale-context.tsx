'use client'

import { createContext, useContext, useState, useTransition, ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'
import { getT } from '@/lib/i18n'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: ReturnType<typeof getT>
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [, startTransition] = useTransition()

  function setLocale(next: Locale) {
    // Set cookie
    document.cookie = `lang=${next};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`
    setLocaleState(next)
    // Soft-refresh to get server components in the new language
    startTransition(() => {
      window.location.reload()
    })
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: getT(locale) }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}
