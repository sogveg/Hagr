'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export function HeaderAuthNav() {
  const [user, setUser] = useState<{ email?: string | null } | null | undefined>(undefined)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) { setUser(null); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Skeleton while loading to avoid layout shift
  if (user === undefined) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-14 h-6 bg-black/[0.06] rounded-full animate-pulse" />
        <div className="w-24 h-8 bg-black/[0.06] rounded-full animate-pulse" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/artikler" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors hidden md:block">
          Artikler
        </Link>
        <Link href="/kontakt" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors hidden md:block">
          Kontakt
        </Link>
        <Link
          href="/account"
          className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          Min konto
        </Link>
        <Link
          href="/bergen"
          className="text-sm font-semibold bg-[var(--color-foreground)] text-white px-4 py-2 rounded-[var(--radius-full)] hover:opacity-90 transition-opacity"
        >
          Se utstyr
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/artikler" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors hidden md:block">
        Artikler
      </Link>
      <Link href="/kontakt" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors hidden md:block">
        Kontakt
      </Link>
      <Link
        href="/login"
        className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
      >
        Logg inn
      </Link>
      <Link
        href="/register"
        className="text-sm font-semibold bg-[var(--color-foreground)] text-white px-4 py-2 rounded-[var(--radius-full)] hover:opacity-90 transition-opacity"
      >
        Kom i gang
      </Link>
    </div>
  )
}
