'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  evaluateGift,
  getRemainingGiftAllowance,
  GIFT_TAX_FREE_LIMIT_NOK,
  evaluatePersonalDiscount,
  PERSONAL_DISCOUNT_TAX_FREE_LIMIT_NOK,
} from '@/lib/shared'
import { Gift, Tag, AlertTriangle, Plus } from 'lucide-react'
import GlobalTipBox from '@/components/TipBox'

function TipBox({ tips }: { tips: string[] }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="text-sm text-amber-900" dangerouslySetInnerHTML={{ __html: `• ${tip}` }} />
        ))}
      </ul>
    </div>
  )
}
import EmptyToolState from '@/components/EmptyToolState'

const GIFT_TIPS = [
  '<strong>Grensen er 5 000 kr per person per år (2026)</strong> — regn med hele kalenderåret, ikke per hendelse.',
  '<strong>Kontanter og Vipps er alltid skattepliktige</strong> — uansett beløp. Det samme gjelder gavekort som kan løses inn i penger (f.eks. saldo-gavekort).',
  '<strong>Gavekort som ikke kan løses inn i penger er skattefritt</strong> under 5 000 kr — f.eks. gavekort til en spesifikk butikk, hotell eller opplevelse fungerer på lik linje med en fysisk gave.',
  'Gaver i naturalier (vin, opplevelse, elektronikk, gavekort) er skattefrie under grensen — husk kvittering og at gavekortet ikke kan innløses kontant.',
  'Juletips: gi et gavekort til en spesifikk butikk verdt 4 900 kr + ta vare på kvittering. Gjenværende 100 kr kan brukes resten av året.',
  '<strong>Jubileumsgave ekstra:</strong> ved personlig jubileum (rund bursdag, 10/20/25 år i jobben) eller bedriftsjubileum (25, 50 år) kan det gis <strong>opptil 8 000 kr ekstra</strong> skattefritt utover de ordinære 5 000 kr.',
  'Registrér alltid mottaker, dato og type gave — Skatteetaten kan be om full liste per ansatt.',
]

const DISCOUNT_TIPS = [
  '<strong>Grensen er 10 000 kr rabatt per ansatt per år (2026)</strong> — beregnes på markedspris minus det de betaler.',
  'Gjelder <strong>kun varer og tjenester selskapet selv produserer eller selger</strong>. Ikke rabatt hos en leverandør.',
  'Familie til ansatte uten ansettelsesforhold = ikke personalrabatt. Da er det en skattepliktig fordel for den ansatte.',
  'Rabatten kan ikke kombineres med andre skattefrie ytelser for å "doble" fordelen.',
  'Husk å dokumentere markedsprisen — bruk ordinær prisliste eller nettbutikkpris samme dag som rabatten gis.',
  'Over 10 000 kr? <strong>Overskytende er skattepliktig lønn</strong> og skal innberettes på a-meldingen.',
]

