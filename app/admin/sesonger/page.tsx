export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']

async function createSeason(formData: FormData) {
  'use server'
  const productId   = formData.get('product_id') as string
  const name        = formData.get('name') as string
  const startMonth  = Number(formData.get('start_month'))
  const startDay    = Number(formData.get('start_day'))
  const endMonth    = Number(formData.get('end_month'))
  const endDay      = Number(formData.get('end_day'))
  const priceDay    = formData.get('price_day')   ? Number(formData.get('price_day'))   : null
  const priceWeek   = formData.get('price_week')  ? Number(formData.get('price_week'))  : null
  const priceMonth  = formData.get('price_month') ? Number(formData.get('price_month')) : null

  if (!productId || !name || !startMonth || !startDay || !endMonth || !endDay) return

  const supabase = createServiceClient()
  await (supabase.from as any)('seasonal_prices').insert({
    product_id:  productId,
    name, start_month: startMonth, start_day: startDay,
    end_month: endMonth, end_day: endDay,
    price_day: priceDay, price_week: priceWeek, price_month: priceMonth,
    active: true,
  })
  revalidatePath('/admin/sesonger')
}

async function toggleSeason(id: string, active: boolean) {
  'use server'
  const supabase = createServiceClient()
  await (supabase.from as any)('seasonal_prices').update({ active }).eq('id', id)
  revalidatePath('/admin/sesonger')
}

function fmtRange(sm: number, sd: number, em: number, ed: number) {
  return `${sd}. ${MONTH_NAMES[sm - 1]} – ${ed}. ${MONTH_NAMES[em - 1]}`
}

export default async function AdminSesonger() {
  const supabase = createServiceClient()

  const { data: seasons }  = await (supabase.from as any)('seasonal_prices')
    .select('*')
    .order('start_month').order('start_day')

  const { data: products } = await supabase
    .from('products')
    .select('id, name, brand, price_day, price_week, price_month')
    .eq('published', true)
    .order('name')

  const productMap = new Map((products ?? []).map(p => [p.id, p]))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Sesongjusteringer</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overstyr standardprisene i bestemte perioder (f.eks. sommer eller jul)
        </p>
      </div>

      {/* Info box */}
      <div className="bg-[#F0EAE0] rounded-xl px-5 py-3 mb-6 text-sm text-[#6B5B4B]">
        <strong>Slik fungerer det:</strong> Sesongjusteringer overstyrer produktets standardpris i den angitte perioden. Blank pris betyr at standardpris brukes for den enheten.
      </div>

      {/* New season form */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 mb-6">
        <h2 className="text-sm font-bold text-[#2B2B2B] mb-4">Opprett sesong</h2>
        <form action={createSeason} className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Produkt *</label>
              <select
                name="product_id"
                required
                className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
              >
                <option value="">Velg produkt…</option>
                {(products ?? []).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.brand ? `${p.brand} — ` : ''}{p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Sesong-navn *</label>
              <input
                name="name"
                required
                placeholder="Sommer, Jul, Vinter…"
                className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
              />
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Fra måned *</label>
              <select name="start_month" required className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40">
                <option value="">Mnd…</option>
                {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Fra dag *</label>
              <input name="start_day" type="number" min={1} max={31} required placeholder="1" className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Til måned *</label>
              <select name="end_month" required className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40">
                <option value="">Mnd…</option>
                {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Til dag *</label>
              <input name="end_day" type="number" min={1} max={31} required placeholder="31" className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40" />
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Pris/dag (kr)</label>
              <input name="price_day" type="number" min={0} placeholder="La stå tom = standard" className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Pris/uke (kr)</label>
              <input name="price_week" type="number" min={0} placeholder="La stå tom = standard" className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Pris/mnd (kr)</label>
              <input name="price_month" type="number" min={0} placeholder="La stå tom = standard" className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40" />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#2B2B2B] text-white text-sm font-semibold rounded-xl px-6 py-2.5 hover:bg-black transition-colors"
          >
            Opprett sesong
          </button>
        </form>
      </div>

      {/* Season list */}
      {(seasons ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/[0.06] px-8 py-16 text-center">
          <p className="text-gray-400 text-sm">Ingen sesongjusteringer ennå</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          {(seasons ?? []).map((s: any, i: number) => {
            const product = productMap.get(s.product_id) as any
            return (
              <div
                key={s.id}
                className={`px-6 py-4 flex items-center justify-between gap-4 ${i > 0 ? 'border-t border-black/[0.04]' : ''} ${!s.active ? 'opacity-50' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {s.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {fmtRange(s.start_month, s.start_day, s.end_month, s.end_day)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#2B2B2B] truncate">
                    {product?.brand ? `${product.brand} — ` : ''}{product?.name ?? 'Ukjent produkt'}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {s.price_day   != null && <span className="text-xs text-gray-500">{s.price_day} kr/dag</span>}
                    {s.price_week  != null && <span className="text-xs text-gray-500">{s.price_week} kr/uke</span>}
                    {s.price_month != null && <span className="text-xs text-gray-500">{s.price_month} kr/mnd</span>}
                    {s.price_day == null && s.price_week == null && s.price_month == null && (
                      <span className="text-xs text-gray-300 italic">Ingen prisoverstyring</span>
                    )}
                    {product && (
                      <span className="text-[10px] text-gray-300">
                        Standard: {product.price_day ? `${product.price_day}/d` : ''} {product.price_week ? `${product.price_week}/u` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <form action={toggleSeason.bind(null, s.id, !s.active)}>
                  <button type="submit" className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    s.active
                      ? 'border-red-200 text-red-500 hover:bg-red-50'
                      : 'border-green-200 text-green-700 hover:bg-green-50'
                  }`}>
                    {s.active ? 'Deaktiver' : 'Aktiver'}
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
