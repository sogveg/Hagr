'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PHONE_INTERNET_MAX_TAXABLE_NOK as PHONE_INTERNET_TAXABLE_BENEFIT_NOK } from '@/lib/shared'
import { Smartphone, Wifi, Lightbulb, ChevronDown, ChevronUp, Plus, AlertTriangle } from 'lucide-react'

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
  `<strong>Sjablongbeløp 2025: ${PHONE_INTERNET_TAXABLE_BENEFIT_NOK.toLocaleString('nb-NO')} kr per år</strong> — dette er skattepliktig fordel uavhengig av faktisk privat bruk.`,
  'Ordningen gjelder <strong>én mobil og ett internettabonnement</strong> per ansatt. To mobiler = dobbelt sjablongbeløp.',
  'Hytte-internett: kan dekkes av selskapet <strong>hvis det er dokumentert tjenstlig behov</strong> (f.eks. at man jobber derfra).',
  'TV/streaming inkludert i bredbåndsabonnementet? Det er <strong>ikke fradragsberettiget</strong> for selskapet.',
  'Husk å <strong>innberette fordelen i a-meldingen</strong> — det er arbeidsgivers ansvar.',
  'ENK-eier kan trekke fra tjenstlig andel av faktisk kostnad — dokumentér bruksandelen.',
]

type DeviceType = 'mobile' | 'home_broadband' | 'mobile_broadband' | 'device'

const DEVICE_LABELS: Record<DeviceType, string> = {
  mobile: 'Mobiltelefon/abonnement',
  home_broadband: 'Bredbånd hjemme',
  mobile_broadband: 'Mobilt bredbånd',
  device: 'Telefonapparat/nettbrett',
}

