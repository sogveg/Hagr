// Norwegian cabin/boat rules 2026
// Fri bruk av arbeidsgivers hytte/båt = skattepliktig naturalytelse

// Skattedirektoratets standardsatser for fri fritidsbolig/båt (2026)
export const CABIN_BENEFIT_RATE_PEAK_PER_DAY = 1135    // kr/dag (høysesong: 15. juni – 31. aug + romjul)
export const CABIN_BENEFIT_RATE_OFF_PEAK_PER_DAY = 530 // kr/dag (lavsesong: resten av året)
export const BOAT_BENEFIT_RATE_PEAK_PER_DAY = 1135     // kr/dag (båtsesong: mai–sept)
export const BOAT_BENEFIT_RATE_OFF_PEAK_PER_DAY = 530  // kr/dag

export type AssetType = 'cabin' | 'boat' | 'other_leisure'

export interface CabinBoatInput {
  asset_type: AssetType
  days_used: number
  is_peak_season: boolean
  has_business_element: boolean // faglig innhold = kan redusere skattepliktig del
  employee_paid_nok: number     // eventuelt betalt leie
}

export interface CabinBoatResult {
  gross_benefit_nok: number
  net_taxable_nok: number
  flags: string[]
}

export function evaluateCabinBoat(input: CabinBoatInput): CabinBoatResult {
  const flags: string[] = []

  const ratePerDay = input.is_peak_season
    ? (input.asset_type === 'cabin' ? CABIN_BENEFIT_RATE_PEAK_PER_DAY : BOAT_BENEFIT_RATE_PEAK_PER_DAY)
    : (input.asset_type === 'cabin' ? CABIN_BENEFIT_RATE_OFF_PEAK_PER_DAY : BOAT_BENEFIT_RATE_OFF_PEAK_PER_DAY)

  const grossBenefit = input.days_used * ratePerDay
  let taxableBenefit = Math.max(0, grossBenefit - input.employee_paid_nok)

  if (input.has_business_element) {
    flags.push('Faglig element (kurs, møte) — del av oppholdet kan behandles som yrkesmessig kostnad, ikke privat fordel. Dokumentér program.')
  }

  if (input.employee_paid_nok >= grossBenefit) {
    flags.push('Ansatt har betalt markedspris — ingen skattepliktig fordel')
    taxableBenefit = 0
  }

  if (input.days_used > 7 && !input.has_business_element) {
    flags.push('Over 7 dager uten faglig innhold — vurder om bruken er forretningsmessig begrunnet')
  }

  flags.push('Husk å innberette fordelen i a-meldingen (kode 122-A)')

  return {
    gross_benefit_nok: Math.round(grossBenefit),
    net_taxable_nok: Math.round(taxableBenefit),
    flags,
  }
}
