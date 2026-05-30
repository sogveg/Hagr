export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'
import { unsubscribeNewsletter } from '@/app/actions/newsletter'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminAbonnenter() {
  const supabase = createServiceClient()
  const { data: subscribers } = await (supabase.from as any)('newsletter_subscribers')
    .select('id, email, name, active, created_at')
    .order('created_at', { ascending: false })

  const active   = (subscribers ?? []).filter((s: any) => s.active)
  const inactive = (subscribers ?? []).filter((s: any) => !s.active)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Nyhetsbrev-abonnenter</h1>
        <p className="text-sm text-gray-500 mt-1">
          {active.length} aktive · {inactive.length} avmeldt
        </p>
      </div>

      {/* Export hint */}
      <div className="bg-[#F0EAE0] rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
        <p className="text-sm text-[#6B5B4B]">
          Eksporter e-postlisten for å bruke i Mailchimp, Klaviyo e.l.
        </p>
        <a
          href="/api/admin/export?type=subscribers"
          className="text-xs font-bold text-[#5A7A55] hover:underline"
        >
          Last ned CSV →
        </a>
      </div>

      {active.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/[0.06] px-8 py-16 text-center">
          <p className="text-gray-400 text-sm">Ingen aktive abonnenter ennå</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden mb-8">
          <div className="px-5 py-3 bg-[#F8F7F4] border-b border-black/[0.04]">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Aktive abonnenter ({active.length})</p>
          </div>
          {active.map((s: any, i: number) => (
            <div key={s.id} className={`px-6 py-3 flex items-center justify-between gap-4 ${i > 0 ? 'border-t border-black/[0.04]' : ''}`}>
              <div>
                <p className="text-sm font-medium text-[#2B2B2B]">{s.email}</p>
                {s.name && <p className="text-xs text-gray-400">{s.name}</p>}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">{fmtDate(s.created_at)}</span>
                <form action={unsubscribeNewsletter.bind(null, s.id)}>
                  <button type="submit" className="text-xs text-red-400 hover:text-red-600 font-medium">
                    Meld av
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {inactive.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="px-5 py-3 bg-[#F8F7F4] border-b border-black/[0.04]">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Avmeldte ({inactive.length})</p>
          </div>
          {inactive.map((s: any, i: number) => (
            <div key={s.id} className={`px-6 py-3 flex items-center justify-between gap-4 ${i > 0 ? 'border-t border-black/[0.04]' : ''}`}>
              <p className="text-sm text-gray-400 line-through">{s.email}</p>
              <span className="text-xs text-gray-300">{fmtDate(s.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
