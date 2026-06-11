'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart, calcRentalPrice } from '@/context/cart-context'
import { checkoutCart, type DeliveryOption, type PaymentMethod } from '@/app/actions/checkout'
import { useLocale } from '@/context/locale-context'

// ─── Accessories catalogue ────────────────────────────────────────────────────

const ACCESSORIES = [
  { id: 'soap',    name: 'Sitronsåpe',    description: 'Naturlig rengjøring av babyutstyr',   price: 79  },
  { id: 'sheet',   name: 'Laken',         description: 'Rent laken til barneseng eller vogn', price: 99  },
  { id: 'bedding', name: 'Sengetøy-sett', description: 'Dyne + pute tilpasset barneseng',     price: 199 },
  { id: 'liner',   name: 'Vogninnlegg',   description: 'Mykt, vaskbart innlegg til vogn',     price: 149 },
]

// ─── Date helpers ─────────────────────────────────────────────────────────────

function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}
function toStr(d: Date) { return d.toISOString().split('T')[0] }

// ─── Component ────────────────────────────────────────────────────────────────

export function CartContent() {
  const router = useRouter()
  const { t, locale } = useLocale()
  const { rentals, accessories, removeRental, updateDates, setAccessoryQty, clearCart } = useCart()

  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [success,      setSuccess]      = useState(false)
  const [bookingIds,   setBookingIds]   = useState<string[]>([])

  // Delivery state
  const [deliveryType,    setDeliveryType]    = useState<DeliveryOption['type']>('pickup')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [flightNumber,    setFlightNumber]    = useState('')
  const [hotelName,       setHotelName]       = useState('')

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vipps')

  const today = toStr(new Date())
  const dateLocale = locale === 'en' ? 'en-GB' : 'nb-NO'

  function fmt(d: string) {
    return new Date(d).toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' })
  }

  // Delivery options built from translations
  const DELIVERY_OPTIONS: {
    id:          DeliveryOption['type']
    name:        string
    description: string
    extra:       'address' | 'flight' | 'hotel' | null
  }[] = [
    { id: 'pickup',  name: t.cart.delivery.pickup.name,   description: t.cart.delivery.pickup.desc,   extra: null      },
    { id: 'home',    name: t.cart.delivery.home.name,     description: t.cart.delivery.home.desc,     extra: 'address' },
    { id: 'hotel',   name: t.cart.delivery.hotel.name,    description: t.cart.delivery.hotel.desc,    extra: 'hotel'   },
    { id: 'airport', name: t.cart.delivery.airport.name,  description: t.cart.delivery.airport.desc,  extra: 'flight'  },
    { id: 'train',   name: t.cart.delivery.train.name,    description: t.cart.delivery.train.desc,    extra: null      },
  ]

  // ── Totals ──────────────────────────────────────────────────────────────────
  const rentalTotal = useMemo(() => rentals.reduce((sum, r) => {
    const p = calcRentalPrice(r.startDate, r.endDate, r.priceDay, r.priceWeek, r.priceMonth)
    return sum + (p?.total ?? 0)
  }, 0), [rentals])

  const depositTotal   = useMemo(() => rentals.reduce((s, r) => s + r.depositAmount, 0), [rentals])
  const accessoryTotal = useMemo(() => accessories.reduce((s, a) => s + a.price * a.quantity, 0), [accessories])
  const grandTotal     = rentalTotal + depositTotal + accessoryTotal

  // ── Checkout ─────────────────────────────────────────────────────────────────
  async function handleCheckout() {
    setError(null)

    if (deliveryType === 'home' && !deliveryAddress.trim()) {
      setError(t.cart.errorAddress); return
    }
    if (deliveryType === 'airport' && !flightNumber.trim()) {
      setError(t.cart.errorFlight); return
    }
    if (deliveryType === 'hotel' && !hotelName.trim()) {
      setError(t.cart.errorHotelName); return
    }
    if (deliveryType === 'hotel' && !deliveryAddress.trim()) {
      setError(t.cart.errorHotelAddress); return
    }

    setLoading(true)
    const result = await checkoutCart({
      rentals,
      accessories,
      paymentMethod,
      delivery: {
        type:         deliveryType,
        address:      deliveryAddress.trim() || undefined,
        flightNumber: flightNumber.trim()    || undefined,
        hotelName:    hotelName.trim()       || undefined,
      },
    })
    setLoading(false)

    if (!result.success) {
      if (result.error.includes('logge inn')) {
        router.push('/login?redirect=/cart')
        return
      }
      setError(result.error)
      return
    }

    clearCart()

    // Vipps: redirect to Vipps landing page
    if (result.vippsUrl) {
      window.location.href = result.vippsUrl
      return
    }

    // Pay-at-pickup: show success screen
    setBookingIds(result.bookingIds)
    setSuccess(true)
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EBF0E7] flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">{t.cart.successTitle}</h1>
        <p className="text-[var(--color-muted)] mb-8 leading-relaxed">
          {t.cart.successDesc}
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/account" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-full)] bg-[#4A6741] text-white font-semibold hover:opacity-90 transition-opacity">
            {t.cart.myBookings}
          </Link>
          <Link href="/bergen" className="text-sm text-[var(--color-muted)] hover:underline">
            {t.cart.keepShopping}
          </Link>
        </div>
      </div>
    )
  }

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (!rentals.length) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="text-5xl mb-6">🛍️</div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">{t.cart.empty}</h1>
        <p className="text-[var(--color-muted)] mb-8">{t.cart.emptyDesc}</p>
        <Link
          href="/bergen"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-full)] bg-[var(--color-foreground)] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {t.cart.browseEquipment} →
        </Link>
      </div>
    )
  }

  const freeLabel  = locale === 'en' ? 'Free'   : 'Gratis'
  const agreeLabel = locale === 'en' ? 'Agreed' : 'Avtales'

  // ── Cart ────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-8 tracking-tight">
        {t.cart.title}
      </h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

        {/* ── LEFT: Items ───────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Rental items */}
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.04]">
              <h2 className="text-sm font-bold text-[var(--color-foreground)]">
                {t.cart.rentals(rentals.length)}
              </h2>
            </div>

            <div className="divide-y divide-black/[0.04]">
              {rentals.map(rental => {
                const price  = calcRentalPrice(rental.startDate, rental.endDate, rental.priceDay, rental.priceWeek, rental.priceMonth)
                const minEnd = toStr(addDays(new Date(rental.startDate), Math.max(rental.minimumRentalDays, 1)))

                return (
                  <div key={rental.cartId} className="p-5 flex gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F0EAE0] shrink-0">
                      {rental.imageUrl ? (
                        <Image src={rental.imageUrl} alt={rental.productName} fill className="object-cover" sizes="80px" />
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
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Date pickers inline */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-[var(--color-background)] rounded-lg px-3 py-1.5">
                          <span className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wide">{t.cart.dateFrom}</span>
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
                          <span className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wide">{t.cart.dateTo}</span>
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
              <h2 className="text-sm font-bold text-[var(--color-foreground)]">{t.cart.extrasTitle}</h2>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">{t.cart.extrasSubtitle}</p>
            </div>
            <div className="divide-y divide-black/[0.04]">
              {ACCESSORIES.map(acc => {
                const inCart = accessories.find(a => a.id === acc.id)
                const qty    = inCart?.quantity ?? 0

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
                          {t.cart.addItem}
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

          {/* Delivery options */}
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.04]">
              <h2 className="text-sm font-bold text-[var(--color-foreground)]">{t.cart.deliveryTitle}</h2>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">{t.cart.deliverySubtitle}</p>
            </div>
            <div className="divide-y divide-black/[0.04]">
              {DELIVERY_OPTIONS.map(opt => {
                const isSelected = deliveryType === opt.id
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 px-6 py-4 cursor-pointer transition-colors ${isSelected ? 'bg-[#F5F8F4]' : 'hover:bg-gray-50'}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div
                        onClick={() => setDeliveryType(opt.id)}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-[#4A6741]' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#4A6741]" />}
                      </div>
                    </div>
                    <div className="flex-1" onClick={() => setDeliveryType(opt.id)}>
                      <p className="text-sm font-semibold text-[var(--color-foreground)]">{opt.name}</p>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">{opt.description}</p>

                      {isSelected && opt.extra === 'address' && (
                        <input
                          type="text"
                          placeholder={t.cart.addressPlaceholder}
                          value={deliveryAddress}
                          onChange={e => setDeliveryAddress(e.target.value)}
                          onClick={e => e.stopPropagation()}
                          className="mt-2 w-full text-sm border border-black/10 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                        />
                      )}

                      {isSelected && opt.extra === 'hotel' && (
                        <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            placeholder={t.cart.hotelNamePlaceholder}
                            value={hotelName}
                            onChange={e => setHotelName(e.target.value)}
                            className="w-full text-sm border border-black/10 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                          />
                          <input
                            type="text"
                            placeholder={t.cart.hotelAddressPlaceholder}
                            value={deliveryAddress}
                            onChange={e => setDeliveryAddress(e.target.value)}
                            className="w-full text-sm border border-black/10 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                          />
                        </div>
                      )}

                      {isSelected && opt.extra === 'flight' && (
                        <input
                          type="text"
                          placeholder={t.cart.flightPlaceholder}
                          value={flightNumber}
                          onChange={e => setFlightNumber(e.target.value)}
                          onClick={e => e.stopPropagation()}
                          className="mt-2 w-full text-sm border border-black/10 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                        />
                      )}
                    </div>
                    <span className="text-xs text-[var(--color-muted)] shrink-0 mt-0.5">
                      {opt.id === 'pickup' ? freeLabel : agreeLabel}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.04]">
              <h2 className="text-sm font-bold text-[var(--color-foreground)]">{t.cart.paymentTitle}</h2>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">{t.cart.paymentSubtitle}</p>
            </div>
            <div className="divide-y divide-black/[0.04]">

              {/* Vipps */}
              <label
                className={`flex items-start gap-3 px-6 py-4 cursor-pointer transition-colors ${paymentMethod === 'vipps' ? 'bg-[#F5F8F4]' : 'hover:bg-gray-50'}`}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    onClick={() => setPaymentMethod('vipps')}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'vipps' ? 'border-[#4A6741]' : 'border-gray-300'}`}
                  >
                    {paymentMethod === 'vipps' && <div className="w-2 h-2 rounded-full bg-[#4A6741]" />}
                  </div>
                </div>
                <div className="flex-1" onClick={() => setPaymentMethod('vipps')}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">
                      {t.cart.payment.vipps.name}
                    </p>
                    {/* Vipps brand colour pill */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF5B24] text-white leading-none">
                      VIPPS
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">
                    {t.cart.payment.vipps.desc}
                  </p>
                </div>
              </label>

              {/* Pay at pickup */}
              <label
                className={`flex items-start gap-3 px-6 py-4 cursor-pointer transition-colors ${paymentMethod === 'pay_at_pickup' ? 'bg-[#F5F8F4]' : 'hover:bg-gray-50'}`}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    onClick={() => setPaymentMethod('pay_at_pickup')}
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'pay_at_pickup' ? 'border-[#4A6741]' : 'border-gray-300'}`}
                  >
                    {paymentMethod === 'pay_at_pickup' && <div className="w-2 h-2 rounded-full bg-[#4A6741]" />}
                  </div>
                </div>
                <div className="flex-1" onClick={() => setPaymentMethod('pay_at_pickup')}>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">
                    {t.cart.payment.pay_at_pickup.name}
                  </p>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">
                    {t.cart.payment.pay_at_pickup.desc}
                  </p>
                </div>
              </label>

            </div>
          </div>

          {/* Continue shopping */}
          <Link href="/bergen" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
            {t.cart.continueShopping}
          </Link>
        </div>

        {/* ── RIGHT: Summary ────────────────────────────────────────────── */}
        <div className="sticky top-24">
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <h2 className="text-sm font-bold text-[var(--color-foreground)] mb-5">{t.cart.summaryTitle}</h2>

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
                  <span className="text-[var(--color-muted)]">{t.cart.depositRow}</span>
                  <span className="font-semibold">{depositTotal} kr</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[var(--color-muted)]">
                  {DELIVERY_OPTIONS.find(o => o.id === deliveryType)?.name ?? t.cart.deliveryTitle}
                </span>
                <span className="font-semibold text-[#4A6741]">
                  {deliveryType === 'pickup' ? freeLabel : agreeLabel}
                </span>
              </div>
            </div>

            <div className="border-t border-black/[0.06] pt-4 flex items-center justify-between mb-6">
              <span className="font-bold text-[var(--color-foreground)]">{t.cart.total}</span>
              <span className="text-xl font-bold text-[var(--color-foreground)]">{grandTotal} kr</span>
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-4 bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading || !rentals.length}
              className={`w-full py-4 rounded-[var(--radius-lg)] text-white text-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 ${
                paymentMethod === 'vipps' ? 'bg-[#FF5B24]' : 'bg-[#4A6741]'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  {t.cart.ordering}
                </span>
              ) : paymentMethod === 'vipps' ? (
                t.cart.orderNowVipps
              ) : (
                t.cart.orderNow
              )}
            </button>

            <p className="text-xs text-center text-[var(--color-muted-foreground)] mt-3">
              {paymentMethod === 'vipps' ? t.cart.noteVipps : t.cart.note}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
