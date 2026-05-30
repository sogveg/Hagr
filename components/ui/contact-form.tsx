'use client'

import { useState, useTransition } from 'react'
import { sendContactMessage } from '@/app/actions/contact'

const SUBJECTS = [
  'Spørsmål om et produkt',
  'Spørsmål om en booking',
  'Levering og henting',
  'Betaling',
  'Annet',
]

interface ContactFormProps {
  bookingId?:     string
  bookingRef?:    string   // e.g. "#ABC123" for display
  prefillSubject?: string
}

export function ContactForm({ bookingId, bookingRef, prefillSubject }: ContactFormProps) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [subject, setSubject] = useState(prefillSubject ?? (bookingId ? 'Spørsmål om en booking' : ''))
  const [message, setMessage] = useState('')
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await sendContactMessage({ name, email, subject, message, bookingId })
      if (result.success) setDone(true)
      else setError(result.error ?? 'Noe gikk galt')
    })
  }

  if (done) {
    return (
      <div className="bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 rounded-2xl px-6 py-8 text-center">
        <p className="text-2xl mb-3">✉️</p>
        <p className="font-semibold text-[var(--color-primary-dark)] mb-1">Meldingen er sendt!</p>
        <p className="text-sm text-[var(--color-muted)]">Vi svarer på e-post så snart vi kan — vanligvis innen en arbeidsdag.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {bookingRef && (
        <div className="bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 rounded-xl px-4 py-3">
          <p className="text-sm text-[var(--color-primary-dark)] font-medium">
            📋 Gjelder booking <span className="font-bold font-mono">{bookingRef}</span>
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Navn *</label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            placeholder="Ola Nordmann"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">E-post *</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            placeholder="ola@eksempel.no"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Emne *</label>
        <select
          required
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40 bg-white"
        >
          <option value="">Velg emne…</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Melding *</label>
        <textarea
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={5}
          className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40 resize-none"
          placeholder="Skriv din melding her…"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[var(--color-foreground)] text-white font-semibold rounded-xl py-3 text-sm hover:bg-black transition-colors disabled:opacity-50"
      >
        {isPending ? 'Sender…' : 'Send melding'}
      </button>

      <p className="text-xs text-center text-[var(--color-muted)]">
        Vi svarer på e-post innen en arbeidsdag.
      </p>
    </form>
  )
}
