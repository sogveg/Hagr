import { createClient } from '@/lib/supabase/server'

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: access } = await supabase
    .from('company_access')
    .select('company_id')
    .eq('user_id', user!.id)

  const companyIds = (access ?? []).map(r => r.company_id)

  const { data: documents } = companyIds.length
    ? await supabase
        .from('documents')
        .select('*, companies(name)')
        .in('company_id', companyIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dokumenter</h1>
          <p className="text-gray-500 mt-1">Genererte dokumenter og bokettersynsmappe</p>
        </div>
      </div>

      <div className="card p-6 mb-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <span className="text-xl">📄</span>
          <div>
            <p className="font-medium text-blue-900">PDF-generering</p>
            <p className="text-sm text-blue-700 mt-1">
              PDF-generering for styreprotokoller, innkallinger, kostnadsoversikter og bokettersynsmapper
              er planlagt som neste funksjon. Dokumentstrukturen er klar.
            </p>
          </div>
        </div>
      </div>

      {documents && documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc: any) => (
            <div key={doc.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{doc.title}</p>
                <p className="text-sm text-gray-500">
                  {doc.companies?.name} · {doc.document_type}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                doc.status === 'final' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {doc.status === 'final' ? 'Ferdig' : 'Utkast'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="font-semibold text-gray-900 mb-2">Bokettersynsmappe</h3>
          <p className="text-gray-500 text-sm">
            Dokumenter genereres automatisk når du ferdigstiller styremøter og strategisamlinger.
          </p>
        </div>
      )}
    </div>
  )
}
