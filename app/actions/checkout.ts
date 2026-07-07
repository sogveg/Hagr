'use server'

import { createClient, createServiceClient } from '@/lib/supabase-server'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'
import { AdminNewBookingEmail } from '@/lib/emails/admin-new-booking'
import { initiateVippsPayment } from '@/lib/vipps'
import React from 'react'
import type { CartRental, CartAccessory } from '@/context/cart-context'

export type DeliveryOption = {
  type:          'pickup' | 'home' | 'airport' | 'train' | 'hotel'
  address?:      string
  flightNumber?: string
  hotelName?:    string
}

export type PaymentMethod = 'vipps' | 'pay_at_pickup'

export type CheckoutInput = {
  rentals:       CartRental[]
  accessories:   CartAccessory[]
  delivery:      DeliveryOption
  paymentMethod: PaymentMethod
}

export type CheckoutResult =
  | { success: true;  bookingId: string; vippsUrl?: string }
  | { success: false; error: string }

function bestPrice(
  days: number,
  priceDay:   number | null,
  priceWeek:  number | null,
  priceMonth: number | null,
): { amount: number; type: string; unitPrice: number } | null {
  const opts = [
    priceDay   != null ? { amount: priceDay   * days,                 type: 'day',   unitPrice: priceDay }   : null,
    priceWeek  != null ? { amount: priceWeek  * Math.ceil(days / 7),  type: 'week',  unitPrice: priceWeek }  : null,
    priceMonth != null ? { amount: priceMonth * Math.ceil(days / 30), type: 'month', unitPrice: priceMonth } : null,
  ].filter(Boolean) as { amount: number; type: string; unitPrice: number }[]

  if (!opts.length) return null
  return opts.reduce((best, curr) => curr.amount < best.amount ? curr : best)
}

