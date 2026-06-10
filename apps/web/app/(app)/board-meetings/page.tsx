import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Plus, ClipboardList, CheckCircle, Clock } from 'lucide-react'

export default async function BoardMeetingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: access } = await supabase
    .from('company_access').select('company_id').eq('user_id', user!.id)
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
          <p className="text-gray-500 mt-1 text-sm">Protokoller og beslutningsdokumenter</p>
        </div>
        <Link href="/board-meetings/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nytt styremøte
        </Link>
      </div>

      {meetings && meetings.length > 0 ? (
        <div className="space-y-2">
          {meetings.map((meeting: any) => (
            <div key={meeting.id} className="card p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  meeting.status === 'finalized' ? 'bg-green-50' : 'bg-gray-100'
                }`}>
                  {meeting.status === 'finalized'
                    ? <CheckCircle size={18} className="text-green-600" strokeWidth={1.8} />
                    : <Clock size={18} className="text-gray-400" strokeWidth={1.8} />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Styremøte #{meeting.meeting_number}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {meeting.companies?.name} · {formatDate(meeting.date)}
                    {meeting.location && ` · ${meeting.location}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  meeting.status === 'finalized'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {meeting.status === 'finalized' ? 'Ferdigstilt' : 'Utkast'}
                </span>
                <Link href={`/board-meetings/${meeting.id}`} className="btn-secondary text-xs">
                  Åpne
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={28} className="text-gray-400" strokeWidth={1.4} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Ingen styremøter ennå</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Dokumenter styremøter for revisjonsklar protokoll med vedtak og deltakerliste.
          </p>
          <Link href="/board-meetings/new" className="btn-primary text-sm">
            Opprett første styremøte
          </Link>
        </div>
      )}
    </div>
  )
}
