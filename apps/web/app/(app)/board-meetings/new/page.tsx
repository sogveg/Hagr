'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RiskCard from '@/components/risk/RiskCard'
import { assessRisk, type RiskResult } from '@skattsmart/shared'

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

export default function NewBoardMeetingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCompany = searchParams.get('company') ?? ''

  const [step, setStep] = useState(1)
  const [companies, setCompanies] = useState<any[]>([])
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
        const ids = (data ?? []).map(r => r.company_id)
        if (ids.length) supabase.from('companies').select('*').in('id', ids).then(({ data: c }) => setCompanies(c ?? []))
      })
    })
  }, [])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
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

    // Get next meeting number
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

    if (err || !meeting) {
      setError(err?.message ?? 'Feil ved lagring')
      setLoading(false)
      return
    }

    // Insert agenda items
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

    // Save risk assessment
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

  const STEPS = ['Detaljer', 'Dagsorden', 'Kostnader', 'Risikovurdering']

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="text-2xl font-bold text-gray-900">Nytt styremøte</h1>
      </div>

      {/* Progress */}
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
            <h2 className="font-semibold">Møteinformasjon</h2>
            <div>
              <label className="label">Selskap *</label>
              <select className="input" value={form.company_id} onChange={e => set('company_id', e.target.value)}>
                <option value="">Velg selskap…</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Dato *</label>
                <input type="date" className="input" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div>
                <label className="label">Møteform</label>
                <select className="input" value={form.meeting_format} onChange={e => set('meeting_format', e.target.value as any)}>
                  <option value="physical">Fysisk</option>
                  <option value="digital">Digitalt</option>
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
            <div>
              <label className="label">Sted/URL</label>
              <input type="text" className="input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Møterom A / Zoom" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Innkalt av</label>
                <input type="text" className="input" value={form.called_by} onChange={e => set('called_by', e.target.value)} />
              </div>
              <div>
                <label className="label">Møteleder</label>
                <input type="text" className="input" value={form.chairperson} onChange={e => set('chairperson', e.target.value)} />
              </div>
              <div>
                <label className="label">Referent</label>
                <input type="text" className="input" value={form.minute_taker} onChange={e => set('minute_taker', e.target.value)} />
              </div>
            </div>
            <button
              onClick={() => { if (!form.company_id || !form.date) { setError('Selskap og dato er påkrevd'); return }; setError(null); setStep(2) }}
              className="btn-primary w-full"
            >
              Neste: Dagsorden
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-semibold">Dagsorden</h2>
            <div className="space-y-4">
              {form.agenda_items.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Sak {i + 1}</span>
                    {form.agenda_items.length > 1 && (
                      <button
                        onClick={() => set('agenda_items', form.agenda_items.filter((_, j) => j !== i))}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Fjern
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    className="input"
                    placeholder="Tittel på saken *"
                    value={item.title}
                    onChange={e => {
                      const updated = [...form.agenda_items]
                      updated[i] = { ...updated[i], title: e.target.value }
                      set('agenda_items', updated)
                    }}
                  />
                  <textarea
                    className="input resize-none"
                    rows={2}
                    placeholder="Beskrivelse (valgfritt)"
                    value={item.description}
                    onChange={e => {
                      const updated = [...form.agenda_items]
                      updated[i] = { ...updated[i], description: e.target.value }
                      set('agenda_items', updated)
                    }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      className="input"
                      placeholder="Ansvarlig"
                      value={item.presenter}
                      onChange={e => {
                        const updated = [...form.agenda_items]
                        updated[i] = { ...updated[i], presenter: e.target.value }
                        set('agenda_items', updated)
                      }}
                    />
                    <input
                      type="number"
                      className="input"
                      placeholder="Min."
                      value={item.duration_minutes}
                      onChange={e => {
                        const updated = [...form.agenda_items]
                        updated[i] = { ...updated[i], duration_minutes: parseInt(e.target.value) || 0 }
                        set('agenda_items', updated)
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => set('agenda_items', [...form.agenda_items, { title: '', description: '', presenter: '', duration_minutes: 30 }])}
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
            <h2 className="font-semibold">Kostnader og risikomarkering</h2>
            <div>
              <label className="label">Totale møtekostnader (NOK)</label>
              <input
                type="number"
                min="0"
                className="input"
                value={form.costs_total}
                onChange={e => set('costs_total', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-3">
              <label className="label">Risikomarkering</label>
              {[
                { key: 'private_elements' as const, label: 'Inneholder private elementer' },
                { key: 'missing_documentation' as const, label: 'Manglende dokumentasjon' },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[item.key]}
                    onChange={e => set(item.key, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-600"
                  />
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
              <button onClick={() => save('draft')} disabled={loading} className="btn-secondary flex-1">
                Lagre utkast
              </button>
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
