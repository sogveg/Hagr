'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart, calcRentalPrice, type CartAccessory } from '@/context/cart-context'
import { checkoutCart } from '@/app/actions/checkout'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

// ─── Accessories catalogue ────────────────────────────────────────────────────

const ACCESSORIES = [
  { id: 'soap',     name: 'Sitronsåpe',    description: 'Naturlig rengjøring av babyutstyr',    price: 79  },
  { id: 'sheet',    name: 'Laken',         description: 'Rent laken til barneseng eller vogn',  price: 99  },
  { id: 'bedding',  name: 'Sengetøy-sett', description: 'Dyne + pute tilpasset barneseng',      price: 199 },
  { id: 'liner',    name: 'Vogninnlegg',   description: 'Mykt, vaskbart innlegg til vogn',      price: 149 },
]

// ─── Date helpers ─────────────────────────────────────────────────────────────

function fmt(d: string) {
  return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })
}
function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}
function toStr(d: Date) { return d.toISOString().split('T')[0] }

// ─── Component ────────────────────────────────────────────────────────────────

export default function CartPage() {
  const router = useRouter()
  const { rentals, accessories, removeRental, updateDates, setAccessoryQty, clearCart } = useCart()

  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState(false)
  const [bookingIds, setBookingIds] = useState<string[]>([])

  const today = toStr(new Date())

  // ── Totals ──────────────────────────────────────────────────────────────────
  const rentalTotal = useMemo(() => rentals.reduce((sum, r) => {
    const p = calcRentalPrice(r.startDate, r.endDate, r.priceDay, r.priceWeek, r.priceMonth)
    return sum + (p?.total ?? 0)
  }, 0), [rentals])

  const depositTotal    = useMemo(() => rentals.reduce((s, r) => s + r.depositAmount, 0), [rentals])
  const accessoryTotal  = useMemo(() => accessories.reduce((s, a) => s + a.price * a.quantity, 0), [accessories])
  const grandTotal      = rentalTotal + depositTotal + accessoryTotal

  // ── Checkout ─────────────────────────────────────────────────────────────────
  async function handleCheckout() {
    setError(null)
    setLoading(true)
    const result = await checkoutCart({ rentals, accessories })
    setLoading(false)

    if (!result.success) {
      if (result.error.includes('logge inn')) {
        // Redirect to login with cart redirect
        router.push('/login?redirect=/cart')
        return
      }
      setError(result.error)
      return
    }

    setBookingIds(result.bookingIds)
    setSuccess(true)
    clearCart()
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <main className="min-h-screen bg-[var(--color-background)]">
        <Header />
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EBF0E7] flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">Bestilling mottatt!</h1>
          <p className="text-[var(--color-muted)] mb-8 leading-relaxed">
            Vi har mottatt din forespørsel og kontakter deg innen 24 timer for å bekrefte og avklare detaljer.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/account" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-full)] bg-[#4A6741] text-white font-semibold hover:opacity-90 transition-opacity">
              Se mine bestillinger →
            </Link>
            <Link href="/bergen" className="text-sm text-[var(--color-muted)] hover:underline">
              Fortsett å handle
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (!rentals.length) {
    return (
      <main className="min-h-screen bg-[var(--color-background)]">
        <Header />
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="text-5xl mb-6">🛍️</div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">Handlevognen er tom</h1>
          <p className="text-[var(--color-muted)] mb-8">Legg til produkter for å komme i gang.</p>
          <Link
            href="/bergen"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-full)] bg-[var(--color-foreground)] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Se utstyr i Bergen →
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  // ── Cart ────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-8 tracking-tight">
          Handlevogn
        </h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* ── LEFT: Items ───────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Rental items */}
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
              <div className="px-6 py-4 border-b border-black/[0.04]">
                <h2 className="text-sm font-bold text-[var(--color-foreground)]">
                  Leieprodukt{rentals.length !== 1 ? 'er' : ''} ({rentals.length})
                </h2>
              </div>

              <div className="divide-y divide-black/[0.04]">
                {rentals.map(rental => {
                  const price = calcRentalPrice(rental.startDate, rental.endDate, rental.priceDay, rental.priceWeek, rental.priceMonth)
                  const minEnd = toStr(addDays(new Date(rental.startDate), Math.max(rental.minimumRentalDays, 1)))

                  return (
                    <div key={rental.cartId} className="p-5 flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F0EAE0] shrink-0">
                        {rental.imageUrl ? (
                          <img src={rental.imageUrl} alt={rental.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-foreground)] leading-snug">
                              {rental.productName}
                            </p>
                            <p className="text-xs text-[var(--color-muted)] mt-0.5">{rental.locationName}</p>
                          </div>
                          <button
                            onClick={() => removeRental(rental.cartId)}
                            className="text-xs text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                            aria-label="Fjern"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Date pickers inline */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 bg-[var(--color-background)] rounded-lg px-3 py-1.5">
                            <span className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wide">Fra</span>
                            <input
                              type="date"
                              value={rental.startDate}
                              min={today}
                              onChange={e => {
                                const newStart = e.target.value
                                const newMin = toStr(addDays(new Date(newStart), Math.max(rental.minimumRentalDays, 1)))
                                updateDates(rental.cartId, newStart, rental.endDate < newMin ? newMin : rental.endDate)
                              }}
                              className="text-xs font-semibold text-[var(--color-foreground)] bg-transparent outline-none cursor-pointer"
                            />
                          </div>
                          <span className="text-[var(--color-muted)] text-xs">→</span>
                          <div className="flex items-center gap-1.5 bg-[var(--color-background)] rounded-lg px-3 py-1.5">
                            <span className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wide">Til</span>
                            <input
                              type="date"
                              value={rental.endDate}
                              min={minEnd}
                              onChange={e => updateDates(rental.cartId, rental.startDate, e.target.value)}
                              className="text-xs font-semibold text-[var(--color-foreground)] bg-transparent outline-none cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[var(--color-foreground)]">
                          {price ? `${price.total} kr` : '—'}
                        </p>
                        {rental.depositAmount > 0 && (
                          <p className="text-[10px] text-[var(--color-muted)] mt-0.5">
                            +{rental.depositAmount} kr dep.
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Accessories add-ons */}
            <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
              <div className="px-6 py-4 border-b border-black/[0.04]">
                <h2 className="text-sm font-bold text-[var(--color-foreground)]">Legg til ekstra</h2>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">Praktisk tilbehør som gjør leien enda enklere</p>
              </div>
              <div className="divide-y divide-black/[0.04]">
                {ACCESSORIES.map(acc => {
                  const inCart = accessories.find(a => a.id === acc.id)
                  const qty = inCart?.quantity ?? 0

                  return (
                    <div key={acc.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-foreground)]">{acc.name}</p>
                        <p className="text-xs text-[var(--color-muted)]">{acc.description}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-medium text-[var(--color-foreground)]">{acc.price} kr</span>
                        {qty === 0 ? (
                          <button
                            onClick={() => setAccessoryQty(acc.id, acc.name, acc.price, 1)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741] hover:text-white transition-colors"
                          >
                            + Legg til
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setAccessoryQty(acc.id, acc.name, acc.price, qty - 1)}
                              className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                            >
                              −
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{qty}</span>
                            <button
                              onClick={() => setAccessoryQty(acc.id, acc.name, acc.price, qty + 1)}
                              className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Continue shopping */}
            <Link href="/bergen" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
              ← Fortsett å handle
            </Link>
          </div>

          {/* ── RIGHT: Summary ────────────────────────────────────────────── */}
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
              <h2 className="text-sm font-bold text-[var(--color-foreground)] mb-5">Oppsummering</h2>

              <div className="space-y-3 text-sm mb-5">
                {rentals.map(r => {
                  const p = calcRentalPrice(r.startDate, r.endDate, r.priceDay, r.priceWeek, r.priceMonth)
                  return (
                    <div key={r.cartId} className="flex items-start justify-between gap-2">
                      <div className="text-[var(--color-muted)] min-w-0">
                        <p className="font-medium text-[var(--color-foreground)] truncate">{r.productName}</p>
                        <p className="text-xs">{fmt(r.startDate)} – {fmt(r.endDate)}</p>
                      </div>
                      <span className="font-semibold shrink-0">{p ? `${p.total} kr` : '—'}</span>
                    </div>
                  )
                })}

                {accessories.map(a => (
                  <div key={a.id} className="flex items-center justify-between gap-2">
                    <span className="text-[var(--color-muted)]">{a.name} ×{a.quantity}</span>
                    <span className="font-semibold">{a.price * a.quantity} kr</span>
                  </div>
                ))}

                {depositTotal > 0 && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[var(--color-muted)]">Depositum (refunderes)</span>
                    <span className="font-semibold">{depositTotal} kr</span>
                  </div>
                )}
              </div>

              <div className="border-t border-black/[0.06] pt-4 flex items-center justify-between mb-6">
                <span className="font-bold text-[var(--color-foreground)]">Totalt</span>
                <span className="text-xl font-bold text-[var(--color-foreground)]">{grandTotal} kr</span>
              </div>

              {error && (
                <p className="text-sm text-red-500 mb-4 bg-red-50 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading || !rentals.length}
                className="w-full py-4 rounded-[var(--radius-lg)] bg-[#4A6741] text-white text-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Sender...
                  </span>
                ) : (
                  'Send leieforespørsel'
                )}
              </button>

              <p className="text-xs text-center text-[var(--color-muted-foreground)] mt-3">
                Ingen betaling nå — vi kontakter deg innen 24 timer
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
