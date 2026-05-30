export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

async function createCode(formData: FormData) {
  'use server'
  const code       = (formData.get('code') as string).toUpperCase().trim()
  const type       = formData.get('type') as string
  const value      = Number(formData.get('value'))
  const maxUses    = formData.get('max_uses') ? Number(formData.get('max_uses')) : null
  const expiresAt  = formData.get('expires_at') ? new Date(formData.get('expires_at') as string).toISOString() : null

  if (!code || !type || !value) return

  const supabase = createServiceClient()
  await (supabase.from as any)('discount_codes').insert({
    code,
    type,
    value,
    max_uses:   maxUses,
    expires_at: expiresAt,
    active:     true,
    uses:       0,
  })
  revalidatePath('/admin/rabatter')
}

async function toggleCode(id: string, active: boolean) {
  'use server'
  const supabase = createServiceClient()
  await (supabase.from as any)('discount_codes').update({ active }).eq('id', id)
  revalidatePath('/admin/rabatter')
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminRabatter() {
  const supabase = createServiceClient()
  const { data: codes } = await (supabase.from as any)('discount_codes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Rabattkoder</h1>
        <p className="text-sm text-gray-500 mt-1">{(codes ?? []).length} koder opprettet</p>
      </div>

      {/* New code form */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 mb-6">
        <h2 className="text-sm font-bold text-[#2B2B2B] mb-4">Opprett ny kode</h2>
        <form action={createCode} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Kode *</label>
            <input
              name="code"
              required
              placeholder="SOMMER25"
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Type *</label>
            <select
              name="type"
              required
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            >
              <option value="percent">Prosent (%)</option>
              <option value="fixed">Fast beløp (kr)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Verdi *</label>
            <input
              name="value"
              type="number"
              min={1}
              required
              placeholder="10"
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Maks bruk</label>
            <input
              name="max_uses"
              type="number"
              min={1}
              placeholder="Ubegrenset"
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Utløpsdato</label>
            <input
              name="expires_at"
              type="date"
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA68B]/40"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-[#2B2B2B] text-white text-sm font-semibold rounded-xl px-5 py-2.5 hover:bg-black transition-colors"
            >
              Opprett kode
            </button>
          </div>
        </form>
      </div>

      {/* Code list */}
      {(codes ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/[0.06] px-8 py-16 text-center">
          <p className="text-gray-400 text-sm">Ingen rabattkoder ennå</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-[#F8F7F4] border-b border-black/[0.04]">
            {['Kode', 'Rabatt', 'Bruk', 'Utløper', ''].map(h => (
              <p key={h} className="text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</p>
            ))}
          </div>
          {(codes ?? []).map((c: any, i: number) => {
            const isExpired = c.expires_at && new Date(c.expires_at) < new Date()
            const isExhausted = c.max_uses && c.uses >= c.max_uses
            const inactive = !c.active || isExpired || isExhausted

            return (
              <div
                key={c.id}
                className={`grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 ${i > 0 ? 'border-t border-black/[0.04]' : ''} ${inactive ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#2B2B2B]">{c.code}</span>
                  {!inactive && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Aktiv</span>}
                  {isExpired && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Utløpt</span>}
                  {isExhausted && <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Brukt opp</span>}
                </div>
                <span className="text-sm text-[#2B2B2B]">
                  {c.type === 'percent' ? `${c.value}%` : `${c.value} kr`}
                </span>
                <span className="text-sm text-gray-500">
                  {c.uses ?? 0}{c.max_uses ? ` / ${c.max_uses}` : ''}
                </span>
                <span className="text-sm text-gray-500">{fmtDate(c.expires_at)}</span>
                <form action={toggleCode.bind(null, c.id, !c.active)}>
                  <button type="submit" className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    c.active
                      ? 'border-red-200 text-red-500 hover:bg-red-50'
                      : 'border-green-200 text-green-700 hover:bg-green-50'
                  }`}>
                    {c.active ? 'Deaktiver' : 'Aktiver'}
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
