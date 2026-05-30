export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

async function logCleaning(formData: FormData) {
  'use server'
  const itemId    = formData.get('item_id') as string
  const cleanedBy = (formData.get('cleaned_by') as string) || 'TinyRent'
  const cleanedAt = formData.get('cleaned_at') as string
  const notes     = formData.get('notes') as string

  if (!itemId) return

  const supabase = createServiceClient()
  await (supabase.from as any)('cleaning_logs').insert({
    inventory_item_id: itemId,
    cleaned_by:        cleanedBy,
    cleaned_at:        cleanedAt ? new Date(cleanedAt).toISOString() : new Date().toISOString(),
    notes:             notes || null,
  })
  revalidatePath('/admin/rengjoring')
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('nb-NO', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function daysSince(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'I dag'
  if (days === 1) return 'I går'
  return `${days} dager siden`
}

function cleanStatus(lastCleaned: string | null) {
  if (!lastCleaned) return { label: 'Aldri vasket', color: 'bg-red-100 text-red-600' }
  const days = Math.floor((Date.now() - new Date(lastCleaned).getTime()) / 86_400_000)
  if (days <= 3)  return { label: 'Nylig vasket', color: 'bg-green-100 text-green-700' }
  if (days <= 14) return { label: `${days}d siden`, color: 'bg-yellow-50 text-yellow-700' }
  return { label: `${days}d siden`, color: 'bg-orange-50 text-orange-600' }
}

export default async function AdminRengjoring() {
  const supabase = createServiceClient()

  const { data: items } = await supabase
    .from('inventory_items')
    .select('id, internal_name, status, product_id, location_id')
    .order('internal_name')

  const { data: products }  = await supabase.from('products').select('id, name')
  const { data: locations } = await supabase.from('locations').select('id, name')

  const productMap  = new Map((products  ?? []).map(p => [p.id, p.name]))
  const locationMap = new Map((locations ?? []).map(l => [l.id, l.name]))

  // Last cleaning per item
  const itemIds = (items ?? []).map(i => i.id)
  const { data: logs } = itemIds.length
    ? await (supabase.from as any)('cleaning_logs')
        .select('inventory_item_id, cleaned_at, cleaned_by, notes, id')
        .in('inventory_item_id', itemIds)
        .order('cleaned_at', { ascending: false })
    : { data: [] }

  // Map: item_id → most recent log
  const lastLogMap = new Map<string, any>()
  const allLogsMap = new Map<string, any[]>()
  for (const log of logs ?? []) {
    if (!lastLogMap.has(log.inventory_item_id)) {
      lastLogMap.set(log.inventory_item_id, log)
    }
    const arr = allLogsMap.get(log.inventory_item_id) ?? []
    arr.push(log)
    allLogsMap.set(log.inventory_item_id, arr)
  }

  const today = new Date().toISOString().slice(0, 16) // for datetime-local default

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Rengjøringslogg</h1>
        <p className="text-sm text-gray-500 mt-1">
          Spor når hvert lagerutstyr sist ble vasket og desinfisert
        </p>
      </div>

      {/* Legg til ny loggføring */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 mb-6">
        <h2 className="text-sm font-bold text-[#2B2B2B] mb-4">Registrer vask</h2>
        <form action={logCleaning} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Lagerenhet *</label>
            <select
              name="item_id"
              required
              className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            >
              <option value="">Velg enhet…</option>
              {(items ?? []).map(item => (
                <option key={item.id} value={item.id}>
                  {item.internal_name ?? (item.product_id ? productMap.get(item.product_id) : null) ?? 'Ukjent'}
                  {item.location_id ? ` (${locationMap.get(item.location_id) ?? ''})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Vasket av</label>
            <input
              name="cleaned_by"
              defaultValue="TinyRent"
              className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tidspunkt</label>
            <input
              name="cleaned_at"
              type="datetime-local"
              defaultValue={today}
              className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Merknad</label>
            <input
              name="notes"
              placeholder="Desinfisert, damprens…"
              className="w-full border border-black/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-[#2B2B2B] text-white text-sm font-semibold rounded-xl px-5 py-2.5 hover:bg-black transition-colors"
            >
              Loggfør vask
            </button>
          </div>
        </form>
      </div>

      {/* Oversikt per lagerenhet */}
      <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
        <div className="px-6 py-3 bg-[#F8F7F4] border-b border-black/[0.04] grid grid-cols-[2fr_1fr_1fr_2fr] gap-4">
          {['Enhet', 'Status', 'Sist vasket', 'Logg (siste 5)'].map(h => (
            <p key={h} className="text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</p>
          ))}
        </div>

        {(items ?? []).length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">Ingen lagerenheter funnet</div>
        ) : (
          (items ?? []).map((item, i) => {
            const last = lastLogMap.get(item.id)
            const status = cleanStatus(last?.cleaned_at ?? null)
            const itemLogs = allLogsMap.get(item.id) ?? []

            return (
              <div
                key={item.id}
                className={`px-6 py-4 grid grid-cols-[2fr_1fr_1fr_2fr] gap-4 items-start ${i > 0 ? 'border-t border-black/[0.04]' : ''}`}
              >
                {/* Enhet */}
                <div>
                  <p className="text-sm font-semibold text-[#2B2B2B]">
                    {item.internal_name ?? productMap.get(item.product_id) ?? 'Ukjent'}
                  </p>
                  {item.location_id && (
                    <p className="text-xs text-gray-400">{locationMap.get(item.location_id)}</p>
                  )}
                </div>

                {/* Status-badge */}
                <div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* Sist vasket */}
                <div>
                  {last ? (
                    <>
                      <p className="text-xs font-medium text-[#2B2B2B]">{daysSince(last.cleaned_at)}</p>
                      <p className="text-[10px] text-gray-400">{fmtDate(last.cleaned_at)}</p>
                      <p className="text-[10px] text-gray-400">{last.cleaned_by}</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-300">—</p>
                  )}
                </div>

                {/* Mini-logg */}
                <div className="space-y-0.5">
                  {itemLogs.slice(0, 5).map((log: any) => (
                    <p key={log.id} className="text-[11px] text-gray-400">
                      <span className="text-gray-500 font-medium">{new Date(log.cleaned_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}</span>
                      {log.cleaned_by !== 'TinyRent' && ` · ${log.cleaned_by}`}
                      {log.notes && <span className="text-gray-300"> · {log.notes}</span>}
                    </p>
                  ))}
                  {itemLogs.length === 0 && <p className="text-xs text-gray-200">Ingen logg</p>}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
