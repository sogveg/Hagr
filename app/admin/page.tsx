export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

const REVENUE_STATUSES = ['confirmed', 'prepared', 'delivered', 'active_rental', 'returned', 'completed']

function fmt(n: number) {
  return n.toLocaleString('nb-NO', { maximumFractionDigits: 0 }) + ' kr'
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
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'active_rental'),
    supabase.from('inventory_items').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('id, total_amount, deposit_amount, status, created_at'),
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  // Revenue calculations
  const bookings = allBookings ?? []
  const revenueBookings = bookings.filter(b => REVENUE_STATUSES.includes(b.status))

  const totalRevenue = revenueBookings
    .reduce((s, b) => s + ((b.total_amount ?? 0) - (b.deposit_amount ?? 0)), 0)

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const thisMonthRevenue = revenueBookings
    .filter(b => new Date(b.created_at) >= monthStart)
    .reduce((s, b) => s + ((b.total_amount ?? 0) - (b.deposit_amount ?? 0)), 0)

  const lastMonthRevenue = revenueBookings
    .filter(b => {
      const d = new Date(b.created_at)
      return d >= prevMonthStart && d < monthStart
    })
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

  const countStats = [
    { label: 'Totale bookinger',    value: totalBookings ?? 0,  color: 'bg-[#2B2B2B]' },
    { label: 'Aktive leier',        value: activeRentals ?? 0,  color: 'bg-[#5B7C99]' },
    { label: 'Tilgjengelig lager',  value: availableItems ?? 0, color: 'bg-[#8FA68B]' },
    { label: 'Kunder',              value: totalCustomers ?? 0, color: 'bg-[#D6B980]' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Oversikt</h1>
        <p className="text-sm text-gray-500 mt-1">TinyRent administrasjon</p>
      </div>

      {/* Count stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {countStats.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-black/[0.06]">
            <div className={`w-2 h-2 rounded-full ${stat.color} mb-4`} />
            <div className="text-3xl font-bold text-[#2B2B2B] mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
          <div className="w-2 h-2 rounded-full bg-[#8FA68B] mb-4" />
          <div className="text-2xl font-bold text-[#2B2B2B] mb-1 leading-tight">{fmt(totalRevenue)}</div>
          <div className="text-xs text-gray-500 mb-1">Totale inntekter</div>
          <div className="text-xs text-gray-400">Alle bekreftede bookinger</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
          <div className="w-2 h-2 rounded-full bg-[#5B7C99] mb-4" />
          <div className="text-2xl font-bold text-[#2B2B2B] mb-1 leading-tight">{fmt(thisMonthRevenue)}</div>
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
          <div className="text-2xl font-bold text-[#2B2B2B] mb-1 leading-tight">{fmt(pipeline)}</div>
          <div className="text-xs text-gray-500 mb-1">Aktiv pipeline</div>
          <div className="text-xs text-gray-400">Bekreftet, ikke fullført</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
          <div className="w-2 h-2 rounded-full bg-gray-300 mb-4" />
          <div className="text-2xl font-bold text-[#2B2B2B] mb-1 leading-tight">{avgBooking > 0 ? fmt(avgBooking) : '—'}</div>
          <div className="text-xs text-gray-500 mb-1">Snitt bookingverdi</div>
          <div className="text-xs text-gray-400">Ekskl. depositum</div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-black/[0.06]">
        <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#2B2B2B]">Siste bookinger</h2>
          <Link href="/admin/bookings" className="text-sm text-[#8FA68B] font-semibold hover:underline">
            Se alle →
          </Link>
        </div>

        {!recentBookings?.length ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            Ingen bookinger ennå
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {recentBookings.map(booking => (
              <Link
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#F8F7F4] transition-colors"
              >
                <div>
                  <p className="text-sm font-mono text-gray-400">#{booking.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {booking.start_date} → {booking.end_date}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
                <div className="text-sm font-semibold text-[#2B2B2B] text-right">
                  {booking.total_amount} kr
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    draft:           { label: 'Utkast',         className: 'bg-gray-100 text-gray-500' },
    pending_payment: { label: 'Venter betaling', className: 'bg-yellow-50 text-yellow-700' },
    confirmed:       { label: 'Bekreftet',       className: 'bg-blue-50 text-blue-700' },
    prepared:        { label: 'Klar',            className: 'bg-purple-50 text-purple-700' },
    active_rental:   { label: 'Aktiv leie',      className: 'bg-green-50 text-green-700' },
    completed:       { label: 'Fullført',         className: 'bg-gray-50 text-gray-500' },
    cancelled:       { label: 'Kansellert',       className: 'bg-red-50 text-red-500' },
  }
  const s = map[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.className}`}>
      {s.label}
    </span>
  )
}
