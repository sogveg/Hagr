/**
 * Vipps MobilePay eCom v2 callback handler
 *
 * Vipps POSTs to {callbackPrefix}/v2/payments/{orderId} when payment status changes.
 * callbackPrefix is set to https://www.tinyrent.no/api/vipps in checkout.ts.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { captureVippsPayment } from '@/lib/vipps'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'
import { AdminNewBookingEmail } from '@/lib/emails/admin-new-booking'
import React from 'react'

interface VippsCallbackBody {
  merchantSerialNumber: string
  orderId:              string
  transactionInfo: {
    amount:        number   // øre
    status:        string   // RESERVE | SALE | CANCEL | REJECTED
    transactionId: string
    timeStamp:     string
  }
  errorInfo?: {
    errorCode:    string
    errorMessage: string
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params

  let body: VippsCallbackBody
  try {
    body = await request.json()
  } catch {
    console.error('[vipps callback] invalid JSON for orderId', orderId)
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const status        = body.transactionInfo?.status
  const transactionId = body.transactionInfo?.transactionId ?? null

  console.log(`[vipps callback] orderId=${orderId} status=${status} txId=${transactionId}`)

  const supabase = createServiceClient()

  // ── Payment succeeded ──────────────────────────────────────────────────────
  if (status === 'RESERVE' || status === 'SALE') {
    // For RESERVE we must explicitly capture. For SALE (express checkout) it's already captured.
    if (status === 'RESERVE') {
      try {
        // Columns vipps_order_id / vipps_transaction_id added in migration 012 — cast to any
        const { data: bookings } = await (supabase as any)
          .from('bookings')
          .select('total_amount')
          .eq('vipps_order_id', orderId)

        const totalNok = ((bookings ?? []) as { total_amount: number | null }[]).reduce(
          (s, b) => s + (b.total_amount ?? 0),
          0,
        )

        if (totalNok > 0) {
          await captureVippsPayment({ orderId, amountNok: totalNok })
          console.log(`[vipps callback] captured ${totalNok} NOK for orderId=${orderId}`)
        }
      } catch (e) {
        console.error('[vipps callback] capture failed:', e)
        // Continue — we still want to mark as confirmed
      }
    }

    // Update all bookings in this order to confirmed
    const { error: updateErr } = await (supabase as any)
      .from('bookings')
      .update({
        status:                'confirmed',
        vipps_transaction_id:  transactionId,
      })
      .eq('vipps_order_id', orderId)
      .in('status', ['pending_payment', 'draft'])

    if (updateErr) {
      console.error('[vipps callback] booking update failed:', updateErr)
    }

    // Send admin notification
    try {
      const { data: bookings } = await (supabase as any)
        .from('bookings')
        .select(`
          id,
          total_amount,
          deposit_amount,
          start_date,
          end_date,
          booking_items ( unit_price, products ( name ) ),
          customers ( first_name, last_name, email, phone )
        `)
        .eq('vipps_order_id', orderId)
        .limit(10)

      if (bookings && (bookings as any[]).length > 0) {
        const first    = (bookings as any[])[0]
        const customer = first.customers as { first_name?: string; last_name?: string; email: string; phone?: string } | null

        const productNames: string[] = (bookings as any[]).flatMap((b: any) =>
          (b.booking_items ?? []).map((i: any) => i.products?.name).filter(Boolean),
        )

        const totalAll   = (bookings as any[]).reduce((s: number, b: any) => s + (b.total_amount   ?? 0), 0)
        const depositAll = (bookings as any[]).reduce((s: number, b: any) => s + (b.deposit_amount ?? 0), 0)

        const fmt = (d: string) =>
          new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })

        const customerName = `${customer?.first_name ?? ''} ${customer?.last_name ?? ''}`.trim()
          || (customer?.email ?? 'Ukjent')

        await sendEmail({
          to:      ADMIN_EMAIL(),
          subject: `Vipps bekreftet: ${customerName}`,
          react:   React.createElement(AdminNewBookingEmail, {
            bookingId:     first.id,
            customerName,
            customerEmail: customer?.email ?? '',
            customerPhone: customer?.phone ?? null,
            productNames:  productNames.length ? productNames : ['Ukjent produkt'],
            startDate:     fmt(first.start_date),
            endDate:       fmt(first.end_date),
            totalAmount:   totalAll,
            depositAmount: depositAll,
            adminUrl:      `https://www.tinyrent.no/admin/bookings/${first.id}`,
          }),
        })
      }
    } catch (e) {
      console.error('[vipps callback] admin email failed:', e)
    }
  }

  // ── Payment cancelled or rejected ──────────────────────────────────────────
  if (status === 'CANCEL' || status === 'REJECTED') {
    const { error: cancelErr } = await (supabase as any)
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('vipps_order_id', orderId)
      .in('status', ['pending_payment', 'draft'])

    if (cancelErr) {
      console.error('[vipps callback] cancel update failed:', cancelErr)
    }
    console.log(`[vipps callback] bookings cancelled for orderId=${orderId}`)
  }

  // Vipps expects 200 OK regardless
  return NextResponse.json({ ok: true })
}
