import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { COMPANY_TYPE_LABELS } from '@/lib/shared'
import {
  generateRecommendations, estimateAnnualSavings,
  type CompanyContext,
} from '@/lib/shared/recommendations'
import {
  ClipboardList, Target, Gift, Users, Building2, Plus,
  Smartphone, Navigation, TrendingUp, Heart, Anchor, Coffee,
  AlertTriangle, ChevronRight, Lightbulb, ArrowRight,
  CheckCircle, CircleDashed, Sparkles, Calendar, BarChart3,
  BadgeCheck,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  Smartphone, Navigation, Gift, ClipboardList, Target,
  Coffee, TrendingUp, Heart, Anchor, AlertTriangle,
}

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; badge: string; icon: string }> = {
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  badge: 'bg-green-100 text-green-800',   icon: 'bg-green-100' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-800',     icon: 'bg-blue-100' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-800',   icon: 'bg-amber-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800', icon: 'bg-purple-100' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    badge: 'bg-red-100 text-red-800',       icon: 'bg-red-100' },
}

function isDecember() { return new Date().getMonth() === 11 }
function isQ4() { return new Date().getMonth() >= 9 }
const currentYear = new Date().getFullYear()

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: accessRows } = await supabase
    .from('company_access').select('company_id, role').eq('user_id', user!.id)

  const companyIds = (accessRows ?? []).map(r => r.company_id)

  const { data: companies } = companyIds.length
    ? await supabase.from('companies').select('*').in('id', companyIds)
    : { data: [] }

  const { data: subscription } = await supabase
    .from('subscriptions').select('*').eq('user_id', user!.id).single()

  let allStats = { meetings: 0, gatherings: 0, gifts: 0, giftsValue: 0 }
  let moduleStats = {
    phone_benefit_count: 0, mileage_trip_count: 0,
    representation_count: 0, welfare_count: 0,
  }

  if (companyIds.length) {
    const [
      { count: meetings }, { count: gatherings },
      { count: gifts }, { data: giftValues },
      { count: phoneBenefits }, { count: mileageTrips },
      { count: representations }, { count: welfare },
    ] = await Promise.all([
      supabase.from('board_meetings').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('strategy_gatherings').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('gifts').select('id', { count: 'exact', head: true }).in('company_id', companyIds).eq('year', currentYear),
      supabase.from('gifts').select('total_value_nok').in('company_id', companyIds).eq('year', currentYear),
      supabase.from('phone_internet_benefits').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('mileage_trips').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('representation_events').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('welfare_measures').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
    ])

    const giftsValue = (giftValues ?? []).reduce((s: number, g: any) => s + Number(g.total_value_nok ?? 0), 0)
    allStats = { meetings: meetings ?? 0, gatherings: gatherings ?? 0, gifts: gifts ?? 0, giftsValue }
    moduleStats = {
      phone_benefit_count: phoneBenefits ?? 0,
      mileage_trip_count: mileageTrips ?? 0,
      representation_count: representations ?? 0,
      welfare_count: welfare ?? 0,
    }
  }

  const primaryCompany = companies && companies.length > 0 ? companies[0] as any : null
  const ctx: CompanyContext | null = primaryCompany ? {
    owner_employed: primaryCompany.owner_employed ?? true,
    payroll_active: primaryCompany.payroll_active ?? false,
    has_employees: primaryCompany.has_employees ?? false,
    employee_count: primaryCompany.employee_count ?? 0,
    spouse_involved: primaryCompany.spouse_involved ?? false,
    uses_phone_for_work: primaryCompany.uses_phone_for_work ?? false,
    company_pays_phone: primaryCompany.company_pays_phone ?? false,
    works_from_home: primaryCompany.works_from_home ?? false,
    company_pays_internet: primaryCompany.company_pays_internet ?? false,
    has_company_car: primaryCompany.has_company_car ?? false,
    uses_private_car_for_biz: primaryCompany.uses_private_car_for_biz ?? false,
    has_cabin_boat: primaryCompany.has_cabin_boat ?? false,
    holds_board_meetings: primaryCompany.holds_board_meetings ?? true,
    holds_strategy_gatherings: primaryCompany.holds_strategy_gatherings ?? false,
    has_client_entertainment: primaryCompany.has_client_entertainment ?? false,
    approx_annual_profit: primaryCompany.approx_annual_profit ?? null,
    current_owner_salary: primaryCompany.current_owner_salary ?? null,
    aga_zone: primaryCompany.aga_zone ?? 'zone1',
    board_meeting_count: allStats.meetings,
    strategy_gathering_count: allStats.gatherings,
    gift_count: allStats.gifts,
    ...moduleStats,
  } satisfies CompanyContext : null

  const recommendations = ctx ? generateRecommendations(ctx) : []
  const savings = ctx ? estimateAnnualSavings(ctx) : null

  const activatedCount = savings ? savings.items.filter(i => i.activated).length : 0
  const totalOpportunities = savings ? savings.items.length : 0
  const activatedSavings = savings ? savings.items.filter(i => i.activated).reduce((s, i) => s + i.amount, 0) : 0

  const highPrio = recommendations.filter(r => r.priority === 'high')
  const otherRecs = recommendations.filter(r => r.priority !== 'high')

  const employeeCount = primaryCompany?.employee_count ?? 0
  const giftBudgetTotal = Math.max(1, employeeCount) * 5000
  const giftBudgetUsed = allStats.giftsValue
  const giftBudgetPct = Math.min(100, Math.round((giftBudgetUsed / giftBudgetTotal) * 100))

  return (
    <div className="max-w-4xl">

      {/* ── NO COMPANY: Kom i gang ─────────────────────────────────────────── */}
      {!primaryCompany && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles size={28} className="text-brand-600" strokeWidth={1.8} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Finn din skatteoptimalisering</h1>
          <p className="text-gray-500 text-lg mb-2 max-w-lg">
            De fleste AS-eiere betaler 20 000–80 000 kr for mye i skatt hvert år — ikke fordi reglene er urettferdige, men fordi de ikke kjenner til dem.
          </p>
          <p className="text-gray-400 mb-8 max-w-md">
            Svar på noen raske spørsmål om selskapet ditt. Vi analyserer situasjonen din og viser deg konkrete muligheter.
          </p>
          <Link href="/onboarding" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
            <CheckCircle size={18} /> Kom i gang — ta 3 minutter
          </Link>
          <p className="text-xs text-gray-400 mt-4">Gratis å starte · Ingen kredittkort nødvendig</p>

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl w-full">
            {[
              { icon: TrendingUp, title: 'Lønn vs. utbytte', body: 'Riktig balanse mellom lønn og utbytte kan spare deg 20 000–80 000 kr/år.' },
              { icon: Gift, title: 'Naturalytelser', body: 'Gaver, telefon, julebord og mer — inntil 15 000 kr per ansatt kan gis skattefritt.' },
              { icon: ClipboardList, title: 'Dokumentasjon', body: 'Alle fradrag krever bilag. Vi sørger for at du har det klart ved bokettersyn.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-4 text-left">
                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center mb-3">
                  <Icon size={16} className="text-brand-600" strokeWidth={1.8} />
                </div>
                <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN DASHBOARD ─────────────────────────────────────────────────── */}
      {primaryCompany && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{primaryCompany.name}</h1>
              <p className="text-gray-500 mt-0.5 text-sm">
                {COMPANY_TYPE_LABELS[primaryCompany.company_type as keyof typeof COMPANY_TYPE_LABELS]}
                {primaryCompany.org_number && ` · ${primaryCompany.org_number}`}
                {subscription && ` · ${subscription.plan_id === 'start' ? 'Start' : subscription.plan_id === 'pro' ? 'Pro' : 'Premium'}-abonnement`}
              </p>
            </div>
            <Link href="/onboarding" className="btn-secondary text-sm flex items-center gap-1.5">
              <Plus size={14} /> Nytt selskap
            </Link>
          </div>

          {/* ── HERO: Skatteoptimalisering ─────────────────────────────────── */}
          {savings && savings.total > 0 && (
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-6 mb-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-brand-200 text-sm font-medium mb-1">Estimert skatteoptimaliserings-potensial {currentYear}</p>
                  <p className="text-4xl font-bold">
                    {savings.total.toLocaleString('nb-NO')} kr
                    <span className="text-xl font-normal text-brand-200 ml-2">/ år</span>
                  </p>
                  <p className="text-brand-200 text-sm mt-1">
                    {activatedCount === 0
                      ? 'Ingen muligheter aktivert ennå — start med en av de under'
                      : `${activatedSavings.toLocaleString('nb-NO')} kr dokumentert · ${activatedCount} av ${totalOpportunities} muligheter aktivert`
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center">
                    <span className="text-lg font-bold">
                      {totalOpportunities > 0 ? Math.round((activatedCount / totalOpportunities) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-xs text-brand-200 mt-1">optimalisert</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="bg-white/10 rounded-full h-2 mb-3">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${totalOpportunities > 0 ? (activatedCount / totalOpportunities) * 100 : 0}%` }}
                />
              </div>

              {/* Opportunity pills */}
              <div className="flex flex-wrap gap-2">
                {savings.items.map(item => (
                  <span
                    key={item.label}
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                      item.activated
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-brand-200 border border-white/20'
                    }`}
                  >
                    {item.activated
                      ? <BadgeCheck size={11} />
                      : <CircleDashed size={11} />
                    }
                    {item.label}
                    {item.amount > 0 && !item.activated && (
                      <span className="opacity-70">~{item.amount.toLocaleString('nb-NO')} kr</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Q4/DECEMBER ALERT ──────────────────────────────────────────── */}
          {isQ4() && (
            <div className={`rounded-xl border p-4 mb-5 flex items-start gap-3 ${isDecember() ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              <Calendar size={16} className={`shrink-0 mt-0.5 ${isDecember() ? 'text-red-500' : 'text-amber-500'}`} />
              <div>
                <p className={`font-semibold text-sm ${isDecember() ? 'text-red-800' : 'text-amber-800'}`}>
                  {isDecember() ? '🎄 Desember — siste sjanse for skatteoptimalisering i år' : '🍂 Q4 — tid for årsplanlegging'}
                </p>
                <div className={`text-xs mt-1.5 space-y-1 ${isDecember() ? 'text-red-700' : 'text-amber-700'}`}>
                  {[
                    `${isDecember() ? '⚠️ Siste mulighet' : '📋 Planlegg nå'}: Gi gaver til ansatte innen 31. desember`,
                    'Registrer årets julebord og velferdstiltak',
                    'Sjekk lønn vs. utbytte — hent ut utbytte før nyttår om det lønner seg',
                    'Avhold siste styremøte for året og skriv protokoll',
                    'Samle alle bilag — representasjon, kjørebok, firmakort',
                  ].map((item, i) => <p key={i}>{item}</p>)}
                </div>
              </div>
            </div>
          )}

          {/* ── HØY-PRIORITET ANBEFALINGER ─────────────────────────────────── */}
          {highPrio.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Gjør dette nå
              </h2>
              <div className="space-y-2.5">
                {highPrio.map(rec => {
                  const Icon = ICON_MAP[rec.icon] ?? Lightbulb
                  const c = COLOR_CLASSES[rec.color]
                  return (
                    <Link
                      key={rec.id}
                      href={rec.href}
                      className="flex items-center gap-4 p-4 rounded-xl border bg-white hover:shadow-md transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center shrink-0`}>
                        <Icon size={18} className={c.text} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900">{rec.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{rec.description}</p>
                        {rec.potential_saving_label && (
                          <p className="text-xs font-semibold text-green-600 mt-1">💰 {rec.potential_saving_label}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
                          {rec.cta}
                        </span>
                        <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-600" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── TO-RADERS GRID: BUDSJETT + STATISTIKK ─────────────────────── */}
          <div className="grid grid-cols-2 gap-4 mb-5">

            {/* Gavebudsjett */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Gift size={14} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-gray-700">Gavebudsjett {currentYear}</span>
                </div>
                <Link href="/gifts" className="text-xs text-brand-600 hover:underline">Se detaljer →</Link>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-900">{giftBudgetUsed.toLocaleString('nb-NO')} kr</span>
                <span className="text-sm text-gray-400 mb-0.5">/ {giftBudgetTotal.toLocaleString('nb-NO')} kr</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2 mb-1">
                <div
                  className={`h-2 rounded-full transition-all ${giftBudgetPct > 90 ? 'bg-red-400' : giftBudgetPct > 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  style={{ width: `${giftBudgetPct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {giftBudgetTotal - giftBudgetUsed > 0
                  ? `${(giftBudgetTotal - giftBudgetUsed).toLocaleString('nb-NO')} kr gjenstår skattefritt`
                  : 'Budsjett brukt opp for i år'
                }
              </p>
            </div>

            {/* Lønn/utbytte snarvei */}
            <Link href="/salary-dividend" className="card p-4 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-brand-600" />
                  <span className="text-sm font-semibold text-gray-700">Lønn vs. utbytte</span>
                </div>
                <ChevronRight size={13} className="text-gray-400 group-hover:text-gray-600" />
              </div>
              {primaryCompany.current_owner_salary ? (
                <>
                  <p className="text-2xl font-bold text-gray-900">
                    {Number(primaryCompany.current_owner_salary).toLocaleString('nb-NO')} kr
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Nåværende lønn — klikk for å optimalisere</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mt-2">Den viktigste skatteoptimaliseringen for AS-eiere</p>
                  <p className="text-xs text-brand-600 font-medium mt-2">Beregn ditt optimum →</p>
                </>
              )}
            </Link>
          </div>

          {/* ── STATISTIKK ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Styremøter', sublabel: 'protokollert', value: allStats.meetings, href: '/board-meetings', Icon: ClipboardList, color: 'text-brand-600', bg: 'bg-brand-50', warn: allStats.meetings === 0 },
              { label: 'Strategisamlinger', sublabel: 'dokumentert', value: allStats.gatherings, href: '/strategy', Icon: Target, color: 'text-violet-600', bg: 'bg-violet-50', warn: false },
              { label: 'Gaver i år', sublabel: `registrert i ${currentYear}`, value: allStats.gifts, href: '/gifts', Icon: Gift, color: 'text-emerald-600', bg: 'bg-emerald-50', warn: false },
            ].map(({ label, sublabel, value, href, Icon, color, bg, warn }) => (
              <Link key={label} href={href} className="card p-4 hover:shadow-md transition-shadow group">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={17} className={color} strokeWidth={1.8} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                {warn && value === 0 && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <AlertTriangle size={10} /> Lovpålagt for AS
                  </p>
                )}
              </Link>
            ))}
          </div>

          {/* ── ANDRE ANBEFALINGER ─────────────────────────────────────────── */}
          {otherRecs.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Flere muligheter
              </h2>
              <div className="card divide-y divide-gray-50">
                {otherRecs.map(rec => {
                  const Icon = ICON_MAP[rec.icon] ?? Lightbulb
                  const c = COLOR_CLASSES[rec.color]
                  return (
                    <Link
                      key={rec.id}
                      href={rec.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-lg ${c.icon} flex items-center justify-center shrink-0`}>
                        <Icon size={15} className={c.text} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{rec.title}</p>
                        {rec.potential_saving_label && (
                          <p className={`text-xs ${c.text}`}>{rec.potential_saving_label}</p>
                        )}
                      </div>
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-600 shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── ANDRE SELSKAPER ────────────────────────────────────────────── */}
          {companies && companies.length > 1 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Andre selskaper</h2>
              <div className="space-y-2">
                {companies.slice(1).map((company: any) => (
                  <div key={company.id} className="card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <Building2 size={16} className="text-gray-500" strokeWidth={1.6} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{company.name}</p>
                        <p className="text-xs text-gray-400">
                          {COMPANY_TYPE_LABELS[company.company_type as keyof typeof COMPANY_TYPE_LABELS]}
                          {company.org_number && ` · ${company.org_number}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/board-meetings/new?company=${company.id}`} className="btn-secondary text-xs">Styremøte</Link>
                      <Link href={`/strategy/new?company=${company.id}`} className="btn-secondary text-xs">Samling</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
