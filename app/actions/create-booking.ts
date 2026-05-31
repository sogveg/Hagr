'use server'

import { createClient, createServiceClient } from '@/lib/supabase-server'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'
import { AdminNewBookingEmail } from '@/lib/emails/admin-new-booking'
import React from 'react'

export type CreateBookingInput = {
  productId: string
  locationId: string
  startDate: string   // YYYY-MM-DD
  endDate: string     // YYYY-MM-DD
  priceDay:   number | null
  priceWeek:  number | null
  priceMonth: number | null
  depositAmount: number
}

export type CreateBookingResult =
  | { success: true;  bookingId: string }
  | { success: false; error: string }

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  // Auth check with user client
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { success: false, error: 'Ikke innlogget' }

  // All DB operations use service client to bypass RLS
  const supabase = createServiceClient()

  // Finn kundeprofil — opprett hvis mangler (første booking etter sosial innlogging e.l.)
  let { data: customer } = await supabase
    .from('customers')
    .select('id, first_name, last_name, email, phone')
    .eq('user_id', user.id)
    .single()

  if (!customer) {
    // Auto-opprett kundeprofil fra auth-data
    const { data: newCustomer, error: createErr } = await supabase
      .from('customers')
      .upsert({
        user_id:    user.id,
        email:      user.email!,
        first_name: user.user_metadata?.first_name ?? null,
        last_name:  user.user_metadata?.last_name  ?? null,
      }, { onConflict: 'user_id' })
      .select('id, first_name, last_name, email, phone')
      .single()
    if (createErr || !newCustomer) {
      return { success: false, error: 'Kunne ikke opprette kundeprofil. Prøv å gå til «Min side» og lagre profilen din.' }
    }
    customer = newCustomer
  }

  // Beregn antall dager
  const start = new Date(input.startDate)
  const end   = new Date(input.endDate)
  const days  = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  if (days <= 0) return { success: false, error: 'Sluttdato må være etter startdato' }

  // Velg billigste prismodell
  const dayTotal   = input.priceDay   != null ? input.priceDay   * days                 : Infinity
  const weekTotal  = input.priceWeek  != null ? input.priceWeek  * Math.ceil(days / 7)  : Infinity
  const monthTotal = input.priceMonth != null ? input.priceMonth * Math.ceil(days / 30) : Infinity
  const minTotal   = Math.min(dayTotal, weekTotal, monthTotal)

  if (!isFinite(minTotal)) return { success: false, error: 'Ingen pris er satt for dette produktet' }

  let rentalAmount: number
  let priceType:    string
  let unitPrice:    number

  if (minTotal === dayTotal) {
    rentalAmount = dayTotal;   priceType = 'day';   unitPrice = input.priceDay!
  } else if (minTotal === weekTotal) {
    rentalAmount = weekTotal;  priceType = 'week';  unitPrice = input.priceWeek!
  } else {
    rentalAmount = monthTotal; priceType = 'month'; unitPrice = input.priceMonth!
  }

  const totalAmount = rentalAmount + input.depositAmount

  // Opprett booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      customer_id:    customer.id,
      location_id:    input.locationId,
      status:         'draft',
      start_date:     input.startDate,
      end_date:       input.endDate,
      rental_amount:  rentalAmount,
      deposit_amount: input.depositAmount,
      total_amount:   totalAmount,
      currency:       'NOK',
    })
    .select('id')
    .single()

  if (bookingError || !booking) {
    console.error('Booking error:', bookingError)
    return { success: false, error: 'Kunne ikke opprette forespørsel. Prøv igjen.' }
  }

  // Opprett booking-linje
  const { error: itemError } = await supabase.from('booking_items').insert({
    booking_id:  booking.id,
    product_id:  input.productId,
    quantity:    1,
    unit_price:  unitPrice,
    price_type:  priceType,
  })

  if (itemError) {
    console.error('booking_items error:', itemError)
    // Slett bookingen slik at det ikke blir en zombie-rad
    await supabase.from('bookings').delete().eq('id', booking.id)
    return { success: false, error: 'Kunne ikke registrere produktet på bookingen. Prøv igjen.' }
  }

  // Hent produktnavn for e-post
  const { data: product } = await supabase
    .from('products')
    .select('name')
    .eq('id', input.productId)
    .single()

  // Send e-postvarsling til admin (brannmur: feil her stopper ikke bookingen)
  try {
    const adminEmail = ADMIN_EMAIL()
    const fmt = (d: string) => new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })
    await sendEmail({
      to:      adminEmail,
      subject: `Ny booking fra ${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim(),
      react:   React.createElement(AdminNewBookingEmail, {
        bookingId:     booking.id,
        customerName:  `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() || customer.email,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        productNames:  product ? [product.name] : ['Ukjent produkt'],
        startDate:     fmt(input.startDate),
        endDate:       fmt(input.endDate),
        totalAmount,
        depositAmount: input.depositAmount,
        adminUrl:      `https://www.tinyrent.no/admin/bookings/${booking.id}`,
      }),
    })
  } catch (emailErr) {
    console.error('[createBooking] Admin email failed:', emailErr)
  }

  return { success: true, bookingId: booking.id }
}
