export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function AdminCustomers() {
  const supabase = createServiceClient()

  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  // Tell bookinger per kunde
  const { data: bookings } = await supabase
    .from('bookings')
    .select('customer_id')

  const bookingCountMap = new Map<string, number>()
  for (const b of bookings ?? []) {
    if (!b.customer_id) continue
    bookingCountMap.set(b.customer_id, (bookingCountMap.get(b.customer_id) ?? 0) + 1)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Kunder</h1>
        <p className="text-sm text-gray-500 mt-1">{customers?.length ?? 0} registrerte</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
        {!customers?.length ? (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">Ingen kunder ennå</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#F8F7F4]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Navn</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">E-post</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Telefon</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">By</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Bookinger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {customers.map(customer => (
                <tr
                  key={customer.id}
                  className="hover:bg-[#F8F7F4] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <Link href={`/admin/customers/${customer.id}`} className="block">
                      <p className="font-semibold text-[#2B2B2B]">
                        {customer.first_name || customer.last_name
                          ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim()
                          : '—'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(customer.created_at).toLocaleDateString('nb-NO')}
                      </p>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    <Link href={`/admin/customers/${customer.id}`} className="block">{customer.email}</Link>
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    <Link href={`/admin/customers/${customer.id}`} className="block">{customer.phone ?? '—'}</Link>
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    <Link href={`/admin/customers/${customer.id}`} className="block">{customer.city ?? '—'}</Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/customers/${customer.id}`} className="block">
                      <span className="font-semibold text-[#2B2B2B]">
                        {bookingCountMap.get(customer.id) ?? 0}
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
