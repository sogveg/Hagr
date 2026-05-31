'use client'

import { useState, useTransition } from 'react'
import { subscribeNewsletter } from '@/app/actions/newsletter'

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail]     = useState('')
  const [name, setName]       = useState('')
  const [state, setState]     = useState<'idle' | 'success' | 'exists' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('idle')
    startTransition(async () => {
      const result = await subscribeNewsletter(email, name || undefined)
      if (result.success) {
        if (result.alreadySubscribed) setState('exists')
        else setState('success')
        setEmail('')
        setName('')
      } else {
        setState('error')
        setErrorMsg(result.error ?? 'Noe gikk galt')
      }
    })
  }

  if (state === 'success') {
    return (
      <div className="text-center py-2">
        <p className="text-sm font-semibold text-[var(--color-primary-dark)]">
          Takk! Du er nå registrert på nyhetsbrevet 🎉
        </p>
      </div>
    )
  }

  if (state === 'exists') {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-[var(--color-muted)]">
          Du er allerede registrert på nyhetsbrevet.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'flex gap-2' : 'space-y-3'}>
      {!compact && (
        <input
          type="text"
          placeholder="Ditt navn (valgfritt)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-white/[0.08] border border-white/25 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40"
        />
      )}
      <input
        type="email"
        required
        placeholder="Din e-postadresse"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className={
          compact
            ? 'flex-1 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40'
            : 'w-full bg-white/[0.08] border border-white/25 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40'
        }
      />
      <button
        type="submit"
        disabled={isPending}
        className={
          compact
            ? 'bg-[var(--color-foreground)] text-white text-sm font-semibold rounded-xl px-5 py-2.5 hover:bg-black transition-colors disabled:opacity-50 whitespace-nowrap'
            : 'w-full bg-white text-[var(--color-foreground)] text-sm font-bold rounded-xl px-5 py-3.5 hover:bg-white/90 transition-colors disabled:opacity-50'
        }
      >
        {isPending ? 'Registrerer…' : 'Meld meg på'}
      </button>
      {state === 'error' && (
        <p className="text-xs text-red-400 mt-1">{errorMsg}</p>
      )}
    </form>
  )
}
