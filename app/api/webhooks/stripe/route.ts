import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Idempotens: avvis duplikat-events
  const { error: duplicateError } = await supabase
    .from('stripe_events')
    .insert({ id: event.id, type: event.type })

  if (duplicateError) {
    // Unique constraint brutt = allerede prosessert
    return NextResponse.json({ received: true })
  }

  // Webhook må alltid returnere 200 — fang feil internt
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.booking_id
        if (!bookingId) break

        await supabase
          .from('bookings')
          .update({ status: 'confirmed', stripe_checkout_session_id: session.id })
          .eq('id', bookingId)

        await supabase.from('payments').insert({
          booking_id: bookingId,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: (session.amount_total ?? 0) / 100,
          currency: session.currency?.toUpperCase() ?? 'NOK',
          status: 'succeeded',
          payment_type: 'rental',
        })

        await supabase.from('audit_logs').insert({
          entity_type: 'booking',
          entity_id: bookingId,
          action: 'payment_confirmed',
          metadata: { stripe_session_id: session.id },
        })

        // TODO: send bekreftelses-e-post via Resend
        break
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent
        const { data: payment } = await supabase
          .from('payments')
          .select('booking_id')
          .eq('stripe_payment_intent_id', intent.id)
          .single()

        if (payment?.booking_id) {
          await supabase
            .from('bookings')
            .update({ status: 'payment_failed' })
            .eq('id', payment.booking_id)
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const intentId = charge.payment_intent as string

        const refundedAmount = charge.amount_refunded / 100
        const isFullRefund = charge.refunded

        await supabase
          .from('deposits')
          .update({
            status: isFullRefund ? 'refunded' : 'partially_refunded',
            amount_refunded: refundedAmount,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', intentId)
        break
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err)
    // Returner 200 likevel — Stripe skal ikke re-sende
  }

  return NextResponse.json({ received: true })
}
