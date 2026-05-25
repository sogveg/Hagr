'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    })

    setSent(true)
    setLoading(false)
  }

  return (
    <div style={card}>
      <h2 style={heading}>Glemt passord</h2>

      {sent ? (
        <p style={text}>
          Vi har sendt en e-post til <strong>{email}</strong> med en lenke for å nullstille passordet ditt.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={label}>E-post</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={input}
              placeholder="din@epost.no"
            />
          </div>
          <button type="submit" disabled={loading} style={loading ? { ...primaryButton, opacity: 0.7 } : primaryButton}>
            {loading ? 'Sender...' : 'Send nullstillingslenke'}
          </button>
        </form>
      )}

      <p style={footer}>
        <a href="/login" style={link}>← Tilbake til innlogging</a>
      </p>
    </div>
  )
}

const card: React.CSSProperties = { backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }
const heading: React.CSSProperties = { fontSize: '22px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 12px' }
const text: React.CSSProperties = { fontSize: '15px', color: '#6B7280', lineHeight: '1.6', margin: 0 }
const label: React.CSSProperties = { display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--color-text)', marginBottom: '6px' }
const input: React.CSSProperties = { width: '100%', height: '48px', borderRadius: '14px', border: '1px solid #D1D5DB', padding: '0 16px', fontSize: '15px', color: 'var(--color-text)', backgroundColor: 'white', boxSizing: 'border-box', outline: 'none' }
const primaryButton: React.CSSProperties = { height: '52px', borderRadius: '999px', backgroundColor: 'var(--color-text)', color: 'white', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer', width: '100%' }
const footer: React.CSSProperties = { textAlign: 'center', fontSize: '14px', color: '#6B7280', marginTop: '20px', marginBottom: 0 }
const link: React.CSSProperties = { color: 'var(--color-primary-dark)', textDecoration: 'none', fontWeight: '500' }
