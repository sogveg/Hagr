'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CreditCard, Lightbulb, ChevronDown, ChevronUp, Plus, AlertTriangle, CheckCircle, ArrowLeftRight } from 'lucide-react'

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
  '<strong>Privat kjøp med firmakort</strong>: registrér umiddelbart, tilbakebetal selskapet — ellers risikerer du aksjonærlån-beskatning.',
  '<strong>Aksjonærlån (AS)</strong>: siden 2022 beskattes lån fra AS til aksjonær som utbytte i uttaksåret. Det er i praksis avskaffet.',
  'Mellomregningskonto: hold den i balanse — voksende mellomregning er et rødt flagg ved bokettersyn.',
  '<strong>Firmakjøp med privatkort</strong>: refunder via utleggsskjema — da er alt ryddig og MVA kan trekkes fra.',
  'For alle firmakortbilag: noter formål, deltakere og forretningsmessig sammenheng direkte på kvitteringen.',
]

type TransactionType = 'private_on_company_card' | 'business_on_private_card' | 'unclear'

const TRANSACTION_LABELS: Record<TransactionType, string> = {
  private_on_company_card: 'Privat kjøp med firmakort',
  business_on_private_card: 'Firmakjøp med privatkort',
  unclear: 'Usikker klassifisering',
}

const TRANSACTION_ICONS: Record<TransactionType, string> = {
  private_on_company_card: 'ring-red',
  business_on_private_card: 'ring-green',
  unclear: 'ring-yellow',
}

