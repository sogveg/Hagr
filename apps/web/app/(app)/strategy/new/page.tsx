'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RiskCard from '@/components/risk/RiskCard'
import { assessRisk, type RiskResult } from '@skattsmart/shared'

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
            <h2 className="font-semibold">Formål og detaljer</h2>
            <div>
              <label className="label">Selskap *</label>
              <select className="input" value={form.company_id} onChange={e => set('company_id', e.target.value)}>
                <option value="">Velg selskap…</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tittel på samlingen *</label>
              <input type="text" className="input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Strategisamling Q1 2025" />
            </div>
            <div>
              <label className="label">Forretningsmessig formål *</label>
              <textarea className="input resize-none" rows={3} value={form.purpose} onChange={e => set('purpose', e.target.value)} placeholder="Beskriv det konkrete forretningsmessige formålet med samlingen…" />
            </div>
            <div>
              <label className="label">Forretningsrelevans</label>
              <textarea className="input resize-none" rows={2} value={form.business_relevance} onChange={e => set('business_relevance', e.target.value)} />
            </div>
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
            <div>
              <label className="label">Sted *</label>
              <input type="text" className="input" value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div>
              <label className="label">Begrunnelse for valg av sted</label>
              <input type="text" className="input" value={form.location_rationale} onChange={e => set('location_rationale', e.target.value)} placeholder="F.eks. nærhet til kunder, pris, fasiliteter…" />
            </div>
            <div className="flex gap-4">
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
            <button onClick={() => { if (!form.company_id || !form.title || !form.purpose || !form.date_from) { setError('Fyll inn påkrevde felt'); return }; setError(null); setStep(2) }} className="btn-primary w-full">
              Neste: Deltakere
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-semibold">Deltakere og roller</h2>
            <p className="text-sm text-gray-500">Dokumenter alle deltakeres reelle funksjon under samlingen.</p>
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
            <h2 className="font-semibold">Faglig program</h2>
            <p className="text-sm text-gray-500">Faglig program bør utgjøre hoveddelen av samlingen.</p>
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
            <h2 className="font-semibold">Kostnader</h2>
            <div>
              <label className="label">Totale kostnader (NOK)</label>
              <input type="number" min="0" className="input" value={form.costs_total} onChange={e => set('costs_total', parseFloat(e.target.value) || 0)} />
            </div>
            <p className="text-sm text-gray-500">
              Husk å ta vare på alle kvitteringer. Kostnadsoversikt kan eksporteres til bokettersynsmappen.
            </p>
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
