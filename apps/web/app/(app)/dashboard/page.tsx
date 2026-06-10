import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { COMPANY_TYPE_LABELS } from '@/lib/shared'
import {
  ClipboardList,
  Target,
  Gift,
  Users,
  Building2,
  Plus,
} from 'lucide-react'

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

  let allStats = { meetings: 0, gatherings: 0, gifts: 0 }
  if (companyIds.length) {
    const [{ count: meetings }, { count: gatherings }, { count: gifts }] = await Promise.all([
      supabase.from('board_meetings').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('strategy_gatherings').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('gifts').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
    ])
    allStats = { meetings: meetings ?? 0, gatherings: gatherings ?? 0, gifts: gifts ?? 0 }
  }

  const PLAN_LABELS: Record<string, string> = {
    start: 'Start',
    pro: 'Pro',
    premium: 'Premium',
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Oversikt</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {subscription
              ? `${PLAN_LABELS[subscription.plan_id] ?? subscription.plan_id}-abonnement`
              : 'Ingen aktiv abonnement'}
          </p>
        </div>
        <Link
          href="/onboarding"
          className="flex items-center gap-2 btn-secondary text-sm"
        >
          <Plus size={15} />
          Nytt selskap
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Styremøter', value: allStats.meetings,   href: '/board-meetings', Icon: ClipboardList, color: 'text-brand-600',  bg: 'bg-brand-50' },
          { label: 'Strategisamlinger', value: allStats.gatherings, href: '/strategy', Icon: Target, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Gaver registrert', value: allStats.gifts, href: '/gifts', Icon: Gift, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    {company.has_employees && <span>{company.employee_count} ansatte</span>}
                    {company.owner_employed && <span>· Eier ansatt</span>}
                    {company.payroll_active && <span>· Lønnskjøring</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
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
          { href: '/board-meetings/new', Icon: ClipboardList, label: 'Nytt styremøte',      color: 'text-brand-600',   bg: 'bg-brand-50' },
          { href: '/strategy/new',       Icon: Target,         label: 'Ny strategisamling',  color: 'text-violet-600', bg: 'bg-violet-50' },
          { href: '/gifts',              Icon: Gift,           label: 'Registrer gave',       color: 'text-emerald-600',bg: 'bg-emerald-50' },
          { href: '/people',             Icon: Users,          label: 'Legg til person',      color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(({ href, Icon, label, color, bg }) => (
          <Link
            key={href}
            href={href}
            className="card p-4 text-center hover:shadow-md transition-shadow group"
          >
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
