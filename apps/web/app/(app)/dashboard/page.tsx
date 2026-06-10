import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { COMPANY_TYPE_LABELS } from '@/lib/shared'
import { generateRecommendations, type CompanyContext } from '@/lib/shared/recommendations'
import {
  ClipboardList, Target, Gift, Users, Building2, Plus,
  Smartphone, Navigation, TrendingUp, Heart, Anchor, Coffee,
  AlertTriangle, ChevronRight, CheckCircle, Lightbulb, Star,
} from 'lucide-react'

// ─── Icon map for recommendations ────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Smartphone, Navigation, Gift, ClipboardList, Target,
  Coffee, TrendingUp, Heart, Anchor, AlertTriangle,
}

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  badge: 'bg-green-100 text-green-800' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-800' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-800' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    badge: 'bg-red-100 text-red-800' },
}

const PRIORITY_LABEL: Record<string, string> = {
  high: 'Høy prioritet', medium: 'Middels', low: 'Lav prioritet'
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: accessRows } = await supabase
    .from('company_access')
    .select('company_id, role')
    .eq('user_id', user!.id)

  const companyIds = (accessRows ?? []).map(r => r.company_id)

  const { data: companies } = companyIds.length
    ? await supabase.from('companies').select('*').in('id', companyIds)
    : { data: [] }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  const currentYear = new Date().getFullYear()

  let allStats = { meetings: 0, gatherings: 0, gifts: 0 }
  let moduleStats = {
    phone_benefit_count: 0, mileage_trip_count: 0,
    representation_count: 0, welfare_count: 0,
  }

  if (companyIds.length) {
    const [
      { count: meetings }, { count: gatherings }, { count: gifts },
      { count: phoneBenefits }, { count: mileageTrips },
      { count: representations }, { count: welfare },
    ] = await Promise.all([
      supabase.from('board_meetings').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('strategy_gatherings').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('gifts').select('id', { count: 'exact', head: true }).in('company_id', companyIds).eq('year', currentYear),
      supabase.from('phone_internet_benefits').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('mileage_trips').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('representation_events').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('welfare_measures').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
    ])
    allStats = { meetings: meetings ?? 0, gatherings: gatherings ?? 0, gifts: gifts ?? 0 }
    moduleStats = {
      phone_benefit_count: phoneBenefits ?? 0,
      mileage_trip_count: mileageTrips ?? 0,
      representation_count: representations ?? 0,
      welfare_count: welfare ?? 0,
    }
  }

  // Build recommendations from primary company (first one)
  const primaryCompany = companies && companies.length > 0 ? companies[0] as any : null
  const recommendations = primaryCompany ? generateRecommendations({
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
    holds_board_meetings: primaryCompany.holds_board_meetings ?? true, // assume yes for AS
    holds_strategy_gatherings: primaryCompany.holds_strategy_gatherings ?? false,
    has_client_entertainment: primaryCompany.has_client_entertainment ?? false,
    approx_annual_profit: primaryCompany.approx_annual_profit ?? null,
    current_owner_salary: primaryCompany.current_owner_salary ?? null,
    aga_zone: primaryCompany.aga_zone ?? 'zone1',
    board_meeting_count: allStats.meetings,
    strategy_gathering_count: allStats.gatherings,
    gift_count: allStats.gifts,
    ...moduleStats,
  } satisfies CompanyContext) : []

  const highPrio = recommendations.filter(r => r.priority === 'high')
  const otherRecs = recommendations.filter(r => r.priority !== 'high')

  const PLAN_LABELS: Record<string, string> = { start: 'Start', pro: 'Pro', premium: 'Premium' }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Oversikt</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {subscription ? `${PLAN_LABELS[subscription.plan_id] ?? subscription.plan_id}-abonnement` : 'Ingen aktiv abonnement'}
          </p>
        </div>
        <Link href="/onboarding" className="flex items-center gap-2 btn-secondary text-sm">
          <Plus size={15} /> Nytt selskap
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Styremøter', value: allStats.meetings,    href: '/board-meetings', Icon: ClipboardList, color: 'text-brand-600',   bg: 'bg-brand-50' },
          { label: 'Strategisamlinger', value: allStats.gatherings, href: '/strategy', Icon: Target, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Gaver i år',  value: allStats.gifts,      href: '/gifts',          Icon: Gift,          color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(({ label, value, href, Icon, color, bg }) => (
          <Link key={label} href={href} className="card p-5 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={20} className={color} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ─── ANBEFALINGER ────────────────────────────────────────────────────── */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
              <Star size={14} className="text-amber-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Våre anbefalinger for deg</h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              {recommendations.length} muligheter
            </span>
          </div>

          {/* High priority — prominent cards */}
          {highPrio.length > 0 && (
            <div className="space-y-3 mb-4">
              {highPrio.map(rec => {
                const Icon = ICON_MAP[rec.icon] ?? Lightbulb
                const c = COLOR_CLASSES[rec.color]
                return (
                  <Link
                    key={rec.id}
                    href={rec.href}
                    className={`flex items-start gap-4 p-4 rounded-xl border ${c.bg} ${c.border} hover:shadow-md transition-all group`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0`}>
                      <Icon size={18} className={c.text} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`font-semibold text-sm ${c.text}`}>{rec.title}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${c.badge}`}>
                          {PRIORITY_LABEL[rec.priority]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-snug">{rec.description}</p>
                      {rec.potential_saving_label && (
                        <p className={`text-xs font-semibold mt-1.5 ${c.text}`}>
                          💰 {rec.potential_saving_label}
                        </p>
                      )}
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold mt-2 ${c.text} group-hover:underline`}>
                        {rec.cta} <ChevronRight size={12} />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Other recommendations — compact list */}
          {otherRecs.length > 0 && (
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
                    <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
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
          )}
        </div>
      )}

      {/* No company yet — placeholder */}
      {!primaryCompany && (
        <div className="card p-6 mb-6 bg-gradient-to-r from-brand-50 to-blue-50 border border-brand-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
              <Lightbulb size={20} className="text-brand-600" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Kom i gang — få dine personlige anbefalinger</p>
              <p className="text-sm text-gray-600 mb-3">Registrer selskapet ditt og svar på noen raske spørsmål. Vi analyserer situasjonen din og viser deg konkrete skattemuligheter.</p>
              <Link href="/onboarding" className="btn-primary text-sm inline-flex items-center gap-2">
                <CheckCircle size={14} /> Kom i gang
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Companies */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Dine selskaper</h2>
      </div>

      {companies && companies.length > 0 ? (
        <div className="space-y-3 mb-8">
          {companies.map((company: any) => (
            <div key={company.id} className="card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-gray-500" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{company.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {COMPANY_TYPE_LABELS[company.company_type as keyof typeof COMPANY_TYPE_LABELS]}
                    {company.org_number && ` · ${company.org_number}`}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {company.has_employees && (
                      <span className="text-xs text-gray-400">{company.employee_count} ansatte</span>
                    )}
                    {company.owner_employed && <span className="text-xs text-gray-400">· Eier ansatt</span>}
                    {company.payroll_active && <span className="text-xs text-gray-400">· Lønnskjøring</span>}
                    {company.approx_annual_profit && (
                      <span className="text-xs text-gray-400">· ~{Number(company.approx_annual_profit).toLocaleString('nb-NO')} kr i overskudd</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/board-meetings/new?company=${company.id}`} className="btn-secondary text-xs">
                  Nytt styremøte
                </Link>
                <Link href={`/strategy/new?company=${company.id}`} className="btn-secondary text-xs">
                  Ny samling
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center mb-8">
          <p className="text-gray-500 mb-4 text-sm">Ingen selskaper ennå</p>
          <Link href="/onboarding" className="btn-primary text-sm">Legg til selskap</Link>
        </div>
      )}

      {/* Quick actions */}
      <h2 className="text-base font-semibold text-gray-900 mb-4">Hurtigvalg</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/board-meetings/new', Icon: ClipboardList, label: 'Nytt styremøte',     color: 'text-brand-600',   bg: 'bg-brand-50' },
          { href: '/strategy/new',       Icon: Target,         label: 'Ny strategisamling', color: 'text-violet-600', bg: 'bg-violet-50' },
          { href: '/gifts',              Icon: Gift,           label: 'Registrer gave',      color: 'text-emerald-600',bg: 'bg-emerald-50' },
          { href: '/people',             Icon: Users,          label: 'Legg til person',     color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(({ href, Icon, label, color, bg }) => (
          <Link key={href} href={href} className="card p-4 text-center hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform`}>
              <Icon size={20} className={color} strokeWidth={1.8} />
            </div>
            <p className="text-sm font-medium text-gray-700">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
