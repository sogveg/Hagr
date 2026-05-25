'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    if (!supabase) {
      setError('Kunne ikke koble til. Prov igjen.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Feil e-post eller passord')
      setLoading(false)
      return
    }

    router.push('/account')
    router.refresh()
  }

  return (
    <Card>
      <h2 className="text-[22px] font-bold text-[var(--color-foreground)] mb-6">
        Logg inn
      </h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Input
          type="email"
          label="E-post"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="din@epost.no"
        />

        <Input
          type="password"
          label="Passord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="text-sm text-[var(--color-damaged)]">{error}</p>
        )}

        <Button type="submit" disabled={loading} fullWidth className="mt-2">
          {loading ? 'Logger inn...' : 'Logg inn'}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-muted)] mt-5">
        Ikke kunde enna?{' '}
        <Link href="/register" className="text-[var(--color-primary-dark)] font-medium hover:underline">
          Opprett konto
        </Link>
      </p>
      
      <p className="text-center text-sm mt-1">
        <Link href="/forgot-password" className="text-[var(--color-primary-dark)] font-medium hover:underline">
          Glemt passord?
        </Link>
      </p>
    </Card>
  )
}
