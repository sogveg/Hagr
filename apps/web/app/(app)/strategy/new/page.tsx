'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RiskCard from '@/components/risk/RiskCard'
import { assessRisk, type RiskResult } from '@/lib/shared'
import { Lightbulb, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'

function TipBox({ tips, defaultOpen = true }: { tips: string[]; defaultOpen?: boolean }) {
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

/** Klikkbare forslag — klikk fyller feltet */
function SuggestionChips({ suggestions, onSelect }: { suggestions: string[]; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {suggestions.map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1 transition-colors text-left"
        >
          {s}
        </button>
      ))}
    </div>
  )
}

interface ProgramBlock {
  day_number: number
  start_time: string
  end_time: string
  title: string
  block_type: 'professional' | 'social' | 'break'
}

interface Participant {
  name: string
  role_explanation: string
}

interface FormState {
  company_id: string
  title: string
  purpose: string
  business_relevance: string
  date_from: string
  date_to: string
  location: string
  location_rationale: string
  travel_included: boolean
  overnight_stay: boolean
  private_activities: string
  social_program: string
  companions: string
  create_board_meeting_docs: boolean
  participants: Participant[]
  program_blocks: ProgramBlock[]
  costs_total: number
}

export default function NewStrategyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCompany = searchParams.get('company') ?? ''

  const [step, setStep] = useState(1)
  const [companies, setCompanies] = useState<any[]>([])
  const [existingThisYear, setExistingThisYear] = useState<any[]>([])
  const [form, setForm] = useState<FormState>({
    company_id: preselectedCompany,
    title: '',
    purpose: '',
    business_relevance: '',
    date_from: '',
    date_to: '',
    location: '',
    location_rationale: '',
    travel_included: false,
    overnight_stay: false,
    private_activities: '',
    social_program: '',
    companions: '',
    create_board_meeting_docs: false,
    participants: [{ name: '', role_explanation: '' }],
    program_blocks: [
      { day_number: 1, start_time: '09:00', end_time: '12:00', title: '', block_type: 'professional' },
    ],
    costs_total: 0,
  })
  const [risk, setRisk] = useState<RiskResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('company_access').select('company_id').eq('user_id', user.id).then(({ data }) => {
        const ids = (data ?? []).map(r => r.company_id)
        if (!ids.length) return
        supabase.from('companies').select('*').in('id', ids).then(({ data: c }) => {
          const list = c ?? []
          setCompanies(list)
          // Auto-select if only one company and none pre-selected
          if (list.length === 1 && !preselectedCompany) {
            setForm(prev => ({ ...prev, company_id: list[0].id }))
          }
        })
      })
    })
  }, [])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    // When company changes, check existing gatherings this year
    if (key === 'company_id' && value) {
      const supabase = createClient()
      const year = new Date().getFullYear()
      supabase
        .from('strategy_gatherings')
        .select('id, title, date_from')
        .eq('company_id', value)
        .gte('date_from', `${year}-01-01`)
        .lte('date_from', `${year}-12-31`)
        .then(({ data }) => setExistingThisYear(data ?? []))
    }
  }

  // Suggest a title based on the selected company name + current quarter
  function suggestTitle(companyName: string): string[] {
    const now = new Date()
    const q = Math.ceil((now.getMonth() + 1) / 3)
    const y = now.getFullYear()
    return [
      `${companyName} — Strategisamling Q${q} ${y}`,
      `${companyName} — Årsplanlegging ${y}`,
      `${companyName} — Budsjett og strategi ${y}`,
      `${companyName} — Ledersamling Q${q} ${y}`,
    ]
  }

  const selectedCompany = companies.find(c => c.id === form.company_id)

  const PURPOSE_SUGGESTIONS = [
    'Gjennomgang av budsjett og prognose for neste år, med vurdering av investeringsbehov og kapitalbehov.',
    'Strategisk planlegging for ekspansjon til nye markeder — analyse av konkurrenter, muligheter og risikoer.',
    'Evaluering av selskapets produktportefølje og utvikling av ny forretningsmodell for digital distribusjon.',
    'Kompetanseheving og intern fagdag: gjennomgang av nye lover, bransjenyheter og beste praksis.',
    'Organisasjonsgjennomgang: gjennomgang av roller, ansvar og strukturer for kommende periode.',
  ]

  const RELEVANCE_SUGGESTIONS = [
    'Beslutningene som tas på samlingen vil direkte påvirke selskapets strategi og økonomi de neste 12 månedene.',
    'Innholdet er nødvendig for å oppdatere forretningsplanen og forberede styremøte for kommende kvartal.',
    'Samlingen erstatter ordinære arbeidsdager og er nødvendig for å løfte strategiske spørsmål ut av daglig drift.',
  ]

  const LOCATION_RATIONALE_SUGGESTIONS = [
    'Hotellet har egnede konferansefasiliteter (møterom, projektor, grupperom) og god kollektivtilknytning for alle deltakere.',
    'Beliggenheten er valgt for å minimere reisetid for deltakere fra ulike byer — sentralt mellom Oslo og Bergen.',
    'Stedet er valgt basert på pris og tilgjengelighet i den aktuelle perioden. Konferanselokaler er booket separat.',
    'Hotellet har egnet infrastruktur for flerdagerssamlinger (stabil internett, stille rom, catering). Ingen fritidsfasiliteter er benyttet.',
    'Valgt pga. nærhet til en av selskapets nøkkelkunder som deltar i deler av programmet.',
  ]

  function computeRisk() {
    const company = companies.find(c => c.id === form.company_id)
    if (!company) return
    const result = assessRisk({
      company_type: company.company_type,
      employee_count: company.employee_count,
      owner_managed: company.owner_employed,
      spouse_involved: company.spouse_involved,
      event_type: 'strategy_gathering',
      travel_included: form.travel_included,
      overnight_stay: form.overnight_stay,
      private_elements: !!form.private_activities,
      missing_documentation: !form.purpose || !form.location_rationale,
      cash_or_cash_equivalent: false,
      no_real_role: form.participants.some(p => !p.role_explanation),
      high_cost: form.costs_total > 30000,
      family_only: !!form.companions && form.participants.length <= 1,
    })
    setRisk(result)
    setStep(5)
  }

  async function save(status: 'draft' | 'finalized') {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const { data: gathering, error: err } = await supabase
      .from('strategy_gatherings')
      .insert({
        company_id: form.company_id,
        title: form.title,
        purpose: form.purpose,
        business_relevance: form.business_relevance,
        date_from: form.date_from,
        date_to: form.date_to,
        location: form.location,
        location_rationale: form.location_rationale,
        social_program: form.social_program || null,
        private_activities: form.private_activities || null,
        companions: form.companions || null,
        travel_included: form.travel_included,
        overnight_stay: form.overnight_stay,
        create_board_meeting_docs: form.create_board_meeting_docs,
        status,
      })
      .select()
      .single()

    if (err || !gathering) { setError(err?.message ?? 'Feil'); setLoading(false); return }

    // Insert participants
    const validParticipants = form.participants.filter(p => p.name.trim())
    if (validParticipants.length) {
      await supabase.from('event_participants').insert(
        validParticipants.map(p => ({
          event_type: 'strategy_gathering',
          event_id: gathering.id,
          name: p.name,
          role_explanation: p.role_explanation,
        }))
      )
    }

    // Insert program blocks
    const validBlocks = form.program_blocks.filter(b => b.title.trim())
    if (validBlocks.length) {
      await supabase.from('program_blocks').insert(
        validBlocks.map(b => ({
          strategy_gathering_id: gathering.id,
          ...b,
        }))
      )
    }

    // Risk assessment
    if (risk) {
      await supabase.from('risk_assessments').insert({
        company_id: form.company_id,
        event_type: 'strategy_gathering',
        event_id: gathering.id,
        level: risk.level,
        score: risk.score,
        reasons: risk.reasons,
        required_documentation: risk.required_documentation,
        risk_reducing_actions: risk.risk_reducing_actions,
      })
    }

    router.push('/strategy')
  }

  const STEPS = ['Formål', 'Deltakere', 'Program', 'Kostnader', 'Risiko']

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="text-2xl font-bold text-gray-900">Ny strategisamling</h1>
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
            <h2 className="font-semibold mb-4">Formål og detaljer</h2>
            <TipBox defaultOpen tips={[
              '<strong>Skriv konkret formål</strong> — ikke «planleggingssamling», men f.eks. «Gjennomgang av budsjett 2026 og strategi for ekspansjon til nye markeder».',
              '<strong>Velg sted med konferanselokale</strong> — hotell med møterom ser langt bedre ut enn et feriested eller hytte.',
              '<strong>Unngå fellesferie og helligdager</strong> — samling i uke 28 er et rødt flagg hos Skatteetaten.',
              'Varighet 1–3 dager er normalt. Over 4 dager krever ekstra sterk faglig begrunnelse.',
              '<strong>Begrunnelse for valg av sted er kritisk</strong> — det er ett av de første feltene en revisor ser på. Bruk eksemplene under feltet.',
            ]} />

            {/* Selskap */}
            <div>
              <label className="label">Selskap *</label>
              <select className="input" value={form.company_id} onChange={e => set('company_id', e.target.value)}>
                <option value="">Velg selskap…</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Warning: already has a gathering this year */}
            {existingThisYear.length > 0 && (
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-3 text-sm text-amber-800">
                <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="font-medium">
                    {selectedCompany?.name ?? 'Selskapet'} har allerede {existingThisYear.length === 1 ? 'én strategisamling' : `${existingThisYear.length} strategisamlinger`} registrert i {new Date().getFullYear()}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {existingThisYear.map(g => (
                      <li key={g.id} className="text-xs text-amber-700">
                        • {g.title} ({new Date(g.date_from).toLocaleDateString('nb-NO')})
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-amber-700 mt-1.5">
                    Skatteetaten aksepterer normalt kun <strong>én faglig samling per år</strong> per selskap. En ekstra samling øker risikoen for at begge avvises.
                  </p>
                </div>
              </div>
            )}

            {/* Tittel */}
            <div>
              <label className="label">Tittel på samlingen *</label>
              <input
                type="text" className="input"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder={selectedCompany ? `${selectedCompany.name} — Strategisamling Q${Math.ceil((new Date().getMonth()+1)/3)} ${new Date().getFullYear()}` : 'Strategisamling Q3 2026'}
              />
              {selectedCompany && !form.title && (
                <SuggestionChips
                  suggestions={suggestTitle(selectedCompany.name)}
                  onSelect={v => set('title', v)}
                />
              )}
            </div>

            {/* Forretningsmessig formål */}
            <div>
              <label className="label">Forretningsmessig formål *</label>
              <p className="text-xs text-gray-400 mb-1">
                Beskriv <strong>hva dere skal beslutte eller gjennomgå</strong> — ikke bare «planlegging». Skatteetaten leser dette nøye.
              </p>
              <textarea
                className="input resize-none" rows={3}
                value={form.purpose}
                onChange={e => set('purpose', e.target.value)}
                placeholder="Gjennomgang av budsjett og prognose for neste år, med vurdering av investeringsbehov og markedsstrategi…"
              />
              <SuggestionChips suggestions={PURPOSE_SUGGESTIONS} onSelect={v => set('purpose', v)} />
            </div>

            {/* Forretningsrelevans */}
            <div>
              <label className="label">Forretningsrelevans</label>
              <p className="text-xs text-gray-400 mb-1">
                Hvorfor er det nødvendig å gjennomføre dette <em>utenfor kontoret</em>? Hva gir denne samlingen som ordinære arbeidsdager ikke gir?
              </p>
              <textarea
                className="input resize-none" rows={2}
                value={form.business_relevance}
                onChange={e => set('business_relevance', e.target.value)}
                placeholder="Samlingen er nødvendig for å løfte strategiske spørsmål ut av daglig drift…"
              />
              <SuggestionChips suggestions={RELEVANCE_SUGGESTIONS} onSelect={v => set('business_relevance', v)} />
            </div>

            {/* Datoer */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Fra dato *</label>
                <input type="date" className="input" value={form.date_from} onChange={e => set('date_from', e.target.value)} />
              </div>
              <div>
                <label className="label">Til dato *</label>
                <input type="date" className="input" value={form.date_to} onChange={e => set('date_to', e.target.value)} />
              </div>
            </div>
            {form.date_from && (() => {
              const d = new Date(form.date_from)
              const week = Math.ceil(((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7)
              const isRisky = (week >= 27 && week <= 32) || d.getDay() === 0 || d.getDay() === 6
              return isRisky ? (
                <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-500" />
                  Uke {week} er i perioden for fellesferie eller helg — dette er et rødt flagg hos Skatteetaten. Vurder å flytte samlingen.
                </div>
              ) : null
            })()}

            {/* Sted */}
            <div>
              <label className="label">Sted *</label>
              <input
                type="text" className="input"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="F.eks. Clarion Hotel Oslo, Soria Moria Konferansehotell…"
              />
              <p className="text-xs text-gray-400 mt-1">
                Hotell med konferansefasiliteter er langt sterkere dokumentasjonsmessig enn hytte, privatbolig eller feriested.
              </p>
            </div>

            {/* Begrunnelse for sted — kritisk felt */}
            <div>
              <label className="label">
                Begrunnelse for valg av sted
                <span className="ml-2 text-xs font-normal text-orange-600 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5">Viktig for bokettersyn</span>
              </label>
              <p className="text-xs text-gray-400 mb-1">
                Dette er ett av de første feltene en revisor ser på. En god begrunnelse nevner <strong>faglige fasiliteter</strong>, <strong>tilgjengelighet</strong> og/eller <strong>pris</strong> — ikke at det «var et fint sted».
              </p>
              <textarea
                className="input resize-none" rows={2}
                value={form.location_rationale}
                onChange={e => set('location_rationale', e.target.value)}
                placeholder="Hotellet har egnede konferansefasiliteter og god tilgjengelighet for alle deltakere…"
              />
              <SuggestionChips suggestions={LOCATION_RATIONALE_SUGGESTIONS} onSelect={v => set('location_rationale', v)} />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-4 flex-wrap">
              {[
                { key: 'travel_included' as const, label: 'Reise inkludert' },
                { key: 'overnight_stay' as const, label: 'Overnatting' },
                { key: 'create_board_meeting_docs' as const, label: 'Koble til styremøtedokument' },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form[item.key]} onChange={e => set(item.key, e.target.checked)} className="w-4 h-4" />
                  {item.label}
                </label>
              ))}
            </div>

            <button
              onClick={() => {
                if (!form.company_id || !form.title || !form.purpose || !form.date_from) {
                  setError('Fyll inn påkrevde felt (selskap, tittel, formål og dato)')
                  return
                }
                setError(null)
                setStep(2)
              }}
              className="btn-primary w-full"
            >
              Neste: Deltakere
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-semibold mb-1">Deltakere og roller</h2>
            <p className="text-sm text-gray-500 mb-4">Dokumenter alle deltakeres reelle funksjon under samlingen.</p>
            <TipBox tips={[
              '<strong>Alle deltakere MÅ ha en reell, faglig rolle</strong> — ikke bare «deltaker». Skriv konkret: «Presenterte markedsplan for Q1» eller «Ansvarlig for budsjettgjennomgang».',
              '<strong>Kun eier + ektefelle/samboer</strong> som eneste deltakere = svært høy risiko. Ha med minst én ekstern eller ikke-familietilknyttet person.',
              'Ektefelle/samboer <strong>uten ansettelsesforhold</strong>: kostnaden for ledsager er skattepliktig lønn for den ansatte — dokumentér separat og innberett.',
              'Eksternt innleide (konsulenter, styremedlemmer) teller som legitime deltakere — bruk dem gjerne.',
            ]} />
            <div className="space-y-4">
              {form.participants.map((p, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Deltaker {i + 1}</span>
                    {form.participants.length > 1 && (
                      <button onClick={() => set('participants', form.participants.filter((_, j) => j !== i))} className="text-xs text-red-500">Fjern</button>
                    )}
                  </div>
                  <input type="text" className="input" placeholder="Navn *" value={p.name} onChange={e => { const u = [...form.participants]; u[i] = { ...u[i], name: e.target.value }; set('participants', u) }} />
                  <textarea className="input resize-none" rows={2} placeholder="Rollebeskrivelse og faglig begrunnelse *" value={p.role_explanation} onChange={e => { const u = [...form.participants]; u[i] = { ...u[i], role_explanation: e.target.value }; set('participants', u) }} />
                </div>
              ))}
              <button onClick={() => set('participants', [...form.participants, { name: '', role_explanation: '' }])} className="btn-secondary w-full text-sm">+ Legg til deltaker</button>
            </div>
            <div>
              <label className="label">Ledsagere (valgfritt)</label>
              <textarea className="input resize-none" rows={2} value={form.companions} onChange={e => set('companions', e.target.value)} placeholder="Navn og relasjon til ansatt…" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">Tilbake</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">Neste: Program</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-semibold mb-1">Faglig program</h2>
            <p className="text-sm text-gray-500 mb-4">Faglig program bør utgjøre hoveddelen av samlingen.</p>
            <TipBox tips={[
              '<strong>70/30-regelen</strong>: faglig innhold bør utgjøre minst 70% av timene. Sosialt er OK, men hold balansen.',
              'Fyll inn tidspunkter nøyaktig — Skatteetaten kan spørre: «Hva gjorde dere mellom 10.00 og 14.00 på dag 2?»',
              '<strong>Ta bilder</strong> under faglige sesjoner og lagre presentasjoner/slides — ekstremt verdifullt ved bokettersyn.',
              'Felles middag = sosialt innslag, men akseptert som del av samlingen. Konsert eller fornøyelsespark = privat — registrér det som privat aktivitet.',
              'Private aktiviteter reduserer fradragsretten forholdsmessig — vurder om det er verdt det.',
            ]} />
            <div className="space-y-4">
              {form.program_blocks.map((block, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Programpost {i + 1}</span>
                    {form.program_blocks.length > 1 && (
                      <button onClick={() => set('program_blocks', form.program_blocks.filter((_, j) => j !== i))} className="text-xs text-red-500">Fjern</button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="label text-xs">Dag</label>
                      <input type="number" min="1" className="input" value={block.day_number} onChange={e => { const u = [...form.program_blocks]; u[i] = { ...u[i], day_number: parseInt(e.target.value) || 1 }; set('program_blocks', u) }} />
                    </div>
                    <div>
                      <label className="label text-xs">Fra</label>
                      <input type="time" className="input" value={block.start_time} onChange={e => { const u = [...form.program_blocks]; u[i] = { ...u[i], start_time: e.target.value }; set('program_blocks', u) }} />
                    </div>
                    <div>
                      <label className="label text-xs">Til</label>
                      <input type="time" className="input" value={block.end_time} onChange={e => { const u = [...form.program_blocks]; u[i] = { ...u[i], end_time: e.target.value }; set('program_blocks', u) }} />
                    </div>
                  </div>
                  <input type="text" className="input" placeholder="Tittel *" value={block.title} onChange={e => { const u = [...form.program_blocks]; u[i] = { ...u[i], title: e.target.value }; set('program_blocks', u) }} />
                  <select className="input" value={block.block_type} onChange={e => { const u = [...form.program_blocks]; u[i] = { ...u[i], block_type: e.target.value as any }; set('program_blocks', u) }}>
                    <option value="professional">Faglig</option>
                    <option value="social">Sosialt</option>
                    <option value="break">Pause</option>
                  </select>
                </div>
              ))}
              <button onClick={() => set('program_blocks', [...form.program_blocks, { day_number: 1, start_time: '09:00', end_time: '10:00', title: '', block_type: 'professional' }])} className="btn-secondary w-full text-sm">+ Legg til programpost</button>
            </div>
            <div>
              <label className="label">Sosialt program</label>
              <textarea className="input resize-none" rows={2} value={form.social_program} onChange={e => set('social_program', e.target.value)} placeholder="Felles middag, teambuilding e.l." />
            </div>
            <div>
              <label className="label">Private aktiviteter (OBS: reduserer fradragsrett)</label>
              <textarea className="input resize-none" rows={2} value={form.private_activities} onChange={e => set('private_activities', e.target.value)} placeholder="Beskriv private innslag…" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">Tilbake</button>
              <button onClick={() => setStep(4)} className="btn-primary flex-1">Neste: Kostnader</button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="font-semibold mb-4">Kostnader</h2>
            <TipBox tips={[
              'Over <strong>30 000 kr totalt</strong> øker sannsynligheten for kontroll — ikke et forbud, men dokumentér ekstra grundig.',
              '<strong>Alkohol er ikke fradragsberettiget</strong> for interne arrangementer — be om separat alkoholregning for å holde det ryddig.',
              'Reise (tog, fly, bil) og overnatting = fradragsberettiget som driftsutgift — ta vare på alle billetter.',
              'Business class krever særskilt begrunnelse (f.eks. arbeid ombord). Økonomi er alltid tryggere.',
              'Husk å ta vare på alle kvitteringer — de kan knyttes til bokettersynsmappen herfra.',
            ]} />
            <div className="mt-4">
              <label className="label">Totale kostnader (NOK)</label>
              <input type="number" min="0" className="input" value={form.costs_total} onChange={e => set('costs_total', parseFloat(e.target.value) || 0)} />
            </div>
            {form.costs_total > 30000 && (
              <div className="flex items-start gap-2.5 bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-sm text-yellow-800 mt-3">
                <AlertTriangle size={15} className="text-yellow-500 shrink-0 mt-0.5" strokeWidth={2} />
                Over 30 000 kr — sørg for at alle kostnader har kvittering og at faglig program er grundig dokumentert.
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="btn-secondary flex-1">Tilbake</button>
              <button onClick={computeRisk} className="btn-primary flex-1">Kjør risikovurdering</button>
            </div>
          </>
        )}

        {step === 5 && risk && (
          <>
            <h2 className="font-semibold">Risikovurdering</h2>
            <RiskCard result={risk} />
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(4)} className="btn-secondary flex-1">Tilbake</button>
              <button onClick={() => save('draft')} disabled={loading} className="btn-secondary flex-1">Lagre utkast</button>
              <button onClick={() => save('finalized')} disabled={loading} className="btn-primary flex-1">
                {loading ? 'Lagrer…' : 'Ferdigstill'}
              </button>
            </div>
          </>
        )}

        {error && step < 5 && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}
      </div>
    </div>
  )
}
