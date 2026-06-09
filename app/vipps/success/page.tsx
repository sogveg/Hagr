import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title:   'Betaling | TinyRent',
  robots:  { index: false, follow: false },
}

export default async function VippsSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams

  // Look up booking status so we can show the right message
  let status: string | null = null
  if (orderId) {
    const supabase = createServiceClient()
    const { data } = await (supabase as any)
      .from('bookings')
      .select('status')
      .eq('vipps_order_id', orderId)
      .limit(1)
      .maybeSingle()
    status = (data as { status: string } | null)?.status ?? null
  }

  const confirmed  = status === 'confirmed'
  const cancelled  = status === 'cancelled'
  // pending_payment = callback not yet processed, treat optimistically as success

  if (cancelled) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="m15 9-6 6M9 9l6 6"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">
          Betaling avbrutt
        </h1>
        <p className="text-[var(--color-muted)] mb-8 leading-relaxed">
          Det ser ut til at betalingen ble avbrutt eller avvist. Ingen betaling er registrert.
          Du kan legge til utstyr og prøve igjen.
        </p>
        <Link
          href="/bergen"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-full)] bg-[var(--color-foreground)] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Tilbake til utleieoversikt
        </Link>
      </div>
    )
  }

  // confirmed or pending_payment (optimistic)
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
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
        {confirmed ? 'Booking bekreftet!' : 'Betaling mottatt!'}
      </h1>

      <p className="text-[var(--color-muted)] mb-2 leading-relaxed">
        Vi har mottatt betalingen din via Vipps.
      </p>
      <p className="text-[var(--color-muted)] mb-8 leading-relaxed">
        {confirmed
          ? 'Bookingen er bekreftet. Du finner den under «Min konto».'
          : 'Bookingen bekreftes automatisk og vil snart dukke opp under «Min konto». Vi sender deg en e-post så fort alt er klart.'
        }
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
