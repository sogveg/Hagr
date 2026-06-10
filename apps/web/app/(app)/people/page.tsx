'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  evaluateGift,
  getRemainingGiftAllowance,
  GIFT_TAX_FREE_LIMIT_NOK,
} from '@/lib/shared'

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Eier',
  BOARD_MEMBER: 'Styremedlem',
  BOARD_CHAIR: 'Styreleder',
  CEO: 'Daglig leder',
  EMPLOYEE: 'Ansatt',
  ACCOUNTANT: 'Regnskapsfører',
  AUDITOR: 'Revisor',
  SPOUSE: 'Ektefelle/samboer',
  OTHER: 'Annen',
}

const FAMILY_RELATIONS = [
  { value: '', label: 'Ingen kjent familierelasjon' },
  { value: 'spouse', label: 'Ektefelle / samboer' },
  { value: 'child', label: 'Barn' },
  { value: 'parent', label: 'Forelder' },
  { value: 'sibling', label: 'Søsken' },
  { value: 'other_family', label: 'Annen nær familie' },
]

interface PersonForm {
  name: string
  email: string
  role: string
  is_owner: boolean
  ownership_percentage: string
  is_employee: boolean
  employment_percentage: string
  family_relation: string
  family_relation_description: string
  company_ids: string[] // can belong to multiple companies
}

interface GiftForm {
  description: string
  amount_nok: string
  is_cash_equivalent: boolean
  is_performance_related: boolean
  date: string
  notes: string
}

const EMPTY_GIFT: GiftForm = {
  description: '',
  amount_nok: '',
  is_cash_equivalent: false,
  is_performance_related: false,
  date: new Date().toISOString().split('T')[0],
  notes: '',
}

