import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function StrategyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: access } = await supabase
    .from('company_access')
    .select('company_id')
    .eq('user_id', user!.id)

  const companyIds = (access ?? []).map(r => r.company_id)

  const { data: gatherings } = companyIds.length
    ? await supabase
        .from('strategy_gatherings')
        .select('*, companies(name)')
        .in('company_id', companyIds)
        .order('date_from', { ascending: false })
    : { data: [] }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Strategisamlinger</h1>
          <p className="text-gray-500 mt-1">Faglige samlinger og offsite</p>
        </div>
        <Link href="/strategy/new" className="btn-primary">+ Ny samling</Link>
      </div>

      {gatherings && gatherings.length > 0 ? (
        <div className="space-y-3">
          {gatherings.map((g: any) => (
            <div key={g.id} className="card p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-gray-900">{g.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    g.status === 'finalized' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {g.status === 'finalized' ? 'Ferdigstilt' : 'Utkast'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {g.companies?.name} · {formatDate(g.date_from)} – {formatDate(g.date_to)}
                  {g.location && ` · ${g.location}`}
                </p>
              </div>
              <Link href={`/strategy/${g.id}`} className="btn-secondary text-sm">Åpne</Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="font-semibold text-gray-900 mb-2">Ingen strategisamlinger ennå</h3>
          <p className="text-gray-500 text-sm mb-6">
            Dokumenter strategisamlinger med formål, program og deltakerliste for skattemessig fradrag.
          </p>
          <Link href="/strategy/new" className="btn-primary">Opprett første samling</Link>
        </div>
      )}
    </div>
  )
}
