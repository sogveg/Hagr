import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { sendBookingReminder } from '@/lib/emails/send'

// Vercel Cron: runs daily at 08:00 Oslo time (06:00 UTC)
// vercel.json: { "crons": [{ "path": "/api/cron/reminders", "schedule": "0 6 * * *" }] }

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const { data: bookings } = await (supabase as any)
    .from('bookings')
    .select(`
      id, start_date,
      booking_items ( products ( name ) ),
      customers ( first_name, last_name, email )
    `)
    .eq('start_date', tomorrowStr)
    .in('status', ['confirmed', 'prepared'])
    .limit(50)

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0
  for (const booking of bookings) {
    const customer = booking.customers as { first_name?: string; last_name?: string; email: string } | null
    if (!customer?.email) continue

    const productNames: string[] = (booking.booking_items ?? [])
      .map((i: any) => i.products?.name)
      .filter(Boolean)

    const customerName =
      `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() || customer.email

    try {
      await sendBookingReminder({
        to:          customer.email,
        customerName,
        bookingId:   booking.id,
        productName: productNames.join(', ') || 'babyutstyret',
        startDate:   booking.start_date,
      })
      sent++
    } catch (e) {
      console.error('[cron/reminders] failed for booking', booking.id, e)
    }
  }

  return NextResponse.json({ sent })
}
