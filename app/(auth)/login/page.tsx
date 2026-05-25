'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

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
    <div style={card}>
      <h2 style={heading}>Logg inn</h2>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            autoComplete="current-password"
            style={input}
          />
        </div>

        {error && <p style={errorStyle}>{error}</p>}

        <button type="submit" disabled={loading} style={loading ? { ...primaryButton, opacity: 0.7 } : primaryButton}>
          {loading ? 'Logger inn...' : 'Logg inn'}
        </button>
      </form>

      <p style={footer}>
        Ikke kunde ennå?{' '}
        <a href="/register" style={link}>Opprett konto</a>
      </p>
      <p style={{ ...footer, marginTop: '4px' }}>
        <a href="/forgot-password" style={link}>Glemt passord?</a>
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
