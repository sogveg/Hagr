'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    if (supabase) {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      })
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <Card>
      <h2 className="text-[22px] font-bold text-[var(--color-foreground)] mb-3">
        Glemt passord
      </h2>

      {sent ? (
        <p className="text-[15px] text-[var(--color-muted)] leading-relaxed">
          Vi har sendt en e-post til <strong className="text-[var(--color-foreground)]">{email}</strong> med en lenke for å nullstille passordet ditt.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            label="E-post"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="din@epost.no"
          />
          
          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Sender...' : 'Send nullstillingslenke'}
          </Button>
        </form>
      )}

      <p className="text-center text-sm mt-5">
        <Link href="/login" className="text-[var(--color-primary-dark)] font-medium hover:underline">
          &larr; Tilbake til innlogging
        </Link>
      </p>
    </Card>
  )
}
