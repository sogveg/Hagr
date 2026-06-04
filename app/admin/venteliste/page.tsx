export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { markWaitlistNotified } from '@/app/actions/waitlist'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminVenteliste() {
  const supabase = createServiceClient()

  const { data: waitlist } = await (supabase.from as any)('waitlist')
    .select('id, email, name, message, notified, created_at, product_id, location_id')
    .order('created_at', { ascending: false })

  // Fetch products + locations for names
  const productIds  = [...new Set((waitlist ?? []).map((w: any) => w.product_id).filter(Boolean))]
  const locationIds = [...new Set((waitlist ?? []).map((w: any) => w.location_id).filter(Boolean))]

  const [{ data: products }, { data: locations }] = await Promise.all([
    productIds.length
      ? supabase.from('products').select('id, name').in('id', productIds as string[])
      : { data: [] },
    locationIds.length
      ? supabase.from('locations').select('id, name').in('id', locationIds as string[])
      : { data: [] },
  ])

  const productMap  = new Map((products ?? []).map(p => [p.id, p.name]))
  const locationMap = new Map((locations ?? []).map(l => [l.id, l.name]))

  const pending   = (waitlist ?? []).filter((w: any) => !w.notified)
  const notified  = (waitlist ?? []).filter((w: any) => w.notified)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Venteliste</h1>
        <p className="text-sm text-gray-500 mt-1">
          {pending.length} venter på svar · {notified.length} varslet
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/[0.06] px-8 py-16 text-center">
          <p className="text-gray-400 text-sm">Ingen på venteliste for øyeblikket</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden mb-8">
          <div className="px-5 py-3 bg-[#F0EAE0] border-b border-black/[0.04]">
            <p className="text-xs font-bold text-[#6B5B4B] uppercase tracking-wide">Venter på svar ({pending.length})</p>
          </div>
          {pending.map((w: any, i: number) => (
            <div key={w.id} className={`px-6 py-4 ${i > 0 ? 'border-t border-black/[0.04]' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-[#2B2B2B]">{w.email}</p>
                    {w.name && <span className="text-xs text-gray-400">({w.name})</span>}
                  </div>
                  <p className="text-xs text-gray-500">
                    Produkt: <span className="font-medium">{productMap.get(w.product_id) ?? '—'}</span>
                    {' · '}
                    Sted: <span className="font-medium">{locationMap.get(w.location_id) ?? '—'}</span>
                    {' · '}
                    {fmtDate(w.created_at)}
                  </p>
                  {w.message && (
                    <p className="text-xs text-gray-500 mt-1 italic">"{w.message}"</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`mailto:${w.email}?subject=Godt nytt! ${productMap.get(w.product_id) ?? 'Produktet'} er ledig`}
                    className="text-xs font-semibold text-[#8FA68B] hover:underline"
                  >
                    Send e-post
                  </a>
                  <form action={markWaitlistNotified.bind(null, w.id)}>
                    <button type="submit" className="text-xs font-semibold text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1">
                      Merk varslet
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {notified.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="px-5 py-3 bg-[#F8F7F4] border-b border-black/[0.04]">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Varslet ({notified.length})</p>
          </div>
          {notified.map((w: any, i: number) => (
            <div key={w.id} className={`px-6 py-3 flex items-center justify-between gap-4 ${i > 0 ? 'border-t border-black/[0.04]' : ''}`}>
              <div>
                <p className="text-sm text-gray-400">{w.email}</p>
                <p className="text-xs text-gray-300">{productMap.get(w.product_id) ?? '—'} · {fmtDate(w.created_at)}</p>
              </div>
              <span className="text-xs bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded-full">Varslet</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
