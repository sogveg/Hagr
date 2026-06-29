'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
type ReactNode = React.ReactNode
import { createClient } from '@/lib/supabase/client'

interface Company {
  id: string
  name: string
  org_number?: string
  company_type?: string
  [key: string]: any
}

interface CompanyContextValue {
  companies: Company[]
  selectedCompanyId: string
  selectedCompany: Company | null
  setSelectedCompanyId: (id: string) => void
  loading: boolean
}

const CompanyContext = createContext<CompanyContextValue>({
  companies: [],
  selectedCompanyId: '',
  selectedCompany: null,
  setSelectedCompanyId: () => {},
  loading: true,
})

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyIdState] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      supabase
        .from('company_access')
        .select('company_id')
        .eq('user_id', user.id)
        .then(({ data }) => {
          const ids = (data ?? []).map((r: any) => r.company_id)
          if (!ids.length) { setLoading(false); return }
          supabase
            .from('companies')
            .select('id, name, org_number')
            .in('id', ids)
            .order('name')
            .then(({ data: c }) => {
              const list = c ?? []
              setCompanies(list)
              // Restore saved selection or default to first
              const saved = localStorage.getItem('hagr_selected_company')
              const valid = saved && list.find((x: Company) => x.id === saved)
              setSelectedCompanyIdState(valid ? saved! : (list[0]?.id ?? ''))
              setLoading(false)
            })
        })
    })
  }, [])

  function setSelectedCompanyId(id: string) {
    setSelectedCompanyIdState(id)
    localStorage.setItem('hagr_selected_company', id)
  }

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) ?? null

  return (
    <CompanyContext.Provider value={{ companies, selectedCompanyId, selectedCompany, setSelectedCompanyId, loading }}>
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  return useContext(CompanyContext)
}
