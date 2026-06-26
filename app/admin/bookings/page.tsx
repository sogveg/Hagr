export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { StatusDropdown } from '@/components/admin/status-dropdown'

export default async function AdminBookings() {
  const supabase = createServiceClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  const customerIds = [...new Set((bookings ?? []).map(b => b.customer_id).filter(Boolean))]
  const { data: customers } = customerIds.length
    ? await supabase.from('customers').select('id, first_name, last_name, email').in('id', customerIds as string[])
    : { data: [] }

  const customerMap = new Map((customers ?? []).map(c => [c.id, c]))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Bookinger</h1>
          <p className="text-sm text-gray-500 mt-1">{bookings?.length ?? 0} totalt</p>
        </div>
        <a
          href="/api/admin/export?type=bookings"
          className="text-xs font-bold text-[#8FA68B] hover:underline border border-[#8FA68B]/30 rounded-xl px-4 py-2"
        >
          Eksporter CSV
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
        {!bookings?.length ? (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">
            Ingen bookinger ennå
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#F8F7F4]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Booking</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Kunde</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Periode</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Beløp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {bookings.map(booking => {
                const customer = booking.customer_id ? customerMap.get(booking.customer_id) : null
                return (
                  <tr key={booking.id} className="hover:bg-[#F8F7F4] transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/bookings/${booking.id}`} className="block">
                        <p className="font-mono text-xs text-[#8FA68B] font-semibold hover:underline">
                          #{booking.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(booking.created_at).toLocaleDateString('nb-NO')}
                        </p>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      {customer ? (
                        <div>
                          <p className="font-medium text-[#2B2B2B]">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-xs text-gray-400">{customer.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-xs">
                      {booking.start_date} → {booking.end_date}
                    </td>
                    <td className="px-4 py-4">
                      <StatusDropdown
                        bookingId={booking.id}
                        currentStatus={booking.status}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="font-semibold text-[#2B2B2B]">
                          {booking.total_amount} kr
                        </span>
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="text-xs text-[#8FA68B] font-semibold hover:underline"
                        >
                          Åpne →
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
