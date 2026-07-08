'use client'

import { useState } from 'react'
import { sendReviewRequestAction } from '@/app/actions/review'

export function SendReviewButton({ bookingId }: { bookingId: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function handleClick() {
    setState('loading')
    const result = await sendReviewRequestAction(bookingId)
    setState(result.success ? 'sent' : 'error')
  }

  if (state === 'sent') {
    return (
      <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
        Sendt
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === 'loading'}
      className="text-xs font-semibold px-4 py-1.5 rounded-full border border-[#8FA68B] text-[#4A6741] hover:bg-[#F0F4EE] transition-colors disabled:opacity-50"
    >
      {state === 'loading' ? '...' : state === 'error' ? 'Prøv igjen' : 'Send anmeldelsesforespørsel'}
    </button>
  )
}
