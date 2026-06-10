'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  evaluateGift,
  getRemainingGiftAllowance,
  GIFT_TAX_FREE_LIMIT_NOK,
} from '@skattsmart/shared'
import RiskBadge from '@/components/risk/RiskBadge'

export default function GiftsPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [gifts, setGifts] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    recipient_name: '',
    description: '',
    amount_nok: '',
    is_cash_equivalent: false,
    is_performance_related: false,
    date: new Date().toISOString().split('T')[0],
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
    supabase
      .from('gifts')
      .select('*')
      .eq('company_id', selectedCompany)
      .eq('year', year)
      .order('date', { ascending: false })
      .then(({ data }) => setGifts(data ?? []))
  }, [selectedCompany, year])

  // Compute per-recipient totals
  const recipientTotals: Record<string, number> = {}
  for (const gift of gifts) {
    recipientTotals[gift.recipient_name] = (recipientTotals[gift.recipient_name] ?? 0) + Number(gift.amount_nok)
  }

  async function submitGift() {
    setLoading(true)
    const amount = parseFloat(form.amount_nok) || 0
    const usedBefore = recipientTotals[form.recipient_name] ?? 0
    const result = evaluateGift({
      amount_nok: amount,
      is_cash_equivalent: form.is_cash_equivalent,
      is_performance_related: form.is_performance_related,
      used_this_year_before_nok: usedBefore,
    })

    const supabase = createClient()
    await supabase.from('gifts').insert({
      company_id: selectedCompany,
      recipient_name: form.recipient_name,
      year,
      description: form.description,
      amount_nok: amount,
      is_cash_equivalent: form.is_cash_equivalent,
      is_performance_related: form.is_performance_related,
      date: form.date,
      tax_free_amount: result.tax_free_amount,
      taxable_amount: result.taxable_amount,
      notes: form.notes || null,
    })

    // Refresh
    const { data } = await supabase
      .from('gifts')
      .select('*')
      .eq('company_id', selectedCompany)
      .eq('year', year)
      .order('date', { ascending: false })
    setGifts(data ?? [])
    setShowForm(false)
    setForm({ recipient_name: '', description: '', amount_nok: '', is_cash_equivalent: false, is_performance_related: false, date: new Date().toISOString().split('T')[0], notes: '' })
    setLoading(false)
  }

  const totalTaxFree = gifts.reduce((s, g) => s + Number(g.tax_free_amount), 0)
  const totalTaxable = gifts.reduce((s, g) => s + Number(g.taxable_amount), 0)

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gaveregister</h1>
          <p className="text-gray-500 mt-1">Skattefri grense: {GIFT_TAX_FREE_LIMIT_NOK.toLocaleString('nb-NO')} NOK per person per år</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Registrer gave</button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select className="input w-48" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input w-28" value={year} onChange={e => setYear(parseInt(e.target.value))}>
          {[2025, 2024, 2023].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-2xl font-bold text-gray-900">{gifts.length}</p>
          <p className="text-sm text-gray-500">Gaver registrert</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-green-600">{totalTaxFree.toLocaleString('nb-NO')} kr</p>
          <p className="text-sm text-gray-500">Skattefri andel</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-red-600">{totalTaxable.toLocaleString('nb-NO')} kr</p>
          <p className="text-sm text-gray-500">Skattepliktig andel</p>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card p-6 mb-6 space-y-4">
          <h3 className="font-semibold">Registrer ny gave</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Mottaker *</label>
              <input type="text" className="input" value={form.recipient_name} onChange={e => setForm(p => ({ ...p, recipient_name: e.target.value }))} />
              {form.recipient_name && recipientTotals[form.recipient_name] !== undefined && (
                <p className="text-xs text-gray-500 mt-1">
                  Brukt i år: {recipientTotals[form.recipient_name].toLocaleString('nb-NO')} NOK ·
                  Gjenstår: {getRemainingGiftAllowance(recipientTotals[form.recipient_name]).toLocaleString('nb-NO')} NOK
                </p>
              )}
            </div>
            <div>
              <label className="label">Dato *</label>
              <input type="date" className="input" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Beskrivelse *</label>
            <input type="text" className="input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div>
            <label className="label">Beløp (NOK) *</label>
            <input type="number" min="0" className="input" value={form.amount_nok} onChange={e => setForm(p => ({ ...p, amount_nok: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.is_cash_equivalent} onChange={e => setForm(p => ({ ...p, is_cash_equivalent: e.target.checked }))} className="w-4 h-4" />
              Kontant eller kontantekvivalent (aldri skattefritt)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.is_performance_related} onChange={e => setForm(p => ({ ...p, is_performance_related: e.target.checked }))} className="w-4 h-4" />
              Prestasjonsgave (mulig lønnsklassifisering)
            </label>
          </div>

          {/* Preview calculation */}
          {form.amount_nok && parseFloat(form.amount_nok) > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
              <p className="font-medium text-gray-700">Beregning:</p>
              {(() => {
                const r = evaluateGift({
                  amount_nok: parseFloat(form.amount_nok),
                  is_cash_equivalent: form.is_cash_equivalent,
                  is_performance_related: form.is_performance_related,
                  used_this_year_before_nok: recipientTotals[form.recipient_name] ?? 0,
                })
                return (
                  <>
                    <p className="text-green-600">Skattefri: {r.tax_free_amount.toLocaleString('nb-NO')} NOK</p>
                    <p className="text-red-600">Skattepliktig: {r.taxable_amount.toLocaleString('nb-NO')} NOK</p>
                    {r.flags.map((f, i) => <p key={i} className="text-yellow-700">⚠ {f}</p>)}
                  </>
                )
              })()}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Avbryt</button>
            <button onClick={submitGift} disabled={loading || !form.recipient_name || !form.amount_nok} className="btn-primary flex-1">
              {loading ? 'Lagrer…' : 'Lagre gave'}
            </button>
          </div>
        </div>
      )}

      {/* Gift list */}
      {gifts.length > 0 ? (
        <div className="space-y-2">
          {gifts.map(gift => (
            <div key={gift.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{gift.recipient_name}</p>
                <p className="text-sm text-gray-500">{gift.description} · {gift.date}</p>
                {gift.is_cash_equivalent && <span className="badge-red mt-1">Kontantekvivalent</span>}
                {gift.is_performance_related && <span className="badge-yellow mt-1">Prestasjon</span>}
              </div>
              <div className="text-right">
                <p className="font-semibold">{Number(gift.amount_nok).toLocaleString('nb-NO')} kr</p>
                <p className="text-xs text-green-600">{Number(gift.tax_free_amount).toLocaleString('nb-NO')} kr skattefri</p>
                {Number(gift.taxable_amount) > 0 && (
                  <p className="text-xs text-red-600">{Number(gift.taxable_amount).toLocaleString('nb-NO')} kr skattepliktig</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="text-3xl mb-3">🎁</div>
          <p className="text-gray-500 text-sm">Ingen gaver registrert for {year}</p>
        </div>
      )}
    </div>
  )
}