export default function CompanyCardPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [entries, setEntries] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    transaction_type: 'private_on_company_card' as TransactionType,
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount_nok: '',
    who_used_it: '',
    business_purpose: '',
    to_be_refunded: true,
    is_naturalytelse: false,
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
    supabase.from('cost_entries')
      .select('*').eq('company_id', selectedCompany)
      .gte('date', `${year}-01-01`).lte('date', `${year}-12-31`)
      .order('date', { ascending: false })
      .then(({ data }) => setEntries(data ?? []))
  }, [selectedCompany, year])

  // Risk assessment
  function getRisk(f: typeof form) {
    if (f.transaction_type === 'private_on_company_card' && !f.to_be_refunded && !f.is_naturalytelse) {
      return { level: 'red' as const, msg: 'Privat kjøp med firmakort som ikke tilbakebetales = aksjonærlån-risiko' }
    }
    if (f.transaction_type === 'unclear') {
      return { level: 'yellow' as const, msg: 'Usikker klassifisering — avklar med regnskapsfører' }
    }
    if (f.transaction_type === 'private_on_company_card' && f.to_be_refunded) {
      return { level: 'yellow' as const, msg: 'OK hvis tilbakebetalingen dokumenteres og gjennomføres raskt' }
    }
    return { level: 'green' as const, msg: 'Firmakjøp med privatkort refundert som utlegg — helt greit' }
  }

  const risk = getRisk(form)

  async function submit() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('cost_entries').insert({
      company_id: selectedCompany,
      date: form.date,
      description: form.description,
      amount_nok: parseFloat(form.amount_nok) || 0,
      entry_type: form.transaction_type,
      who_used_it: form.who_used_it,
      business_purpose: form.business_purpose,
      to_be_refunded: form.to_be_refunded,
      is_naturalytelse: form.is_naturalytelse,
      risk_level: risk.level,
      notes: form.notes || null,
    })
    const { data } = await supabase.from('cost_entries')
      .select('*').eq('company_id', selectedCompany)
      .gte('date', `${year}-01-01`).lte('date', `${year}-12-31`)
      .order('date', { ascending: false })
    setEntries(data ?? [])
    setShowForm(false)
    setForm({ transaction_type: 'private_on_company_card', date: new Date().toISOString().split('T')[0], description: '', amount_nok: '', who_used_it: '', business_purpose: '', to_be_refunded: true, is_naturalytelse: false, notes: '' })
    setLoading(false)
  }

  const totalPrivateOnCompany = entries.filter(e => e.entry_type === 'private_on_company_card').reduce((s, e) => s + Number(e.amount_nok), 0)
  const totalBusinessOnPrivate = entries.filter(e => e.entry_type === 'business_on_private_card').reduce((s, e) => s + Number(e.amount_nok), 0)
  const pendingRefunds = entries.filter(e => e.to_be_refunded && !e.is_naturalytelse).length

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Firmakort og mellomregning</h1>
          <p className="text-gray-500 mt-1 text-sm">Avklar og dokumenter private/firmakjøp på feil kort</p>
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
          {(() => { const cy = new Date().getFullYear(); const sn = new Date().getMonth() >= 11; return (sn ? [cy+1,cy,cy-1,cy-2] : [cy,cy-1,cy-2]) })().map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <TipBox tips={TIPS} />

      {pendingRefunds > 0 && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <AlertTriangle size={18} className="text-yellow-500 shrink-0" strokeWidth={2} />
          <p className="text-sm text-yellow-800 font-medium">
            {pendingRefunds} bilag er merket som «skal tilbakebetales» — sørg for at tilbakebetalingen gjennomføres.
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
          <p className="text-sm text-gray-500">Bilag registrert</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-red-600">{totalPrivateOnCompany.toLocaleString('nb-NO')} kr</p>
          <p className="text-sm text-gray-500">Privat på firmakort</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-blue-600">{totalBusinessOnPrivate.toLocaleString('nb-NO')} kr</p>
          <p className="text-sm text-gray-500">Firma på privatkort</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 mb-6 space-y-4">
          <h3 className="font-semibold">Registrer bilag</h3>

          <div>
            <label className="label">Hva skjedde?</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(TRANSACTION_LABELS) as [TransactionType, string][]).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setForm(p => ({ ...p, transaction_type: k }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    form.transaction_type === k
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Dato</label>
              <input type="date" className="input" value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <label className="label">Beløp (NOK)</label>
              <input type="number" min="0" className="input" value={form.amount_nok}
                onChange={e => setForm(p => ({ ...p, amount_nok: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Hva ble kjøpt? *</label>
            <input type="text" className="input" value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Hvem brukte det?</label>
              <input type="text" className="input" value={form.who_used_it}
                onChange={e => setForm(p => ({ ...p, who_used_it: e.target.value }))} />
            </div>
            <div>
              <label className="label">Forretningsmessig formål</label>
              <input type="text" className="input" value={form.business_purpose}
                onChange={e => setForm(p => ({ ...p, business_purpose: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            {form.transaction_type === 'private_on_company_card' && (
              <>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.to_be_refunded}
                    onChange={e => setForm(p => ({ ...p, to_be_refunded: e.target.checked }))} className="w-4 h-4" />
                  Skal tilbakebetales av ansatt/eier til selskapet
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.is_naturalytelse}
                    onChange={e => setForm(p => ({ ...p, is_naturalytelse: e.target.checked }))} className="w-4 h-4" />
                  Naturalytelse (skal innberettes som lønn/fordel)
                </label>
              </>
            )}
          </div>

          {/* Risk preview */}
          {form.amount_nok && (
            <div className={`rounded-lg p-3 text-sm flex items-start gap-2 ${
              risk.level === 'green' ? 'bg-green-50 border border-green-100' :
              risk.level === 'yellow' ? 'bg-yellow-50 border border-yellow-100' :
              'bg-red-50 border border-red-100'
            }`}>
              {risk.level === 'green'
                ? <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" strokeWidth={2} />
                : <AlertTriangle size={15} className={`shrink-0 mt-0.5 ${risk.level === 'red' ? 'text-red-500' : 'text-yellow-500'}`} strokeWidth={2} />}
              <span className={risk.level === 'green' ? 'text-green-800' : risk.level === 'yellow' ? 'text-yellow-800' : 'text-red-800'}>
                {risk.msg}
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Avbryt</button>
            <button onClick={submit} disabled={loading || !form.description || !form.amount_nok}
              className="btn-primary flex-1">
              {loading ? 'Lagrer…' : 'Lagre bilag'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map(entry => (
            <div key={entry.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  entry.entry_type === 'private_on_company_card' ? 'bg-red-50' :
                  entry.entry_type === 'business_on_private_card' ? 'bg-green-50' : 'bg-yellow-50'
                }`}>
                  {entry.entry_type === 'unclear'
                    ? <ArrowLeftRight size={17} className="text-yellow-500" strokeWidth={1.8} />
                    : <CreditCard size={17} className={entry.entry_type === 'private_on_company_card' ? 'text-red-500' : 'text-green-500'} strokeWidth={1.8} />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{entry.description}</p>
                  <p className="text-sm text-gray-500">{TRANSACTION_LABELS[entry.entry_type as TransactionType]} · {entry.date}</p>
                  {entry.to_be_refunded && (
                    <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                      Skal tilbakebetales
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{Number(entry.amount_nok).toLocaleString('nb-NO')} kr</p>
                <p className={`text-xs ${entry.risk_level === 'green' ? 'text-green-600' : entry.risk_level === 'red' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {entry.risk_level === 'green' ? 'Lav risiko' : entry.risk_level === 'red' ? 'Høy risiko' : 'Moderat'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard size={26} className="text-gray-400" strokeWidth={1.4} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Ingen bilag registrert</h3>
          <p className="text-gray-500 text-sm">Registrer firmakort-avklaringer med knappen øverst til høyre.</p>
        </div>
      )}
    </div>
  )
}
