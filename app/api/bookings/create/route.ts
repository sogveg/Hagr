import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const { productId, locationId, startDate, endDate, customerId } = await req.json()

  const supabase = createServiceClient()

  // Opprett booking i status 'draft'
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      customer_id: customerId,
      location_id: locationId,
      status: 'draft',
      start_date: startDate,
      end_date: endDate,
      rental_amount: 0,
      deposit_amount: 0,
      total_amount: 0,
    })
    .select()
    .single()

  if (bookingError || !booking) {
    return NextResponse.json({ data: null, error: 'Kunne ikke opprette booking' }, { status: 500 })
  }

  // Reserver inventory_item atomisk via Postgres-funksjon
  // Dette bruker SELECT FOR UPDATE SKIP LOCKED — ingen race condition
  const { data: itemId, error: reserveError } = await supabase.rpc('reserve_inventory_item', {
    p_product_id: productId,
    p_location_id: locationId,
    p_start_date: startDate,
    p_end_date: endDate,
    p_booking_id: booking.id,
  })

  if (reserveError || !itemId) {
    // Rydd opp draft-booking hvis ingen enhet var ledig
    await supabase.from('bookings').delete().eq('id', booking.id)
    return NextResponse.json({ data: null, error: 'Produktet er ikke tilgjengelig i valgt periode' }, { status: 409 })
  }

  // Hent produktpris og beregn totalbeløp
  const { data: product } = await supabase
    .from('products')
    .select('price_day, deposit_amount, name')
    .eq('id', productId)
    .single()

  const days = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  const rentalAmount = (product?.price_day ?? 0) * days
  const depositAmount = product?.deposit_amount ?? 0
  const totalAmount = rentalAmount + depositAmount

  // Oppdater booking med riktige beløp og unit_price på booking_item
  await Promise.all([
    supabase
      .from('bookings')
      .update({
        status: 'pending_payment',
        rental_amount: rentalAmount,
        deposit_amount: depositAmount,
        total_amount: totalAmount,
      })
      .eq('id', booking.id),
    supabase
      .from('booking_items')
      .update({ unit_price: product?.price_day ?? 0, price_type: 'day' })
      .eq('booking_id', booking.id),
  ])

  // Opprett Stripe Checkout Session
  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'nok',
          unit_amount: Math.round(rentalAmount * 100), // øre
          product_data: { name: `Leie: ${product?.name ?? 'Produkt'}` },
        },
        quantity: 1,
      },
      ...(depositAmount > 0
        ? [{
            price_data: {
              currency: 'nok',
              unit_amount: Math.round(depositAmount * 100),
              product_data: { name: 'Depositum' },
            },
            quantity: 1,
          }]
        : []),
    ],
    metadata: { booking_id: booking.id },
    success_url: `${process.env.NEXT_PUBLIC_URL}/account/bookings/${booking.id}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout?cancelled=true`,
  })

  await supabase
    .from('bookings')
    .update({ stripe_checkout_session_id: session.id })
    .eq('id', booking.id)

  return NextResponse.json({ data: { checkoutUrl: session.url, bookingId: booking.id }, error: null })
}