export default function PhoneInternetPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [benefits, setBenefits] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    employee_name: '',
    device_type: 'mobile' as DeviceType,
    monthly_cost_nok: '',
    months_covered: '12',
    business_need_description: '',
    includes_tv_streaming: false,
    is_reported_a_melding: false,
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
    supabase.from('phone_internet_benefits')
      .select('*').eq('company_id', selectedCompany).eq('year', year)
      .order('created_at', { ascending: false })
      .then(({ data }) => setBenefits(data ?? []))
  }, [selectedCompany, year])

  async function submit() {
    setLoading(true)
    const monthlyCost = parseFloat(form.monthly_cost_nok) || 0
    const months = parseInt(form.months_covered) || 12
    const annualCost = monthlyCost * months
    const taxableBenefit = Math.min(annualCost, PHONE_INTERNET_TAXABLE_BENEFIT_NOK)

    const supabase = createClient()
    await supabase.from('phone_internet_benefits').insert({
      company_id: selectedCompany,
      year,
      employee_name: form.employee_name,
      device_type: form.device_type,
      monthly_cost_nok: monthlyCost,
      months_covered: months,
      annual_cost_nok: annualCost,
      taxable_benefit_nok: taxableBenefit,
      business_need_description: form.business_need_description,
      includes_tv_streaming: form.includes_tv_streaming,
      is_reported_a_melding: form.is_reported_a_melding,
      notes: form.notes || null,
    })

    const { data } = await supabase.from('phone_internet_benefits')
      .select('*').eq('company_id', selectedCompany).eq('year', year)
      .order('created_at', { ascending: false })
    setBenefits(data ?? [])
    setShowForm(false)
    setForm({ employee_name: '', device_type: 'mobile', monthly_cost_nok: '', months_covered: '12', business_need_description: '', includes_tv_streaming: false, is_reported_a_melding: false, notes: '' })
    setLoading(false)
  }

  const totalAnnual = benefits.reduce((s, b) => s + Number(b.annual_cost_nok), 0)
  const totalTaxable = benefits.reduce((s, b) => s + Number(b.taxable_benefit_nok), 0)

  // Live preview
  const previewAnnual = (parseFloat(form.monthly_cost_nok) || 0) * (parseInt(form.months_covered) || 12)
  const previewTaxable = Math.min(previewAnnual, PHONE_INTERNET_TAXABLE_BENEFIT_NOK)

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Telefon og internett</h1>
          <p className="text-gray-500 mt-1 text-sm">
            EK-ytelse — sjablongbeløp {PHONE_INTERNET_TAXABLE_BENEFIT_NOK.toLocaleString('nb-NO')} kr/år per ansatt (2025)
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
          <p className="text-2xl font-bold text-gray-900">{benefits.length}</p>
          <p className="text-sm text-gray-500">Registrerte ytelser</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-blue-600">{totalAnnual.toLocaleString('nb-NO')} kr</p>
          <p className="text-sm text-gray-500">Total kostnad selskap</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-orange-600">{totalTaxable.toLocaleString('nb-NO')} kr</p>
          <p className="text-sm text-gray-500">Skattepliktig fordel</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 mb-6 space-y-4">
          <h3 className="font-semibold">Registrer telefon/internett-ytelse</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Ansatt *</label>
              <input type="text" className="input" value={form.employee_name}
                onChange={e => setForm(p => ({ ...p, employee_name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.device_type}
                onChange={e => setForm(p => ({ ...p, device_type: e.target.value as DeviceType }))}>
                {Object.entries(DEVICE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Månedlig kostnad (NOK)</label>
              <input type="number" min="0" className="input" value={form.monthly_cost_nok}
                onChange={e => setForm(p => ({ ...p, monthly_cost_nok: e.target.value }))} />
            </div>
            <div>
              <label className="label">Antall måneder</label>
              <input type="number" min="1" max="12" className="input" value={form.months_covered}
                onChange={e => setForm(p => ({ ...p, months_covered: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Tjenstlig behovsnotat *</label>
            <textarea className="input resize-none" rows={2} value={form.business_need_description}
              placeholder="Beskriv det tjenstlige behovet — f.eks. kontakt med kunder, hjemmekontor-arbeid…"
              onChange={e => setForm(p => ({ ...p, business_need_description: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.includes_tv_streaming}
                onChange={e => setForm(p => ({ ...p, includes_tv_streaming: e.target.checked }))} className="w-4 h-4" />
              Inkluderer TV/streaming (ikke fradragsberettiget for selskapet)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.is_reported_a_melding}
                onChange={e => setForm(p => ({ ...p, is_reported_a_melding: e.target.checked }))} className="w-4 h-4" />
              Fordelen er innberettet i a-meldingen
            </label>
          </div>

          {form.monthly_cost_nok && parseFloat(form.monthly_cost_nok) > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
              <p className="font-medium text-gray-700">Beregning:</p>
              <p className="text-gray-600">Årskostand for selskap: {previewAnnual.toLocaleString('nb-NO')} kr</p>
              <p className="text-orange-600">Skattepliktig fordel (sjablong): {previewTaxable.toLocaleString('nb-NO')} kr</p>
              {form.includes_tv_streaming && (
                <p className="text-red-600 flex items-center gap-1.5">
                  <AlertTriangle size={13} strokeWidth={2} /> TV/streaming-del er ikke fradragsberettiget for selskapet
                </p>
              )}
              {!form.is_reported_a_melding && (
                <p className="text-yellow-700 flex items-center gap-1.5">
                  <AlertTriangle size={13} strokeWidth={2} /> Husk å innberette {previewTaxable.toLocaleString('nb-NO')} kr i a-meldingen
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Avbryt</button>
            <button onClick={submit} disabled={loading || !form.employee_name || !form.monthly_cost_nok}
              className="btn-primary flex-1">
              {loading ? 'Lagrer…' : 'Lagre ytelse'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {benefits.length > 0 ? (
        <div className="space-y-2">
          {benefits.map(b => (
            <div key={b.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  {b.device_type === 'mobile' || b.device_type === 'device'
                    ? <Smartphone size={17} className="text-blue-500" strokeWidth={1.8} />
                    : <Wifi size={17} className="text-blue-500" strokeWidth={1.8} />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{b.employee_name}</p>
                  <p className="text-sm text-gray-500">{DEVICE_LABELS[b.device_type as DeviceType]} · {b.months_covered} mnd</p>
                  {!b.is_reported_a_melding && (
                    <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                      Ikke innberettet
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{Number(b.annual_cost_nok).toLocaleString('nb-NO')} kr/år</p>
                <p className="text-xs text-orange-600">Skattepliktig fordel: {Number(b.taxable_benefit_nok).toLocaleString('nb-NO')} kr</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smartphone size={26} className="text-gray-400" strokeWidth={1.4} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Ingen telefon/internett-ytelser registrert</h3>
          <p className="text-gray-500 text-sm">Registrer ytelser med knappen øverst til høyre.</p>
        </div>
      )}
    </div>
  )
}
