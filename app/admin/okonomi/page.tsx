export const dynamic = 'force-dynamic'

import { createServiceClient } from '@/lib/supabase-server'

// Statuser som teller som inntekt (ikke draft/cancelled/mislykket)
const REVENUE_STATUSES = ['confirmed', 'prepared', 'delivered', 'active_rental', 'returned', 'completed']

function fmt(n: number) {
  return n.toLocaleString('nb-NO', { maximumFractionDigits: 0 }) + ' kr'
}

function pct(a: number, b: number) {
  if (!b) return null
  const p = ((a - b) / b) * 100
  return { value: Math.abs(p).toFixed(0), up: p >= 0 }
}

export default async function AdminOkonomi() {
  const supabase = createServiceClient()

  // ── Hent all data parallelt ───────────────────────────────────────────────
  const [
    { data: allBookings },
    { data: bookingItems },
    { data: inventory },
  ] = await Promise.all([
    supabase
      .from('bookings')
      .select('id, total_amount, deposit_amount, status, created_at, start_date, end_date')
      .order('created_at', { ascending: false }),
    supabase
      .from('booking_items')
      .select('booking_id, product_id, unit_price, price_type, products(name, brand)'),
    supabase
      .from('inventory_items')
      .select('purchase_price, status, condition'),
  ])

  const bookings = allBookings ?? []

  // ── Inntektsberegning (total_amount minus depositum som refunderes) ────────
  const revenueBookings = bookings.filter(b => REVENUE_STATUSES.includes(b.status))

  // "Realisert" inntekt = fullført / returnert
  const realised = bookings
    .filter(b => ['returned', 'completed'].includes(b.status))
    .reduce((s, b) => s + ((b.total_amount ?? 0) - (b.deposit_amount ?? 0)), 0)

  // Aktiv pipeline (confirmed → active_rental)
  const pipeline = bookings
    .filter(b => ['confirmed', 'prepared', 'delivered', 'active_rental'].includes(b.status))
    .reduce((s, b) => s + ((b.total_amount ?? 0) - (b.deposit_amount ?? 0)), 0)

  const totalRevenue = revenueBookings
    .reduce((s, b) => s + ((b.total_amount ?? 0) - (b.deposit_amount ?? 0)), 0)

  // ── Inntekter per måned (siste 13 måneder for å beregne vekst) ────────────
  const now = new Date()
  const months = Array.from({ length: 13 }, (_, i) => {
    const d    = new Date(now.getFullYear(), now.getMonth() - 12 + i, 1)
    const next = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
    const mb   = revenueBookings.filter(b => {
      const c = new Date(b.created_at)
      return c >= d && c < next
    })
    return {
      label:   d.toLocaleDateString('nb-NO', { month: 'short', year: '2-digit' }),
      labelFull: d.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' }),
      revenue: mb.reduce((s, b) => s + ((b.total_amount ?? 0) - (b.deposit_amount ?? 0)), 0),
      count:   mb.length,
    }
  })

  const thisMonthRevenue = months[12].revenue
  const lastMonthRevenue = months[11].revenue
  const growth           = pct(thisMonthRevenue, lastMonthRevenue)
  const chartMonths      = months.slice(1) // siste 12 for visning
  const maxMonthlyRev    = Math.max(...chartMonths.map(m => m.revenue), 1)

  // ── Beste produkter ───────────────────────────────────────────────────────
  const validIds = new Set(revenueBookings.map(b => b.id))
  const prodMap  = new Map<string, { name: string; brand: string | null; revenue: number; count: number }>()

  for (const item of bookingItems ?? []) {
    if (!item.product_id || !validIds.has(item.booking_id ?? '')) continue
    const existing = prodMap.get(item.product_id) ?? {
      name:    (item.products as any)?.name  ?? 'Ukjent',
      brand:   (item.products as any)?.brand ?? null,
      revenue: 0,
      count:   0,
    }
    prodMap.set(item.product_id, {
      ...existing,
      revenue: existing.revenue + (item.unit_price ?? 0),
      count:   existing.count + 1,
    })
  }
  const topProducts = [...prodMap.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)

  // ── Kostnad / investering ─────────────────────────────────────────────────
  const inv            = inventory ?? []
  const totalInvestment = inv.reduce((s, i) => s + (i.purchase_price ?? 0), 0)
  const activeUnits    = inv.filter(i => i.status !== 'retired').length
  const damagedUnits   = inv.filter(i => i.status === 'damaged').length
  const roi            = totalInvestment > 0
    ? ((realised / totalInvestment) * 100).toFixed(1)
    : null

  // ── Depositum og utestående ───────────────────────────────────────────────
  const outstandingDeposits = bookings
    .filter(b => ['delivered', 'active_rental'].includes(b.status))
    .reduce((s, b) => s + (b.deposit_amount ?? 0), 0)

  const pendingAmount = bookings
    .filter(b => ['draft', 'pending_payment'].includes(b.status))
    .reduce((s, b) => s + (b.total_amount ?? 0), 0)
  const pendingCount = bookings.filter(b => ['draft', 'pending_payment'].includes(b.status)).length

  // ── Bookingfordeling ──────────────────────────────────────────────────────
  const statusCounts: Record<string, number> = {}
  for (const b of bookings) {
    statusCounts[b.status] = (statusCounts[b.status] ?? 0) + 1
  }

  const statusLabels: Record<string, string> = {
    draft:           'Utkast',
    pending_payment: 'Venter betaling',
    confirmed:       'Bekreftet',
    prepared:        'Klar',
    delivered:       'Levert',
    active_rental:   'Aktiv leie',
    returned:        'Returnert',
    completed:       'Fullført',
    cancelled:       'Kansellert',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Økonomi</h1>
        <p className="text-sm text-gray-500 mt-1">Inntekter, kostnader og investeringsoversikt</p>
      </div>

      {/* ── KPI-kort ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Totale inntekter"
          value={fmt(totalRevenue)}
          sub="Alle bekreftede bookinger"
          dot="bg-[#8FA68B]"
        />
        <KpiCard
          label="Denne måneden"
          value={fmt(thisMonthRevenue)}
          sub={growth
            ? `${growth.up ? '↑' : '↓'} ${growth.value}% vs forrige måned`
            : 'Første måned'}
          subColor={growth ? (growth.up ? 'text-green-600' : 'text-red-500') : undefined}
          dot="bg-[#5B7C99]"
        />
        <KpiCard
          label="Aktiv pipeline"
          value={fmt(pipeline)}
          sub="Bekreftet, ikke fullført"
          dot="bg-[#D6B980]"
        />
        <KpiCard
          label="Utestående depositum"
          value={fmt(outstandingDeposits)}
          sub="Holdes under aktiv leie"
          dot="bg-gray-400"
        />
      </div>

      {/* ── Månedlig inntekt ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 mb-6">
        <h2 className="text-sm font-bold text-[#2B2B2B] mb-1">Månedlig inntekt</h2>
        <p className="text-xs text-gray-400 mb-6">Siste 12 måneder — leiepris ekskl. depositum</p>

        <div className="space-y-2.5">
          {chartMonths.map(m => (
            <div key={m.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-14 text-right shrink-0">{m.label}</span>
              <div className="flex-1 relative h-7 bg-gray-100 rounded-lg overflow-hidden">
                {m.revenue > 0 && (
                  <div
                    className="absolute left-0 top-0 h-full rounded-lg bg-[#8FA68B] transition-all"
                    style={{ width: `${Math.max((m.revenue / maxMonthlyRev) * 100, 2)}%` }}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <span className="text-xs font-semibold text-[#2B2B2B] relative z-10">
                    {m.count > 0 ? `${m.count} booking${m.count > 1 ? 'er' : ''}` : ''}
                  </span>
                  <span className="text-xs font-semibold text-[#2B2B2B] relative z-10">
                    {m.revenue > 0 ? fmt(m.revenue) : '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* ── Beste produkter ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-black/[0.06]">
            <h2 className="text-sm font-bold text-[#2B2B2B]">Mest lønnsomme produkter</h2>
            <p className="text-xs text-gray-400 mt-0.5">Basert på bekreftede bookinger</p>
          </div>
          {topProducts.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400">Ingen data ennå</p>
          ) : (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-black/[0.04]">
                {topProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-[#F8F7F4] transition-colors">
                    <td className="px-5 py-3">
                      {p.brand && (
                        <p className="text-[10px] font-bold text-[#8FA68B] uppercase tracking-widest mb-0.5">
                          {p.brand}
                        </p>
                      )}
                      <p className="font-medium text-[#2B2B2B]">{p.name}</p>
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-gray-400">
                      {p.count} leier
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-[#2B2B2B] whitespace-nowrap">
                      {fmt(p.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Bookingfordeling ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-black/[0.06]">
            <h2 className="text-sm font-bold text-[#2B2B2B]">Bookingfordeling</h2>
            <p className="text-xs text-gray-400 mt-0.5">Alle {bookings.length} bookinger etter status</p>
          </div>
          <div className="divide-y divide-black/[0.04]">
            {Object.entries(statusCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => (
                <div key={status} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm text-[#2B2B2B]">{statusLabels[status] ?? status}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-[#8FA68B]"
                        style={{ width: `${(count / bookings.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#2B2B2B] w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ── Investering & lager ──────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-black/[0.06]">
            <h2 className="text-sm font-bold text-[#2B2B2B]">Investering & avkastning</h2>
            <p className="text-xs text-gray-400 mt-0.5">Basert på innkjøpspris i lageroversikten</p>
          </div>
          <div className="divide-y divide-black/[0.04]">
            <Row label="Total innkjøpskostnad" value={totalInvestment > 0 ? fmt(totalInvestment) : '—'} />
            <Row label="Realiserte inntekter" value={fmt(realised)} />
            <Row
              label="ROI (realisert)"
              value={roi ? `${roi} %` : '—'}
              highlight={!!roi}
            />
            <Row label="Aktive lagerenheter" value={`${activeUnits} stk`} />
            {damagedUnits > 0 && (
              <Row label="Skadede enheter" value={`${damagedUnits} stk`} warn />
            )}
          </div>
          {totalInvestment === 0 && (
            <p className="px-5 py-3 text-xs text-gray-400">
              Legg til innkjøpspris på lagerenhetene under Lager for å se avkastning.
            </p>
          )}
        </div>

        {/* ── Utestående ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="px-5 py-4 border-b border-black/[0.06]">
            <h2 className="text-sm font-bold text-[#2B2B2B]">Utestående</h2>
            <p className="text-xs text-gray-400 mt-0.5">Beløp som venter eller holdes</p>
          </div>
          <div className="divide-y divide-black/[0.04]">
            <Row label="Aktive depositum (holdes)" value={fmt(outstandingDeposits)} />
            <Row label="Ubekreftet / ubetalte bookinger" value={`${pendingCount} stk — ${fmt(pendingAmount)}`} warn={pendingCount > 0} />
            <Row label="Pipeline (bekreftet, ikke fullført)" value={fmt(pipeline)} highlight={pipeline > 0} />
          </div>
        </div>
      </div>

      {/* ── Nøkkeltall oppsummering ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
        <h2 className="text-sm font-bold text-[#2B2B2B] mb-4">Nøkkeltall</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {[
            {
              label: 'Snitt bookingverdi',
              value: revenueBookings.length
                ? fmt(Math.round(totalRevenue / revenueBookings.length))
                : '—',
            },
            {
              label: 'Antall leier totalt',
              value: revenueBookings.length.toString(),
            },
            {
              label: 'Fullføringsrate',
              value: bookings.length
                ? `${Math.round((bookings.filter(b => b.status === 'completed').length / bookings.length) * 100)} %`
                : '—',
            },
            {
              label: 'Kansellert',
              value: bookings.length
                ? `${Math.round((bookings.filter(b => b.status === 'cancelled').length / bookings.length) * 100)} %`
                : '—',
            },
          ].map(stat => (
            <div key={stat.label} className="bg-[#F8F7F4] rounded-xl p-4">
              <p className="text-xl font-bold text-[#2B2B2B]">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Hjelpere ──────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, subColor, dot,
}: {
  label: string
  value: string
  sub?: string
  subColor?: string
  dot: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-black/[0.06]">
      <div className={`w-2 h-2 rounded-full ${dot} mb-4`} />
      <div className="text-2xl font-bold text-[#2B2B2B] mb-1 leading-tight">{value}</div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      {sub && <div className={`text-xs font-medium ${subColor ?? 'text-gray-400'}`}>{sub}</div>}
    </div>
  )
}

function Row({
  label, value, highlight, warn,
}: {
  label: string
  value: string
  highlight?: boolean
  warn?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${
        warn      ? 'text-orange-600' :
        highlight ? 'text-[#5A7A55]'  :
                    'text-[#2B2B2B]'
      }`}>
        {value}
      </span>
    </div>
  )
}
