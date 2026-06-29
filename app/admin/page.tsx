export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

const REVENUE_STATUSES = ['confirmed', 'prepared', 'delivered', 'active_rental', 'returned', 'completed']

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  draft:           { label: 'Utkast',         className: 'bg-gray-100 text-gray-500' },
  pending_payment: { label: 'Venter betaling', className: 'bg-yellow-50 text-yellow-700' },
  confirmed:       { label: 'Bekreftet',       className: 'bg-blue-50 text-blue-700' },
  prepared:        { label: 'Klar',            className: 'bg-purple-50 text-purple-700' },
  delivered:       { label: 'Levert',          className: 'bg-indigo-50 text-indigo-700' },
  active_rental:   { label: 'Aktiv leie',      className: 'bg-green-50 text-green-700' },
  returned:        { label: 'Returnert',        className: 'bg-gray-50 text-gray-600' },
  completed:       { label: 'Fullført',         className: 'bg-gray-50 text-gray-500' },
  cancelled:       { label: 'Kansellert',       className: 'bg-red-50 text-red-500' },
}

function fmt(n: number) {
  return n.toLocaleString('nb-NO', { maximumFractionDigits: 0 }) + ' kr'
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })
}

function fmtTime(d: string) {
  return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default async function AdminDashboard() {
  const supabase = createServiceClient()

  const [
    { count: totalBookings },
    { count: activeRentals },
    { count: availableItems },
    { count: totalCustomers },
    { data: allBookings },
    { data: recentBookings },
    bookingMessages,
    contactMessages,
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'active_rental'),
    supabase.from('inventory_items').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('id, total_amount, deposit_amount, status, created_at'),
    // Recent bookings with customer + product info
    supabase
      .from('bookings')
      .select('id, status, start_date, end_date, total_amount, created_at, customer_id, customers(first_name, last_name, email), booking_items(products(name))')
      .order('created_at', { ascending: false })
      .limit(8),
    // Booking-level messages (customer inbound only)
    (supabase as any)
      .from('booking_messages')
      .select('id, booking_id, sender, body, created_at, bookings(customers(first_name, last_name, email))')
      .eq('sender', 'customer')
      .order('created_at', { ascending: false })
      .limit(10)
      .then((r: any) => r.data ?? []),
    // General contact messages
    (supabase as any)
      .from('contact_messages')
      .select('id, name, email, subject, body, read, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
      .then((r: any) => r.data ?? []),
  ])

  // Revenue calculations
  const bookings = allBookings ?? []
  const revenueBookings = bookings.filter(b => REVENUE_STATUSES.includes(b.status))
  const totalRevenue = revenueBookings.reduce((s, b) => s + ((b.total_amount ?? 0) - (b.deposit_amount ?? 0)), 0)

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const thisMonthRevenue = revenueBookings
    .filter(b => new Date(b.created_at) >= monthStart)
    .reduce((s, b) => s + ((b.total_amount ?? 0) - (b.deposit_amount ?? 0)), 0)

  const lastMonthRevenue = revenueBookings
    .filter(b => { const d = new Date(b.created_at); return d >= prevMonthStart && d < monthStart })
    .reduce((s, b) => s + ((b.total_amount ?? 0) - (b.deposit_amount ?? 0)), 0)

  const growth = lastMonthRevenue > 0
    ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : null

  const pipeline = bookings
    .filter(b => ['confirmed', 'prepared', 'delivered', 'active_rental'].includes(b.status))
    .reduce((s, b) => s + ((b.total_amount ?? 0) - (b.deposit_amount ?? 0)), 0)

  const avgBooking = revenueBookings.length > 0
    ? Math.round(totalRevenue / revenueBookings.length)
    : 0

  // Unified inbox: merge booking messages + contact messages, sort by date
  const inboxItems = [
    ...(bookingMessages as any[]).map((m: any) => ({
      type:      'booking' as const,
      id:        m.id,
      bookingId: m.booking_id,
      name:      `${m.bookings?.customers?.first_name ?? ''} ${m.bookings?.customers?.last_name ?? ''}`.trim() || m.bookings?.customers?.email || 'Ukjent',
      email:     m.bookings?.customers?.email ?? '',
      subject:   null as string | null,
      body:      m.body as string,
      read:      true,
      date:      m.created_at as string,
    })),
    ...(contactMessages as any[]).map((m: any) => ({
      type:      'contact' as const,
      id:        m.id,
      bookingId: null as string | null,
      name:      m.name as string,
      email:     m.email as string,
      subject:   m.subject as string | null,
      body:      m.body as string,
      read:      m.read as boolean,
      date:      m.created_at as string,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 12)

  const unreadCount = inboxItems.filter(i => !i.read).length

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Oversikt</h1>
        <p className="text-sm text-gray-500 mt-1">TinyRent administrasjon</p>
      </div>

      {/* Count stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[
          { label: 'Totale bestillinger', value: totalBookings ?? 0,  color: 'bg-[#2B2B2B]' },
          { label: 'Aktive leier',        value: activeRentals ?? 0,  color: 'bg-[#5B7C99]' },
          { label: 'Tilgjengelig lager',  value: availableItems ?? 0, color: 'bg-[#8FA68B]' },
          { label: 'Kunder',              value: totalCustomers ?? 0, color: 'bg-[#D6B980]' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-black/[0.06]">
            <div className={`w-2 h-2 rounded-full ${stat.color} mb-4`} />
            <div className="text-3xl font-bold text-[#2B2B2B] mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
          <div className="w-2 h-2 rounded-full bg-[#8FA68B] mb-4" />
          <div className="text-2xl font-bold text-[#2B2B2B] mb-1">{fmt(totalRevenue)}</div>
          <div className="text-xs text-gray-500 mb-1">Totale inntekter</div>
          <div className="text-xs text-gray-400">Alle bekreftede bestillinger</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
          <div className="w-2 h-2 rounded-full bg-[#5B7C99] mb-4" />
          <div className="text-2xl font-bold text-[#2B2B2B] mb-1">{fmt(thisMonthRevenue)}</div>
          <div className="text-xs text-gray-500 mb-1">Denne måneden</div>
          {growth !== null ? (
            <div className={`text-xs font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}% vs forrige måned
            </div>
          ) : (
            <div className="text-xs text-gray-400">Første måned</div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
          <div className="w-2 h-2 rounded-full bg-[#D6B980] mb-4" />
          <div className="text-2xl font-bold text-[#2B2B2B] mb-1">{fmt(pipeline)}</div>
          <div className="text-xs text-gray-500 mb-1">Aktiv pipeline</div>
          <div className="text-xs text-gray-400">Bekreftet, ikke fullført</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
          <div className="w-2 h-2 rounded-full bg-gray-300 mb-4" />
          <div className="text-2xl font-bold text-[#2B2B2B] mb-1">{avgBooking > 0 ? fmt(avgBooking) : '—'}</div>
          <div className="text-xs text-gray-500 mb-1">Snitt bestillingsverdi</div>
          <div className="text-xs text-gray-400">Ekskl. depositum</div>
        </div>
      </div>

      {/* Two-column layout: bookings + inbox */}
      <div className="grid lg:grid-cols-[1fr_420px] gap-6">

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2B2B2B]">Siste bestillinger</h2>
            <Link href="/admin/bookings" className="text-sm text-[#8FA68B] font-semibold hover:underline">
              Se alle →
            </Link>
          </div>

          {!recentBookings?.length ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">Ingen bestillinger ennå</div>
          ) : (
            <div className="divide-y divide-black/[0.04]">
              {(recentBookings as any[]).map((booking: any) => {
                const s = STATUS_MAP[booking.status] ?? { label: booking.status, className: 'bg-gray-100 text-gray-500' }
                const customer = booking.customers as any
                const customerName = customer
                  ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() || customer.email
                  : null
                const products: string[] = (booking.booking_items ?? [])
                  .map((item: any) => item.products?.name)
                  .filter(Boolean)

                return (
                  <Link
                    key={booking.id}
                    href={`/admin/bookings/${booking.id}`}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-[#F8F7F4] transition-colors"
                  >
                    {/* Kunde + produkt */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-[#2B2B2B] truncate">
                          {customerName ?? <span className="text-gray-400 font-normal">Ukjent kunde</span>}
                        </p>
                        <p className="text-[10px] font-mono text-gray-300 shrink-0">
                          #{booking.id.slice(0, 6).toUpperCase()}
                        </p>
                      </div>
                      {products.length > 0 && (
                        <p className="text-xs text-gray-400 truncate">
                          {products.join(', ')}
                        </p>
                      )}
                      {(booking.start_date && booking.end_date) && (
                        <p className="text-xs text-gray-300 mt-0.5">
                          {fmtDate(booking.start_date)} → {fmtDate(booking.end_date)}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${s.className}`}>
                      {s.label}
                    </span>

                    {/* Beløp */}
                    <div className="text-sm font-semibold text-[#2B2B2B] shrink-0">
                      {booking.total_amount} kr
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Customer service inbox */}
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-black/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#2B2B2B]">Innboks</h2>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-[#8FA68B] text-white px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">Kontaktskjema og meldinger</span>
          </div>

          {inboxItems.length === 0 ? (
            <div className="px-5 py-12 text-center text-gray-400 text-sm">Ingen henvendelser ennå</div>
          ) : (
            <div className="divide-y divide-black/[0.04] overflow-y-auto max-h-[600px]">
              {inboxItems.map(item => (
                <div key={`${item.type}-${item.id}`} className={`px-5 py-4 ${!item.read ? 'bg-[#F8FBF7]' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {!item.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8FA68B] shrink-0 mt-1" />
                      )}
                      <p className="text-sm font-semibold text-[#2B2B2B] truncate">{item.name}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                      {fmtTime(item.date)}
                    </span>
                  </div>

                  {item.email && (
                    <p className="text-xs text-gray-400 mb-1 truncate">{item.email}</p>
                  )}

                  {item.subject && (
                    <p className="text-xs font-medium text-gray-600 mb-1">{item.subject}</p>
                  )}

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.body}</p>

                  <div className="flex items-center gap-3 mt-2">
                    {item.type === 'booking' && item.bookingId && (
                      <Link
                        href={`/admin/bookings/${item.bookingId}`}
                        className="text-[10px] font-semibold text-[#8FA68B] hover:underline"
                      >
                        Åpne booking →
                      </Link>
                    )}
                    {item.type === 'contact' && (
                      <a
                        href={`mailto:${item.email}?subject=Re: ${item.subject ?? 'Henvendelse'}`}
                        className="text-[10px] font-semibold text-[#8FA68B] hover:underline"
                      >
                        Svar på e-post →
                      </a>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      item.type === 'booking'
                        ? 'bg-blue-50 text-blue-500'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {item.type === 'booking' ? 'Booking-melding' : 'Kontaktskjema'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
