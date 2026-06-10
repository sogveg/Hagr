'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

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

export default function PeoplePage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [people, setPeople] = useState<any[]>([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'EMPLOYEE',
    is_owner: false,
    is_employee: true,
    employment_percentage: '100',
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
      .from('company_people')
      .select('*')
      .eq('company_id', selectedCompany)
      .order('name')
      .then(({ data }) => setPeople(data ?? []))
  }, [selectedCompany])

  async function addPerson() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('company_people').insert({
      company_id: selectedCompany,
      name: form.name,
      email: form.email || null,
      role: form.role,
      is_owner: form.is_owner,
      is_employee: form.is_employee,
      employment_percentage: form.is_employee ? parseFloat(form.employment_percentage) : null,
    })
    const { data } = await supabase.from('company_people').select('*').eq('company_id', selectedCompany).order('name')
    setPeople(data ?? [])
    setShowForm(false)
    setForm({ name: '', email: '', role: 'EMPLOYEE', is_owner: false, is_employee: true, employment_percentage: '100' })
    setLoading(false)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personer og roller</h1>
          <p className="text-gray-500 mt-1">Administrer hvem som er tilknyttet selskapet</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Legg til person</button>
      </div>

      <div className="mb-6">
        <select className="input w-48" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 space-y-4">
          <h3 className="font-semibold">Legg til person</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Navn *</label>
              <input type="text" className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">E-post</label>
              <input type="email" className="input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Rolle</label>
            <select className="input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              {Object.entries(ROLE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.is_owner} onChange={e => setForm(p => ({ ...p, is_owner: e.target.checked }))} className="w-4 h-4" />
              Er eier/aksjonær
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.is_employee} onChange={e => setForm(p => ({ ...p, is_employee: e.target.checked }))} className="w-4 h-4" />
              Er ansatt
            </label>
          </div>
          {form.is_employee && (
            <div>
              <label className="label">Stillingsandel (%)</label>
              <input type="number" min="1" max="100" className="input w-32" value={form.employment_percentage} onChange={e => setForm(p => ({ ...p, employment_percentage: e.target.value }))} />
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Avbryt</button>
            <button onClick={addPerson} disabled={loading || !form.name} className="btn-primary flex-1">
              {loading ? 'Lagrer…' : 'Legg til'}
            </button>
          </div>
        </div>
      )}

      {people.length > 0 ? (
        <div className="space-y-2">
          {people.map(person => (
            <div key={person.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{person.name}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {ROLE_LABELS[person.role] ?? person.role}
                  </span>
                  {person.is_owner && <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">Eier</span>}
                  {person.is_employee && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Ansatt {person.employment_percentage ? `${person.employment_percentage}%` : ''}
                    </span>
                  )}
                </div>
                {person.email && <p className="text-xs text-gray-400 mt-1">{person.email}</p>}
              </div>
            </div>
          ))}
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
