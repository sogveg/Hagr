'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

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
      // Opprett kundeprofil
      await supabase.from('customers').insert({
        user_id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
      })
    }

    router.push('/account')
    router.refresh()
  }

  return (
    <div style={card}>
      <h2 style={heading}>Opprett konto</h2>

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={label}>Fornavn</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              style={input}
              placeholder="Ola"
            />
          </div>
          <div>
            <label style={label}>Etternavn</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              style={input}
              placeholder="Nordmann"
            />
          </div>
        </div>

        <div>
          <label style={label}>E-post</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={input}
            placeholder="din@epost.no"
          />
        </div>

        <div>
          <label style={label}>Passord</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            style={input}
            placeholder="Minst 8 tegn"
          />
        </div>

        {error && <p style={errorStyle}>{error}</p>}

        <button type="submit" disabled={loading} style={loading ? { ...primaryButton, opacity: 0.7 } : primaryButton}>
          {loading ? 'Oppretter konto...' : 'Opprett konto'}
        </button>
      </form>

      <p style={footer}>
        Har du konto fra før?{' '}
        <a href="/login" style={link}>Logg inn</a>
      </p>
    </div>
  )
}

const card: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '24px',
  padding: '32px',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
}

const heading: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '700',
  color: 'var(--color-text)',
  margin: '0 0 24px',
}

const label: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '500',
  color: 'var(--color-text)',
  marginBottom: '6px',
}

const input: React.CSSProperties = {
  width: '100%',
  height: '48px',
  borderRadius: '14px',
  border: '1px solid #D1D5DB',
  padding: '0 16px',
  fontSize: '15px',
  color: 'var(--color-text)',
  backgroundColor: 'white',
  boxSizing: 'border-box',
  outline: 'none',
}

const primaryButton: React.CSSProperties = {
  height: '52px',
  borderRadius: '999px',
  backgroundColor: 'var(--color-text)',
  color: 'white',
  fontSize: '15px',
  fontWeight: '600',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  marginTop: '8px',
}

const errorStyle: React.CSSProperties = {
  color: '#C46A6A',
  fontSize: '14px',
  margin: 0,
}

const footer: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '14px',
  color: '#6B7280',
  marginTop: '20px',
  marginBottom: 0,
}

const link: React.CSSProperties = {
  color: 'var(--color-primary-dark)',
  textDecoration: 'none',
  fontWeight: '500',
}
