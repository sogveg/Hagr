'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { evaluateRepresentation, REPRESENTATION_LIMIT_PER_PERSON_NOK } from '@/lib/shared'
import { UtensilsCrossed, Lightbulb, ChevronDown, ChevronUp, Plus, AlertTriangle, CheckCircle } from 'lucide-react'

function TipBox({ tips }: { tips: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-lg overflow-hidden mb-6">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left">
        <div className="flex items-center gap-2">
          <Lightbulb size={14} className="text-amber-500 shrink-0" strokeWidth={2} />
          <span className="text-sm font-medium text-amber-800">Tips og regler</span>
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

const TIPS = [
  `<strong>Grensen for middag/middag: ${REPRESENTATION_LIMIT_PER_PERSON_NOK} kr per person eks. mva (2025)</strong> — over grensen er overskytende ikke fradragsberettiget.`,
  '<strong>Lunsj i arbeidstid</strong> med ekstern part = 100% fradragsberettiget, ingen beløpsgrense.',
  '<strong>Det MÅ være en ekstern part</strong> (kunde, leverandør, potensiell partner) — kun interne ansatte = internt arrangement, ikke representasjon.',
  'Alkohol er <strong>aldri fradragsberettiget</strong> og gir heller ikke MVA-fradrag. Be om separat alkoholnota.',
  'Dokumentasjonskrav: dato, sted, alle deltakere med navn og selskap, forretningsmessig formål. Mangel = avvist fradrag.',
  'Brennevin/sprit: spesielt strengt regelfortolket — unngå.',
]

type RepType = 'dinner' | 'lunch' | 'coffee' | 'other'
const REP_LABELS: Record<RepType, string> = {
  dinner: 'Middag/kveldsmåltid',
  lunch: 'Lunsj',
  coffee: 'Kaffe/enkel bevertning',
  other: 'Annet',
}

export default function RepresentationPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    rep_type: 'dinner' as RepType,
    amount_nok: '',
    person_count: '2',
    includes_alcohol: false,
    during_work_hours: false,
    has_external_participant: true,
    participants: '',   // fritekst — navn og selskap
    purpose: '',
    notes: '',
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('company_access').select('company_id').eq('user_id', user.id).then(({ data }) => {
        const ids = (data ?? []).map(r => r.company_id)
        if (!ids.length) return
        supabase.from('companies').select('*').in('id', ids).then(({ data: c }) => {
          setCompanies(c ?? [])
          if (c && c.length > 0) setSelectedCompany(c[0].id)
        })
      })
    })
  }, [])

  useEffect(() => {
    if (!selectedCompany) return
    const supabase = createClient()
    supabase.from('representation_events')
      .select('*').eq('company_id', selectedCompany)
      .gte('date', `${year}-01-01`).lte('date', `${year}-12-31`)
      .order('date', { ascending: false })
      .then(({ data }) => setEvents(data ?? []))
  }, [selectedCompany, year])

  const preview = form.amount_nok ? evaluateRepresentation({
    amount_nok: parseFloat(form.amount_nok) || 0,
    person_count: parseInt(form.person_count) || 1,
    rep_type: form.rep_type,
    includes_alcohol: form.includes_alcohol,
    has_external_participant: form.has_external_participant,
    during_work_hours: form.during_work_hours,
    purpose: form.purpose,
  }) : null

  async function submit() {
    setLoading(true)
    const result = evaluateRepresentation({
      amount_nok: parseFloat(form.amount_nok) || 0,
      person_count: parseInt(form.person_count) || 1,
      rep_type: form.rep_type,
      includes_alcohol: form.includes_alcohol,
      has_external_participant: form.has_external_participant,
      during_work_hours: form.during_work_hours,
      purpose: form.purpose,
    })
    const supabase = createClient()
    await supabase.from('representation_events').insert({
      company_id: selectedCompany,
      date: form.date,
      location: form.location,
      rep_type: form.rep_type,
      amount_nok: parseFloat(form.amount_nok) || 0,
      person_count: parseInt(form.person_count) || 1,
      includes_alcohol: form.includes_alcohol,
      has_external_participant: form.has_external_participant,
      during_work_hours: form.during_work_hours,
      participants: form.participants,
      purpose: form.purpose,
      deductible_amount: result.deductible_amount,
      non_deductible_amount: result.non_deductible_amount,
      notes: form.notes || null,
    })
    const { data } = await supabase.from('representation_events')
      .select('*').eq('company_id', selectedCompany)
      .gte('date', `${year}-01-01`).lte('date', `${year}-12-31`)
      .order('date', { ascending: false })
    setEvents(data ?? [])
    setShowForm(false)
    setForm({ date: new Date().toISOString().split('T')[0], location: '', rep_type: 'dinner', amount_nok: '', person_count: '2', includes_alcohol: false, during_work_hours: false, has_external_participant: true, participants: '', purpose: '', notes: '' })
    setLoading(false)
  }

  const totalDeductible = events.reduce((s, e) => s + Number(e.deductible_amount), 0)
  const totalNonDeductible = events.reduce((s, e) => s + Number(e.non_deductible_amount), 0)

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Representasjon</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Maks {REPRESENTATION_LIMIT_PER_PERSON_NOK} kr/person for middag (2025) · Lunsj i arbeidstid = fullt fradrag
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Registrer
        </button>
      </div>

      <div className="flex gap-3 mb-5">
        <select className="input w-48" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input w-28" value={year} onChange={e => setYear(parseInt(e.target.value))}>
          {[2025, 2024, 2023].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <TipBox tips={TIPS} />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-2xl font-bold text-gray-900">{events.length}</p>
          <p className="text-sm text-gray-500">Hendelser registrert</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-green-600">{totalDeductible.toLocaleString('nb-NO')} kr</p>
          <p className="text-sm text-gray-500">Fradragsberettiget</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-red-600">{totalNonDeductible.toLocaleString('nb-NO')} kr</p>
          <p className="text-sm text-gray-500">Ikke fradragsberettiget</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 mb-6 space-y-4">
          <h3 className="font-semibold">Registrer representasjonshendelse</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Dato *</label>
              <input type="date" className="input" value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <label className="label">Sted</label>
              <input type="text" className="input" placeholder="Restaurant/sted" value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.rep_type}
                onChange={e => setForm(p => ({ ...p, rep_type: e.target.value as RepType }))}>
                {Object.entries(REP_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Totalbeløp (NOK) *</label>
              <input type="number" min="0" className="input" value={form.amount_nok}
                onChange={e => setForm(p => ({ ...p, amount_nok: e.target.value }))} />
            </div>
            <div>
              <label className="label">Antall personer</label>
              <input type="number" min="1" className="input" value={form.person_count}
                onChange={e => setForm(p => ({ ...p, person_count: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Deltakere (navn + selskap) *</label>
            <textarea className="input resize-none" rows={2} value={form.participants}
              placeholder="F.eks: Vegard Sognefest (Motoro AS), Kari Nordmann (Kunde AS)"
              onChange={e => setForm(p => ({ ...p, participants: e.target.value }))} />
          </div>
          <div>
            <label className="label">Forretningsmessig formål *</label>
            <input type="text" className="input" value={form.purpose}
              placeholder="F.eks: Statusmøte Q3, forhandling om ny kontrakt, produktdemonstrasjon"
              onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.has_external_participant}
                onChange={e => setForm(p => ({ ...p, has_external_participant: e.target.checked }))} className="w-4 h-4" />
              Ekstern part til stede (kunde, leverandør, partner)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.during_work_hours}
                onChange={e => setForm(p => ({ ...p, during_work_hours: e.target.checked }))} className="w-4 h-4" />
              I arbeidstid (lunsj i arbeidstid = fullt fradragsberettiget)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.includes_alcohol}
                onChange={e => setForm(p => ({ ...p, includes_alcohol: e.target.checked }))} className="w-4 h-4" />
              Alkohol inkludert i beløpet
            </label>
          </div>

          {preview && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
              <p className="font-medium text-gray-700">Beregning:</p>
              <p className="text-gray-600">Beløp per person: {Math.round(preview.per_person_nok).toLocaleString('nb-NO')} kr</p>
              <p className="text-green-600 flex items-center gap-1.5">
                <CheckCircle size={13} strokeWidth={2} /> Fradragsberettiget: {preview.deductible_amount.toLocaleString('nb-NO')} kr
              </p>
              {preview.non_deductible_amount > 0 && (
                <p className="text-red-600">Ikke fradragsberettiget: {preview.non_deductible_amount.toLocaleString('nb-NO')} kr</p>
              )}
              {preview.flags.map((f, i) => (
                <p key={i} className="text-yellow-700 flex items-center gap-1.5">
                  <AlertTriangle size={13} strokeWidth={2} /> {f}
                </p>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Avbryt</button>
            <button onClick={submit} disabled={loading || !form.amount_nok || !form.purpose}
              className="btn-primary flex-1">
              {loading ? 'Lagrer…' : 'Lagre'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {events.length > 0 ? (
        <div className="space-y-2">
          {events.map(ev => (
            <div key={ev.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <UtensilsCrossed size={17} className="text-orange-500" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{ev.purpose || REP_LABELS[ev.rep_type as RepType]}</p>
                  <p className="text-sm text-gray-500">{ev.date}{ev.location ? ` · ${ev.location}` : ''} · {ev.person_count} personer</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{ev.participants}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{Number(ev.amount_nok).toLocaleString('nb-NO')} kr</p>
                <p className="text-xs text-green-600">{Number(ev.deductible_amount).toLocaleString('nb-NO')} kr fradrag</p>
                {Number(ev.non_deductible_amount) > 0 && (
                  <p className="text-xs text-red-600">{Number(ev.non_deductible_amount).toLocaleString('nb-NO')} kr ikke fradrag</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed size={26} className="text-gray-400" strokeWidth={1.4} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Ingen representasjon registrert</h3>
          <p className="text-gray-500 text-sm">Registrer representasjon med knappen øverst til høyre.</p>
        </div>
      )}
    </div>
  )
}