export async function checkoutCart(input: CheckoutInput): Promise<CheckoutResult> {
  if (!input.rentals.length) {
    return { success: false, error: 'Handlevognen er tom' }
  }

  // ── Auth ─────────────────────────────────────────────────────────────────
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { success: false, error: 'Du må logge inn for å fullføre bestillingen' }

  const supabase = createServiceClient()

  // ── Hent eller opprett kundeprofil ─────────────────────────────────────
  let { data: customer } = await supabase
    .from('customers')
    .select('id, first_name, last_name, email, phone')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!customer) {
    const { data: created, error: insertErr } = await supabase
      .from('customers')
      .insert({
        user_id:    user.id,
        email:      user.email!,
        first_name: user.user_metadata?.first_name ?? null,
        last_name:  user.user_metadata?.last_name  ?? null,
      })
      .select('id, first_name, last_name, email, phone')
      .maybeSingle()

    if (insertErr || !created) {
      console.error('[checkoutCart] customer insert failed:', insertErr)
      return { success: false, error: 'Kunne ikke opprette kundeprofil. Gå til «Min side» og lagre profilen.' }
    }
    customer = created
  }

  // ── Beregn per-produkt priser ──────────────────────────────────────────
  type LineItem = {
    rental:        CartRental
    days:          number
    priceInfo:     { amount: number; type: string; unitPrice: number }
    rentalAmount:  number
    depositAmount: number
  }

  const lineItems: LineItem[] = []
  for (const rental of input.rentals) {
    const days = Math.ceil(
      (new Date(rental.endDate).getTime() - new Date(rental.startDate).getTime()) / 86_400_000
    )
    if (days <= 0) continue
    const priceInfo = bestPrice(days, rental.priceDay, rental.priceWeek, rental.priceMonth)
    if (!priceInfo) continue
    lineItems.push({ rental, days, priceInfo, rentalAmount: priceInfo.amount, depositAmount: rental.depositAmount })
  }

  if (!lineItems.length) {
    return { success: false, error: 'Ingen gyldige leieperioder. Prøv igjen.' }
  }

  const accessoryTotal   = input.accessories.reduce((s, a) => s + a.price * a.quantity, 0)
  const totalRentalAmt   = lineItems.reduce((s, l) => s + l.rentalAmount, 0) + accessoryTotal
  const totalDepositAmt  = lineItems.reduce((s, l) => s + l.depositAmount, 0)
  const totalAmount      = totalRentalAmt + totalDepositAmt

  // Booking-level period: min start → max end
  const allStarts = lineItems.map(l => l.rental.startDate).sort()
  const allEnds   = lineItems.map(l => l.rental.endDate).sort()
  const bookingStart = allStarts[0]
  const bookingEnd   = allEnds[allEnds.length - 1]

  // ── Levering og tilbehør som notat ────────────────────────────────────
  const deliveryLabels: Record<string, string> = {
    pickup:  'Hent selv',
    home:    'Hjemlevering',
    airport: 'Levering flyplass',
    train:   'Levering togstasjon',
    hotel:   'Levering hotell',
  }
  const deliveryNote = (() => {
    const base = deliveryLabels[input.delivery.type] ?? input.delivery.type
    if (input.delivery.type === 'home' && input.delivery.address)
      return `${base}: ${input.delivery.address}`
    if (input.delivery.type === 'airport' && input.delivery.flightNumber)
      return `${base}, flight: ${input.delivery.flightNumber}`
    if (input.delivery.type === 'hotel') {
      const parts = [input.delivery.hotelName, input.delivery.address].filter(Boolean)
      return parts.length ? `${base}: ${parts.join(', ')}` : base
    }
    return base
  })()
  const accessoryNote = input.accessories.length > 0
    ? 'Ønsket tilbehør: ' + input.accessories.map(a => `${a.name} ×${a.quantity}`).join(', ')
    : null

  const isVipps = input.paymentMethod === 'vipps'

  // ── Opprett ÉN booking ────────────────────────────────────────────────
  const { data: booking, error: bookingErr } = await (supabase as any)
    .from('bookings')
    .insert({
      customer_id:    customer.id,
      location_id:    lineItems[0].rental.locationId,
      status:         isVipps ? 'pending_payment' : 'confirmed',
      start_date:     bookingStart,
      end_date:       bookingEnd,
      rental_amount:  totalRentalAmt,
      deposit_amount: totalDepositAmt,
      total_amount:   totalAmount,
      currency:       'NOK',
      payment_method: input.paymentMethod,
      notes:          [deliveryNote, accessoryNote].filter(Boolean).join(' | ') || null,
    })
    .select('id')
    .single()

  if (bookingErr || !booking) {
    console.error('[checkoutCart] booking insert failed:', bookingErr)
    return { success: false, error: 'Kunne ikke opprette bestilling. Prøv igjen.' }
  }

  const bookingId: string = booking.id

  // ── Opprett booking_items (ett per produkt) ────────────────────────────
  const itemInserts = lineItems.map(l => ({
    booking_id:     bookingId,
    product_id:     l.rental.productId,
    quantity:       1,
    unit_price:     l.priceInfo.unitPrice,
    price_type:     l.priceInfo.type,
    start_date:     l.rental.startDate,
    end_date:       l.rental.endDate,
    rental_amount:  l.rentalAmount,
    deposit_amount: l.depositAmount,
  }))

  const { error: itemErr } = await supabase.from('booking_items').insert(itemInserts as any)
  if (itemErr) {
    console.error('[checkoutCart] booking_items insert failed:', itemErr)
    await supabase.from('bookings').delete().eq('id', bookingId)
    return { success: false, error: 'Kunne ikke registrere produkter. Prøv igjen.' }
  }

  // ── Vipps payment path ────────────────────────────────────────────────
  if (isVipps) {
    const vippsOrderId = bookingId.replace(/-/g, '').slice(0, 30)

    await (supabase as any)
      .from('bookings')
      .update({ vipps_order_id: vippsOrderId })
      .eq('id', bookingId)

    const productNames = lineItems.map(l => l.rental.productName)
    const txText = `TinyRent: ${productNames.join(', ')}`.slice(0, 100)
    const SITE = 'https://www.tinyrent.no'

    try {
      const vippsUrl = await initiateVippsPayment({
        orderId:         vippsOrderId,
        amountNok:       totalAmount,
        redirectUrl:     `${SITE}/vipps/success?orderId=${vippsOrderId}`,
        callbackPrefix:  `${SITE}/api/vipps`,
        transactionText: txText,
        customerPhone:   customer.phone ?? undefined,
      })
      return { success: true, bookingId, vippsUrl }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error('[checkoutCart] Vipps init failed — orderId:', vippsOrderId, '— error:', msg)
      await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)
      return { success: false, error: 'Kunne ikke starte Vipps-betaling. Prøv igjen.' }
    }
  }

  // ── Pay-at-pickup: e-post til admin ───────────────────────────────────
  try {
    const fmt = (d: string) =>
      new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })

    const productNames = lineItems.map(l => l.rental.productName)
    const allNames = input.accessories.length > 0
      ? [...productNames, ...input.accessories.map(a => `${a.name} ×${a.quantity}`)]
      : productNames

    await sendEmail({
      to:      ADMIN_EMAIL(),
      subject: `Ny bestilling fra ${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim(),
      react:   React.createElement(AdminNewBookingEmail, {
        bookingId,
        customerName:  `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() || customer.email,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        productNames:  allNames,
        startDate:     fmt(bookingStart),
        endDate:       fmt(bookingEnd),
        totalAmount,
        depositAmount: totalDepositAmt,
        adminUrl:      `https://www.tinyrent.no/admin/bookings/${bookingId}`,
        paymentMethod: input.paymentMethod,
        deliveryNote,
      }),
    })
  } catch (e) {
    console.error('[checkoutCart] Email failed:', e)
  }

  return { success: true, bookingId }
}
