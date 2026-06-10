import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText, FolderOpen, CheckCircle, Clock, Download, Archive } from 'lucide-react'

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: access } = await supabase
    .from('company_access').select('company_id').eq('user_id', user!.id)
  const companyIds = (access ?? []).map(r => r.company_id)

  const { data: companies } = companyIds.length
    ? await supabase.from('companies').select('*').in('id', companyIds)
    : { data: [] }

  const { data: meetings } = companyIds.length
    ? await supabase.from('board_meetings').select('*, companies(name)').in('company_id', companyIds).order('date', { ascending: false }).limit(10)
    : { data: [] }

  const { data: gatherings } = companyIds.length
    ? await supabase.from('strategy_gatherings').select('*, companies(name)').in('company_id', companyIds).order('date_from', { ascending: false }).limit(10)
    : { data: [] }

  const year = new Date().getFullYear()

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dokumenter og eksport</h1>
          <p className="text-gray-500 mt-1 text-sm">Last ned PDF-er og eksporter bokettersynsmappe</p>
        </div>
      </div>

      {/* Bokettersynsmappe eksport */}
      <div className="card p-5 mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
            <Archive size={20} className="text-brand-600" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Bokettersynsmappe</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Last ned en komplett ZIP-mappe med alle styreprotokoller, strategisamlingsrapporter,
              gaveliste, telefon/internett-oversikt og representasjon for valgt selskap og år.
            </p>
          </div>
        </div>

        {companies && companies.length > 0 ? (
          <div className="space-y-3">
            {companies.map((company: any) => (
              <div key={company.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                <div>
                  <p className="font-medium text-sm text-gray-900">{company.name}</p>
                  <p className="text-xs text-gray-500">{company.company_type} · Org.nr: {company.org_number ?? '—'}</p>
                </div>
                <div className="flex gap-2">
                  {[year - 1, year].map(y => (
                    <a
                      key={y}
                      href={`/api/export/audit-folder?company_id=${company.id}&year=${y}`}
                      className="btn-secondary text-xs flex items-center gap-1.5"
                      download
                    >
                      <Download size={13} strokeWidth={2} />
                      {y}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Ingen selskaper funnet.</p>
        )}
      </div>

      {/* Styreprotokoller */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={17} className="text-gray-500" strokeWidth={1.8} />
          Styreprotokoller (PDF)
        </h2>
        {meetings && meetings.length > 0 ? (
          <div className="space-y-2">
            {meetings.map((meeting: any) => (
              <div key={meeting.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    meeting.status === 'finalized' ? 'bg-green-50' : 'bg-gray-100'
                  }`}>
                    {meeting.status === 'finalized'
                      ? <CheckCircle size={16} className="text-green-600" strokeWidth={1.8} />
                      : <Clock size={16} className="text-gray-400" strokeWidth={1.8} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      Styremøte #{meeting.meeting_number} — {meeting.date}
                    </p>
                    <p className="text-xs text-gray-500">{meeting.companies?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    meeting.status === 'finalized' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {meeting.status === 'finalized' ? 'Ferdigstilt' : 'Utkast'}
                  </span>
                  <a
                    href={`/api/pdf/board-meeting/${meeting.id}`}
                    className="btn-secondary text-xs flex items-center gap-1.5"
                    download
                  >
                    <Download size={13} strokeWidth={2} /> PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText size={22} className="text-gray-400" strokeWidth={1.4} />
            </div>
            <p className="text-gray-500 text-sm">Ingen styremøter ennå.</p>
            <Link href="/board-meetings/new" className="btn-primary text-sm mt-4 inline-block">Opprett styremøte</Link>
          </div>
        )}
      </div>

      {/* Strategisamlinger */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={17} className="text-gray-500" strokeWidth={1.8} />
          Strategisamlingsrapporter (PDF)
        </h2>
        {gatherings && gatherings.length > 0 ? (
          <div className="space-y-2">
            {gatherings.map((g: any) => (
              <div key={g.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    g.status === 'finalized' ? 'bg-violet-50' : 'bg-gray-100'
                  }`}>
                    {g.status === 'finalized'
                      ? <CheckCircle size={16} className="text-violet-600" strokeWidth={1.8} />
                      : <Clock size={16} className="text-gray-400" strokeWidth={1.8} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{g.title}</p>
                    <p className="text-xs text-gray-500">{g.companies?.name} · {g.date_from}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    g.status === 'finalized' ? 'bg-violet-50 text-violet-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {g.status === 'finalized' ? 'Ferdigstilt' : 'Utkast'}
                  </span>
                  <a
                    href={`/api/pdf/strategy/${g.id}`}
                    className="btn-secondary text-xs flex items-center gap-1.5"
                    download
                  >
                    <Download size={13} strokeWidth={2} /> PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FolderOpen size={22} className="text-gray-400" strokeWidth={1.4} />
            </div>
            <p className="text-gray-500 text-sm">Ingen strategisamlinger ennå.</p>
            <Link href="/strategy/new" className="btn-primary text-sm mt-4 inline-block">Opprett strategisamling</Link>
          </div>
        )}
      </div>

      {/* Gaveliste PDF */}
      {companies && companies.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={17} className="text-gray-500" strokeWidth={1.8} />
            Gaveliste og personalrabatter (PDF)
          </h2>
          <div className="space-y-2">
            {companies.map((company: any) => (
              <div key={company.id} className="card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">{company.name}</p>
                  <p className="text-xs text-gray-500">Gaver, gavekort og personalrabatter</p>
                </div>
                <div className="flex gap-2">
                  {[year - 1, year].map(y => (
                    <a
                      key={y}
                      href={`/api/pdf/gifts?company_id=${company.id}&year=${y}`}
                      className="btn-secondary text-xs flex items-center gap-1.5"
                      download
                    >
                      <Download size={13} strokeWidth={2} /> Gaveliste {y}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
