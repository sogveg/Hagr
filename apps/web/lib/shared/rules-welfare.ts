// Norwegian welfare measure rules 2026
// Velferdstiltak for ansatte: julebord, sommerfest, teambuilding osv.

// Ingen lovfestet øvre grense, men Skatteetaten bruker rimelighetsvurdering
// Generell akseptert ramme: ca. 5 000 kr per ansatt per år totalt
export const WELFARE_RECOMMENDED_LIMIT_PER_EMPLOYEE = 5000 // kr/år, veiledende

// 560 kr/person er representasjonsgrensen for mat+drikke.
// Over dette kan mat+drikke-delen omklassifiseres til representasjon.
// Representasjon med brennevin/sprit er ALDRI fradragsberettiget.
export const REPRESENTATION_FOOD_LIMIT_PER_PERSON = 560 // kr/person, eks. mva

export type WelfareType =
  | 'christmas_party'      // Julebord
  | 'summer_party'         // Sommerfest
  | 'team_building'        // Teambuilding/kurs
  | 'sports_culture'       // Idrett/kultur (abonnement)
  | 'health'               // Helse/trening
  | 'other'

export type AlcoholType = 'none' | 'beer_wine' | 'spirits'

export const WELFARE_TYPE_LABELS: Record<WelfareType, string> = {
  christmas_party: 'Julebord',
  summer_party: 'Sommerfest/selskapsfest',
  team_building: 'Teambuilding / faglig kurs',
  sports_culture: 'Idrett og kulturaktiviteter',
  health: 'Helse og trening',
  other: 'Annet velferdstiltak',
}

export const ALCOHOL_LABELS: Record<AlcoholType, string> = {
  none: 'Ingen alkohol',
  beer_wine: 'Øl/vin',
  spirits: 'Brennevin/sprit',
}

export interface WelfareInput {
  welfare_type: WelfareType
  total_cost_nok: number
  employee_count: number
  spouses_included: boolean
  is_for_all_employees: boolean
  has_substantial_private_element: boolean
  food_cost_per_person?: number     // kun mat + drikke (eks. lokale, underholdning)
  alcohol_served?: AlcoholType
}

export interface WelfareResult {
  cost_per_employee_nok: number
  food_cost_per_person: number
  is_tax_free_for_employees: boolean
  is_deductible_for_company: boolean
  flags: string[]
  risk_level: 'green' | 'yellow' | 'red'
  // Detailed breakdown
  spirits_kills_deduction: boolean
  food_exceeds_rep_limit: boolean
  above_annual_guideline: boolean
}

