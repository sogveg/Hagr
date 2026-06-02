export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import { ProductForm } from '@/components/admin/product-form'
import { updateProduct } from '@/app/actions/admin'
import Link from 'next/link'

const SEVERITY_LABEL: Record<string, string> = {
  minor:    'Mindre',
  moderate: 'Moderat',
  severe:   'Alvorlig',
}
const SEVERITY_COLOR: Record<string, string> = {
  minor:    'bg-yellow-50 text-yellow-700',
  moderate: 'bg-orange-50 text-orange-700',
  severe:   'bg-red-50 text-red-700',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('nb-NO', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServiceClient()

  const [{ data: product }, { data: categories }, { data: locations }, { data: productLocation }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('locations').select('id, name').order('name'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from as any)('product_locations').select('category_id, location_id').eq('product_id', id).single(),
  ])

  if (!product) notFound()

  // Hent lagerenheter for dette produktet
  const { data: items } = await supabase
    .from('inventory_items')
    .select('id, internal_name, status')
    .eq('product_id', id)
    .order('internal_name')

  // Hent skaderapporter for disse enhetene
  const itemIds = (items ?? []).map(i => i.id)
  const { data: damages } = itemIds.length
    ? await (supabase.from as any)('damage_reports')
        .select('id, inventory_item_id, description, severity, amount_charged, reported_by, created_at, photo_url')
        .in('inventory_item_id', itemIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  const itemNameMap = new Map((items ?? []).map(i => [i.id, i.internal_name ?? 'Ukjent enhet']))

  async function handleSave(input: Parameters<typeof updateProduct>[1]): Promise<{ success: boolean; error?: string }> {
    'use server'
    return updateProduct(id, input)
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors mb-3 inline-block"
        >
          ← Tilbake til produkter
        </Link>
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">
          Rediger produkt
        </h1>
        <p className="text-sm text-gray-400 mt-1 font-mono">{product.slug}</p>
      </div>

      <ProductForm
        categories={categories ?? []}
        locations={locations ?? []}
        product={product}
        currentCategoryId={product.category_id ?? undefined}
        onSave={handleSave}
      />

      {/* ── Skadeoversikt ─────────────────────────────────────── */}
      <section className="mt-8 bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.04] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#2B2B2B]">Registrerte skader og feil</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {(damages ?? []).length === 0
                ? 'Ingen skader registrert'
                : `${(damages ?? []).length} rapport${(damages ?? []).length !== 1 ? 'er' : ''}`}
            </p>
          </div>
          {itemIds.length > 0 && (
            <Link
              href={`/admin/bookings`}
              className="text-xs text-[#8FA68B] font-semibold hover:underline"
            >
              Se bookinger →
            </Link>
          )}
        </div>

        {(damages ?? []).length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-300">
            Ingen skader eller feil er registrert for dette produktet
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {(damages ?? []).map((d: any) => (
              <div key={d.id} className="px-6 py-4 grid grid-cols-[1fr_auto] gap-4 items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {d.severity && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SEVERITY_COLOR[d.severity] ?? 'bg-gray-100 text-gray-600'}`}>
                        {SEVERITY_LABEL[d.severity] ?? d.severity}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 font-medium">
                      {itemNameMap.get(d.inventory_item_id) ?? 'Ukjent enhet'}
                    </span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] text-gray-400">
                      {d.reported_by === 'customer' ? 'Rapportert av leietaker' : 'Rapportert av TinyRent'}
                    </span>
                  </div>
                  <p className="text-sm text-[#2B2B2B] leading-snug">{d.description || '—'}</p>
                  {d.photo_url && (
                    <a href={d.photo_url} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-[#8FA68B] hover:underline mt-1 inline-block">
                      Se bilde →
                    </a>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">{fmtDate(d.created_at)}</p>
                  {d.amount_charged != null && d.amount_charged > 0 && (
                    <p className="text-sm font-semibold text-red-600 mt-0.5">
                      {d.amount_charged} kr belastet
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
