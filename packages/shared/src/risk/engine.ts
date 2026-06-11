import type { CompanyType } from '../types/company'
import type { EventType } from '../types/events'

export type RiskLevel = 'green' | 'yellow' | 'red'

export interface RiskInput {
  company_type: CompanyType
  employee_count: number
  owner_managed: boolean
  spouse_involved: boolean
  event_type: EventType
  travel_included: boolean
  overnight_stay: boolean
  private_elements: boolean
  missing_documentation: boolean
  cash_or_cash_equivalent: boolean
  no_real_role: boolean
  high_cost: boolean
  family_only: boolean
}

export interface RiskResult {
  level: RiskLevel
  score: number // 0-100, higher = more risk
  reasons: string[]
  required_documentation: string[]
  risk_reducing_actions: string[]
}

export function assessRisk(input: RiskInput): RiskResult {
  let score = 0
  const reasons: string[] = []
  const required_documentation: string[] = []
  const risk_reducing_actions: string[] = []

  // Employee count modifiers
  if (input.employee_count === 0) {
    score += 20
    reasons.push('0 ansatte øker risiko for velferdsgoder uten tilstrekkelig grunnlag')
    required_documentation.push('Dokumenter forretningsmessig formål grundig')
  } else if (input.employee_count === 1 && input.owner_managed) {
    score += 10
    reasons.push('Eneaksjonær/eierledet selskap krever god dokumentasjon')
    required_documentation.push('Styreprotokoll og beslutningsgrunnlag')
  }

  // Spouse involvement
  if (input.spouse_involved) {
    score += 15
    reasons.push('Ektefelle/samboer involvert — særskilt dokumentasjonskrav')
    required_documentation.push('Rolleavklaring og reell arbeidsdeltagelse for ektefelle')
    risk_reducing_actions.push('Dokumenter ektefellens reelle rolle og arbeidsoppgaver')
  }

  // Private elements
  if (input.private_elements) {
    score += 25
    reasons.push('Private innslag i arrangementet øker risiko for uttaksbeskatning')
    required_documentation.push('Klart skille mellom faglig og privat program')
    risk_reducing_actions.push('Fjern eller separer private aktiviteter og kostnader')
  }

  // Family only
  if (input.family_only) {
    score += 30
    reasons.push('Kun familiemedlemmer — svekker forretningsmessig formål')
    risk_reducing_actions.push('Inkluder ansatte eller forretningsforbindelser utover familie')
  }

  // Missing documentation
  if (input.missing_documentation) {
    score += 20
    reasons.push('Manglende dokumentasjon er den vanligste årsaken til etterberegning')
    required_documentation.push('Komplett dokumentasjon er påkrevd')
    risk_reducing_actions.push('Fullfør all dokumentasjon før innsending')
  }

  // Cash/cash equivalent
  if (input.cash_or_cash_equivalent) {
    score += 30
    reasons.push('Kontanter eller kontantekvivalenter er aldri skattefrie')
    required_documentation.push('Bytt til naturalytelse for skattefrihet')
  }

  // No real role
  if (input.no_real_role) {
    score += 25
    reasons.push('Deltaker uten reell rolle svekker fradragsrett')
    required_documentation.push('Rolleavklaring for alle deltakere')
    risk_reducing_actions.push('Dokumenter alle deltakeres reelle funksjon')
  }

  // High cost
  if (input.high_cost) {
    score += 15
    reasons.push('Høye kostnader øker sannsynlighet for kontroll')
    required_documentation.push('Kostnadsoversikt med kvitteringer')
    risk_reducing_actions.push('Vurder rimeligheten i kostnadsbildet')
  }

  // Travel and overnight stay
  if (input.travel_included && input.overnight_stay) {
    score += 10
    reasons.push('Reise med overnatting krever spesielt god dokumentasjon')
    required_documentation.push('Reiseplan og hotellbilag')
  }

  // Event-type specific
  if (input.event_type === 'strategy_gathering' && input.overnight_stay) {
    required_documentation.push('Faglig program minimum 6 timer per dag')
    risk_reducing_actions.push('Sørg for at faglig program utgjør hoveddelen av samlingen')
  }

  if (input.event_type === 'representation' && input.private_elements) {
    score += 15
    reasons.push('Representasjon med privat preg gir begrenset/ingen fradragsrett')
  }

  // Clamp score
  score = Math.min(100, score)

  const level: RiskLevel = score >= 60 ? 'red' : score >= 30 ? 'yellow' : 'green'

  return { level, score, reasons, required_documentation, risk_reducing_actions }
}
