export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'

const statusLabels: Record<string, { label: string; className: string }> = {
  available: { label: 'Tilgjengelig', className: 'bg-green-50 text-green-700' },
  reserved: { label: 'Reservert', className: 'bg-blue-50 text-blue-700' },
  delivered: { label: 'Levert', className: 'bg-indigo-50 text-indigo-700' },
  active_rental: { label: 'Aktiv leie', className: 'bg-green-50 text-green-700' },
  cleaning: { label: 'Rengjøring', className: 'bg-yellow-50 text-yellow-700' },
  maintenance: { label: 'Vedlikehold', className: 'bg-orange-50 text-orange-700' },
  damaged: { label: 'Skadet', className: 'bg-red-50 text-red-600' },
  retired: { label: 'Pensjonert', className: 'bg-gray-100 text-gray-500' },
}

export default async function AdminInventory() {
  const supabase = createServiceClient()

  const { data: items } = await supabase
    .from('inventory_items')
    .select('*')
    .order('internal_name')

  const productIds = [...new Set((items ?? []).map(i => i.product_id).filter(Boolean))]
  const { data: products } = productIds.length
    ? await supabase.from('products').select('id, name, brand').in('id', productIds as string[])
    : { data: [] }

  const productMap = new Map((products ?? []).map(p => [p.id, p]))

  const byStatus = (items ?? []).reduce((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Lager</h1>
        <p className="text-sm text-gray-500 mt-1">{items?.length ?? 0} enheter totalt</p>
      </div>

      {/* Status-sammendrag */}
      <div className="flex flex-wrap gap-3 mb-8">
        {Object.entries(byStatus).map(([status, count]) => {
          const s = statusLabels[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' }
          return (
            <div key={status} className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full ${s.className}`}>
              {s.label}
              <span className="font-bold">{count}</span>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
        {!items?.length ? (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">Ingen lagerenheter registrert</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#F8F7F4]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Enhet</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Produkt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Stand</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {items.map(item => {
                const product = item.product_id ? productMap.get(item.product_id) : null
                const s = statusLabels[item.status] ?? { label: item.status, className: 'bg-gray-100 text-gray-500' }
                return (
                  <tr key={item.id} className="hover:bg-[#F8F7F4] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#2B2B2B]">{item.internal_name}</p>
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
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-600 capitalize">{item.condition}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.className}`}>
                        {s.label}
                      </span>
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
