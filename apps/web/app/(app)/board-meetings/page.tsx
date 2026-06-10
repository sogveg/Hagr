import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function BoardMeetingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: access } = await supabase
    .from('company_access')
    .select('company_id')
    .eq('user_id', user!.id)

  const companyIds = (access ?? []).map(r => r.company_id)

  const { data: meetings } = companyIds.length
    ? await supabase
        .from('board_meetings')
        .select('*, companies(name)')
        .in('company_id', companyIds)
        .order('date', { ascending: false })
    : { data: [] }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Styremøter</h1>
          <p className="text-gray-500 mt-1">Dokumenter og protokoller</p>
        </div>
        <Link href="/board-meetings/new" className="btn-primary">
          + Nytt styremøte
        </Link>
      </div>

      {meetings && meetings.length > 0 ? (
        <div className="space-y-3">
          {meetings.map((meeting: any) => (
            <div key={meeting.id} className="card p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-gray-900">
                    Styremøte #{meeting.meeting_number}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    meeting.status === 'finalized'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {meeting.status === 'finalized' ? 'Ferdigstilt' : 'Utkast'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {meeting.companies?.name} · {formatDate(meeting.date)}
                  {meeting.location && ` · ${meeting.location}`}
                </p>
              </div>
              <Link
                href={`/board-meetings/${meeting.id}`}
                className="btn-secondary text-sm"
              >
                Åpne
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="font-semibold text-gray-900 mb-2">Ingen styremøter ennå</h3>
          <p className="text-gray-500 text-sm mb-6">
            Dokumenter styremøter for å ha revisjonsklar protokoll.
          </p>
          <Link href="/board-meetings/new" className="btn-primary">
            Opprett første styremøte
          </Link>
        </div>
      )}
    </div>
  )
}
