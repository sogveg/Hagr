import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'

async function verifyAdmin() {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return false
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  if (adminEmails.length > 0 && !adminEmails.includes((user.email ?? '').toLowerCase())) return false
  return true
}

function toCSV(rows: string[][]): string {
  return rows
    .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n')
}

export async function GET(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const type = req.nextUrl.searchParams.get('type') ?? 'bookings'
  const supabase = createServiceClient()

  if (type === 'subscribers') {
    const { data } = await (supabase.from as any)('newsletter_subscribers')
      .select('email, name, active, created_at')
      .eq('active', true)
      .order('created_at', { ascending: false })

    const csv = toCSV([
      ['E-post', 'Navn', 'Registrert'],
      ...(data ?? []).map((s: any) => [
        s.email,
        s.name ?? '',
        new Date(s.created_at).toLocaleDateString('nb-NO'),
      ]),
    ])

    return new NextResponse(csv, {
      headers: {
        'Content-Type':        'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="abonnenter.csv"',
      },
    })
  }

  if (type === 'waitlist') {
    const { data: waitlist } = await (supabase.from as any)('waitlist')
      .select('email, name, message, notified, created_at, product_id, location_id')
      .order('created_at', { ascending: false })

    const productIds = [...new Set((waitlist ?? []).map((w: any) => w.product_id).filter(Boolean))]
    const { data: products } = productIds.length
      ? await supabase.from('products').select('id, name').in('id', productIds as string[])
      : { data: [] }
    const productMap = new Map((products ?? []).map(p => [p.id, p.name]))

    const csv = toCSV([
      ['E-post', 'Navn', 'Produkt', 'Melding', 'Varslet', 'Dato'],
      ...(waitlist ?? []).map((w: any) => [
        w.email,
        w.name ?? '',
        productMap.get(w.product_id) ?? '',
        w.message ?? '',
        w.notified ? 'Ja' : 'Nei',
        new Date(w.created_at).toLocaleDateString('nb-NO'),
      ]),
    ])

    return new NextResponse(csv, {
      headers: {
        'Content-Type':        'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="venteliste.csv"',
      },
    })
  }

  // Default: bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, status, start_date, end_date, total_amount, deposit_amount, created_at, customer_id')
    .order('created_at', { ascending: false })

  const customerIds = [...new Set((bookings ?? []).map(b => b.customer_id).filter(Boolean))]
  const { data: customers } = customerIds.length
    ? await supabase.from('customers').select('id, first_name, last_name, email, phone').in('id', customerIds as string[])
    : { data: [] }
  const customerMap = new Map((customers ?? []).map(c => [c.id, c]))

  const csv = toCSV([
    ['Booking-ID', 'Status', 'Kunde', 'E-post', 'Telefon', 'Start', 'Slutt', 'Totalt', 'Depositum', 'Opprettet'],
    ...(bookings ?? []).map(b => {
      const c = customerMap.get(b.customer_id ?? '') as any
      return [
        b.id.slice(0, 8).toUpperCase(),
        b.status,
        c ? `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim() : '',
        c?.email ?? '',
        c?.phone ?? '',
        b.start_date,
        b.end_date,
        String(b.total_amount),
        String(b.deposit_amount ?? 0),
        new Date(b.created_at).toLocaleDateString('nb-NO'),
      ]
    }),
  ])

  return new NextResponse(csv, {
    headers: {
      'Content-Type':        'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="bookinger.csv"',
    },
  })
}
