export type PlanId = 'start' | 'pro' | 'premium'

export interface Plan {
  id: PlanId
  name: string
  price_nok_monthly: number
  included_companies: number
  can_add_extra_companies: boolean
  extra_company_price_nok: number | null
}

export const PLANS: Record<PlanId, Plan> = {
  start: {
    id: 'start',
    name: 'Start',
    price_nok_monthly: 79,
    included_companies: 1,
    can_add_extra_companies: false,
    extra_company_price_nok: null,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price_nok_monthly: 139,
    included_companies: 4,
    can_add_extra_companies: false,
    extra_company_price_nok: null,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price_nok_monthly: 199,
    included_companies: 10,
    can_add_extra_companies: true,
    extra_company_price_nok: 10,
  },
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: PlanId
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'
  current_period_end: string
  extra_companies: number
  created_at: string
  updated_at: string
}

export function getMaxCompanies(sub: Subscription): number {
  const plan = PLANS[sub.plan_id]
  if (!plan.can_add_extra_companies) return plan.included_companies
  return plan.included_companies + sub.extra_companies
}

export function canAddCompany(sub: Subscription, currentCount: number): boolean {
  return currentCount < getMaxCompanies(sub)
}
