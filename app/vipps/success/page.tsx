import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title:   'Betaling mottatt | TinyRent',
  robots:  { index: false, follow: false },
}

export default function VippsSuccessPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">

      {/* Checkmark icon */}
      <div className="w-16 h-16 rounded-full bg-[#EBF0E7] flex items-center justify-center mx-auto mb-6">
        <svg
          width="28" height="28" viewBox="0 0 24 24"
          fill="none" stroke="#4A6741" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m9 12 2 2 4-4"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">
        Betaling mottatt!
      </h1>

      <p className="text-[var(--color-muted)] mb-2 leading-relaxed">
        Vi har mottatt betalingen din via Vipps.
      </p>
      <p className="text-[var(--color-muted)] mb-8 leading-relaxed">
        Bookingen din bekreftes automatisk og vil snart dukke opp under «Min konto».
        Vi sender deg en e-post så fort alt er klart.
      </p>

      <div className="flex flex-col gap-3 items-center">
        <Link
          href="/account"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-full)] bg-[#4A6741] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Se mine bestillinger →
        </Link>
        <Link
          href="/bergen"
          className="text-sm text-[var(--color-muted)] hover:underline"
        >
          Fortsett å handle
        </Link>
      </div>

    </div>
  )
}
