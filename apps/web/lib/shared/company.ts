export type CompanyType =
  | 'AS'
  | 'HOLDING_AS'
  | 'ENK'
  | 'ANS_DA'
  | 'PRIVATE'
  | 'OTHER'

export interface Company {
  id: string
  user_id: string
  name: string
  org_number: string | null
  company_type: CompanyType
  has_employees: boolean
  employee_count: number
  owner_employed: boolean
  payroll_active: boolean
  spouse_involved: boolean
  created_at: string
  updated_at: string
}

export interface CompanyPerson {
  id: string
  company_id: string
  user_id: string | null
  name: string
  email: string | null
  role: PersonRole
  is_owner: boolean
  is_employee: boolean
  employment_percentage: number | null
  created_at: string
}

export type PersonRole =
  | 'OWNER'
  | 'BOARD_MEMBER'
  | 'BOARD_CHAIR'
  | 'CEO'
  | 'EMPLOYEE'
  | 'ACCOUNTANT'
  | 'AUDITOR'
  | 'SPOUSE'
  | 'OTHER'

export const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  AS: 'Aksjeselskap (AS)',
  HOLDING_AS: 'Holdingselskap (AS)',
  ENK: 'Enkeltpersonforetak (ENK)',
  ANS_DA: 'ANS/DA',
  PRIVATE: 'Privatperson',
  OTHER: 'Annet',
}

export const MODULES_BY_COMPANY_TYPE: Record<CompanyType, string[]> = {
  AS: [
    'board_meetings',
    'shareholders',
    'dividends',
    'payroll',
    'gifts',
    'personal_discounts',
    'phone_internet',
    'a_melding',
    'shareholder_loan',
    'documents',
    'representation',
    'strategy_gathering',
  ],
  HOLDING_AS: [
    'subsidiaries',
    'dividends',
    'investments',
    'intra_group',
    'board_meetings',
    'documents',
    'representation',
  ],
  ENK: [
    'business_deductions',
    'owner_withdrawals',
    'spouse_income',
    'vat',
    'gifts',
    'phone_internet',
    'documents',
    'representation',
    'strategy_gathering',
  ],
  ANS_DA: [
    'board_meetings',
    'gifts',
    'phone_internet',
    'documents',
    'representation',
    'strategy_gathering',
  ],
  PRIVATE: ['gifts', 'documents'],
  OTHER: ['documents'],
}
