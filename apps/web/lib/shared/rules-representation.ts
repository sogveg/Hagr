// Norwegian representation rules 2025
// Ekstern representasjon: maks 560 kr per person eks. mva (lunsj/middag)
// Intern (ansatte kun): ikke fradragsberettiget representasjon — bruk velferdstiltak-regler
// Alkohol: aldri MVA-fradrag, ikke inkludert i representasjonsgrensen

export const REPRESENTATION_LIMIT_PER_PERSON_NOK = 560 // 2025, eks. mva
export const REPRESENTATION_LUNCH_FULLY_DEDUCTIBLE = true // lunsj i arbeidstid = fullt fradrag

export type RepresentationType = 'dinner' | 'lunch' | 'coffee' | 'other'

export interface RepresentationInput {
  amount_nok: number
  person_count: number
  rep_type: RepresentationType
  includes_alcohol: boolean
  has_external_participant: boolean // kunde, leverandør, samarbeidspartner
  during_work_hours: boolean
  purpose: string
}

export interface RepresentationResult {
  deductible_amount: number
  non_deductible_amount: number
  vat_deductible: boolean
  flags: string[]
  per_person_nok: number
}

export function evaluateRepresentation(input: RepresentationInput): RepresentationResult {
  const flags: string[] = []
  const per_person = input.person_count > 0 ? input.amount_nok / input.person_count : input.amount_nok

  if (!input.has_external_participant) {
    flags.push('Kun interne ansatte — dette er ikke ekstern representasjon, men internt arrangement/velferdstiltak')
    return {
      deductible_amount: 0,
      non_deductible_amount: input.amount_nok,
      vat_deductible: false,
      flags,
      per_person_nok: per_person,
    }
  }

  // Lunsj i arbeidstid = fullt fradragsberettiget
  if (input.rep_type === 'lunch' && input.during_work_hours) {
    if (input.includes_alcohol) {
      flags.push('Alkohol er ikke fradragsberettiget — trekk fra alkoholdelen av beløpet')
    }
    return {
      deductible_amount: input.amount_nok,
      non_deductible_amount: 0,
      vat_deductible: false, // representasjon = ingen MVA-fradrag
      flags,
      per_person_nok: per_person,
    }
  }

  // Middag/annen representasjon: grense 560 kr/person
  const limit = REPRESENTATION_LIMIT_PER_PERSON_NOK * input.person_count
  const deductible = Math.min(input.amount_nok, limit)
  const non_deductible = input.amount_nok - deductible

  if (per_person > REPRESENTATION_LIMIT_PER_PERSON_NOK) {
    flags.push(
      `${Math.round(per_person)} kr per person — maks ${REPRESENTATION_LIMIT_PER_PERSON_NOK} kr/person er fradragsberettiget`
    )
  }
  if (input.includes_alcohol) {
    flags.push('Alkohol er ikke fradragsberettiget og gir heller ikke MVA-fradrag')
  }
  if (!input.purpose) {
    flags.push('Husk å dokumentere forretningsmessig formål med møtet')
  }

  return {
    deductible_amount: deductible,
    non_deductible_amount: non_deductible,
    vat_deductible: false,
    flags,
    per_person_nok: per_person,
  }
}
