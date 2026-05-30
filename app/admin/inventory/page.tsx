export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { updateInventoryStatus, addInventoryItem } from '@/app/actions/admin'
import Link from 'next/link'

const ALL_STATUSES = [
  'available', 'reserved', 'delivered', 'active_rental',
  'cleaning', 'maintenance', 'damaged', 'retired',
] as const

const statusLabels: Record<string, { label: string; className: string }> = {
  available:    { label: 'Tilgjengelig', className: 'bg-green-50 text-green-700' },
  reserved:     { label: 'Reservert',    className: 'bg-blue-50 text-blue-700' },
  delivered:    { label: 'Levert',       className: 'bg-indigo-50 text-indigo-700' },
  active_rental:{ label: 'Aktiv leie',   className: 'bg-green-50 text-green-700' },
  cleaning:     { label: 'Rengjøring',   className: 'bg-yellow-50 text-yellow-700' },
  maintenance:  { label: 'Vedlikehold',  className: 'bg-orange-50 text-orange-700' },
  damaged:      { label: 'Skadet',       className: 'bg-red-50 text-red-600' },
  retired:      { label: 'Pensjonert',   className: 'bg-gray-100 text-gray-500' },
}

export default async function AdminInventory() {
  const supabase = createServiceClient()

  const [{ data: items }, { data: products }, { data: locations }] = await Promise.all([
    supabase.from('inventory_items').select('*').order('internal_name'),
    supabase.from('products').select('id, name, brand').order('name'),
    supabase.from('locations').select('id, name').order('name'),
  ])

  const productMap  = new Map((products  ?? []).map(p => [p.id, p]))
  const locationMap = new Map((locations ?? []).map(l => [l.id, l]))

  const byStatus = (items ?? []).reduce((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Lager</h1>
          <p className="text-sm text-gray-500 mt-1">{items?.length ?? 0} enheter totalt</p>
        </div>
      </div>

      {/* Status-sammendrag */}
      <div className="flex flex-wrap gap-2 mb-8">
        {Object.entries(byStatus).map(([status, count]) => {
          const s = statusLabels[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' }
          return (
            <div key={status} className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${s.className}`}>
              {s.label} <span className="font-bold">{count}</span>
            </div>
          )
        })}
      </div>

      {/* Legg til enhet */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-5 mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Legg til lagerenhet</p>
        <form
          action={async (formData: FormData) => {
            'use server'
            const productId    = formData.get('product_id') as string
            const locationId   = formData.get('location_id') as string
            const internalName = formData.get('internal_name') as string
            if (productId && locationId && internalName) {
              await addInventoryItem(productId, locationId, internalName)
            }
          }}
          className="grid grid-cols-4 gap-3 items-end"
        >
          <div>
            <label className="block text-xs text-gray-400 mb-1">Produkt</label>
            <select name="product_id" required
              className="w-full h-10 px-3 text-sm border border-black/[0.12] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B]">
              {(products ?? []).map(p => (
                <option key={p.id} value={p.id}>{p.brand ? `${p.brand} — ` : ''}{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Lokasjon</label>
            <select name="location_id" required
              className="w-full h-10 px-3 text-sm border border-black/[0.12] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B]">
              {(locations ?? []).map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Internt navn</label>
            <input name="internal_name" required placeholder="f.eks. Stokke Tripp Trapp #3"
              className="w-full h-10 px-3 text-sm border border-black/[0.12] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B]" />
          </div>
          <button type="submit"
            className="h-10 bg-[#2B2B2B] text-white px-4 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
            + Legg til
          </button>
        </form>
      </div>

      {/* Lagertabell */}
      <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
        {!items?.length ? (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">Ingen lagerenheter registrert</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#F8F7F4]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Enhet</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Produkt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Lokasjon</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Stand</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {items.map(item => {
                const product  = item.product_id  ? productMap.get(item.product_id)   : null
                const location = item.location_id ? locationMap.get(item.location_id) : null
                const s = statusLabels[item.status] ?? { label: item.status, className: 'bg-gray-100 text-gray-500' }
                return (
                  <tr key={item.id} className="hover:bg-[#F8F7F4] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#2B2B2B]">{item.internal_name ?? '—'}</p>
                      {item.serial_number && (
                        <p className="text-xs text-gray-400 font-mono mt-0.5">SN: {item.serial_number}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {product ? (
                        <div>
                          {product.brand && (
                            <p className="text-[10px] font-bold text-[#8FA68B] uppercase tracking-widest mb-0.5">
                              {product.brand}
                            </p>
                          )}
                          <p className="text-[#2B2B2B]">{product.name}</p>
                        </div>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-sm">
                      {location?.name ?? '—'}
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-sm capitalize">
                      {item.condition ?? '—'}
                    </td>
                    <td className="px-4 py-4">
                      <form action={async (formData: FormData) => {
                        'use server'
                        const status = formData.get('status') as string
                        await updateInventoryStatus(item.id, status)
                      }} className="flex items-center gap-2">
                        <select
                          name="status"
                          defaultValue={item.status}
                          className="text-xs border border-black/[0.12] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B]"
                        >
                          {ALL_STATUSES.map(st => (
                            <option key={st} value={st}>{statusLabels[st]?.label ?? st}</option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="text-xs text-[#8FA68B] font-semibold hover:text-[#5A7A55] transition-colors"
                        >
                          Lagre
                        </button>
                      </form>
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
