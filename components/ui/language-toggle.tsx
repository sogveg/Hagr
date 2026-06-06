'use client'

import { useLocale } from '@/context/locale-context'

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLocale()

  const isNo = locale === 'no'

  return (
    <button
      onClick={() => setLocale(isNo ? 'en' : 'no')}
      className={`text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors ${className}`}
      title={isNo ? 'Switch to English' : 'Bytt til norsk'}
      aria-label={isNo ? 'Switch to English' : 'Bytt til norsk'}
    >
      {isNo ? 'EN' : 'NO'}
    </button>
  )
}
