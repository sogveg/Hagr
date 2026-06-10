// Norwegian salary vs dividend calculator — uses DynamicTaxRates
// All hardcoded fallbacks live in DEFAULT_TAX_RATES (tax-rates.ts)

import { DEFAULT_TAX_RATES, type DynamicTaxRates } from './tax-rates'

// Re-export for convenience
export { DEFAULT_TAX_RATES }
export type { DynamicTaxRates }

// AGA zone map (for UI selects)
export const AGA_ZONE_KEYS = ['zone1', 'zone2', 'zone3', 'zone4', 'zone5'] as const
export type AGAZone = typeof AGA_ZONE_KEYS[number]

export function getAGARate(zone: AGAZone, rates: DynamicTaxRates): number {
  return rates[`aga_${zone}` as keyof DynamicTaxRates] as number
}

// ─── Pensjonsberegning ────────────────────────────────────────────────────────
export interface PensionImpact {
  annual_accrual_nok: number
  sick_pay_coverage_nok: number
  parental_pay_coverage_nok: number
  pension_coverage_pct: number
  has_sick_pay: boolean
  at_max_pension: boolean
  notes: string[]
}

export function calcPensionImpact(salary: number, rates: DynamicTaxRates = DEFAULT_TAX_RATES): PensionImpact {
  const notes: string[] = []
  const PENSION_ACCRUAL_RATE = 0.181

  const cappedForPension = Math.min(salary, rates.pension_max_nok)
  const annualAccrual = Math.round(cappedForPension * PENSION_ACCRUAL_RATE)
  const maxAccrual = Math.round(rates.pension_max_nok * PENSION_ACCRUAL_RATE)
  const pensionPct = maxAccrual > 0 ? annualAccrual / maxAccrual : 0

  const hasSickPay = salary >= rates.min_benefits_nok
  const sickPay = hasSickPay ? Math.min(salary, rates.sick_pay_max_nok) : 0
  const atMax = salary >= rates.pension_max_nok

  if (!hasSickPay) {
    notes.push(`Lønn under 0,5 G (${rates.min_benefits_nok.toLocaleString('nb-NO')} kr) — ingen sykepenger eller dagpenger`)
  } else if (!atMax) {
    const diff = rates.pension_max_nok - salary
    notes.push(`${diff.toLocaleString('nb-NO')} kr unna full pensjonsopptjening (7,1 G)`)
  } else {
    notes.push('Full pensjonsopptjening og full syke-/foreldrepengedekning')
  }

  return {
    annual_accrual_nok: annualAccrual,
    sick_pay_coverage_nok: Math.round(sickPay),
    parental_pay_coverage_nok: Math.round(sickPay),
    pension_coverage_pct: pensionPct,
    has_sick_pay: hasSickPay,
    at_max_pension: atMax,
    notes,
  }
}

// ─── Skatt ────────────────────────────────────────────────────────────────────
function calcTopTax(income: number, rates: DynamicTaxRates): number {
  const brackets = [
    { from: rates.bracket_1_from, to: rates.bracket_2_from, rate: rates.bracket_1_rate },
    { from: rates.bracket_2_from, to: rates.bracket_3_from, rate: rates.bracket_2_rate },
    { from: rates.bracket_3_from, to: rates.bracket_4_from, rate: rates.bracket_3_rate },
    { from: rates.bracket_4_from, to: rates.bracket_5_from, rate: rates.bracket_4_rate },
    { from: rates.bracket_5_from, to: Infinity,             rate: rates.bracket_5_rate },
  ]
  return brackets.reduce((tax, b) => {
    if (income <= b.from) return tax
    return tax + (Math.min(income, b.to) - b.from) * b.rate
  }, 0)
}

function calcPersonalIncomeTax(salary: number, rates: DynamicTaxRates): number {
  const minstefradrag = Math.min(salary * rates.minstefradrag_rate, rates.minstefradrag_max)
  const alminneligInntekt = Math.max(0, salary - minstefradrag - rates.personfradrag)
  return (
    alminneligInntekt * rates.flat_tax_rate +
    calcTopTax(salary, rates) +
    salary * rates.trygdeavgift_rate
  )
}

// ─── Scenario ─────────────────────────────────────────────────────────────────
export interface SalaryDividendScenario {
  salary: number
  dividend: number
  aga_cost: number
  corporation_tax: number
  personal_income_tax: number
  dividend_tax: number
  total_tax: number
  net_private: number
  effective_tax_rate: number
  pension: PensionImpact
}