export default function PeoplePage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [people, setPeople] = useState<any[]>([])
  const [giftsByPerson, setGiftsByPerson] = useState<Record<string, number>>({}) // name → used NOK this year
  const [selectedCompany, setSelectedCompany] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Gift panel state
  const [giftTarget, setGiftTarget] = useState<any | null>(null) // person object
  const [giftForm, setGiftForm] = useState<GiftForm>(EMPTY_GIFT)
  const [giftLoading, setGiftLoading] = useState(false)
  const [giftError, setGiftError] = useState<string | null>(null)
  const [giftSuccess, setGiftSuccess] = useState(false)

  const [form, setForm] = useState<PersonForm>({
    name: '',
    email: '',
    role: 'EMPLOYEE',
    is_owner: false,
    ownership_percentage: '',
    is_employee: true,
    employment_percentage: '100',
    family_relation: '',
    family_relation_description: '',
    company_ids: [],
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
          if (c && c.length > 0) {
            setSelectedCompany(c[0].id)
            setForm(prev => ({ ...prev, company_ids: [c[0].id] }))
          }
        })
      })
    })
  }, [])

  useEffect(() => {
    if (!selectedCompany) return
    loadPeople()
  }, [selectedCompany])

  async function loadPeople() {
    const supabase = createClient()
    const { data } = await supabase
      .from('company_people')
      .select('*')
      .eq('company_id', selectedCompany)
      .order('name')
    setPeople(data ?? [])

    // Load gift totals for this year per person name
    const year = new Date().getFullYear()
    const { data: gifts } = await supabase
      .from('gifts')
      .select('recipient_name, amount_nok')
      .eq('company_id', selectedCompany)
      .eq('year', year)
    const totals: Record<string, number> = {}
    for (const g of gifts ?? []) {
      totals[g.recipient_name] = (totals[g.recipient_name] ?? 0) + Number(g.amount_nok)
    }
    setGiftsByPerson(totals)
  }

  function setF<K extends keyof PersonForm>(key: K, value: PersonForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleCompany(id: string) {
    setForm(prev => ({
      ...prev,
      company_ids: prev.company_ids.includes(id)
        ? prev.company_ids.filter(c => c !== id)
        : [...prev.company_ids, id],
    }))
  }

  const totalOwnership = people.reduce((s, p) => s + (Number(p.ownership_percentage) || 0), 0)

  async function addPerson() {
    if (!form.company_ids.length) { setError('Velg minst ett selskap'); return }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    // Insert person for each selected company
    const inserts = form.company_ids.map(cid => ({
      company_id: cid,
      name: form.name,
      email: form.email || null,
      role: form.role,
      is_owner: form.is_owner,
      ownership_percentage: form.is_owner ? parseFloat(form.ownership_percentage) || null : null,
      is_employee: form.is_employee,
      employment_percentage: form.is_employee ? parseFloat(form.employment_percentage) : null,
      family_relation: form.family_relation || null,
      family_relation_description: form.family_relation_description || null,
    }))

    const { error: err } = await supabase.from('company_people').insert(inserts)
    if (err) { setError(err.message); setLoading(false); return }

    await loadPeople()
    setShowForm(false)
    setForm(prev => ({
      name: '', email: '', role: 'EMPLOYEE',
      is_owner: false, ownership_percentage: '',
      is_employee: true, employment_percentage: '100',
      family_relation: '', family_relation_description: '',
      company_ids: [selectedCompany],
    }))
    setLoading(false)
  }

  // ── Gift panel ──
  function openGiftPanel(person: any) {
    setGiftTarget(person)
    setGiftForm(EMPTY_GIFT)
    setGiftError(null)
    setGiftSuccess(false)
  }

  async function submitGift() {
    if (!giftTarget || !giftForm.amount_nok || !giftForm.description) return
    setGiftLoading(true)
    setGiftError(null)

    const amount = parseFloat(giftForm.amount_nok)
    const usedBefore = giftsByPerson[giftTarget.name] ?? 0
    const result = evaluateGift({
      amount_nok: amount,
      is_cash_equivalent: giftForm.is_cash_equivalent,
      is_performance_related: giftForm.is_performance_related,
      used_this_year_before_nok: usedBefore,
    })

    const supabase = createClient()
    const { error: err } = await supabase.from('gifts').insert({
      company_id: selectedCompany,
      recipient_person_id: giftTarget.id,
      recipient_name: giftTarget.name,
      year: new Date().getFullYear(),
      description: giftForm.description,
      amount_nok: amount,
      is_cash_equivalent: giftForm.is_cash_equivalent,
      is_performance_related: giftForm.is_performance_related,
      date: giftForm.date,
      tax_free_amount: result.tax_free_amount,
      taxable_amount: result.taxable_amount,
      notes: giftForm.notes || null,
    })

    if (err) { setGiftError(err.message); setGiftLoading(false); return }

    setGiftSuccess(true)
    await loadPeople()
    setTimeout(() => {
      setGiftTarget(null)
      setGiftSuccess(false)
    }, 1800)
    setGiftLoading(false)
  }

  const giftPreview = giftTarget && giftForm.amount_nok
    ? evaluateGift({
        amount_nok: parseFloat(giftForm.amount_nok) || 0,
        is_cash_equivalent: giftForm.is_cash_equivalent,
        is_performance_related: giftForm.is_performance_related,
        used_this_year_before_nok: giftsByPerson[giftTarget?.name] ?? 0,
      })
    : null

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personer og roller</h1>
          <p className="text-gray-500 mt-1">Administrer hvem som er tilknyttet selskapet</p>
        </div>
        <button onClick={() => { setShowForm(true); setError(null) }} className="btn-primary">
          + Legg til person
        </button>
      </div>

      {/* Company selector */}
      <div className="mb-6">
        <select className="input w-56" value={selectedCompany}
          onChange={e => setSelectedCompany(e.target.value)}>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Ownership bar */}
      {people.some(p => p.is_owner && p.ownership_percentage) && (
        <div className="card p-4 mb-5 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-1">Eierstruktur</p>
            <div className="flex h-3 rounded-full overflow-hidden bg-gray-100 gap-0.5">
              {people.filter(p => p.is_owner && p.ownership_percentage).map((p, i) => {
                const colors = ['bg-brand-500','bg-green-500','bg-yellow-500','bg-purple-500','bg-red-400']
                return <div key={p.id} className={colors[i % colors.length]}
                  style={{ width: `${p.ownership_percentage}%` }} title={`${p.name}: ${p.ownership_percentage}%`} />
              })}
            </div>
            <div className="flex gap-4 mt-1.5 flex-wrap">
              {people.filter(p => p.is_owner).map((p, i) => {
                const colors = ['text-brand-600','text-green-600','text-yellow-600','text-purple-600','text-red-500']
                return <span key={p.id} className={`text-xs ${colors[i % colors.length]}`}>
                  {p.name}{p.ownership_percentage ? ` ${p.ownership_percentage}%` : ''}
                </span>
              })}
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${totalOwnership > 100 ? 'text-red-600' : totalOwnership === 100 ? 'text-green-600' : 'text-gray-700'}`}>
              {totalOwnership}%
            </p>
            <p className="text-xs text-gray-400">registrert</p>
          </div>
        </div>
      )}

      {/* Family risk note */}
      {people.some(p => p.is_owner && p.family_relation) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 flex gap-3">
          <span className="text-yellow-500 text-lg">⚠</span>
          <div>
            <p className="text-sm font-medium text-yellow-800">Nærstående eiere registrert</p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Påvirker risikovurdering for gaver, representasjon og andre ytelser.
            </p>
          </div>
        </div>
      )}

      {/* ── Add person form ── */}
      {showForm && (
        <div className="card p-6 mb-6 space-y-5">
          <h3 className="font-semibold text-gray-900">Legg til person</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Navn *</label>
              <input type="text" className="input" value={form.name}
                onChange={e => setF('name', e.target.value)} />
            </div>
            <div>
              <label className="label">E-post</label>
              <input type="email" className="input" value={form.email}
                onChange={e => setF('email', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Rolle</label>
            <select className="input" value={form.role} onChange={e => setF('role', e.target.value)}>
              {Object.entries(ROLE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </div>

          {/* Multi-company assignment */}
          {companies.length > 1 && (
            <div>
              <label className="label">
                Tilknyttet selskap(er)
                <span className="ml-1 text-xs font-normal text-gray-400">— huk av alle som gjelder</span>
              </label>
              <div className="space-y-2">
                {companies.map(c => (
                  <label key={c.id} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={form.company_ids.includes(c.id)}
                      onChange={() => toggleCompany(c.id)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.company_type}{c.org_number ? ` · ${c.org_number}` : ''}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.is_owner}
                onChange={e => setF('is_owner', e.target.checked)} className="w-4 h-4" />
              Er eier/aksjonær
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.is_employee}
                onChange={e => setF('is_employee', e.target.checked)} className="w-4 h-4" />
              Er ansatt
            </label>
          </div>

          {form.is_owner && (
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="label">Eierandel (%)</label>
              <div className="flex items-center gap-3">
                <input type="number" min="0" max="100" step="0.1" className="input w-32"
                  value={form.ownership_percentage}
                  onChange={e => setF('ownership_percentage', e.target.value)}
                  placeholder="0.0" />
                {totalOwnership > 0 && (
                  <p className="text-xs text-gray-500">
                    Øvrige har {totalOwnership}% — gjenstår {Math.max(0, 100 - totalOwnership)}%
                  </p>
                )}
              </div>
            </div>
          )}

          {form.is_employee && (
            <div>
              <label className="label">Stillingsandel (%)</label>
              <input type="number" min="1" max="100" className="input w-32"
                value={form.employment_percentage}
                onChange={e => setF('employment_percentage', e.target.value)} />
            </div>
          )}

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div>
              <label className="label">
                Familierelasjon til andre eiere
                <span className="ml-1 text-xs font-normal text-gray-400">(påvirker risikovurdering)</span>
              </label>
              <select className="input" value={form.family_relation}
                onChange={e => setF('family_relation', e.target.value)}>
                {FAMILY_RELATIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            {form.family_relation && (
              <div>
                <label className="label">Beskriv relasjonen</label>
                <input type="text" className="input" value={form.family_relation_description}
                  onChange={e => setF('family_relation_description', e.target.value)}
                  placeholder="F.eks. ektefelle til Vegard Sognefest" />
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => { setShowForm(false); setError(null) }} className="btn-secondary flex-1">Avbryt</button>
            <button onClick={addPerson} disabled={loading || !form.name} className="btn-primary flex-1">
              {loading ? 'Lagrer…' : `Legg til${form.company_ids.length > 1 ? ` i ${form.company_ids.length} selskaper` : ''}`}
            </button>
          </div>
        </div>
      )}

      {/* ── People list ── */}
      {people.length > 0 ? (
        <div className="space-y-3">
          {people.map(person => {
            const usedNok = giftsByPerson[person.name] ?? 0
            const remaining = getRemainingGiftAllowance(usedNok)
            const isGiftOpen = giftTarget?.id === person.id

            return (
              <div key={person.id} className="card overflow-hidden">
                {/* Person row */}
                <div className="p-4 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{person.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {ROLE_LABELS[person.role] ?? person.role}
                      </span>
                      {person.is_owner && (
                        <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                          Eier{person.ownership_percentage ? ` ${person.ownership_percentage}%` : ''}
                        </span>
                      )}
                      {person.is_employee && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Ansatt{person.employment_percentage ? ` ${person.employment_percentage}%` : ''}
                        </span>
                      )}
                      {person.family_relation && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          {FAMILY_RELATIONS.find(r => r.value === person.family_relation)?.label}
                        </span>
                      )}
                    </div>
                    {person.email && <p className="text-xs text-gray-400 mt-1">{person.email}</p>}
                    {person.family_relation_description && (
                      <p className="text-xs text-gray-500 mt-0.5 italic">{person.family_relation_description}</p>
                    )}
                  </div>

                  {/* Right side: gift status + button */}
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    {/* Gift allowance pill */}
                    <div className="text-right">
                      <p className={`text-xs font-medium ${usedNok > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                        {usedNok > 0 ? `${usedNok.toLocaleString('nb-NO')} kr brukt` : 'Ingen gaver i år'}
                      </p>
                      <p className={`text-xs ${remaining === 0 ? 'text-red-500' : remaining < 2000 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {remaining.toLocaleString('nb-NO')} kr gjenstår
                      </p>
                    </div>
                    <button
                      onClick={() => isGiftOpen ? setGiftTarget(null) : openGiftPanel(person)}
                      className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                        isGiftOpen
                          ? 'border-brand-300 bg-brand-50 text-brand-700'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      🎁 Gave
                    </button>
                  </div>
                </div>

                {/* ── Inline gift panel ── */}
                {isGiftOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4">
                    {giftSuccess ? (
                      <div className="flex items-center gap-2 text-green-700 font-medium py-2">
                        <span className="text-xl">✓</span> Gave registrert!
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-700">
                          Registrer gave til <span className="text-brand-700">{person.name}</span>
                          <span className="ml-2 text-xs font-normal text-gray-400">
                            Skattefri grense: {GIFT_TAX_FREE_LIMIT_NOK.toLocaleString('nb-NO')} kr/år ·
                            Gjenstår: {remaining.toLocaleString('nb-NO')} kr
                          </span>
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="label text-xs">Beskrivelse *</label>
                            <input type="text" className="input" value={giftForm.description}
                              onChange={e => setGiftForm(p => ({ ...p, description: e.target.value }))}
                              placeholder="Julegave, jubileum..." />
                          </div>
                          <div>
                            <label className="label text-xs">Beløp (NOK) *</label>
                            <input type="number" min="0" className="input" value={giftForm.amount_nok}
                              onChange={e => setGiftForm(p => ({ ...p, amount_nok: e.target.value }))} />
                          </div>
                        </div>
                        <div>
                          <label className="label text-xs">Dato</label>
                          <input type="date" className="input w-44" value={giftForm.date}
                            onChange={e => setGiftForm(p => ({ ...p, date: e.target.value }))} />
                        </div>
                        <div className="flex gap-5 text-sm">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={giftForm.is_cash_equivalent}
                              onChange={e => setGiftForm(p => ({ ...p, is_cash_equivalent: e.target.checked }))}
                              className="w-4 h-4" />
                            Kontant / gavekort til kontanter
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={giftForm.is_performance_related}
                              onChange={e => setGiftForm(p => ({ ...p, is_performance_related: e.target.checked }))}
                              className="w-4 h-4" />
                            Prestasjonsgave
                          </label>
                        </div>

                        {/* Live preview */}
                        {giftPreview && parseFloat(giftForm.amount_nok) > 0 && (
                          <div className="flex gap-4 text-sm bg-white rounded-lg px-4 py-3 border border-gray-200">
                            <span className="text-green-600 font-medium">
                              ✓ {giftPreview.tax_free_amount.toLocaleString('nb-NO')} kr skattefri
                            </span>
                            {giftPreview.taxable_amount > 0 && (
                              <span className="text-red-600 font-medium">
                                ⚠ {giftPreview.taxable_amount.toLocaleString('nb-NO')} kr skattepliktig
                              </span>
                            )}
                            {giftPreview.flags.map((f, i) => (
                              <span key={i} className="text-yellow-700 text-xs">{f}</span>
                            ))}
                          </div>
                        )}

                        {giftError && (
                          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{giftError}</p>
                        )}

                        <div className="flex gap-2">
                          <button onClick={() => setGiftTarget(null)} className="btn-secondary text-sm">Avbryt</button>
                          <button
                            onClick={submitGift}
                            disabled={giftLoading || !giftForm.description || !giftForm.amount_nok}
                            className="btn-primary text-sm"
                          >
                            {giftLoading ? 'Lagrer…' : 'Lagre gave'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="text-3xl mb-3">👥</div>
          <p className="text-gray-500 text-sm">Ingen personer registrert for dette selskapet ennå</p>
        </div>
      )}
    </div>
  )
}
