// Norwegian welfare measure rules 2026
// Velferdstiltak for ansatte: julebord, sommerfest, teambuilding osv.

// Ingen lovfestet øvre grense, men Skatteetaten bruker rimelighetsvurdering
// Generell akseptert ramme: ca. 5 000 kr per ansatt per år totalt
export const WELFARE_RECOMMENDED_LIMIT_PER_EMPLOYEE = 5000 // kr/år, veiledende

export type WelfareType =
  | 'christmas_party'      // Julebord
  | 'summer_party'         // Sommerfest
  | 'team_building'        // Teambuilding/kurs
  | 'sports_culture'       // Idrett/kultur (abonnement)
  | 'health'               // Helse/trening
  | 'other'

export const WELFARE_TYPE_LABELS: Record<WelfareType, string> = {
  christmas_party: 'Julebord',
  summer_party: 'Sommerfest/selskapsfest',
  team_building: 'Teambuilding / faglig kurs',
  sports_culture: 'Idrett og kulturaktiviteter',
  health: 'Helse og trening',
  other: 'Annet velferdstiltak',
}

export interface WelfareInput {
  welfare_type: WelfareType
  total_cost_nok: number
  employee_count: number
  spouses_included: boolean
  is_for_all_employees: boolean // MÅ gjelde alle (eller alle i en avdeling)
  has_substantial_private_element: boolean
  per_person_cost?: number
}

export interface WelfareResult {
  cost_per_employee_nok: number
  is_tax_free_for_employees: boolean
  is_deductible_for_company: boolean
  flags: string[]
  risk_level: 'green' | 'yellow' | 'red'
}

export function evaluateWelfare(input: WelfareInput): WelfareResult {
  const flags: string[] = []
  const perEmployee = input.employee_count > 0
    ? input.total_cost_nok / input.employee_count
    : input.total_cost_nok

  if (!input.is_for_all_employees) {
    flags.push('Velferdstiltak MÅ gjelde alle ansatte (eller hele avdelinger) — særbehandling av enkeltpersoner = skattepliktig lønn')
    return {
      cost_per_employee_nok: Math.round(perEmployee),
      is_tax_free_for_employees: false,
      is_deductible_for_company: false,
      flags,
      risk_level: 'red',
    }
  }

  if (input.employee_count === 0 || (input.employee_count === 1 && !input.spouses_included)) {
    flags.push('Eier alene uten ansatte — velferdstiltak krever et faktisk ansattforhold. Høy risiko for omklassifisering.')
    return {
      cost_per_employee_nok: Math.round(perEmployee),
      is_tax_free_for_employees: false,
      is_deductible_for_company: false,
      flags,
      risk_level: 'red',
    }
  }

  let riskLevel: 'green' | 'yellow' | 'red' = 'green'

  if (perEmployee > WELFARE_RECOMMENDED_LIMIT_PER_EMPLOYEE) {
    flags.push(`${Math.round(perEmployee).toLocaleString('nb-NO')} kr per ansatt — over anbefalt grense på ${WELFARE_RECOMMENDED_LIMIT_PER_EMPLOYEE.toLocaleString('nb-NO')} kr. Rimelighetsvurdering kreves.`)
    riskLevel = 'yellow'
  }

  if (input.has_substantial_private_element) {
    flags.push('Vesentlig privat element — Skatteetaten kan avvise fradraget. Dokumentér den faglige/sosiale begrunnelsen.')
    riskLevel = 'yellow'
  }

  if (input.spouses_included) {
    flags.push('Ektefeller/samboere er inkludert — dette er akseptert, men kostnaden pr. ansatt stiger tilsvarende')
  }

  const isHighRisk = perEmployee > 10000
  if (isHighRisk) {
    flags.push(`Svært høy kostnad per ansatt (${Math.round(perEmployee).toLocaleString('nb-NO')} kr) — sterkt anbefalt å avklare med regnskapsfører`)
    riskLevel = 'red'
  }

  return {
    cost_per_employee_nok: Math.round(perEmployee),
    is_tax_free_for_employees: !isHighRisk,
    is_deductible_for_company: true,
    flags,
    risk_level: riskLevel,
  }
}
