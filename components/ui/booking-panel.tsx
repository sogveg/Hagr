'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { createBooking } from '@/app/actions/create-booking'

interface BookingPanelProps {
  productId:          string
  locationId:         string
  locationName:       string
  locationSlug:       string
  categorySlug:       string
  productSlug:        string
  priceDay:           number | null
  priceWeek:          number | null
  priceMonth:         number | null
  depositAmount:      number
  minimumRentalDays:  number
  isLoggedIn:         boolean
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function calcPrice(days: number, priceDay: number | null, priceWeek: number | null, priceMonth: number | null) {
  if (days <= 0) return null

  const opts: { total: number; label: string; unit: string }[] = []

  if (priceDay   != null) opts.push({ total: priceDay   * days,                    label: `${days} dag${days !== 1 ? 'er' : ''}`,  unit: `${priceDay} kr/dag` })
  if (priceWeek  != null) opts.push({ total: priceWeek  * Math.ceil(days / 7),     label: `${Math.ceil(days / 7)} uke${Math.ceil(days / 7) !== 1 ? 'r' : ''}`,   unit: `${priceWeek} kr/uke` })
  if (priceMonth != null) opts.push({ total: priceMonth * Math.ceil(days / 30),    label: `${Math.ceil(days / 30)} mnd`,             unit: `${priceMonth} kr/mnd` })

  if (!opts.length) return null

  return opts.reduce((best, curr) => curr.total < best.total ? curr : best)
}

export function BookingPanel({
  productId,
  locationId,
  locationName,
  locationSlug,
  categorySlug,
  productSlug,
  priceDay,
  priceWeek,
  priceMonth,
  depositAmount,
  minimumRentalDays,
  isLoggedIn,
}: BookingPanelProps) {
  const today     = formatDate(new Date())
  const minEnd    = formatDate(addDays(new Date(), Math.max(minimumRentalDays, 1)))
  const [start,   setStart]   = useState(today)
  const [end,     setEnd]     = useState(minEnd)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)

  const days = useMemo(() => {
    if (!start || !end) return 0
    return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000)
  }, [start, end])

  const priceCalc = useMemo(() => calcPrice(days, priceDay, priceWeek, priceMonth), [days, priceDay, priceWeek, priceMonth])
  const total     = priceCalc ? priceCalc.total + depositAmount : null

  const loginHref    = `/login?redirect=/${locationSlug}/${categorySlug}/${productSlug}`
  const registerHref = `/register?redirect=/${locationSlug}/${categorySlug}/${productSlug}`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!priceCalc || days <= 0) return
    setError(null)
    setLoading(true)

    const result = await createBooking({
      productId,
      locationId,
      startDate:     start,
      endDate:       end,
      priceDay,
      priceWeek,
      priceMonth,
      depositAmount,
    })

    setLoading(false)

    if (result.success) {
      setBookingId(result.bookingId)
      setSuccess(true)
    } else {
      setError(result.error)
    }
  }

  /* ── Success state ── */
  if (success) {
    return (
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <div className="px-5 py-8 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#EBF0E7' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2">
            Forespørsel sendt!
          </h3>
          <p className="text-sm text-[var(--color-muted)] mb-6 leading-relaxed">
            Vi har mottatt forespørselen din for {locationName} og kontakter deg innen 24 timer.
          </p>
          {bookingId && (
            <p className="text-xs text-[var(--color-muted-foreground)] font-mono mb-5">
              #{bookingId.slice(0, 8)}
            </p>
          )}
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-dark)] hover:underline"
          >
            Se mine bookinger &rarr;
          </Link>
        </div>
      </div>
    )
  }

  /* ── Not logged in ── */
  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <div className="px-5 py-6">
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-1">Lei dette produktet</p>
          <p className="text-sm text-[var(--color-muted)] mb-5">
            Logg inn eller opprett konto for å sende en leieforespørsel.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href={loginHref}
              className="flex items-center justify-center w-full py-3 px-4 rounded-[var(--radius-lg)] text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#4A6741' }}
            >
              Logg inn
            </Link>
            <Link
              href={registerHref}
              className="flex items-center justify-center w-full py-3 px-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] text-sm font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-background)] transition-colors"
            >
              Opprett konto
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Booking form ── */
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden mb-3">
        {/* Date pickers */}
        <div className="grid grid-cols-2 divide-x divide-[var(--color-border)]">
          <div className="px-4 py-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">
              Fra
            </label>
            <input
              type="date"
              value={start}
              min={today}
              onChange={e => {
                setStart(e.target.value)
                const minE = formatDate(addDays(new Date(e.target.value), Math.max(minimumRentalDays, 1)))
                if (end <= e.target.value) setEnd(minE)
              }}
              className="w-full text-sm font-semibold text-[var(--color-foreground)] bg-transparent outline-none cursor-pointer"
              required
            />
          </div>
          <div className="px-4 py-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">
              Til
            </label>
            <input
              type="date"
              value={end}
              min={start ? formatDate(addDays(new Date(start), Math.max(minimumRentalDays, 1))) : today}
              onChange={e => setEnd(e.target.value)}
              className="w-full text-sm font-semibold text-[var(--color-foreground)] bg-transparent outline-none cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Price breakdown */}
        {priceCalc && days > 0 && (
          <>
            <div className="border-t border-[var(--color-border)]">
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-[var(--color-muted)]">
                  {priceCalc.label} × {priceCalc.unit}
                </span>
                <span className="text-sm font-semibold text-[var(--color-foreground)]">
                  {priceCalc.total} kr
                </span>
              </div>

              {depositAmount > 0 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">
                    Depositum (refunderes)
                  </span>
                  <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
                    {depositAmount} kr
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between px-5 py-4 bg-[var(--color-background)] border-t border-[var(--color-border)]">
                <span className="text-sm font-bold text-[var(--color-foreground)]">Totalt</span>
                <span className="text-lg font-bold text-[var(--color-foreground)]">{total} kr</span>
              </div>
            </div>
          </>
        )}

        {(!priceCalc || days <= 0) && (
          <div className="border-t border-[var(--color-border)] px-5 py-4 text-sm text-[var(--color-muted)]">
            Velg datoer for å se pris
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-[var(--color-damaged)] mb-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !priceCalc || days <= 0}
        className="w-full py-4 rounded-[var(--radius-lg)] text-base font-semibold text-white transition-opacity disabled:opacity-50"
        style={{ backgroundColor: '#4A6741' }}
      >
        {loading ? 'Sender...' : 'Send leieforespørsel'}
      </button>

      <p className="text-center text-xs text-[var(--color-muted-foreground)] mt-2">
        Vi kontakter deg innen 24 timer
      </p>
    </form>
  )
}
