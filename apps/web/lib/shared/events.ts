export type EventType =
  | 'board_meeting'
  | 'strategy_gathering'
  | 'gift'
  | 'personal_discount'
  | 'phone_internet'
  | 'representation'
  | 'company_card'

export interface BoardMeeting {
  id: string
  company_id: string
  meeting_number: number
  date: string
  start_time: string
  end_time: string
  location: string
  meeting_format: 'physical' | 'digital' | 'hybrid'
  called_by: string
  chairperson: string
  minute_taker: string
  participants: MeetingParticipant[]
  agenda_items: AgendaItem[]
  decisions: Decision[]
  costs: CostEntry[]
  attachments: string[]
  risk_flags: string[]
  status: 'draft' | 'finalized'
  created_at: string
  updated_at: string
}

export interface MeetingParticipant {
  person_id: string
  name: string
  role: string
  attended: boolean
  signature: string | null
}

export interface AgendaItem {
  id: string
  order: number
  title: string
  description: string | null
  presenter: string | null
  duration_minutes: number | null
}

export interface Decision {
  id: string
  agenda_item_id: string
  text: string
  vote_for: number
  vote_against: number
  vote_abstain: number
  carried: boolean
}

export interface CostEntry {
  id: string
  description: string
  amount_nok: number
  category: string
  receipt_url: string | null
}

export interface StrategyGathering {
  id: string
  company_id: string
  title: string
  purpose: string
  business_relevance: string
  date_from: string
  date_to: string
  location: string
  location_rationale: string
  participants: GatheringParticipant[]
  program_blocks: ProgramBlock[]
  social_program: string | null
  private_activities: string | null
  companions: string | null
  travel_included: boolean
  overnight_stay: boolean
  costs: CostEntry[]
  create_board_meeting_docs: boolean
  status: 'draft' | 'finalized'
  created_at: string
  updated_at: string
}

export interface GatheringParticipant {
  person_id: string
  name: string
  role_explanation: string
}

export interface ProgramBlock {
  id: string
  day: number
  start_time: string
  end_time: string
  title: string
  type: 'professional' | 'social' | 'break'
  description: string | null
}

export interface Gift {
  id: string
  company_id: string
  recipient_person_id: string
  recipient_name: string
  year: number
  description: string
  amount_nok: number
  is_cash_equivalent: boolean
  is_performance_related: boolean
  date: string
  tax_free_amount: number
  taxable_amount: number
  notes: string | null
  created_at: string
}

export interface PersonalDiscount {
  id: string
  company_id: string
  employee_person_id: string
  employee_name: string
  year: number
  product_service: string
  market_price_nok: number
  paid_price_nok: number
  discount_value_nok: number
  tax_free_amount: number
  taxable_amount: number
  date: string
  notes: string | null
  created_at: string
}

export interface PhoneInternetBenefit {
  id: string
  company_id: string
  employee_person_id: string
  employee_name: string
  year: number
  services: PhoneService[]
  total_employer_cost_nok: number
  taxable_amount_nok: number
  notes: string | null
  created_at: string
}

export interface PhoneService {
  type: 'mobile' | 'broadband' | 'tv' | 'other'
  description: string
  monthly_cost_nok: number
  is_private_use: boolean
  has_business_need: boolean
  flag_reason: string | null
}

export interface RepresentationEvent {
  id: string
  company_id: string
  date: string
  purpose: string
  participants: RepParticipant[]
  customer_supplier_relation: boolean
  location: string
  total_amount_nok: number
  amount_per_person_nok: number
  includes_alcohol: boolean
  notes: string | null
  risk_flags: string[]
  created_at: string
}

export interface RepParticipant {
  name: string
  company: string | null
  role: string
}