function calcScenario(
  salary: number,
  profit: number,
  agaZone: AGAZone,
  shieldingDeduction: number,
  rates: DynamicTaxRates
): SalaryDividendScenario {
  const agaRate = getAGARate(agaZone, rates)
  const agaCost = salary * agaRate
  const profitAfter = Math.max(0, profit - salary - agaCost)
  const corpTax = profitAfter * rates.corporation_tax_rate
  const availDividend = Math.max(0, profitAfter - corpTax)

  const personalTax = salary > 0 ? calcPersonalIncomeTax(salary, rates) : 0
  const taxableDividend = Math.max(0, availDividend - shieldingDeduction)
  const dividendTax = taxableDividend * rates.dividend_tax_rate * rates.dividend_upscale
  const netDividend = availDividend - dividendTax
  const netSalary = salary - personalTax
  const totalTax = agaCost + corpTax + personalTax + dividendTax

  return {
    salary,
    dividend: Math.round(availDividend),
    aga_cost: Math.round(agaCost),
    corporation_tax: Math.round(corpTax),
    personal_income_tax: Math.round(personalTax),
    dividend_tax: Math.round(dividendTax),
    total_tax: Math.round(totalTax),
    net_private: Math.round(netSalary + netDividend),
    effective_tax_rate: profit > 0 ? totalTax / profit : 0,
    pension: calcPensionImpact(salary, rates),
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export interface SalaryDividendInput {
  company_profit_before_owner_salary: number
  current_salary: number
  aga_zone: AGAZone
  shielding_deduction: number
  retained_earnings: number
}

export interface MarginalAnalysis {
  salary: number
  marginal_personal_tax_rate: number   // trygdeavgift + flat + trinnskatt
  effective_dividend_rate: number      // 37.84% (fast)
  salary_wins: boolean                 // lønn bedre enn utbytte ved dette nivået
}

export interface SalaryDividendResult {
  scenario_low_salary: SalaryDividendScenario      // lønn = 0
  scenario_current: SalaryDividendScenario          // nåværende lønn
  scenario_7_1g: SalaryDividendScenario             // 7,1 G (anbefalt — full pension)
  scenario_tax_optimal: SalaryDividendScenario      // rent skattemessig optimal (max netto privat)
  scenario_max_salary: SalaryDividendScenario       // alt ut som lønn
  recommended_salary_nok: number
  tax_crossover_nok: number           // punkt der utbytte tar over skattemessig
  effective_dividend_rate: number     // 37.84%
  g_value: number
  marginal_at_7_1g: MarginalAnalysis
  marginal_at_crossover: MarginalAnalysis
  recommendation: string
  notes: string[]
}

export function calculateSalaryDividend(
  input: SalaryDividendInput,
  rates: DynamicTaxRates = DEFAULT_TAX_RATES
): SalaryDividendResult {
  const notes: string[] = []
  const profit = input.company_profit_before_owner_salary
  const agaRate = getAGARate(input.aga_zone, rates)
  const maxSalaryFromProfit = Math.max(0, profit / (1 + agaRate))

  // 7,1 G — capped at what company can afford
  const salary71G = Math.min(rates.pension_max_nok, maxSalaryFromProfit)

  // ─── Effektiv utbyttesats (fast, uavhengig av inntektsnivå) ──────────────────
  // 22% selskapsskatt → 37,84% utbytteskatt på restbeløpet
  // Total effektiv sats per krone overskudd: 1 - (1-0.22)×(1-1.72×0.22) = 51,51%
  const effectiveDivRate = rates.dividend_tax_rate * rates.dividend_upscale // 37.84%

  // ─── Marginal personskatt ved et gitt lønnsnivå ───────────────────────────
  function calcMarginalPersonalRate(salary: number): number {
    // Above minstefradrag max (~227k): flat + trygdeavgift + trinnskatt
    const trinnskatt =
      salary > rates.bracket_5_from ? rates.bracket_5_rate :
      salary > rates.bracket_4_from ? rates.bracket_4_rate :
      salary > rates.bracket_3_from ? rates.bracket_3_rate :
      salary > rates.bracket_2_from ? rates.bracket_2_rate :
      salary > rates.bracket_1_from ? rates.bracket_1_rate : 0
    return rates.flat_tax_rate + rates.trygdeavgift_rate + trinnskatt
  }

  // Kryssingspunkt: lønn er bedre enn utbytte per krone selskapskostnad så lenge
  // (1 − marginalPersonskatt) / (1 + agaRate) > (1−corpTax)×(1−effDivRate)
  // Løs for marginalPersonskatt:
  //   breakeven_marginal = 1 − (1−corpTax)×(1−effDivRate)×(1+agaRate)
  const breakEvenMarginal =
    1 - (1 - rates.corporation_tax_rate) * (1 - effectiveDivRate) * (1 + agaRate)

  // Finn kryssingspunktet analytisk fra trinnskatt-grensene
  const bracketThresholds = [
    rates.bracket_1_from, rates.bracket_2_from, rates.bracket_3_from,
    rates.bracket_4_from, rates.bracket_5_from, Infinity,
  ]
  let taxCrossoverNok = maxSalaryFromProfit
  for (const threshold of bracketThresholds) {
    if (calcMarginalPersonalRate(threshold + 1) >= breakEvenMarginal) {
      taxCrossoverNok = Math.min(threshold, maxSalaryFromProfit)
      break
    }
  }
  taxCrossoverNok = Math.round(taxCrossoverNok / 100) * 100

  // Skattemessig optimal = kryssingspunktet (capped av tilgjengelig overskudd)
  const taxOptimalSalary = taxCrossoverNok

  const s0        = calcScenario(0,                        profit, input.aga_zone, input.shielding_deduction, rates)
  const sCurrent  = calcScenario(input.current_salary,     profit, input.aga_zone, input.shielding_deduction, rates)
  const s71G      = calcScenario(salary71G,                profit, input.aga_zone, input.shielding_deduction, rates)
  const sTaxOpt   = calcScenario(taxOptimalSalary,         profit, input.aga_zone, input.shielding_deduction, rates)
  const sMax      = calcScenario(Math.round(maxSalaryFromProfit), profit, input.aga_zone, input.shielding_deduction, rates)

  const marginalAt71G: MarginalAnalysis = {
    salary: salary71G,
    marginal_personal_tax_rate: calcMarginalPersonalRate(salary71G),
    effective_dividend_rate: effectiveDivRate,
    salary_wins: calcMarginalPersonalRate(salary71G) < breakEvenMarginal,
  }
  const marginalAtCrossover: MarginalAnalysis = {
    salary: taxCrossoverNok,
    marginal_personal_tax_rate: calcMarginalPersonalRate(taxCrossoverNok + 1),
    effective_dividend_rate: effectiveDivRate,
    salary_wins: false,
  }

  // Notes
  if (input.current_salary < rates.min_benefits_nok) {
    notes.push(`Lønn under 0,5 G (${rates.min_benefits_nok.toLocaleString('nb-NO')} kr) — ingen rett til sykepenger eller dagpenger`)
  }
  if (input.current_salary > 0 && input.current_salary < rates.sick_pay_max_nok) {
    notes.push(`Full sykepenge-/foreldrepengedekning oppnås ved lønn ≥ 6 G (${rates.sick_pay_max_nok.toLocaleString('nb-NO')} kr)`)
  }
  if (input.current_salary > rates.pension_max_nok) {
    notes.push(`Lønn over 7,1 G gir ingen ekstra pensjonsopptjening — vurder utbytte for overskytende beløp`)
  }
  if (input.current_salary > taxCrossoverNok) {
    notes.push(`Lønn over skattemessig kryssingspunkt (${taxCrossoverNok.toLocaleString('nb-NO')} kr) — marginalskatt på lønn overstiger utbytteskatten på 37,84%`)
  }
  notes.push(`G ${rates.year ?? CURRENT_YEAR}: ${rates.g_value.toLocaleString('nb-NO')} kr${rates.fetched_at ? ` (hentet ${new Date(rates.fetched_at).toLocaleDateString('nb-NO')})` : ' (standardverdier 2025)'}`)
  notes.push('Beregningen er en forenkling. Kontakt regnskapsfører for endelig beslutning.')
  notes.push('Skjermingsfradrag, holding-AS og IPS er ikke hensyntatt.')

  // Recommendation
  let recommendation = ''
  if (profit < rates.min_benefits_nok) {
    recommendation = `Lavt overskudd — ta ut det du kan som lønn for å oppnå trygderettigheter. Minstegrense for sykepenger: ${rates.min_benefits_nok.toLocaleString('nb-NO')} kr.`
  } else if (profit < rates.pension_max_nok) {
    recommendation = `Overskuddet er under 7,1 G — ta ut maks lønn (${Math.round(maxSalaryFromProfit).toLocaleString('nb-NO')} kr) for å bygge pensjonsrettigheter.`
  } else {
    const gapNote = taxOptimalSalary > salary71G
      ? ` Du kan øke til skattemessig optimalt (${taxOptimalSalary.toLocaleString('nb-NO')} kr) for ${(sTaxOpt.net_private - s71G.net_private).toLocaleString('nb-NO')} kr mer netto — men uten ytterligere pensjonsopptjening over 7,1 G.`
      : ''
    recommendation =
      `Anbefalt: 7,1 G = ${rates.pension_max_nok.toLocaleString('nb-NO')} kr lønn gir full pensjon (+${Math.round(rates.pension_max_nok * 0.181).toLocaleString('nb-NO')} kr/år) og full syke-/foreldrepengedekning. ` +
      `Ta resten (${s71G.dividend.toLocaleString('nb-NO')} kr) som utbytte.` + gapNote
  }

  return {
    scenario_low_salary: s0,
    scenario_current:    sCurrent,
    scenario_7_1g:       s71G,
    scenario_tax_optimal: sTaxOpt,
    scenario_max_salary: sMax,
    recommended_salary_nok: salary71G,
    tax_crossover_nok: taxCrossoverNok,
    effective_dividend_rate: effectiveDivRate,
    g_value: rates.g_value,
    marginal_at_7_1g: marginalAt71G,
    marginal_at_crossover: marginalAtCrossover,
    recommendation,
    notes,
  }
}

const CURRENT_YEAR = new Date().getFullYear()
