'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { COMPANY_TYPE_LABELS, type CompanyType } from '@skattsmart/shared'

const COMPANY_TYPES = Object.entries(COMPANY_TYPE_LABELS) as [CompanyType, string][]

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

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function finish() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Create subscription (trialing start plan)
    const { error: subError } = await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan_id: 'start',
      status: 'trialing',
      current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
    }, { onConflict: 'user_id' })
    if (subError) { setError(subError.message); setLoading(false); return }

    // Create company
    const { data: company, error: compError } = await supabase
      .from('companies')
      .insert({
        name: form.name,
        org_number: form.org_number || null,
        company_type: form.company_type,
        has_employees: form.has_employees,
        employee_count: form.employee_count,
        owner_employed: form.owner_employed,
        payroll_active: form.payroll_active,
        spouse_involved: form.spouse_involved,
      })
      .select()
      .single()
    if (compError || !company) { setError(compError?.message ?? 'Feil'); setLoading(false); return }

    // Grant access
    await supabase.from('company_access').insert({
      company_id: company.id,
      user_id: user.id,
      role: 'owner',
    })

    router.push('/dashboard')
    router.refresh()
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
                className={`h-1.5 w-12 rounded-full transition-colors ${
                  s <= step ? 'bg-brand-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="card p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Om selskapet</h2>
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
              <div>
                <label className="label">Organisasjonsnummer</label>
                <input
                  type="text"
                  className="input"
                  value={form.org_number}
                  onChange={e => set('org_number', e.target.value)}
                  placeholder="123 456 789"
                />
              </div>
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
              <button
                onClick={() => { if (!form.name) { setError('Selskapsnavn er påkrevd'); return }; setError(null); setStep(2) }}
                className="btn-primary w-full"
              >
                Neste
              </button>
            </div>
          )}

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
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">Tilbake</button>
                <button onClick={finish} disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Oppretter…' : 'Opprett selskap'}
                </button>
              </div>
            </div>
          )}
          {error && step !== 3 && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
