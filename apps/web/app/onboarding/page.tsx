'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { COMPANY_TYPE_LABELS, type CompanyType } from '@/lib/shared'
import {
  Phone, Wifi, Car, Navigation, Anchor, ClipboardList,
  Target, Coffee, CheckCircle, ChevronRight, Lightbulb,
} from 'lucide-react'

const COMPANY_TYPES = Object.entries(COMPANY_TYPE_LABELS) as [CompanyType, string][]

function mapOrgForm(kode: string, name: string): CompanyType {
  const n = name.toLowerCase()
  switch (kode) {
    case 'AS': return n.includes('holding') ? 'HOLDING_AS' : 'AS'
    case 'ASA': return 'AS'
    case 'ENK': return 'ENK'
    case 'ANS': case 'DA': return 'ANS_DA'
    default: return 'OTHER'
  }
}

interface BrregResult {
  navn: string
  organisasjonsnummer: string
  organisasjonsform: { kode: string; beskrivelse: string }
  antallAnsatte?: number
  forretningsadresse?: { adresse?: string[]; poststed?: string }
}

interface FormState {
  // Step 1 — selskapet
  name: string
  org_number: string
  company_type: CompanyType
  // Step 2 — ansatte og lønn
  has_employees: boolean
  employee_count: number
  owner_employed: boolean
  payroll_active: boolean
  spouse_involved: boolean
  approx_annual_profit: string
  current_owner_salary: string
  aga_zone: string
  // Step 3 — telefon og internett
  uses_phone_for_work: boolean | null
  company_pays_phone: boolean | null
  works_from_home: boolean | null
  company_pays_internet: boolean | null
  // Step 4 — bil og transport
  has_company_car: boolean | null
  uses_private_car_for_biz: boolean | null
  has_cabin_boat: boolean | null
  // Step 5 — møter og representasjon
  holds_board_meetings: boolean | null
  holds_strategy_gatherings: boolean | null
  has_client_entertainment: boolean | null
}

const INITIAL: FormState = {
  name: '', org_number: '', company_type: 'AS',
  has_employees: false, employee_count: 0, owner_employed: true,
  payroll_active: false, spouse_involved: false,
  approx_annual_profit: '', current_owner_salary: '', aga_zone: 'zone1',
  uses_phone_for_work: null, company_pays_phone: null,
  works_from_home: null, company_pays_internet: null,
  has_company_car: null, uses_private_car_for_biz: null, has_cabin_boat: null,
  holds_board_meetings: null, holds_strategy_gatherings: null, has_client_entertainment: null,
}

const TOTAL_STEPS = 5