export function evaluateWelfare(input: WelfareInput): WelfareResult {
  const flags: string[] = []
  const perEmployee = input.employee_count > 0
    ? input.total_cost_nok / input.employee_count
    : input.total_cost_nok

  const foodPerPerson = input.food_cost_per_person ?? 0
  const alcohol = input.alcohol_served ?? 'none'

  // ─── Grunnvilkår: gjelder alle ──────────────────────────────────────────────
  if (!input.is_for_all_employees) {
    flags.push('❌ Velferdstiltak MÅ gjelde alle ansatte (eller hele avdelinger) — særbehandling = skattepliktig lønn')
    return {
      cost_per_employee_nok: Math.round(perEmployee),
      food_cost_per_person: Math.round(foodPerPerson),
      is_tax_free_for_employees: false,
      is_deductible_for_company: false,
      flags, risk_level: 'red',
      spirits_kills_deduction: false, food_exceeds_rep_limit: false, above_annual_guideline: false,
    }
  }

  if (input.employee_count <= 1 && !input.spouses_included) {
    flags.push('❌ Eier alene uten ansatte: julebord og festligheter for deg selv er uttak — beskattes som utbytte + AGA')
    return {
      cost_per_employee_nok: Math.round(perEmployee),
      food_cost_per_person: Math.round(foodPerPerson),
      is_tax_free_for_employees: false,
      is_deductible_for_company: false,
      flags, risk_level: 'red',
      spirits_kills_deduction: false, food_exceeds_rep_limit: false, above_annual_guideline: false,
    }
  }

  let riskLevel: 'green' | 'yellow' | 'red' = 'green'
  let isTaxFree = true
  let isDeductible = true

  // ─── Brennevin / sprit ──────────────────────────────────────────────────────
  // Representasjon med sprit er aldri fradragsberettiget (sktl § 6-21).
  // Dersom mat+drikke overskrider 560 kr/person klassifiseres det som representasjon
  // og sprit gjør da hele mat+drikke-delen ikke-fradragsberettiget.
  // Som velferd er det en gråsone — tryggeste råd: unngå sprit.
  const spiritsKillsDeduction = alcohol === 'spirits'
  if (spiritsKillsDeduction) {
    flags.push('🚨 Brennevin/sprit: Representasjon med sprit er ikke fradragsberettiget (skatteloven § 6-21). Dersom arrangementet omklassifiseres som representasjon, mister du hele fradraget. Bytt til øl/vin for trygg fradragsrett.')
    isDeductible = false
    riskLevel = 'red'
  }

  // ─── Mat + drikke over 560 kr/person ───────────────────────────────────────
  const foodExceedsRepLimit = foodPerPerson > 0 && foodPerPerson > REPRESENTATION_FOOD_LIMIT_PER_PERSON
  if (foodExceedsRepLimit) {
    if (alcohol === 'spirits') {
      flags.push(`🚨 Mat+drikke ${Math.round(foodPerPerson)} kr/person overskrider representasjonsgrensen på 560 kr/person, OG det serveres sprit — fradraget faller helt bort.`)
    } else {
      flags.push(`⚠️ Mat+drikke (${Math.round(foodPerPerson)} kr/person) overskrider representasjonsgrensen på 560 kr/person. Mat+drikke-delen kan omklassifiseres til representasjon. Sørg for at det ikke serveres sprit.`)
      if (riskLevel === 'green') riskLevel = 'yellow'
    }
  } else if (foodPerPerson > 0 && foodPerPerson <= REPRESENTATION_FOOD_LIMIT_PER_PERSON) {
    flags.push(`✅ Mat+drikke (${Math.round(foodPerPerson)} kr/person) er under 560 kr-grensen — arrangementet behandles trygt som velferdstiltak.`)
  }

  // ─── Totalkostnad per ansatt over veiledende grense ────────────────────────
  const aboveGuideline = perEmployee > WELFARE_RECOMMENDED_LIMIT_PER_EMPLOYEE
  if (aboveGuideline) {
    flags.push(`⚠️ ${Math.round(perEmployee).toLocaleString('nb-NO')} kr/ansatt overskrider Skatteetatens veiledende grense på ${WELFARE_RECOMMENDED_LIMIT_PER_EMPLOYEE.toLocaleString('nb-NO')} kr/år. Over grensen kan fordelen bli skattepliktig lønn. Kontroller totalsum for alle velferdstiltak i år.`)
    if (riskLevel === 'green') riskLevel = 'yellow'
  }

  if (perEmployee > 10000) {
    flags.push(`🚨 Svært høy kostnad (${Math.round(perEmployee).toLocaleString('nb-NO')} kr/ansatt) — anbefales avklart med regnskapsfører`)
    riskLevel = 'red'
    isTaxFree = false
  }

  // ─── Ektefeller ─────────────────────────────────────────────────────────────
  if (input.spouses_included) {
    flags.push('ℹ️ Ektefeller/samboere er akseptert og skattefritt — men kostnaden inngår i totalen per ansatt.')
  }

  // ─── Vesentlig privat element ───────────────────────────────────────────────
  if (input.has_substantial_private_element) {
    flags.push('⚠️ Vesentlig privat element (utlandsreise, konsert, eksklusiv opplevelse) — høy risiko for omklassifisering. Dokumentér den sosiale/faglige begrunnelsen nøye.')
    if (riskLevel === 'green') riskLevel = 'yellow'
  }

  // ─── Alt OK ─────────────────────────────────────────────────────────────────
  if (flags.length === 0 || flags.every(f => f.startsWith('✅'))) {
    flags.push(`✅ Alt ser OK ut! Husk å lagre deltakerliste, kvitteringer og formålet med arrangementet.`)
  }

  return {
    cost_per_employee_nok: Math.round(perEmployee),
    food_cost_per_person: Math.round(foodPerPerson),
    is_tax_free_for_employees: isTaxFree,
    is_deductible_for_company: isDeductible,
    flags,
    risk_level: riskLevel,
    spirits_kills_deduction: spiritsKillsDeduction,
    food_exceeds_rep_limit: foodExceedsRepLimit,
    above_annual_guideline: aboveGuideline,
  }
}
