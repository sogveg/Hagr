'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useCart, calcRentalPrice } from '@/context/cart-context'
import { useLocale } from '@/context/locale-context'

interface BookingPanelProps {
  productId:          string
  productName:        string
  productSlug:        string
  locationId:         string
  locationName:       string
  locationSlug:       string
  categorySlug:       string
  imageUrl:           string
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

export function BookingPanel({
  productId, productName, productSlug,
  locationId, locationName, locationSlug, categorySlug, imageUrl,
  priceDay, priceWeek, priceMonth,
  depositAmount, minimumRentalDays,
}: BookingPanelProps) {
  const { addRental } = useCart()
  const { t } = useLocale()

  const today  = formatDate(new Date())
  const minEnd = formatDate(addDays(new Date(), Math.max(minimumRentalDays, 1)))

  const [start,   setStart]   = useState(today)
  const [end,     setEnd]     = useState(minEnd)
  const [added,   setAdded]   = useState(false)
  const [alrInCart, setAlrInCart] = useState(false)

  const days = useMemo(() => {
    if (!start || !end) return 0
    return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000)
  }, [start, end])

  const priceCalc = useMemo(
    () => calcRentalPrice(start, end, priceDay, priceWeek, priceMonth),
    [start, end, priceDay, priceWeek, priceMonth]
  )
  const total = priceCalc ? priceCalc.total + depositAmount : null

  function handleAddToCart(e: React.FormEvent) {
    e.preventDefault()
    if (!priceCalc || days <= 0) return

    const wasAdded = addRental({
      productId, productName, productSlug,
      locationId, locationName, locationSlug, categorySlug, imageUrl,
      startDate: start, endDate: end,
      priceDay, priceWeek, priceMonth,
      depositAmount, minimumRentalDays,
    })

    if (wasAdded) {
      setAdded(true)
      setTimeout(() => setAdded(false), 3000)
    } else {
      setAlrInCart(true)
      setTimeout(() => setAlrInCart(false), 3000)
    }
  }

  return (
    <form onSubmit={handleAddToCart}>
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden mb-3">
        {/* Date pickers */}
        <div className="grid grid-cols-2 divide-x divide-[var(--color-border)]">
          <div className="px-4 py-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">
              {t.bookingPanel.from}
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
              {t.bookingPanel.to}
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
        {priceCalc && days > 0 ? (
          <div className="border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-[var(--color-muted)]">{priceCalc.label}</span>
              <span className="text-sm font-semibold text-[var(--color-foreground)]">{priceCalc.total} kr</span>
            </div>
            {depositAmount > 0 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border)]">
                <span className="text-sm text-[var(--color-muted)]">{t.bookingPanel.deposit}</span>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)]">{depositAmount} kr</span>
              </div>
            )}
            <div className="flex items-center justify-between px-5 py-4 bg-[var(--color-background)] border-t border-[var(--color-border)]">
              <span className="text-sm font-bold text-[var(--color-foreground)]">{t.bookingPanel.total}</span>
              <span className="text-lg font-bold text-[var(--color-foreground)]">{total} kr</span>
            </div>
          </div>
        ) : (
          <div className="border-t border-[var(--color-border)] px-5 py-4 text-sm text-[var(--color-muted)]">
            {t.bookingPanel.selectDates}
          </div>
        )}
      </div>

      {/* Add to cart button */}
      <button
        type="submit"
        disabled={!priceCalc || days <= 0}
        className={`w-full py-4 rounded-[var(--radius-lg)] text-base font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
          added ? 'bg-[#4A6741]' : 'bg-[var(--color-foreground)] hover:opacity-90'
        }`}
        style={added ? {} : { backgroundColor: '#2B2B2B' }}
      >
        {added ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>
            </svg>
            {t.bookingPanel.addedToCart}
          </>
        ) : alrInCart ? (
          t.bookingPanel.alreadyInCart
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {t.bookingPanel.addToCart}
          </>
        )}
      </button>

      {added && (
        <div className="mt-3 flex gap-2">
          <Link
            href="/cart"
            className="flex-1 py-3 text-center text-sm font-semibold rounded-[var(--radius-lg)] bg-[#4A6741] text-white hover:opacity-90 transition-opacity"
          >
            {t.bookingPanel.goToCart}
          </Link>
          <button
            type="button"
            onClick={() => setAdded(false)}
            className="px-4 py-3 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] font-medium transition-colors"
          >
            {t.bookingPanel.continueShopping}
          </button>
        </div>
      )}

      {!added && !alrInCart && (
        <p className="text-center text-xs text-[var(--color-muted-foreground)] mt-2">
          {t.bookingPanel.note}
        </p>
      )}
    </form>
  )
}
