import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { COMPANY_TYPE_LABELS } from '@skattsmart/shared'

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

  // Counts per company
  const stats: Record<string, { meetings: number; gatherings: number; gifts: number }> = {}
  if (companyIds.length) {
    const [{ count: meetings }, { count: gatherings }, { count: gifts }] = await Promise.all([
      supabase.from('board_meetings').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('strategy_gatherings').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
      supabase.from('gifts').select('id', { count: 'exact', head: true }).in('company_id', companyIds),
    ])
    stats['all'] = { meetings: meetings ?? 0, gatherings: gatherings ?? 0, gifts: gifts ?? 0 }
  }

  const allStats = stats['all'] ?? { meetings: 0, gatherings: 0, gifts: 0 }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Oversikt</h1>
          <p className="text-gray-500 mt-1">
            {subscription ? (
              <span className="capitalize">{subscription.plan_id}-abonnement</span>
            ) : 'Ingen abonnement'}
          </p>
        </div>
        <Link href="/onboarding" className="btn-secondary text-sm">
          + Nytt selskap
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Styremøter', value: allStats.meetings, href: '/board-meetings', color: 'brand' },
          { label: 'Strategisamlinger', value: allStats.gatherings, href: '/strategy', color: 'purple' },
          { label: 'Gaver registrert', value: allStats.gifts, href: '/gifts', color: 'green' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href} className="card p-5 hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Companies */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Dine selskaper</h2>
      {companies && companies.length > 0 ? (
        <div className="grid gap-4">
          {companies.map(company => (
            <div key={company.id} className="card p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{company.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {COMPANY_TYPE_LABELS[company.company_type as keyof typeof COMPANY_TYPE_LABELS]}
                  {company.org_number && ` · ${company.org_number}`}
                </p>
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  {company.has_employees && <span>{company.employee_count} ansatte</span>}
                  {company.owner_employed && <span>· Eier ansatt</span>}
                  {company.payroll_active && <span>· Lønnskjøring</span>}
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
        <div className="card p-8 text-center">
          <p className="text-gray-500 mb-4">Ingen selskaper ennå</p>
          <Link href="/onboarding" className="btn-primary">Legg til selskap</Link>
        </div>
      )}

      {/* Quick actions */}
      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Hurtigvalg</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/board-meetings/new', icon: '📋', label: 'Nytt styremøte' },
          { href: '/strategy/new', icon: '🎯', label: 'Ny strategisamling' },
          { href: '/gifts', icon: '🎁', label: 'Registrer gave' },
          { href: '/people', icon: '👥', label: 'Legg til person' },
        ].map(action => (
          <Link
            key={action.href}
            href={action.href}
            className="card p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <p className="text-sm font-medium text-gray-700">{action.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
