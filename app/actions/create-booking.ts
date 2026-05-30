'use server'

import { createClient } from '@/lib/supabase-server'

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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Ikke innlogget' }

  // Finn kundeprofil
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!customer) return { success: false, error: 'Kundeprofil ikke funnet. Prøv å logg inn på nytt.' }

  // Beregn antall dager
  const start = new Date(input.startDate)
  const end   = new Date(input.endDate)
  const days  = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  if (days <= 0) return { success: false, error: 'Sluttdato må være etter startdato' }

  // Velg billigste prismodell
  const dayTotal   = input.priceDay   != null ? input.priceDay   * days                      : Infinity
  const weekTotal  = input.priceWeek  != null ? input.priceWeek  * Math.ceil(days / 7)       : Infinity
  const monthTotal = input.priceMonth != null ? input.priceMonth * Math.ceil(days / 30)      : Infinity
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
  await supabase.from('booking_items').insert({
    booking_id:  booking.id,
    product_id:  input.productId,
    quantity:    1,
    unit_price:  unitPrice,
    price_type:  priceType,
  })

  return { success: true, bookingId: booking.id }
}
