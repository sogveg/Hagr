'use client'

import { useLocale } from '@/context/locale-context'

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLocale()

  return (
    <div
      className={`flex items-center rounded-full border border-black/[0.10] bg-black/[0.03] p-0.5 gap-0.5 ${className}`}
      role="group"
      aria-label="Velg språk / Choose language"
    >
      <button
        onClick={() => locale !== 'no' && setLocale('no')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
          locale === 'no'
            ? 'bg-white shadow-sm text-[var(--color-foreground)]'
            : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
        }`}
        aria-pressed={locale === 'no'}
        title="Bytt til norsk"
      >
        <span className="text-sm leading-none">🇳🇴</span>
        <span>NO</span>
      </button>

      <button
        onClick={() => locale !== 'en' && setLocale('en')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
          locale === 'en'
            ? 'bg-white shadow-sm text-[var(--color-foreground)]'
            : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
        }`}
        aria-pressed={locale === 'en'}
        title="Switch to English"
      >
        <span className="text-sm leading-none">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  )
}