export default function GiftsPage() {
  const [tab, setTab] = useState<'gifts' | 'discounts'>('gifts')
  const [companies, setCompanies] = useState<any[]>([])
  const [gifts, setGifts] = useState<any[]>([])
  const [discounts, setDiscounts] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  // ── Gift form ──
  const [giftForm, setGiftForm] = useState({
    recipient_name: '',
    description: '',
    amount_nok: '',
    is_cash_equivalent: false,
    is_performance_related: false,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  // ── Discount form ──
  const [discountForm, setDiscountForm] = useState({
    employee_name: '',
    description: '',
    market_value_nok: '',
    employee_paid_nok: '',
    relates_to_own_goods: true,
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
    supabase.from('gifts').select('*').eq('company_id', selectedCompany).eq('year', year)
      .order('date', { ascending: false }).then(({ data }) => setGifts(data ?? []))
    supabase.from('personal_discounts').select('*').eq('company_id', selectedCompany).eq('year', year)
      .order('date', { ascending: false }).then(({ data }) => setDiscounts(data ?? []))
  }, [selectedCompany, year])

  // Per-recipient totals
  const giftTotals: Record<string, number> = {}
  for (const g of gifts) giftTotals[g.recipient_name] = (giftTotals[g.recipient_name] ?? 0) + Number(g.amount_nok)

  const discountTotals: Record<string, number> = {}
  for (const d of discounts) discountTotals[d.employee_name] = (discountTotals[d.employee_name] ?? 0) + Number(d.discount_nok ?? (Number(d.market_value_nok) - Number(d.employee_paid_nok)))

  async function submitGift() {
    setLoading(true)
    const amount = parseFloat(giftForm.amount_nok) || 0
    const result = evaluateGift({
      amount_nok: amount,
      is_cash_equivalent: giftForm.is_cash_equivalent,
      is_performance_related: giftForm.is_performance_related,
      used_this_year_before_nok: giftTotals[giftForm.recipient_name] ?? 0,
    })
    const supabase = createClient()
    await supabase.from('gifts').insert({
      company_id: selectedCompany, recipient_name: giftForm.recipient_name, year,
      description: giftForm.description, amount_nok: amount,
      is_cash_equivalent: giftForm.is_cash_equivalent,
      is_performance_related: giftForm.is_performance_related,
      date: giftForm.date, tax_free_amount: result.tax_free_amount,
      taxable_amount: result.taxable_amount, notes: giftForm.notes || null,
    })
    const { data } = await supabase.from('gifts').select('*').eq('company_id', selectedCompany).eq('year', year).order('date', { ascending: false })
    setGifts(data ?? [])
    setShowForm(false)
    setGiftForm({ recipient_name: '', description: '', amount_nok: '', is_cash_equivalent: false, is_performance_related: false, date: new Date().toISOString().split('T')[0], notes: '' })
    setLoading(false)
  }

  async function submitDiscount() {
    setLoading(true)
    const market = parseFloat(discountForm.market_value_nok) || 0
    const paid = parseFloat(discountForm.employee_paid_nok) || 0
    const result = evaluatePersonalDiscount({
      market_price_nok: market,
      paid_price_nok: paid,
      used_this_year_before_nok: discountTotals[discountForm.employee_name] ?? 0,
      relates_to_own_goods_services: discountForm.relates_to_own_goods,
    })
    const supabase = createClient()
    await supabase.from('personal_discounts').insert({
      company_id: selectedCompany, employee_name: discountForm.employee_name, year,
      description: discountForm.description, market_value_nok: market,
      employee_paid_nok: paid, taxable_amount: result.taxable_amount,
      date: discountForm.date, notes: discountForm.notes || null,
    })
    const { data } = await supabase.from('personal_discounts').select('*').eq('company_id', selectedCompany).eq('year', year).order('date', { ascending: false })
    setDiscounts(data ?? [])
    setShowForm(false)
    setDiscountForm({ employee_name: '', description: '', market_value_nok: '', employee_paid_nok: '', relates_to_own_goods: true, date: new Date().toISOString().split('T')[0], notes: '' })
    setLoading(false)
  }

  const totalGiftTaxFree = gifts.reduce((s, g) => s + Number(g.tax_free_amount), 0)
  const totalGiftTaxable = gifts.reduce((s, g) => s + Number(g.taxable_amount), 0)
  const totalDiscountTaxFree = discounts.reduce((s, d) => s + (Number(d.market_value_nok) - Number(d.employee_paid_nok) - Number(d.taxable_amount)), 0)
  const totalDiscountTaxable = discounts.reduce((s, d) => s + Number(d.taxable_amount), 0)

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gaver og rabatter</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gave: skattefri grense {GIFT_TAX_FREE_LIMIT_NOK.toLocaleString('nb-NO')} kr/person/år ·
            Personalrabatt: {PERSONAL_DISCOUNT_TAX_FREE_LIMIT_NOK.toLocaleString('nb-NO')} kr/person/år
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Registrer
        </button>
      </div>

      <div className="mb-5">
        <GlobalTipBox toolHref="/gifts" title="Tips og regler for gaver og rabatter" maxTips={3} />
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <select className="input w-48" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input w-28" value={year} onChange={e => setYear(parseInt(e.target.value))}>
          {(() => {
            const cy = new Date().getFullYear()
            const showNext = new Date().getMonth() >= 11 // desember
            return (showNext ? [cy + 1, cy, cy - 1, cy - 2] : [cy, cy - 1, cy - 2])
          })().map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => { setTab('gifts'); setShowForm(false) }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'gifts' ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Gift size={15} /> Gaver ({gifts.length})
        </button>
        <button
          onClick={() => { setTab('discounts'); setShowForm(false) }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === 'discounts' ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Tag size={15} /> Personalrabatter ({discounts.length})
        </button>
      </div>

      {/* ── GAVER ─────────────────────────────────────────────────────────── */}
      {tab === 'gifts' && (
        <>
          {gifts.length === 0 && (
            <EmptyToolState
              icon={<Gift size={22} className="text-brand-600" strokeWidth={1.8} />}
              title="Gi gaver skattefritt — inntil 5 000 kr per person"
              tagline="Opp til 5 000 kr/person/år skattefritt"
              description="Selskapet kan gi gaver til ansatte og eier i naturalier uten at noen betaler skatt — forutsatt at gaven ikke er kontanter eller et gavekort som kan løses inn i penger."
              bulletPoints={[
                'Gaver i naturalier (opplevelse, vin, elektronikk, butikkgavekort): 5 000 kr/år',
                'Jubileumsgaver: 8 000 kr ekstra ved runde bursdager og ansettelsesrunder',
                'Kontanter, Vipps og innløsbare gavekort er alltid skattepliktig — uansett beløp',
                'Husk kvittering og notat om mottaker for å dokumentere ved bokettersyn',
              ]}
              lawRef="Skatteloven § 5-15 (2) + Skatteetaten 2026-sats"
            >
              <button onClick={() => setShowForm(true)} className="btn-primary text-sm flex items-center gap-2">
                <Plus size={14} /> Registrer første gave
              </button>
            </EmptyToolState>
          )}

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card p-4">
              <p className="text-2xl font-bold text-gray-900">{gifts.length}</p>
              <p className="text-sm text-gray-500">Gaver registrert</p>
            </div>
            <div className="card p-4">
              <p className="text-2xl font-bold text-green-600">{totalGiftTaxFree.toLocaleString('nb-NO')} kr</p>
              <p className="text-sm text-gray-500">Skattefri andel</p>
            </div>
            <div className="card p-4">
              <p className="text-2xl font-bold text-red-600">{totalGiftTaxable.toLocaleString('nb-NO')} kr</p>
              <p className="text-sm text-gray-500">Skattepliktig andel</p>
            </div>
          </div>

          {/* Gift form */}
          {showForm && (
            <div className="card p-6 mb-6 space-y-4">
              <h3 className="font-semibold">Registrer ny gave</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Mottaker *</label>
                  <input type="text" className="input" value={giftForm.recipient_name}
                    onChange={e => setGiftForm(p => ({ ...p, recipient_name: e.target.value }))} />
                  {giftForm.recipient_name && giftTotals[giftForm.recipient_name] !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      Brukt i år: {giftTotals[giftForm.recipient_name].toLocaleString('nb-NO')} kr ·
                      Gjenstår: {getRemainingGiftAllowance(giftTotals[giftForm.recipient_name]).toLocaleString('nb-NO')} kr
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">Dato *</label>
                  <input type="date" className="input" value={giftForm.date}
                    onChange={e => setGiftForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Beskrivelse *</label>
                <input type="text" className="input" placeholder="F.eks. Vinflasker, gavekort til opplevelse, elektronikk…"
                  value={giftForm.description} onChange={e => setGiftForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <label className="label">Beløp (NOK) *</label>
                <input type="number" min="0" className="input" value={giftForm.amount_nok}
                  onChange={e => setGiftForm(p => ({ ...p, amount_nok: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={giftForm.is_cash_equivalent}
                    onChange={e => setGiftForm(p => ({ ...p, is_cash_equivalent: e.target.checked }))} className="w-4 h-4" />
                  Kontant eller kontantekvivalent (gavekort, Vipps) — alltid skattepliktig
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={giftForm.is_performance_related}
                    onChange={e => setGiftForm(p => ({ ...p, is_performance_related: e.target.checked }))} className="w-4 h-4" />
                  Prestasjonsgave (bonusgave, salgsresultat) — kan klassifiseres som lønn
                </label>
              </div>

              {giftForm.amount_nok && parseFloat(giftForm.amount_nok) > 0 && (() => {
                const r = evaluateGift({
                  amount_nok: parseFloat(giftForm.amount_nok),
                  is_cash_equivalent: giftForm.is_cash_equivalent,
                  is_performance_related: giftForm.is_performance_related,
                  used_this_year_before_nok: giftTotals[giftForm.recipient_name] ?? 0,
                })
                return (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                    <p className="font-medium text-gray-700">Beregning:</p>
                    <p className="text-green-600">Skattefri: {r.tax_free_amount.toLocaleString('nb-NO')} kr</p>
                    <p className="text-red-600">Skattepliktig: {r.taxable_amount.toLocaleString('nb-NO')} kr</p>
                    {r.flags.map((f, i) => (
                      <p key={i} className="text-yellow-700 flex items-center gap-1.5">
                        <AlertTriangle size={13} strokeWidth={2} /> {f}
                      </p>
                    ))}
                  </div>
                )
              })()}

              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Avbryt</button>
                <button onClick={submitGift} disabled={loading || !giftForm.recipient_name || !giftForm.amount_nok} className="btn-primary flex-1">
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
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center shrink-0">
                      <Gift size={17} className="text-violet-500" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{gift.recipient_name}</p>
                      <p className="text-sm text-gray-500">{gift.description} · {gift.date}</p>
                      <div className="flex gap-2 mt-1">
                        {gift.is_cash_equivalent && (
                          <span className="text-xs bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full font-medium">Kontantekvivalent</span>
                        )}
                        {gift.is_performance_related && (
                          <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-0.5 rounded-full font-medium">Prestasjon</span>
                        )}
                      </div>
                    </div>
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
            <div className="card p-10 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift size={26} className="text-gray-400" strokeWidth={1.4} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Ingen gaver registrert for {year}</h3>
              <p className="text-gray-500 text-sm">Registrer gaver med knappen øverst til høyre.</p>
            </div>
          )}
        </>
      )}

      {/* ── PERSONALRABATTER ──────────────────────────────────────────────── */}
      {tab === 'discounts' && (
        <>
          <TipBox tips={DISCOUNT_TIPS} />

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card p-4">
              <p className="text-2xl font-bold text-gray-900">{discounts.length}</p>
              <p className="text-sm text-gray-500">Rabatter registrert</p>
            </div>
            <div className="card p-4">
              <p className="text-2xl font-bold text-green-600">{totalDiscountTaxFree.toLocaleString('nb-NO')} kr</p>
              <p className="text-sm text-gray-500">Skattefri rabatt</p>
            </div>
            <div className="card p-4">
              <p className="text-2xl font-bold text-red-600">{totalDiscountTaxable.toLocaleString('nb-NO')} kr</p>
              <p className="text-sm text-gray-500">Skattepliktig rabatt</p>
            </div>
          </div>

          {/* Discount form */}
          {showForm && (
            <div className="card p-6 mb-6 space-y-4">
              <h3 className="font-semibold">Registrer personalrabatt</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Ansatt *</label>
                  <input type="text" className="input" value={discountForm.employee_name}
                    onChange={e => setDiscountForm(p => ({ ...p, employee_name: e.target.value }))} />
                  {discountForm.employee_name && discountTotals[discountForm.employee_name] !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      Rabatt brukt i år: {discountTotals[discountForm.employee_name].toLocaleString('nb-NO')} kr ·
                      Gjenstår: {Math.max(0, PERSONAL_DISCOUNT_TAX_FREE_LIMIT_NOK - discountTotals[discountForm.employee_name]).toLocaleString('nb-NO')} kr
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">Dato *</label>
                  <input type="date" className="input" value={discountForm.date}
                    onChange={e => setDiscountForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Vare/tjeneste *</label>
                <input type="text" className="input" placeholder="F.eks. Produkt X fra eget sortiment, tjeneste Y…"
                  value={discountForm.description} onChange={e => setDiscountForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Markedspris (NOK) *</label>
                  <input type="number" min="0" className="input" placeholder="Ordinær prisliste"
                    value={discountForm.market_value_nok} onChange={e => setDiscountForm(p => ({ ...p, market_value_nok: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Betalt av ansatt (NOK)</label>
                  <input type="number" min="0" className="input" placeholder="0 = gratis"
                    value={discountForm.employee_paid_nok} onChange={e => setDiscountForm(p => ({ ...p, employee_paid_nok: e.target.value }))} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={discountForm.relates_to_own_goods}
                  onChange={e => setDiscountForm(p => ({ ...p, relates_to_own_goods: e.target.checked }))} className="w-4 h-4" />
                Gjelder varer/tjenester selskapet selv produserer eller selger
              </label>

              {discountForm.market_value_nok && parseFloat(discountForm.market_value_nok) > 0 && (() => {
                const r = evaluatePersonalDiscount({
                  market_price_nok: parseFloat(discountForm.market_value_nok) || 0,
                  paid_price_nok: parseFloat(discountForm.employee_paid_nok) || 0,
                  used_this_year_before_nok: discountTotals[discountForm.employee_name] ?? 0,
                  relates_to_own_goods_services: discountForm.relates_to_own_goods,
                })
                return (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                    <p className="font-medium text-gray-700">Beregning:</p>
                    <p className="text-gray-600">Rabattverdi: {r.discount_value_nok.toLocaleString('nb-NO')} kr</p>
                    <p className="text-green-600">Skattefri: {r.tax_free_amount.toLocaleString('nb-NO')} kr</p>
                    <p className="text-red-600">Skattepliktig: {r.taxable_amount.toLocaleString('nb-NO')} kr</p>
                    {r.flags.map((f, i) => (
                      <p key={i} className="text-yellow-700 flex items-center gap-1.5">
                        <AlertTriangle size={13} strokeWidth={2} /> {f}
                      </p>
                    ))}
                  </div>
                )
              })()}

              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Avbryt</button>
                <button onClick={submitDiscount}
                  disabled={loading || !discountForm.employee_name || !discountForm.market_value_nok}
                  className="btn-primary flex-1">
                  {loading ? 'Lagrer…' : 'Lagre rabatt'}
                </button>
              </div>
            </div>
          )}

          {/* Discount list */}
          {discounts.length > 0 ? (
            <div className="space-y-2">
              {discounts.map(d => {
                const discountVal = Number(d.discount_nok ?? (Number(d.market_value_nok) - Number(d.employee_paid_nok)))
                const taxFree = discountVal - Number(d.taxable_amount)
                return (
                  <div key={d.id} className="card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <Tag size={17} className="text-blue-500" strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{d.employee_name}</p>
                        <p className="text-sm text-gray-500">{d.description} · {d.date}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Markedspris: {Number(d.market_value_nok).toLocaleString('nb-NO')} kr ·
                          Betalt: {Number(d.employee_paid_nok).toLocaleString('nb-NO')} kr
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{discountVal.toLocaleString('nb-NO')} kr rabatt</p>
                      <p className="text-xs text-green-600">{taxFree.toLocaleString('nb-NO')} kr skattefri</p>
                      {Number(d.taxable_amount) > 0 && (
                        <p className="text-xs text-red-600">{Number(d.taxable_amount).toLocaleString('nb-NO')} kr skattepliktig</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="card p-10 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Tag size={26} className="text-gray-400" strokeWidth={1.4} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Ingen personalrabatter registrert for {year}</h3>
              <p className="text-gray-500 text-sm">Registrer rabatter med knappen øverst til høyre.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
