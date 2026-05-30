export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { toggleProductPublished } from '@/app/actions/admin'
import Link from 'next/link'

export default async function AdminProducts() {
  const supabase = createServiceClient()

  const [{ data: products }, { data: inventory }] = await Promise.all([
    supabase.from('products').select('*').order('name'),
    supabase.from('inventory_items').select('product_id, status'),
  ])

  const availableMap = new Map<string, number>()
  const totalMap     = new Map<string, number>()
  for (const item of inventory ?? []) {
    if (!item.product_id) continue
    totalMap.set(item.product_id, (totalMap.get(item.product_id) ?? 0) + 1)
    if (item.status === 'available') {
      availableMap.set(item.product_id, (availableMap.get(item.product_id) ?? 0) + 1)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Produkter</h1>
          <p className="text-sm text-gray-500 mt-1">{products?.length ?? 0} produkter</p>
        </div>
        <Link
          href="/admin/products/new"
          className="text-sm bg-[#2B2B2B] text-white px-5 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          + Nytt produkt
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
        {!products?.length ? (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">Ingen produkter</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#F8F7F4]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Produkt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Pris/uke</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Lager</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Handlinger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {products.map(product => {
                const avail = availableMap.get(product.id) ?? 0
                const total = totalMap.get(product.id)     ?? 0
                return (
                  <tr key={product.id} className="hover:bg-[#F8F7F4] transition-colors">
                    <td className="px-6 py-4">
                      {product.brand && (
                        <p className="text-[10px] font-bold text-[#8FA68B] uppercase tracking-widest mb-0.5">
                          {product.brand}
                        </p>
                      )}
                      <p className="font-semibold text-[#2B2B2B]">{product.name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{product.slug}</p>
                    </td>

                    <td className="px-4 py-4 text-[#2B2B2B] font-semibold">
                      {product.price_week ? `${product.price_week} kr` : '—'}
                    </td>

                    <td className="px-4 py-4">
                      <span className={`text-sm font-semibold ${avail > 0 ? 'text-[#5A7A55]' : 'text-gray-400'}`}>
                        {avail}
                      </span>
                      <span className="text-gray-400 text-xs"> / {total}</span>
                    </td>

                    <td className="px-4 py-4">
                      <form action={toggleProductPublished.bind(null, product.id, !product.published)}>
                        <button
                          type="submit"
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                            product.published
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {product.published ? 'Publisert' : 'Skjult'}
                        </button>
                      </form>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs font-semibold text-[#8FA68B] hover:text-[#5A7A55] transition-colors"
                      >
                        Rediger →
                      </Link>
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
