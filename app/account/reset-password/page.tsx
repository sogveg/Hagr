'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

function ResetPasswordForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [ready,    setReady]    = useState(false)
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)

  useEffect(() => {
    const code    = searchParams.get('code')
    const supabase = createClient()
    if (!supabase) return

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setError('Lenken er ugyldig eller utløpt. Be om en ny lenke.')
        else setReady(true)
      })
    } else {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true)
        else setError('Lenken er ugyldig eller utløpt. Be om en ny lenke.')
      })
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passordene stemmer ikke overens')
      return
    }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    if (!supabase) return
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/account'), 2000)
  }

  const inputCls =
    'w-full h-12 px-4 rounded-xl border border-black/[0.12] bg-white text-[15px] ' +
    'focus:outline-none focus:ring-2 focus:ring-[#8FA68B] focus:border-transparent transition-all'

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <h1 className="text-[28px] font-bold text-[var(--color-foreground)] tracking-tight">TinyRent</h1>
            <p className="text-sm text-[var(--color-primary-dark)] mt-0.5 font-medium">Babyutstyr til leie i Bergen</p>
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm px-8 py-8">
          <h2 className="text-[22px] font-bold text-[var(--color-foreground)] mb-2">Sett nytt passord</h2>

          {done ? (
            <div className="py-4 text-center">
              <p className="text-2xl mb-3">✓</p>
              <p className="text-sm text-[var(--color-muted)]">Passordet er oppdatert. Du blir videresendt…</p>
            </div>
          ) : error && !ready ? (
            <div className="py-4">
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <a
                href="/forgot-password"
                className="text-sm text-[var(--color-primary-dark)] font-medium hover:underline"
              >
                Be om ny nullstillingslenke →
              </a>
            </div>
          ) : !ready ? (
            <p className="text-sm text-[var(--color-muted)] py-4">Verifiserer lenke…</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">Nytt passord</label>
                <input
                  type="password"
                  className={inputCls}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Minst 8 tegn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">Bekreft passord</label>
                <input
                  type="password"
                  className={inputCls}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Gjenta passordet"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full font-semibold text-white transition-opacity disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary-dark)' }}
              >
                {loading ? 'Lagrer…' : 'Sett nytt passord'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-[var(--color-muted-foreground)] mt-8">
          &copy; {new Date().getFullYear()} TinyRent · Bergen, Norge
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
