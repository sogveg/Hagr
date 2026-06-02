'use client'

import { useState, useTransition } from 'react'
import { sendContactMessage } from '@/app/actions/contact'
import { useLocale } from '@/context/locale-context'

interface ContactFormProps {
  bookingId?:      string
  bookingRef?:     string
  prefillSubject?: string
}

export function ContactForm({ bookingId, bookingRef, prefillSubject }: ContactFormProps) {
  const { locale } = useLocale()

  const SUBJECTS = locale === 'en'
    ? ['Question about a product', 'Question about a booking', 'Delivery and collection', 'Payment', 'Other']
    : ['Spørsmål om et produkt', 'Spørsmål om en booking', 'Levering og henting', 'Betaling', 'Annet']

  const defaultSubject = prefillSubject ?? (bookingId ? SUBJECTS[1] : '')

  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [subject, setSubject] = useState(defaultSubject)
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

  const labels = locale === 'en' ? {
    sent:         'Message sent!',
    sentDesc:     "We'll reply by email as soon as we can, usually within one working day.",
    regarding:    'Regarding booking',
    nameLbl:      'Name *',
    namePh:       'Jane Smith',
    emailLbl:     'Email *',
    emailPh:      'jane@example.com',
    subjectLbl:   'Subject *',
    subjectPh:    'Choose subject…',
    messageLbl:   'Message *',
    messagePh:    'Write your message here…',
    send:         'Send message',
    sending:      'Sending…',
    replyNote:    "We'll reply by email within one working day.",
  } : {
    sent:         'Meldingen er sendt!',
    sentDesc:     'Vi svarer på e-post så snart vi kan, vanligvis innen en arbeidsdag.',
    regarding:    'Gjelder booking',
    nameLbl:      'Navn *',
    namePh:       'Ola Nordmann',
    emailLbl:     'E-post *',
    emailPh:      'ola@eksempel.no',
    subjectLbl:   'Emne *',
    subjectPh:    'Velg emne…',
    messageLbl:   'Melding *',
    messagePh:    'Skriv din melding her…',
    send:         'Send melding',
    sending:      'Sender…',
    replyNote:    'Vi svarer på e-post innen en arbeidsdag.',
  }

  if (done) {
    return (
      <div className="bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 rounded-2xl px-6 py-8 text-center">
        <p className="text-2xl mb-3">✉️</p>
        <p className="font-semibold text-[var(--color-primary-dark)] mb-1">{labels.sent}</p>
        <p className="text-sm text-[var(--color-muted)]">{labels.sentDesc}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {bookingRef && (
        <div className="bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 rounded-xl px-4 py-3">
          <p className="text-sm text-[var(--color-primary-dark)] font-medium">
            📋 {labels.regarding} <span className="font-bold font-mono">{bookingRef}</span>
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
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{labels.nameLbl}</label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            placeholder={labels.namePh}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{labels.emailLbl}</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            placeholder={labels.emailPh}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{labels.subjectLbl}</label>
        <select
          required
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40 bg-white"
        >
          <option value="">{labels.subjectPh}</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{labels.messageLbl}</label>
        <textarea
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={5}
          className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40 resize-none"
          placeholder={labels.messagePh}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[var(--color-foreground)] text-white font-semibold rounded-xl py-3 text-sm hover:bg-black transition-colors disabled:opacity-50"
      >
        {isPending ? labels.sending : labels.send}
      </button>

      <p className="text-xs text-center text-[var(--color-muted)]">
        {labels.replyNote}
      </p>
    </form>
  )
}
