'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { createCustomerProfile } from '@/app/actions/customer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

function RegisterForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirectTo   = searchParams.get('redirect') ?? '/account'

  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [loading,   setLoading]   = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    if (!supabase) {
      setError('Kunne ikke koble til. Prøv igjen.')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Use server action with service client — bypasses RLS reliably
      await createCustomerProfile({
        userId:    data.user.id,
        email,
        firstName,
        lastName,
      })
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <Card>
      <h2 className="text-[22px] font-bold text-[var(--color-foreground)] mb-6">
        Opprett konto
      </h2>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="text"
            label="Fornavn"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            placeholder="Ola"
          />
          <Input
            type="text"
            label="Etternavn"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            placeholder="Nordmann"
          />
        </div>

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
          minLength={8}
          autoComplete="new-password"
          placeholder="Minst 8 tegn"
        />

        {error && (
          <p className="text-sm text-[var(--color-damaged)]">{error}</p>
        )}

        <Button type="submit" disabled={loading} fullWidth className="mt-2">
          {loading ? 'Oppretter konto...' : 'Opprett konto'}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-muted)] mt-5">
        Har du konto fra før?{' '}
        <Link
          href={`/login${redirectTo !== '/account' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
          className="text-[var(--color-primary-dark)] font-medium hover:underline"
        >
          Logg inn
        </Link>
      </p>
    </Card>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
