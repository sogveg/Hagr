import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('nb-NO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function timeAgo(dateStr: string | null | undefined) {
  if (!dateStr) return 'Aldri'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'I dag'
  if (days === 1) return 'I går'
  if (days < 7) return `${days} dager siden`
  if (days < 30) return `${Math.floor(days / 7)} uker siden`
  return `${Math.floor(days / 30)} mnd siden`
}

export default async function AdminPage() {
  const supabase = await createClient()

  // Use service role for full access to auth.users
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [
    { data: { users }, error: usersError },
    { data: companies },
    { data: subscriptions },
    { data: companyAccess },
  ] = await Promise.all([
    adminSupabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from('companies').select('id, name, company_type, org_number, created_at'),
    supabase.from('subscriptions').select('user_id, plan_id, status, current_period_end'),
    supabase.from('company_access').select('user_id, company_id, role'),
  ])

  const subsByUser = Object.fromEntries(
    (subscriptions ?? []).map((s: any) => [s.user_id, s])
  )

  const accessByUser: Record<string, string[]> = {}
  for (const row of (companyAccess ?? [])) {
    if (!accessByUser[row.user_id]) accessByUser[row.user_id] = []
    accessByUser[row.user_id].push(row.company_id)
  }

  const companiesById = Object.fromEntries(
    (companies ?? []).map((c: any) => [c.id, c])
  )

  const totalUsers = users?.length ?? 0
  const activeToday = (users ?? []).filter(u => {
    if (!u.last_sign_in_at) return false
    return Date.now() - new Date(u.last_sign_in_at).getTime() < 1000 * 60 * 60 * 24
  }).length
  const activeThisWeek = (users ?? []).filter(u => {
    if (!u.last_sign_in_at) return false
    return Date.now() - new Date(u.last_sign_in_at).getTime() < 1000 * 60 * 60 * 24 * 7
  }).length
  const withCompany = (users ?? []).filter(u => (accessByUser[u.id] ?? []).length > 0).length
  const paying = (subscriptions ?? []).filter((s: any) => s.status === 'active').length

  const sortedUsers = [...(users ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Admin-dashboard</h1>
        <p className="text-gray-500 text-sm">Oversikt over alle brukere, selskaper og abonnementer</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Brukere totalt', value: totalUsers },
          { label: 'Aktive i dag', value: activeToday },
          { label: 'Aktive sist uke', value: activeThisWeek },
          { label: 'Med selskap', value: withCompany },
          { label: 'Betalende', value: paying },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {usersError && (
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 mb-6 text-red-300 text-sm">
          Feil ved henting av brukere: {usersError.message}
        </div>
      )}

      {/* User table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white text-sm">Alle brukere ({totalUsers})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-800">
                <th className="text-left px-6 py-3">E-post</th>
                <th className="text-left px-6 py-3">Registrert</th>
                <th className="text-left px-6 py-3">Sist aktiv</th>
                <th className="text-left px-6 py-3">Selskaper</th>
                <th className="text-left px-6 py-3">Abonnement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {sortedUsers.map(user => {
                const userCompanyIds = accessByUser[user.id] ?? []
                const sub = subsByUser[user.id]
                const userCompanies = userCompanyIds.map(id => companiesById[id]).filter(Boolean)

                return (
                  <tr key={user.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-3">
                      <div>
                        <span className="text-white font-medium">{user.email}</span>
                        {user.email_confirmed_at ? null : (
                          <span className="ml-2 text-xs text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Ubekreftet</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 font-mono">{user.id.slice(0, 8)}…</p>
                    </td>
                    <td className="px-6 py-3 text-gray-400 whitespace-nowrap">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-3 text-gray-400 whitespace-nowrap">
                      {timeAgo(user.last_sign_in_at)}
                    </td>
                    <td className="px-6 py-3">
                      {userCompanies.length === 0 ? (
                        <span className="text-gray-600 text-xs">Ingen</span>
                      ) : (
                        <div className="space-y-1">
                          {userCompanies.map((c: any) => (
                            <div key={c.id} className="text-xs">
                              <span className="text-gray-300">{c.name}</span>
                              <span className="text-gray-600 ml-1">({c.company_type})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {sub ? (
                        <div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            sub.status === 'active'
                              ? 'bg-green-500/15 text-green-400'
                              : 'bg-gray-700 text-gray-400'
                          }`}>
                            {sub.plan_id} · {sub.status}
                          </span>
                          {sub.current_period_end && (
                            <p className="text-xs text-gray-600 mt-0.5">
                              Fornyes {formatDate(sub.current_period_end)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600">Gratis</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Companies table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white text-sm">Alle selskaper ({companies?.length ?? 0})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-800">
                <th className="text-left px-6 py-3">Navn</th>
                <th className="text-left px-6 py-3">Type</th>
                <th className="text-left px-6 py-3">Org.nr</th>
                <th className="text-left px-6 py-3">Opprettet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {(companies ?? []).map((company: any) => (
                <tr key={company.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-3 text-white font-medium">{company.name}</td>
                  <td className="px-6 py-3 text-gray-400 uppercase text-xs">{company.company_type}</td>
                  <td className="px-6 py-3 text-gray-400 font-mono text-xs">{company.org_number ?? '—'}</td>
                  <td className="px-6 py-3 text-gray-400">{formatDate(company.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
