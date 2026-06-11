'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RiskCard from '@/components/risk/RiskCard'
import { assessRisk, type RiskResult } from '@/lib/shared'
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'

function TipBox({ tips, defaultOpen = false }: { tips: string[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left">
        <div className="flex items-center gap-2">
          <Lightbulb size={14} className="text-amber-500 shrink-0" strokeWidth={2} />
          <span className="text-sm font-medium text-amber-800">Tips og råd</span>
        </div>
        {open ? <ChevronUp size={13} className="text-amber-400" /> : <ChevronDown size={13} className="text-amber-400" />}
      </button>
      {open && (
        <ul className="px-4 pb-4 space-y-2 border-t border-amber-100 pt-3">
          {tips.map((tip, i) => (
            <li key={i} className="text-sm text-amber-800 flex gap-2">
              <span className="shrink-0 mt-0.5 text-amber-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: tip }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface AgendaItem {
  title: string
  description: string
  presenter: string
  duration_minutes: number
}

interface Decision {
  agenda_index: number
  text: string
  vote_for: number
  vote_against: number
  vote_abstain: number
  carried: boolean
}

interface FormState {
  company_id: string
  date: string
  start_time: string
  end_time: string
  location: string
  meeting_format: 'physical' | 'digital' | 'hybrid'
  called_by: string
  chairperson: string
  minute_taker: string
  agenda_items: AgendaItem[]
  decisions: Decision[]
  costs_total: number
  private_elements: boolean
  missing_documentation: boolean
}

// Standard agenda templates per meeting type
type MeetingTemplate = 'ordinary' | 'annual' | 'agm' | 'strategy' | 'extraordinary'

const MEETING_TEMPLATES: Record<MeetingTemplate, { label: string; description: string; agenda: AgendaItem[] }> = {
  ordinary: {
    label: 'Ordinært styremøte',
    description: 'Kvartalsmessig eller halvårlig styremøte',
    agenda: [
      { title: 'Godkjenning av innkalling og dagsorden', description: 'Styret godkjenner at møtet er lovlig innkalt og at dagsorden godtas.', presenter: '', duration_minutes: 5 },
      { title: 'Gjennomgang av økonomi og likviditet', description: 'Resultat, balanse og likviditetsoversikt for perioden. Avvik mot budsjett kommenteres.', presenter: '', duration_minutes: 20 },
      { title: 'Status drift og operasjonelle saker', description: 'Orientering om status i selskapet, pågående prosjekter og eventuelle utfordringer.', presenter: '', duration_minutes: 20 },
      { title: 'Fastsettelse av lønn/honorar til daglig leder', description: 'Styret fastsetter lønn til daglig leder for kommende periode. Vedtas med konkret beløp og stemmetall.', presenter: '', duration_minutes: 10 },
      { title: 'Eventuelt', description: '', presenter: '', duration_minutes: 10 },
    ],
  },
  annual: {
    label: 'Årsavslutning / styrebehandling av regnskap',
    description: 'Styrets behandling av årsregnskap og årsberetning (senest 30. juni)',
    agenda: [
      { title: 'Godkjenning av innkalling og dagsorden', description: '', presenter: '', duration_minutes: 5 },
      { title: 'Styrets behandling av årsregnskap', description: 'Styret gjennomgår og godkjenner årsregnskapet. Revisjonsberetning gjennomgås. Styret avgir erklæring om at regnskapet er avlagt i samsvar med god regnskapsskikk.', presenter: '', duration_minutes: 30 },
      { title: 'Styrets årsberetning', description: 'Styret godkjenner årsberetningen, herunder omtale av virksomheten, fremtidsutsikter og forutsetningen om fortsatt drift.', presenter: '', duration_minutes: 15 },
      { title: 'Forslag til disponering av årsresultat', description: 'Styret fremmer forslag til generalforsamlingen om disponering av årets resultat (utbytte, overføring til egenkapital e.l.).', presenter: '', duration_minutes: 15 },
      { title: 'Fastsettelse av lønn til daglig leder for kommende år', description: 'Styret fastsetter lønn til daglig leder. Vedtas med konkret beløp og stemmetall.', presenter: '', duration_minutes: 10 },
      { title: 'Eventuelt', description: '', presenter: '', duration_minutes: 5 },
    ],
  },
  agm: {
    label: 'Generalforsamling (ordinær)',
    description: 'Ordinær generalforsamling — behandling av årsregnskap og utbytte',
    agenda: [
      { title: 'Åpning og valg av møteleder', description: 'Møteleder velges av generalforsamlingen. Innkalling godkjennes.', presenter: '', duration_minutes: 5 },
      { title: 'Godkjenning av årsregnskap og årsberetning', description: 'Generalforsamlingen godkjenner styrets fremlagte årsregnskap og årsberetning.', presenter: '', duration_minutes: 20 },
      { title: 'Disponering av årsresultat / utbyttebeslutning', description: 'Generalforsamlingen beslutter disponering av årsresultatet, herunder eventuell utbytteutbetaling. Vedtas med konkret beløp per aksje.', presenter: '', duration_minutes: 15 },
      { title: 'Valg av styre', description: 'Generalforsamlingen velger styremedlemmer og fastsetter styrehonorarer.', presenter: '', duration_minutes: 10 },
      { title: 'Valg av revisor', description: 'Generalforsamlingen velger revisor og fastsetter revisors honorar (dersom aktuelt).', presenter: '', duration_minutes: 5 },
      { title: 'Eventuelt', description: '', presenter: '', duration_minutes: 5 },
    ],
  },
  strategy: {
    label: 'Styremøte — strategigjennomgang',
    description: 'Styrets behandling av strategi, budsjett eller større beslutninger',
    agenda: [
      { title: 'Godkjenning av innkalling og dagsorden', description: '', presenter: '', duration_minutes: 5 },
      { title: 'Gjennomgang av strategiplan', description: 'Styret gjennomgår og diskuterer selskapets strategiplan og målsetninger.', presenter: '', duration_minutes: 30 },
      { title: 'Budsjett og handlingsplan', description: 'Styret behandler og godkjenner budsjett for kommende periode.', presenter: '', duration_minutes: 20 },
      { title: 'Risikovurdering', description: 'Styret gjennomgår vesentlige risikoer knyttet til selskapets virksomhet.', presenter: '', duration_minutes: 15 },
      { title: 'Fastsettelse av lønn til daglig leder', description: 'Styret fastsetter lønn til daglig leder. Vedtas med konkret beløp og stemmetall.', presenter: '', duration_minutes: 10 },
      { title: 'Eventuelt', description: '', presenter: '', duration_minutes: 5 },
    ],
  },
  extraordinary: {
    label: 'Ekstraordinært styremøte',
    description: 'Enkeltvedtak som krever styrebehandling',
    agenda: [
      { title: 'Godkjenning av innkalling og dagsorden', description: '', presenter: '', duration_minutes: 5 },
      { title: 'Sak til behandling', description: 'Beskriv den konkrete saken som krever styrebehandling.', presenter: '', duration_minutes: 30 },
      { title: 'Vedtak', description: 'Styret fatter vedtak i saken.', presenter: '', duration_minutes: 10 },
    ],
  },
}

export default function NewBoardMeetingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCompany = searchParams.get('company') ?? ''

  const [step, setStep] = useState(1)
  const [companies, setCompanies] = useState<any[]>([])
  const [people, setPeople] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<MeetingTemplate | ''>('')
  const [form, setForm] = useState<FormState>({
    company_id: preselectedCompany,
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '11:00',
    location: '',
    meeting_format: 'physical',
    called_by: '',
    chairperson: '',
    minute_taker: '',
    agenda_items: [{ title: '', description: '', presenter: '', duration_minutes: 30 }],
    decisions: [],
    costs_total: 0,
    private_elements: false,
    missing_documentation: false,
  })
  const [risk, setRisk] = useState<RiskResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('company_access').select('company_id').eq('user_id', user.id).then(({ data }) => {
        const ids = (data ?? []).map((r: any) => r.company_id)
        if (!ids.length) return
        supabase.from('companies').select('*').in('id', ids).then(({ data: c }) => {
          const list = c ?? []
          setCompanies(list)
          // Auto-select if only one company
          const companyId = preselectedCompany || (list.length === 1 ? list[0].id : '')
          if (companyId) {
            setForm(prev => ({ ...prev, company_id: companyId }))
            loadPeople(companyId, list, supabase)
          }
        })
      })
    })
  }, [])

  function loadPeople(companyId: string, companyList: any[], supabase: any) {
    supabase
      .from('people')
      .select('*')
      .eq('company_id', companyId)
      .then(({ data: p }: any) => {
        const persons = p ?? []
        setPeople(persons)
        // Auto-fill roles from people data
        const chair = persons.find((x: any) => x.role === 'BOARD_CHAIR')
        const ceo   = persons.find((x: any) => x.role === 'CEO')
        const owner = persons.find((x: any) => x.is_owner)
        const company = companyList.find(c => c.id === companyId)
        setForm(prev => ({
          ...prev,
          company_id: companyId,
          chairperson:  prev.chairperson  || chair?.name || owner?.name || '',
          called_by:    prev.called_by    || chair?.name || owner?.name || '',
          minute_taker: prev.minute_taker || ceo?.name   || owner?.name || '',
          location:     prev.location     || company?.address || '',
        }))
      })
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function onCompanyChange(companyId: string) {
    set('company_id', companyId)
    if (companyId) {
      const supabase = createClient()
      loadPeople(companyId, companies, supabase)
    }
  }

  function applyTemplate(templateKey: MeetingTemplate) {
    setSelectedTemplate(templateKey)
    const tpl = MEETING_TEMPLATES[templateKey]
    // Pre-fill presenter with chairperson name where relevant
    const items = tpl.agenda.map(item => ({
      ...item,
      presenter: item.presenter || form.chairperson || '',
    }))
    set('agenda_items', items)
  }

  function computeRisk() {
    const company = companies.find(c => c.id === form.company_id)
    if (!company) return
    const result = assessRisk({
      company_type: company.company_type,
      employee_count: company.employee_count,
      owner_managed: company.owner_employed,
      spouse_involved: company.spouse_involved,
      event_type: 'board_meeting',
      travel_included: false,
      overnight_stay: false,
      private_elements: form.private_elements,
      missing_documentation: form.missing_documentation,
      cash_or_cash_equivalent: false,
      no_real_role: false,
      high_cost: form.costs_total > 10000,
      family_only: false,
    })
    setRisk(result)
    setStep(4)
  }

  async function save(status: 'draft' | 'finalized') {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const { count } = await supabase
      .from('board_meetings')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', form.company_id)

    const { data: meeting, error: err } = await supabase
      .from('board_meetings')
      .insert({
        company_id: form.company_id,
        meeting_number: (count ?? 0) + 1,
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
        location: form.location,
        meeting_format: form.meeting_format,
        called_by: form.called_by,
        chairperson: form.chairperson,
        minute_taker: form.minute_taker,
        status,
      })
      .select()
      .single()

    if (err || !meeting) { setError(err?.message ?? 'Feil ved lagring'); setLoading(false); return }

    const validItems = form.agenda_items.filter(a => a.title.trim())
    if (validItems.length) {
      await supabase.from('agenda_items').insert(
        validItems.map((item, i) => ({
          board_meeting_id: meeting.id,
          order_index: i + 1,
          title: item.title,
          description: item.description || null,
          presenter: item.presenter || null,
          duration_minutes: item.duration_minutes || null,
        }))
      )
    }

    if (risk) {
      await supabase.from('risk_assessments').insert({
        company_id: form.company_id,
        event_type: 'board_meeting',
        event_id: meeting.id,
        level: risk.level,
        score: risk.score,
        reasons: risk.reasons,
        required_documentation: risk.required_documentation,
        risk_reducing_actions: risk.risk_reducing_actions,
      })
    }

    router.push('/board-meetings')
  }

  const selectedCompany = companies.find(c => c.id === form.company_id)
  const boardMembers = people.filter(p => ['BOARD_CHAIR', 'BOARD_MEMBER', 'CEO', 'OWNER'].includes(p.role))
  const STEPS = ['Detaljer', 'Dagsorden', 'Kostnader', 'Risikovurdering']

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="text-2xl font-bold text-gray-900">Nytt styremøte</h1>
      </div>

      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full mb-1 ${i + 1 <= step ? 'bg-brand-600' : 'bg-gray-200'}`} />
            <p className={`text-xs ${i + 1 === step ? 'text-brand-700 font-medium' : 'text-gray-400'}`}>{s}</p>
          </div>
        ))}
      </div>

      <div className="card p-6 space-y-5">
        {step === 1 && (
          <>
            <h2 className="font-semibold mb-4">Møteinformasjon</h2>
            <TipBox defaultOpen tips={[
              'Styreprotokoll er <strong>lovpålagt for AS</strong> (aksjeloven § 6-29) — manglende protokoll kan gi styremedlemmer personlig ansvar.',
              '<strong>Lønnsvedtak for daglig leder MÅ protokolleres</strong> med konkret beløp og stemmetall — ellers kan Skatteetaten avvise fradrag.',
              '<strong>Digitalt møte</strong>: lagre deltakerliste fra Zoom/Teams + skjermbilder som dokumentasjon.',
              'Årsregnskap skal behandles av styret <strong>innen 30. juni</strong> for kalenderårsselskaper.',
            ]} />

            {/* Selskap */}
            <div>
              <label className="label">Selskap *</label>
              <select className="input" value={form.company_id} onChange={e => onCompanyChange(e.target.value)}>
                <option value="">Velg selskap…</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Møtetype — velger standard dagsorden i neste steg */}
            <div>
              <label className="label">Type møte</label>
              <p className="text-xs text-gray-400 mb-1">Bestemmer foreslått standarddagsorden i neste steg.</p>
              <div className="grid grid-cols-1 gap-2">
                {(Object.entries(MEETING_TEMPLATES) as [MeetingTemplate, typeof MEETING_TEMPLATES[MeetingTemplate]][]).map(([key, tpl]) => (
                  <label
                    key={key}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTemplate === key
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="meeting_template"
                      value={key}
                      checked={selectedTemplate === key}
                      onChange={() => applyTemplate(key)}
                      className="mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{tpl.label}</p>
                      <p className="text-xs text-gray-400">{tpl.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Dato og møteform */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Dato *</label>
                <input type="date" className="input" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div>
                <label className="label">Møteform</label>
                <select className="input" value={form.meeting_format} onChange={e => set('meeting_format', e.target.value as any)}>
                  <option value="physical">Fysisk</option>
                  <option value="digital">Digitalt (Zoom/Teams)</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Starttid</label>
                <input type="time" className="input" value={form.start_time} onChange={e => set('start_time', e.target.value)} />
              </div>
              <div>
                <label className="label">Sluttid</label>
                <input type="time" className="input" value={form.end_time} onChange={e => set('end_time', e.target.value)} />
              </div>
            </div>

            {/* Sted */}
            <div>
              <label className="label">Sted / URL</label>
              <input
                type="text" className="input"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder={form.meeting_format === 'digital' ? 'Zoom-lenke eller møte-ID' : selectedCompany?.address || 'Møterom, adresse…'}
              />
              {form.meeting_format === 'physical' && selectedCompany?.address && !form.location && (
                <button
                  type="button"
                  onClick={() => set('location', selectedCompany.address)}
                  className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  Bruk selskapets adresse: {selectedCompany.address}
                </button>
              )}
            </div>

            {/* Roller — auto-utfylt fra people */}
            <div>
              <label className="label">Innkalt av / Møteleder / Referent</label>
              {boardMembers.length > 0 && (
                <p className="text-xs text-gray-400 mb-2">
                  Hentet fra <strong>Ansatte og aksjonærer</strong>: {boardMembers.map(p => p.name).join(', ')}
                </p>
              )}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label text-xs">Innkalt av</label>
                  <input
                    type="text" className="input"
                    value={form.called_by}
                    onChange={e => set('called_by', e.target.value)}
                    list="people-list"
                    placeholder="Navn"
                  />
                </div>
                <div>
                  <label className="label text-xs">Møteleder</label>
                  <input
                    type="text" className="input"
                    value={form.chairperson}
                    onChange={e => set('chairperson', e.target.value)}
                    list="people-list"
                    placeholder="Navn"
                  />
                </div>
                <div>
                  <label className="label text-xs">Referent</label>
                  <input
                    type="text" className="input"
                    value={form.minute_taker}
                    onChange={e => set('minute_taker', e.target.value)}
                    list="people-list"
                    placeholder="Navn"
                  />
                </div>
              </div>
              {/* Datalist for autocomplete */}
              <datalist id="people-list">
                {boardMembers.map(p => <option key={p.id} value={p.name} />)}
              </datalist>
              {boardMembers.length === 0 && form.company_id && (
                <p className="text-xs text-gray-400 mt-1">
                  Ingen personer registrert — <a href="/people" className="text-blue-600 hover:underline">legg til i Ansatte og aksjonærer</a> for å auto-utfylle.
                </p>
              )}
            </div>

            <button
              onClick={() => {
                if (!form.company_id || !form.date) { setError('Selskap og dato er påkrevd'); return }
                setError(null)
                setStep(2)
              }}
              className="btn-primary w-full"
            >
              Neste: Dagsorden
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-semibold mb-1">Dagsorden</h2>
            {selectedTemplate && (
              <p className="text-xs text-brand-600 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2 mb-3">
                Standarddagsorden for <strong>{MEETING_TEMPLATES[selectedTemplate].label}</strong> er forhåndsutfylt — juster etter behov.
              </p>
            )}
            <TipBox tips={[
              '<strong>Lønnsvedtak for daglig leder MÅ protokolleres</strong> med konkret beløp og stemmetall — ellers kan Skatteetaten avvise fradrag.',
              'Skriv vedtaksteksten eksplisitt: «Styret vedtar enstemmig at…» — ikke bare «saken ble diskutert».',
              'Daglig leder har <strong>ikke stemmerett</strong> i styret med mindre de også er styremedlem.',
              'Protokollen bør signeres av <strong>alle styremedlemmer</strong> for å ha full rettskraft.',
            ]} />
            <div className="space-y-4">
              {form.agenda_items.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Sak {i + 1}</span>
                    {form.agenda_items.length > 1 && (
                      <button onClick={() => set('agenda_items', form.agenda_items.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:text-red-700">Fjern</button>
                    )}
                  </div>
                  <input
                    type="text" className="input"
                    placeholder="Tittel på saken *"
                    value={item.title}
                    onChange={e => { const u = [...form.agenda_items]; u[i] = { ...u[i], title: e.target.value }; set('agenda_items', u) }}
                  />
                  <textarea
                    className="input resize-none" rows={2}
                    placeholder="Beskrivelse / vedtakstekst"
                    value={item.description}
                    onChange={e => { const u = [...form.agenda_items]; u[i] = { ...u[i], description: e.target.value }; set('agenda_items', u) }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text" className="input"
                      placeholder="Ansvarlig"
                      list="people-list"
                      value={item.presenter}
                      onChange={e => { const u = [...form.agenda_items]; u[i] = { ...u[i], presenter: e.target.value }; set('agenda_items', u) }}
                    />
                    <input
                      type="number" className="input"
                      placeholder="Min."
                      value={item.duration_minutes}
                      onChange={e => { const u = [...form.agenda_items]; u[i] = { ...u[i], duration_minutes: parseInt(e.target.value) || 0 }; set('agenda_items', u) }}
                    />
                  </div>
                </div>
              ))}
              <datalist id="people-list">
                {boardMembers.map(p => <option key={p.id} value={p.name} />)}
              </datalist>
              <button
                onClick={() => set('agenda_items', [...form.agenda_items, { title: '', description: '', presenter: form.chairperson, duration_minutes: 30 }])}
                className="btn-secondary w-full text-sm"
              >
                + Legg til sak
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">Tilbake</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">Neste: Kostnader</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-semibold mb-4">Kostnader og risikomarkering</h2>
            <TipBox tips={[
              'Styrehonorar er <strong>fradragsberettiget for selskapet</strong> og skattepliktig som lønn for mottakeren — husk å innberette på a-meldingen.',
              '<strong>Kaffe, lunsj og enkel servering</strong> under møtet: 100% fradragsberettiget — ta vare på kvitteringen.',
              'Middagsrepresentasjon etter møtet: maks <strong>560 kr per person eks. mva.</strong> er fradragsberettiget (2026).',
              'Leie av møterom: 100% fradragsberettiget — bruk faktura som bilag.',
            ]} />
            <div>
              <label className="label">Totale møtekostnader (NOK)</label>
              <input type="number" min="0" className="input" value={form.costs_total} onChange={e => set('costs_total', parseFloat(e.target.value) || 0)} placeholder="0" />
            </div>
            <div className="space-y-3">
              <label className="label">Risikomarkering</label>
              {[
                { key: 'private_elements' as const, label: 'Inneholder private elementer' },
                { key: 'missing_documentation' as const, label: 'Manglende dokumentasjon' },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form[item.key]} onChange={e => set(item.key, e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-600" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">Tilbake</button>
              <button onClick={computeRisk} className="btn-primary flex-1">Kjør risikovurdering</button>
            </div>
          </>
        )}

        {step === 4 && risk && (
          <>
            <h2 className="font-semibold">Risikovurdering</h2>
            <RiskCard result={risk} />
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="btn-secondary flex-1">Tilbake</button>
              <button onClick={() => save('draft')} disabled={loading} className="btn-secondary flex-1">Lagre utkast</button>
              <button onClick={() => save('finalized')} disabled={loading} className="btn-primary flex-1">
                {loading ? 'Lagrer…' : 'Ferdigstill'}
              </button>
            </div>
          </>
        )}

        {error && step !== 4 && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}
      </div>
    </div>
  )
}