function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3">
      {([true, false] as const).map(v => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            value === v
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {v ? 'Ja' : 'Nei'}
        </button>
      ))}
    </div>
  )
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex justify-center gap-1.5 mt-4">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i < current ? 'w-6 bg-brand-600' : i === current - 1 ? 'w-8 bg-brand-600' : 'w-4 bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [brregData, setBrregData] = useState<BrregResult | null>(null)
  const [brregLoading, setBrregLoading] = useState(false)
  const [brregError, setBrregError] = useState<string | null>(null)
  const [brregConfirmed, setBrregConfirmed] = useState(false)
  const lookupTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleOrgNumberChange(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 9)
    const formatted = digits.replace(/(\d{3})(\d{1,3})?(\d{1,3})?/, (_m, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    )
    set('org_number', formatted)
    setBrregData(null); setBrregConfirmed(false); setBrregError(null)
    if (lookupTimeout.current) clearTimeout(lookupTimeout.current)
    if (digits.length === 9) {
      lookupTimeout.current = setTimeout(() => lookupBrreg(digits), 400)
    }
  }

  async function lookupBrreg(orgnr: string) {
    setBrregLoading(true); setBrregError(null)
    try {
      const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`, { headers: { Accept: 'application/json' } })
      if (!res.ok) { setBrregError('Fant ikke selskapet'); setBrregLoading(false); return }
      setBrregData(await res.json())
    } catch { setBrregError('Feil ved oppslag') }
    finally { setBrregLoading(false) }
  }

  function confirmBrreg() {
    if (!brregData) return
    setForm(prev => ({
      ...prev,
      name: brregData.navn,
      org_number: brregData.organisasjonsnummer.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'),
      company_type: mapOrgForm(brregData.organisasjonsform.kode, brregData.navn),
      has_employees: (brregData.antallAnsatte ?? 0) > 0,
      employee_count: brregData.antallAnsatte ?? 0,
    }))
    setBrregConfirmed(true)
  }

  function next() { setError(null); setStep(s => s + 1) }
  function back() { setError(null); setStep(s => s - 1) }

  async function finish() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/company/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          org_number: form.org_number,
          company_type: form.company_type,
          has_employees: form.has_employees,
          employee_count: form.employee_count,
          owner_employed: form.owner_employed,
          payroll_active: form.payroll_active,
          spouse_involved: form.spouse_involved,
          approx_annual_profit: form.approx_annual_profit ? parseInt(form.approx_annual_profit) : null,
          current_owner_salary: form.current_owner_salary ? parseInt(form.current_owner_salary) : null,
          aga_zone: form.aga_zone,
          uses_phone_for_work: form.uses_phone_for_work ?? false,
          company_pays_phone: form.company_pays_phone ?? false,
          works_from_home: form.works_from_home ?? false,
          company_pays_internet: form.company_pays_internet ?? false,
          has_company_car: form.has_company_car ?? false,
          uses_private_car_for_biz: form.uses_private_car_for_biz ?? false,
          has_cabin_boat: form.has_cabin_boat ?? false,
          holds_board_meetings: form.holds_board_meetings ?? false,
          holds_strategy_gatherings: form.holds_strategy_gatherings ?? false,
          has_client_entertainment: form.has_client_entertainment ?? false,
          onboarding_completed: true,
        }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Noe gikk galt'); setLoading(false); return }
      router.push('/dashboard')
      router.refresh()
    } catch { setError('Nettverksfeil — prøv igjen'); setLoading(false) }
  }

  const AGA_ZONES = [
    { value: 'zone1', label: 'Sone I — 14,1% (Oslo, Bergen, de fleste byer)' },
    { value: 'zone2', label: 'Sone II — 10,6%' },
    { value: 'zone3', label: 'Sone III — 6,4%' },
    { value: 'zone4', label: 'Sone IV — 5,1%' },
    { value: 'zone5', label: 'Sone V — 0% (Finnmark m.fl.)' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo + progress */}
        <div className="text-center mb-6">
          <span className="text-2xl font-bold text-brand-700">SkatteSmart</span>
          <p className="mt-1 text-sm text-gray-500">Steg {step} av {TOTAL_STEPS}</p>
          <StepDots current={step} total={TOTAL_STEPS} />
        </div>

        <div className="card p-8 shadow-lg">
          {/* ── STEP 1: Selskapet ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Om selskapet</h2>
                <p className="text-sm text-gray-500 mt-1">Vi slår opp i Brønnøysundregistrene automatisk</p>
              </div>

              <div>
                <label className="label">Organisasjonsnummer</label>
                <div className="relative">
                  <input type="text" className="input pr-10" value={form.org_number}
                    onChange={e => handleOrgNumberChange(e.target.value)}
                    placeholder="123 456 789" maxLength={11} inputMode="numeric" />
                  {brregLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {brregConfirmed && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg">✓</div>}
                </div>
                {brregData && !brregConfirmed && (
                  <div className="mt-3 border border-brand-200 bg-brand-50 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide">Funnet i Brreg</p>
                    <p className="font-semibold text-gray-900">{brregData.navn}</p>
                    <p className="text-sm text-gray-500">{brregData.organisasjonsform.beskrivelse}{brregData.antallAnsatte !== undefined ? ` · ${brregData.antallAnsatte} ansatte` : ''}</p>
                    <button onClick={confirmBrreg} className="btn-primary text-sm w-full">Bruk disse opplysningene</button>
                  </div>
                )}
                {brregError && <p className="mt-1 text-xs text-red-500">{brregError}</p>}
              </div>

              <div>
                <label className="label">Selskapsnavn *</label>
                <input type="text" className="input" value={form.name}
                  onChange={e => set('name', e.target.value)} placeholder="Eksempel AS" />
              </div>

              <div>
                <label className="label">Selskapstype *</label>
                <select className="input" value={form.company_type}
                  onChange={e => set('company_type', e.target.value as CompanyType)}>
                  {COMPANY_TYPES.map(([type, label]) => (
                    <option key={type} value={type}>{label}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button onClick={() => { if (!form.name) { setError('Selskapsnavn er påkrevd'); return }; next() }} className="btn-primary w-full flex items-center justify-center gap-2">
                Neste <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Ansatte og økonomi ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ansatte og økonomi</h2>
                <p className="text-sm text-gray-500 mt-1">Brukes for å beregne optimal lønn vs. utbytte</p>
              </div>

              <div>
                <label className="label">Har selskapet ansatte?</label>
                <YesNo value={form.has_employees} onChange={v => { set('has_employees', v); if (!v) set('employee_count', 0) }} />
              </div>
              {form.has_employees && (
                <div>
                  <label className="label">Antall ansatte</label>
                  <input type="number" min="1" className="input" value={form.employee_count}
                    onChange={e => set('employee_count', parseInt(e.target.value) || 0)} />
                </div>
              )}

              <div>
                <label className="label">Er eier ansatt i selskapet?</label>
                <YesNo value={form.owner_employed} onChange={v => set('owner_employed', v)} />
              </div>
              <div>
                <label className="label">Er lønnskjøring aktiv?</label>
                <YesNo value={form.payroll_active} onChange={v => set('payroll_active', v)} />
              </div>
              <div>
                <label className="label">Er ektefelle/samboer involvert i selskapet?</label>
                <YesNo value={form.spouse_involved} onChange={v => set('spouse_involved', v)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Typisk årsoverskudd (kr)</label>
                  <input type="number" className="input" placeholder="F.eks. 1 500 000"
                    value={form.approx_annual_profit}
                    onChange={e => set('approx_annual_profit', e.target.value)} />
                  <p className="text-xs text-gray-400 mt-1">FØR eierlønn — ca. tall er bra nok</p>
                </div>
                <div>
                  <label className="label">Din nåværende lønn (kr)</label>
                  <input type="number" className="input" placeholder="F.eks. 927 000"
                    value={form.current_owner_salary}
                    onChange={e => set('current_owner_salary', e.target.value)} />
                  <p className="text-xs text-gray-400 mt-1">7,1 G = 927 658 kr (anbefalt)</p>
                </div>
              </div>

              <div>
                <label className="label">Arbeidsgiveravgift-sone</label>
                <select className="input" value={form.aga_zone} onChange={e => set('aga_zone', e.target.value)}>
                  {AGA_ZONES.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">AGA er ekstra kostnad for selskapet i tillegg til lønnen — f.eks. 14,1% i sone I</p>
              </div>

              <div className="flex gap-3">
                <button onClick={back} className="btn-secondary flex-1">Tilbake</button>
                <button onClick={next} className="btn-primary flex-1 flex items-center justify-center gap-2">Neste <ChevronRight size={16} /></button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Telefon og internett ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Telefon og internett</h2>
                <p className="text-sm text-gray-500 mt-1">Selskapet kan dekke dette skattemessig gunstig</p>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex gap-3">
                <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-sm text-amber-800">Selskapet kan dekke én mobiltelefon og ett bredbånd per ansatt. Den ansatte beskattes kun av et fast sjablongbeløp på <strong>4 392 kr/år</strong> — uavhengig av faktisk bruk.</p>
              </div>

              <div>
                <label className="label flex items-center gap-2"><Phone size={14} /> Bruker du/ansatte mobil i arbeidet?</label>
                <YesNo value={form.uses_phone_for_work} onChange={v => set('uses_phone_for_work', v)} />
              </div>

              {form.uses_phone_for_work && (
                <div>
                  <label className="label">Dekker selskapet mobilen?</label>
                  <YesNo value={form.company_pays_phone} onChange={v => set('company_pays_phone', v)} />
                  {form.company_pays_phone === false && (
                    <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-2">
                      💡 Potensial: Selskapet kan dekke mobilen og trekke fra kostnaden. Ansatte beskattes bare 4 392 kr/år.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="label flex items-center gap-2"><Wifi size={14} /> Jobber du/ansatte hjemmefra?</label>
                <YesNo value={form.works_from_home} onChange={v => set('works_from_home', v)} />
              </div>

              {form.works_from_home && (
                <div>
                  <label className="label">Dekker selskapet hjemme-internett?</label>
                  <YesNo value={form.company_pays_internet} onChange={v => set('company_pays_internet', v)} />
                  {form.company_pays_internet === false && (
                    <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-2">
                      💡 Potensial: Internett hjemme kan dekkes av selskapet ved tjenstlig bruk.
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={back} className="btn-secondary flex-1">Tilbake</button>
                <button onClick={next} className="btn-primary flex-1 flex items-center justify-center gap-2">Neste <ChevronRight size={16} /></button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Bil og transport ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bil, reise og hytte/båt</h2>
                <p className="text-sm text-gray-500 mt-1">Kjøring og firmaeiendom har egne skatteregler</p>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex gap-3">
                <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-sm text-amber-800">Kjøring i privat bil for jobben gir rett til <strong>4,50 kr/km skattefritt</strong>. Logg alltid sted, formål og km.</p>
              </div>

              <div>
                <label className="label flex items-center gap-2"><Car size={14} /> Har selskapet firmabil?</label>
                <YesNo value={form.has_company_car} onChange={v => set('has_company_car', v)} />
              </div>

              <div>
                <label className="label flex items-center gap-2"><Navigation size={14} /> Kjører du/ansatte privatbil i jobben?</label>
                <YesNo value={form.uses_private_car_for_biz} onChange={v => set('uses_private_car_for_biz', v)} />
                {form.uses_private_car_for_biz && (
                  <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-2">
                    💡 Husk kjørebok! 4,50 kr/km er skattefritt — vi hjelper deg holde oversikt.
                  </p>
                )}
              </div>

              <div>
                <label className="label flex items-center gap-2"><Anchor size={14} /> Eier selskapet hytte eller båt?</label>
                <YesNo value={form.has_cabin_boat} onChange={v => set('has_cabin_boat', v)} />
                {form.has_cabin_boat && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-2">
                    ⚠️ Privat bruk av selskapets hytte/båt er en skattepliktig fordel. Vi hjelper deg beregne og dokumentere.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={back} className="btn-secondary flex-1">Tilbake</button>
                <button onClick={next} className="btn-primary flex-1 flex items-center justify-center gap-2">Neste <ChevronRight size={16} /></button>
              </div>
            </div>
          )}

          {/* ── STEP 5: Møter og representasjon ── */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Møter og representasjon</h2>
                <p className="text-sm text-gray-500 mt-1">Fradrag ved riktig dokumentasjon</p>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex gap-3">
                <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-sm text-amber-800">Styremøter, strategisamlinger og kundemøter gir fradragsberettigede kostnader — men <strong>krever god dokumentasjon</strong>.</p>
              </div>

              <div>
                <label className="label flex items-center gap-2"><ClipboardList size={14} /> Har dere styremøter?</label>
                <YesNo value={form.holds_board_meetings} onChange={v => set('holds_board_meetings', v)} />
              </div>

              <div>
                <label className="label flex items-center gap-2"><Target size={14} /> Avholder dere strategisamlinger/fagdager?</label>
                <YesNo value={form.holds_strategy_gatherings} onChange={v => set('holds_strategy_gatherings', v)} />
                {form.holds_strategy_gatherings && (
                  <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-2">
                    💡 Samlingen krever minimum 6 timer faglig program per dag for full fradragsrett.
                  </p>
                )}
              </div>

              <div>
                <label className="label flex items-center gap-2"><Coffee size={14} /> Har dere ekstern representasjon (kunder, leverandører)?</label>
                <YesNo value={form.has_client_entertainment} onChange={v => set('has_client_entertainment', v)} />
                {form.has_client_entertainment && (
                  <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-2">
                    💡 Middag: maks 560 kr/person eks. mva er fradragsberettiget. Lunsj i arbeidstid: fullt fradrag.
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 mb-4">
                  Alt du svarer lagres og brukes til å gi deg personlige skattesparetips på oversiktssiden.
                </p>
                <div className="flex gap-3">
                  <button onClick={back} className="btn-secondary flex-1">Tilbake</button>
                  <button onClick={finish} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <CheckCircle size={16} />
                    {loading ? 'Oppretter…' : 'Fullfør oppsett'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
