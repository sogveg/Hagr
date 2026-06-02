'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useLocale } from '@/context/locale-context'

function LoginForm() {
  const { t } = useLocale()
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirectTo   = searchParams.get('redirect') ?? '/account'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    if (!supabase) {
      setError(t.auth.connectError)
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(t.auth.loginError)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <Card>
      <h2 className="text-[22px] font-bold text-[var(--color-foreground)] mb-6">
        {t.auth.loginTitle}
      </h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Input
          type="email"
          label={t.auth.emailLabel}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder={t.auth.emailPlaceholder}
        />

        <Input
          type="password"
          label={t.auth.passwordLabel}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder={t.auth.passwordPlaceholder}
        />

        {error && (
          <p className="text-sm text-[var(--color-damaged)]">{error}</p>
        )}

        <Button type="submit" disabled={loading} fullWidth className="mt-2">
          {loading ? t.auth.loggingIn : t.auth.loginBtn}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-muted)] mt-5">
        {t.auth.noAccount}{' '}
        <Link
          href={`/register${redirectTo !== '/account' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
          className="text-[var(--color-primary-dark)] font-medium hover:underline"
        >
          {t.auth.createAccount}
        </Link>
      </p>

      <p className="text-center text-sm mt-1">
        <Link href="/forgot-password" className="text-[var(--color-primary-dark)] font-medium hover:underline">
          {t.auth.forgotPassword}
        </Link>
      </p>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
