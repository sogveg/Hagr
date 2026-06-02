'use client'

import { useState, useTransition } from 'react'
import { addToWaitlist } from '@/app/actions/waitlist'
import { useLocale } from '@/context/locale-context'

interface WaitlistFormProps {
  productId:  string
  locationId: string
  productName: string
}

export function WaitlistForm({ productId, locationId, productName }: WaitlistFormProps) {
  const { t, locale } = useLocale()
  const [email, setEmail]     = useState('')
  const [name, setName]       = useState('')
  const [message, setMessage] = useState('')
  const [open, setOpen]       = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await addToWaitlist(productId, locationId, email, name || undefined, message || undefined)
      if (result.success) {
        setDone(true)
      } else {
        setError(result.error ?? 'Noe gikk galt')
      }
    })
  }

  const notifyLabel  = locale === 'en' ? 'Notify me when available' : 'Varsle meg når det er ledig'
  const cancelLabel  = locale === 'en' ? 'Cancel'  : 'Avbryt'
  const doneNotify   = locale === 'en'
    ? `We'll notify you at ${email} as soon as ${productName} is available again.`
    : `Vi gir deg beskjed på ${email} så snart ${productName} er ledig igjen.`
  const successMsg   = locale === 'en' ? "You're on the waiting list! 🎉" : 'Du er på ventelisten! 🎉'
  const namePlaceholder  = locale === 'en' ? 'Your name (optional)' : 'Ditt navn (valgfritt)'
  const emailPlaceholder = locale === 'en' ? 'Your email address *' : 'Din e-postadresse *'

  if (done) {
    return (
      <div className="bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 rounded-[var(--radius-lg)] px-5 py-4 text-center">
        <p className="text-sm font-semibold text-[var(--color-primary-dark)]">
          {successMsg}
        </p>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          {doneNotify}
        </p>
      </div>
    )
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] font-semibold rounded-[var(--radius-lg)] py-4 text-sm hover:bg-[var(--color-primary)]/20 transition-colors border border-[var(--color-primary)]/20"
        >
          {notifyLabel}
        </button>
      ) : (
        <div className="bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 rounded-[var(--radius-lg)] p-5">
          <p className="text-sm font-bold text-[var(--color-primary-dark)] mb-4">
            {t.product.waitlistTitle}
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}
            <input
              type="text"
              placeholder={namePlaceholder}
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            />
            <input
              type="email"
              required
              placeholder={emailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            />
            <textarea
              placeholder={t.waitlist.messagePlaceholder}
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={2}
              className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40 resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 border border-[var(--color-border)] text-[var(--color-muted)] text-sm font-medium rounded-xl py-2.5 hover:bg-white transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[var(--color-foreground)] text-white text-sm font-semibold rounded-xl py-2.5 hover:bg-black transition-colors disabled:opacity-50"
              >
                {isPending ? t.waitlist.submitting : t.waitlist.submit}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
