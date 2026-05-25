export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'

export default async function AdminDashboard() {
  const supabase = createServiceClient()

  const [
    { count: totalBookings },
    { count: activeRentals },
    { count: availableItems },
    { count: totalCustomers },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'active_rental'),
    supabase.from('inventory_items').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
  ])

  const { data: recentBookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Totale bookinger', value: totalBookings ?? 0, color: 'bg-[#2B2B2B]' },
    { label: 'Aktive leier', value: activeRentals ?? 0, color: 'bg-[#5B7C99]' },
    { label: 'Tilgjengelig lager', value: availableItems ?? 0, color: 'bg-[#8FA68B]' },
    { label: 'Kunder', value: totalCustomers ?? 0, color: 'bg-[#D6B980]' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Oversikt</h1>
        <p className="text-sm text-gray-500 mt-1">TinyRent administrasjon</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-black/[0.06]">
            <div className={`w-2 h-2 rounded-full ${stat.color} mb-4`} />
            <div className="text-3xl font-bold text-[#2B2B2B] mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-black/[0.06]">
        <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#2B2B2B]">Siste bookinger</h2>
          <a href="/admin/bookings" className="text-sm text-[#8FA68B] font-semibold hover:underline">
            Se alle →
          </a>
        </div>

        {!recentBookings?.length ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            Ingen bookinger ennå
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {recentBookings.map(booking => (
              <div key={booking.id} className="px-6 py-4 flex items-center justify-between gap-4">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    draft: { label: 'Utkast', className: 'bg-gray-100 text-gray-500' },
    pending_payment: { label: 'Venter betaling', className: 'bg-yellow-50 text-yellow-700' },
    confirmed: { label: 'Bekreftet', className: 'bg-blue-50 text-blue-700' },
    active_rental: { label: 'Aktiv leie', className: 'bg-green-50 text-green-700' },
    completed: { label: 'Fullført', className: 'bg-gray-50 text-gray-500' },
    cancelled: { label: 'Kansellert', className: 'bg-red-50 text-red-500' },
  }
  const s = map[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.className}`}>
      {s.label}
    </span>
  )
}
