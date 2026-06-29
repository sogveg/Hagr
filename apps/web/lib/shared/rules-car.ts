// Norwegian car rules 2026
// Kilde: Skatteetaten.no

// ─── Firmabil ─────────────────────────────────────────────────────────────────
// Progressiv sats (2026):
//   30% av listepris opp til 370 300 kr
//   20% av listepris over 370 300 kr
// Elbil og fossilbil behandles LIKT — ingen elbilrabatt (avviklet)
// Listepris som ny brukes alltid som grunnlag
export const FIRMABIL_RATE_LOW = 0.30             // 30% opp til terskelverdi
export const FIRMABIL_RATE_HIGH = 0.20            // 20% over terskelverdi
export const FIRMABIL_THRESHOLD_NOK = 370_300     // Terskel for progressiv sats
export const FIRMABIL_HIGH_USAGE_KM = 40_000      // Yrkeskjøring over dette gir 25% reduksjon
export const FIRMABIL_HIGH_USAGE_FACTOR = 0.75    // Fordelen settes til 75%
export const FIRMABIL_VAREBIL_DEDUCTION = 0.50    // Varebil kl. 2: 50% av listepris i bunnfradrag
export const FIRMABIL_VAREBIL_MAX_DEDUCTION = 150_000 // Maks bunnfradrag varebil kl. 2

// ─── Kjøregodtgjørelse ────────────────────────────────────────────────────────
// Statens sats 2026: 4,50 kr/km (skattefritt for alle km ved refusjon til ansatt)
// NB: Redusert sats over 10 000 km/år er usikker for 2026 — bruk 4,50 for alle km
export const MILEAGE_RATE_2025 = 4.50   // eksportert navn beholdes for bakoverkompatibilitet
export const MILEAGE_RATE_ALL = 4.50    // kr/km, alle km (2026)

export interface CarBenefitInput {
  list_price_nok: number
  is_varebil_class2?: boolean
  annual_business_km: number
  months_available: number
}

export interface CarBenefitResult {
  annual_benefit_nok: number
  monthly_benefit_nok: number
  flags: string[]
}

export function evaluateCarBenefit(input: CarBenefitInput): CarBenefitResult {
  const flags: string[] = []
  const lp = input.list_price_nok

  // Varebil kl. 2: bunnfradrag
  let basis = lp
  if (input.is_varebil_class2) {
    const reduction = Math.min(lp * FIRMABIL_VAREBIL_DEDUCTION, FIRMABIL_VAREBIL_MAX_DEDUCTION)
    basis = lp - reduction
    flags.push(`Varebil kl. 2: bunnfradrag ${reduction.toLocaleString('nb-NO')} kr`)
  }

  // Progressiv beregning
  let annualBenefit = 0
  if (basis <= FIRMABIL_THRESHOLD_NOK) {
    annualBenefit = basis * FIRMABIL_RATE_LOW
  } else {
    annualBenefit = FIRMABIL_THRESHOLD_NOK * FIRMABIL_RATE_LOW + (basis - FIRMABIL_THRESHOLD_NOK) * FIRMABIL_RATE_HIGH
  }

  // Over 40 000 km yrke
  if (input.annual_business_km >= FIRMABIL_HIGH_USAGE_KM) {
    annualBenefit = annualBenefit * FIRMABIL_HIGH_USAGE_FACTOR
    flags.push(`Over ${FIRMABIL_HIGH_USAGE_KM.toLocaleString('nb-NO')} km yrkeskjøring — fordelen satt til 75%`)
  }

  // Månedsjustering
  annualBenefit = annualBenefit * (input.months_available / 12)

  if (lp > 700_000) {
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
  is_between_home_and_work: boolean
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

  const reimbursement = Math.round(input.km * MILEAGE_RATE_ALL)

  if (!input.purpose) {
    flags.push('Husk å dokumentere formålet med kjøringen — kunde/sted og forretningsformål')
  }

  return {
    reimbursement_nok: reimbursement,
    tax_free_nok: reimbursement,
    flags,
  }
}
