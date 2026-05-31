'use server'

import { createClient, createServiceClient } from '@/lib/supabase-server'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'
import { AdminNewBookingEmail } from '@/lib/emails/admin-new-booking'
import React from 'react'
import type { CartRental, CartAccessory } from '@/context/cart-context'

export type CheckoutInput = {
  rentals:     CartRental[]
  accessories: CartAccessory[]
}

export type CheckoutResult =
  | { success: true;  bookingIds: string[] }
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
    .single()

  if (!customer) {
    const { data: created } = await supabase
      .from('customers')
      .upsert({
        user_id:    user.id,
        email:      user.email!,
        first_name: user.user_metadata?.first_name ?? null,
        last_name:  user.user_metadata?.last_name  ?? null,
      }, { onConflict: 'user_id' })
      .select('id, first_name, last_name, email, phone')
      .single()

    if (!created) return { success: false, error: 'Kunne ikke opprette kundeprofil. Gå til «Min side» og lagre profilen.' }
    customer = created
  }

  // ── Tilbehør som notat ─────────────────────────────────────────────────
  const accessoryNote = input.accessories.length > 0
    ? 'Ønsket tilbehør: ' + input.accessories.map(a => `${a.name} ×${a.quantity}`).join(', ')
    : null

  const accessoryTotal = input.accessories.reduce((s, a) => s + a.price * a.quantity, 0)

  // ── Opprett én booking per leieprodukt ───────────────────────────────────
  const bookingIds: string[] = []

  for (const rental of input.rentals) {
    const start = new Date(rental.startDate)
    const end   = new Date(rental.endDate)
    const days  = Math.ceil((end.getTime() - start.getTime()) / 86_400_000)

    if (days <= 0) continue

    const priceInfo = bestPrice(days, rental.priceDay, rental.priceWeek, rental.priceMonth)
    if (!priceInfo) continue

    // Fordel tilbehøret på første booking
    const isFirst = bookingIds.length === 0
    const thisAccessoryTotal = isFirst ? accessoryTotal : 0

    const rentalAmount = priceInfo.amount + thisAccessoryTotal
    const totalAmount  = rentalAmount + rental.depositAmount

    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .insert({
        customer_id:    customer.id,
        location_id:    rental.locationId,
        status:         'draft',
        start_date:     rental.startDate,
        end_date:       rental.endDate,
        rental_amount:  rentalAmount,
        deposit_amount: rental.depositAmount,
        total_amount:   totalAmount,
        currency:       'NOK',
        ...(isFirst && accessoryNote ? { notes: accessoryNote } : {}),
      })
      .select('id')
      .single()

    if (bookingErr || !booking) {
      console.error('Booking insert failed:', bookingErr)
      continue
    }

    const { error: itemErr } = await supabase.from('booking_items').insert({
      booking_id:  booking.id,
      product_id:  rental.productId,
      quantity:    1,
      unit_price:  priceInfo.unitPrice,
      price_type:  priceInfo.type,
    })

    if (itemErr) {
      console.error('booking_items insert failed:', itemErr)
      await supabase.from('bookings').delete().eq('id', booking.id)
      continue
    }

    bookingIds.push(booking.id)
  }

  if (!bookingIds.length) {
    return { success: false, error: 'Ingen bookinger kunne opprettes. Prøv igjen.' }
  }

  // ── E-postvarsling til admin ──────────────────────────────────────────────
  try {
    const productNames = input.rentals.map(r => r.productName)
    const allNames = input.accessories.length > 0
      ? [...productNames, ...input.accessories.map(a => `${a.name} ×${a.quantity}`)]
      : productNames

    const fmt = (d: string) => new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })
    const firstRental = input.rentals[0]
    const totalAll = input.rentals.reduce((s, r) => {
      const days = Math.ceil((new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 86_400_000)
      return s + (bestPrice(days, r.priceDay, r.priceWeek, r.priceMonth)?.amount ?? 0) + r.depositAmount
    }, 0) + accessoryTotal

    await sendEmail({
      to:      ADMIN_EMAIL(),
      subject: `Ny bestilling fra ${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim(),
      react:   React.createElement(AdminNewBookingEmail, {
        bookingId:     bookingIds[0],
        customerName:  `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() || customer.email,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        productNames:  allNames,
        startDate:     fmt(firstRental.startDate),
        endDate:       fmt(firstRental.endDate),
        totalAmount:   totalAll,
        depositAmount: input.rentals.reduce((s, r) => s + r.depositAmount, 0),
        adminUrl:      `https://www.tinyrent.no/admin/bookings/${bookingIds[0]}`,
      }),
    })
  } catch (e) {
    console.error('[checkoutCart] Email failed:', e)
  }

  return { success: true, bookingIds }
}
