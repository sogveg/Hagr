'use client'

import { useState, useTransition } from 'react'
import { sendMessageToCustomer } from '@/app/actions/customer'

export function SendMessageForm({ bookingId, customerName }: {
  bookingId:    string
  customerName: string
}) {
  const [message, setMessage]   = useState('')
  const [open, setOpen]         = useState(false)
  const [state, setState]       = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError]       = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setState('idle')
    startTransition(async () => {
      const result = await sendMessageToCustomer(bookingId, message.trim())
      if (result.success) {
        setState('success')
        setMessage('')
        setTimeout(() => { setState('idle'); setOpen(false) }, 3000)
      } else {
        setState('error')
        setError(result.error ?? 'Noe gikk galt')
      }
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-[#8FA68B] hover:underline"
      >
        ✉ Send melding til {customerName}
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {state === 'success' && (
        <p className="text-xs font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-2">
          Meldingen ble sendt til {customerName} på e-post ✓
        </p>
      )}
      {state === 'error' && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
        rows={4}
        placeholder={`Skriv en melding til ${customerName}…`}
        className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40 resize-none"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setOpen(false); setState('idle'); setMessage('') }}
          className="flex-1 text-sm text-gray-500 border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-colors"
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={isPending || !message.trim()}
          className="flex-1 bg-[#2B2B2B] text-white text-sm font-semibold rounded-xl py-2 hover:bg-black transition-colors disabled:opacity-50"
        >
          {isPending ? 'Sender…' : 'Send e-post'}
        </button>
      </div>
    </form>
  )
}
