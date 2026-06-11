'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passordene stemmer ikke overens')
      return
    }
    if (password.length < 8) {
      setError('Passordet må være minst 8 tegn')
      return
    }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/onboarding')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand-700">SkatteSmart</Link>
          <p className="mt-2 text-gray-600">Opprett gratis konto</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label">E-post</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="label">Passord</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="label">Bekreft passord</label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="input"
                required
                autoComplete="new-password"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Oppretter konto…' : 'Opprett konto'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Har du allerede konto?{' '}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">
              Logg inn
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">
          Vurderingene er generell beslutningsstøtte og erstatter ikke bindende skatterådgivning.
        </p>
      </div>
    </div>
  )
}
