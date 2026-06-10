'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { COMPANY_TYPE_LABELS, type CompanyType } from '@/lib/shared'

const COMPANY_TYPES = Object.entries(COMPANY_TYPE_LABELS) as [CompanyType, string][]

// Map Brreg org form codes → our CompanyType
function mapOrgForm(kode: string, name: string): CompanyType {
  const n = name.toLowerCase()
  switch (kode) {
    case 'AS':
      return n.includes('holding') ? 'HOLDING_AS' : 'AS'
    case 'ASA': return 'AS'
    case 'ENK': return 'ENK'
    case 'ANS':
    case 'DA': return 'ANS_DA'
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
  name: string
  org_number: string
  company_type: CompanyType
  has_employees: boolean
  employee_count: number
  owner_employed: boolean
  payroll_active: boolean
  spouse_involved: boolean
}

const INITIAL: FormState = {
  name: '',
  org_number: '',
  company_type: 'AS',
  has_employees: false,
  employee_count: 0,
  owner_employed: true,
  payroll_active: false,
  spouse_involved: false,
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Brreg lookup state
  const [brregData, setBrregData] = useState<BrregResult | null>(null)
  const [brregLoading, setBrregLoading] = useState(false)
  const [brregError, setBrregError] = useState<string | null>(null)
  const [brregConfirmed, setBrregConfirmed] = useState(false)
  const lookupTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // Auto-lookup when org number is 9 digits
  function handleOrgNumberChange(raw: string) {
    // Strip spaces and non-digits
    const digits = raw.replace(/\D/g, '').slice(0, 9)
    // Format as XXX XXX XXX for display
    const formatted = digits.replace(/(\d{3})(\d{1,3})?(\d{1,3})?/, (_m, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    )
    set('org_number', formatted)
    setBrregData(null)
    setBrregConfirmed(false)
    setBrregError(null)

    if (lookupTimeout.current) clearTimeout(lookupTimeout.current)

    if (digits.length === 9) {
      lookupTimeout.current = setTimeout(() => lookupBrreg(digits), 400)
    }
  }

  async function lookupBrreg(orgnr: string) {
    setBrregLoading(true)
    setBrregError(null)
    try {
      const res = await fetch(
        `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`,
        { headers: { Accept: 'application/json' } }
      )
      if (!res.ok) {
        setBrregError('Fant ikke selskap med dette organisasjonsnummeret')
        setBrregLoading(false)
        return
      }
      const data: BrregResult = await res.json()
      setBrregData(data)
    } catch {
      setBrregError('Kunne ikke hente data fra Brønnøysundregistrene')
    } finally {
      setBrregLoading(false)
    }
  }

  function confirmBrreg() {
    if (!brregData) return
    const companyType = mapOrgForm(
      brregData.organisasjonsform.kode,
      brregData.navn
    )
    setForm(prev => ({
      ...prev,
      name: brregData.navn,
      org_number: brregData.organisasjonsnummer.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'),
      company_type: companyType,
      has_employees: (brregData.antallAnsatte ?? 0) > 0,
      employee_count: brregData.antallAnsatte ?? 0,
    }))
    setBrregConfirmed(true)
  }

  function dismissBrreg() {
    setBrregData(null)
    setBrregConfirmed(false)
  }

  async function finish() {
    setLoading(true)
    setError(null)

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
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Noe gikk galt')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Nettverksfeil — prøv igjen')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-brand-700">SkatteSmart</span>
          <p className="mt-2 text-gray-600">Sett opp ditt første selskap</p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-1.5 w-12 rounded-full transition-colors ${s <= step ? 'bg-brand-600' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        <div className="card p-8">
          {/* ── STEP 1: Om selskapet ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Om selskapet</h2>

              {/* Org number with Brreg lookup */}
              <div>
                <label className="label">Organisasjonsnummer</label>
                <div className="relative">
                  <input
                    type="text"
                    className="input pr-10"
                    value={form.org_number}
                    onChange={e => handleOrgNumberChange(e.target.value)}
                    placeholder="123 456 789"
                    maxLength={11}
                    inputMode="numeric"
                  />
                  {brregLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {brregConfirmed && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Vi henter selskapsnavn og type automatisk fra Brønnøysundregistrene
                </p>

                {/* Brreg suggestion card */}
                {brregData && !brregConfirmed && (
                  <div className="mt-3 border border-brand-200 bg-brand-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-brand-600 uppercase tracking-wide mb-1">
                          Funnet i Brønnøysundregistrene
                        </p>
                        <p className="font-semibold text-gray-900">{brregData.navn}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {brregData.organisasjonsform.beskrivelse}
                          {brregData.antallAnsatte !== undefined && (
                            <> · {brregData.antallAnsatte} ansatte</>
                          )}
                        </p>
                        {brregData.forretningsadresse?.poststed && (
                          <p className="text-sm text-gray-400">
                            {brregData.forretningsadresse.adresse?.join(', ')}{', '}
                            {brregData.forretningsadresse.poststed}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={dismissBrreg}
                        className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-1"
                        title="Avvis"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={confirmBrreg}
                        className="btn-primary text-sm flex-1"
                      >
                        Bruk disse opplysningene
                      </button>
                      <button
                        onClick={dismissBrreg}
                        className="btn-secondary text-sm"
                      >
                        Fyll inn manuelt
                      </button>
                    </div>
                  </div>
                )}

                {brregError && (
                  <p className="mt-2 text-xs text-red-500">{brregError}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="label">Selskapsnavn *</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Eksempel AS"
                />
              </div>

              {/* Company type */}
              <div>
                <label className="label">Selskapstype *</label>
                <select
                  className="input"
                  value={form.company_type}
                  onChange={e => set('company_type', e.target.value as CompanyType)}
                >
                  {COMPANY_TYPES.map(([type, label]) => (
                    <option key={type} value={type}>{label}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <button
                onClick={() => {
                  if (!form.name) { setError('Selskapsnavn er påkrevd'); return }
                  setError(null)
                  setStep(2)
                }}
                className="btn-primary w-full"
              >
                Neste
              </button>
            </div>
          )}

          {/* ── STEP 2: Ansatte og lønn ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Ansatte og lønn</h2>

              <div>
                <label className="label">Har selskapet ansatte?</label>
                <div className="flex gap-4">
                  {[true, false].map(val => (
                    <button
                      key={String(val)}
                      onClick={() => { set('has_employees', val); if (!val) set('employee_count', 0) }}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        form.has_employees === val
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {val ? 'Ja' : 'Nei'}
                    </button>
                  ))}
                </div>
              </div>

              {form.has_employees && (
                <div>
                  <label className="label">Antall ansatte</label>
                  <input
                    type="number"
                    min="1"
                    className="input"
                    value={form.employee_count}
                    onChange={e => set('employee_count', parseInt(e.target.value) || 0)}
                  />
                </div>
              )}

              <div>
                <label className="label">Er eier ansatt i selskapet?</label>
                <div className="flex gap-4">
                  {[true, false].map(val => (
                    <button
                      key={String(val)}
                      onClick={() => set('owner_employed', val)}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        form.owner_employed === val
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {val ? 'Ja' : 'Nei'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Er lønnskjøring aktiv?</label>
                <div className="flex gap-4">
                  {[true, false].map(val => (
                    <button
                      key={String(val)}
                      onClick={() => set('payroll_active', val)}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        form.payroll_active === val
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {val ? 'Ja' : 'Nei'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Tilbake</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">Neste</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Familie og ektefelle ── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Familie og ektefelle</h2>

              <div>
                <label className="label">Er ektefelle/samboer involvert i selskapet?</label>
                <p className="text-xs text-gray-500 mb-3">
                  Dette kan påvirke hvilke skattemessige regler som gjelder.
                </p>
                <div className="flex gap-4">
                  {[true, false].map(val => (
                    <button
                      key={String(val)}
                      onClick={() => set('spouse_involved', val)}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        form.spouse_involved === val
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {val ? 'Ja' : 'Nei'}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">Tilbake</button>
                <button onClick={finish} disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Oppretter…' : 'Opprett selskap'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
