// Norwegian car rules 2025
// Firmabil (company car): taxable private benefit based on list price
// Kjøregodtgjørelse (mileage): reimbursement for private car used for business

// ─── Firmabil ─────────────────────────────────────────────────────────────────
// Fordelsbeskatning: standard rate on list price
export const CAR_BENEFIT_RATE_NEW = 0.30          // Under 3 år gammel: 30% av listepris
export const CAR_BENEFIT_RATE_OLD = 0.20          // Over 3 år gammel: 20% av redusert listepris
export const CAR_LIST_PRICE_REDUCTION_OLD = 0.75  // Listepris reduseres til 75% etter 3 år
export const CAR_BENEFIT_ELECTRIC_DISCOUNT = 0.50 // El-bil: 50% reduksjon i fordelsgrunnlaget (2025)
export const CAR_BENEFIT_HIGH_USAGE_THRESHOLD_KM = 40000 // Yrkeskjøring: over 40 000 km/år gir reduksjon
export const CAR_BENEFIT_HIGH_USAGE_REDUCTION = 0.25 // Reduksjon: 25% av beregnet fordel

// ─── Kjøregodtgjørelse ────────────────────────────────────────────────────────
export const MILEAGE_RATE_2025 = 4.50         // kr/km (statens sats 2025, alle km)
export const MILEAGE_RATE_ABOVE_10000 = 4.25  // kr/km over 10 000 km

export interface CarBenefitInput {
  list_price_nok: number
  car_age_years: number
  is_electric: boolean
  annual_business_km: number
  months_available: number // where 12 = full year
}

export interface CarBenefitResult {
  annual_benefit_nok: number
  monthly_benefit_nok: number
  flags: string[]
}

export function evaluateCarBenefit(input: CarBenefitInput): CarBenefitResult {
  const flags: string[] = []
  let basis = input.list_price_nok

  // Reduser listepris for eldre biler
  if (input.car_age_years >= 3) {
    basis = basis * CAR_LIST_PRICE_REDUCTION_OLD
    flags.push(`Bilen er over 3 år — grunnlag redusert til ${(CAR_LIST_PRICE_REDUCTION_OLD * 100).toFixed(0)}% av listepris`)
  }

  // Beregn standardfordel
  const rate = input.car_age_years >= 3 ? CAR_BENEFIT_RATE_OLD : CAR_BENEFIT_RATE_NEW
  let annualBenefit = basis * rate

  // El-bil-rabatt
  if (input.is_electric) {
    annualBenefit = annualBenefit * (1 - CAR_BENEFIT_ELECTRIC_DISCOUNT)
    flags.push('El-bil: 50% reduksjon i fordelsgrunnlag (2025)')
  }

  // Høy yrkeskjøring
  if (input.annual_business_km >= CAR_BENEFIT_HIGH_USAGE_THRESHOLD_KM) {
    annualBenefit = annualBenefit * (1 - CAR_BENEFIT_HIGH_USAGE_REDUCTION)
    flags.push(`Over ${CAR_BENEFIT_HIGH_USAGE_THRESHOLD_KM.toLocaleString('nb-NO')} km yrkeskjøring — 25% reduksjon i fordelen`)
  }

  // Juster for måneder
  annualBenefit = annualBenefit * (input.months_available / 12)

  if (input.list_price_nok > 700000) {
    flags.push('Høy listepris — vurder om bilen kan begrunnes forretningsmessig')
  }

  return {
    annual_benefit_nok: Math.round(annualBenefit),
    monthly_benefit_nok: Math.round(annualBenefit / input.months_available),
    flags,
  }
}

// ─── Kjørebok/Kjøregodtgjørelse ──────────────────────────────────────────────
export interface MileageInput {
  km: number
  purpose: string
  is_between_home_and_work: boolean // pendling = ikke fradragsberettiget
}

export interface MileageResult {
  reimbursement_nok: number
  tax_free_nok: number
  flags: string[]
}

export function evaluateMileage(input: MileageInput): MileageResult {
  const flags: string[] = []

  if (input.is_between_home_and_work) {
    flags.push('Kjøring mellom hjem og fast arbeidssted = pendling, ikke fradragsberettiget kjøregodtgjørelse')
    return { reimbursement_nok: 0, tax_free_nok: 0, flags }
  }

  // All mileage at 4.50 kr/km is tax-free when reimbursed at state rate
  const reimbursement = Math.round(input.km * MILEAGE_RATE_2025)

  if (!input.purpose) {
    flags.push('Husk å dokumentere formålet med kjøringen — kunden/sted og forretningsformål')
  }

  return {
    reimbursement_nok: reimbursement,
    tax_free_nok: reimbursement,
    flags,
  }
}
