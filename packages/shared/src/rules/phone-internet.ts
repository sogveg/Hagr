// Norwegian standard: EK-fordel capped at 4392 NOK/year regardless of number of services
export const PHONE_INTERNET_MAX_TAXABLE_NOK = 4392

export interface PhoneInternetRuleInput {
  services: Array<{
    type: 'mobile' | 'broadband' | 'tv' | 'other'
    description: string
    monthly_cost_nok: number
    is_private_use: boolean
    has_business_need: boolean
  }>
  has_cabin_internet: boolean
  has_entertainment_package: boolean
  has_family_subscription: boolean
}

export interface PhoneInternetRuleResult {
  total_employer_cost_nok: number
  taxable_amount_nok: number
  flags: string[]
}

export function evaluatePhoneInternet(input: PhoneInternetRuleInput): PhoneInternetRuleResult {
  const flags: string[] = []

  if (input.has_cabin_internet) {
    flags.push('Hytteinternett er normalt ikke fradragsberettiget som EK-fordel')
  }
  if (input.has_entertainment_package) {
    flags.push('Underholdningspakker i abonnementet kan øke skattepliktig fordel')
  }
  if (input.has_family_subscription) {
    flags.push('Familieabonnement — dokumenter at kostnaden er begrenset til ansattes andel')
  }

  for (const svc of input.services) {
    if (!svc.has_business_need) {
      flags.push(`Tjenesten "${svc.description}" mangler dokumentert jobbrelatert behov`)
    }
  }

  const total_employer_cost_nok =
    input.services.reduce((sum, s) => sum + s.monthly_cost_nok, 0) * 12

  // EK-fordel is taxable up to the cap regardless of actual cost
  const taxable_amount_nok = Math.min(total_employer_cost_nok, PHONE_INTERNET_MAX_TAXABLE_NOK)

  return { total_employer_cost_nok, taxable_amount_nok, flags }
}
