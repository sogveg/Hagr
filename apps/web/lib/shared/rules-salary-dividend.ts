// Norwegian salary vs dividend calculator 2025
// Simplified but realistic approximation

// 2025 tax brackets (trinnskatt)
const BRACKETS = [
  { from: 208050,  to: 292850,  rate: 0.017 },
  { from: 292850,  to: 670000,  rate: 0.040 },
  { from: 670000,  to: 937900,  rate: 0.136 },
  { from: 937900,  to: 1350000, rate: 0.166 },
  { from: 1350000, to: Infinity, rate: 0.176 },
]

export const CORPORATION_TAX_RATE = 0.22
export const DIVIDEND_UPSCALE_FACTOR = 1.72
export const DIVIDEND_TAX_RATE = 0.22 // applied to grossed-up amount
export const EFFECTIVE_DIVIDEND_TAX = 1 - (1 - DIVIDEND_TAX_RATE * DIVIDEND_UPSCALE_FACTOR) // ~37.84%

// Arbeidsgiveravgift-soner 2025
export const AGA_RATES: Record<string, number> = {
  zone1: 0.141, // Oslo, Bergen etc.
  zone2: 0.106,
  zone3: 0.064,
  zone4: 0.051,
  zone5: 0.000,
}

export const PERSONAL_DEDUCTION_2025 = 108550 // personfradrag
export const MIN_DEDUCTION_RATE = 0.46
export const MIN_DEDUCTION_MAX = 104450
export const FLAT_TAX_RATE = 0.22

function calcTopTax(income: number): number {
  return BRACKETS.reduce((tax, b) => {
    if (income <= b.from) return tax
    return tax + (Math.min(income, b.to) - b.from) * b.rate
  }, 0)
}

function calcMinstefradrag(grossSalary: number): number {
  return Math.min(grossSalary * MIN_DEDUCTION_RATE, MIN_DEDUCTION_MAX)
}

function calcPersonalIncomeTax(grossSalary: number): number {
  const minstefradrag = calcMinstefradrag(grossSalary)
  const alminneligInntekt = Math.max(0, grossSalary - minstefradrag - PERSONAL_DEDUCTION_2025)
  const flatTax = alminneligInntekt * FLAT_TAX_RATE
  const topTax = calcTopTax(grossSalary)
  const trygdeavgift = grossSalary * 0.078 // lønnstakere 7.8%
  return flatTax + topTax + trygdeavgift
}

export interface SalaryDividendInput {
  company_profit_before_owner_salary: number // selskapets overskudd FØR eierlønnn
  current_salary: number
  aga_zone: keyof typeof AGA_RATES
  shielding_deduction: number // skjermingsfradrag (sett til 0 hvis ukjent)
  retained_earnings: number // opptjent egenkapital tilgjengelig for utbytte
}

export interface SalaryDividendScenario {
  salary: number
  dividend: number
  aga_cost: number // arbeidsgiveravgift
  corporation_tax: number
  personal_income_tax: number
  dividend_tax: number
  total_tax: number
  net_private: number
  total_cost_to_company: number
  effective_tax_rate: number
}

export interface SalaryDividendResult {
  scenario_low_salary: SalaryDividendScenario   // lønn = 0
  scenario_current: SalaryDividendScenario       // nåværende lønn
  scenario_optimal: SalaryDividendScenario       // anbefalt
  scenario_max_salary: SalaryDividendScenario    // alt som lønn
  recommendation: string
  notes: string[]
}

function calcScenario(
  salary: number,
  companyProfitBeforeSalary: number,
  agaZone: keyof typeof AGA_RATES,
  shieldingDeduction: number
): SalaryDividendScenario {
  const agaRate = AGA_RATES[agaZone]
  const agaCost = salary * agaRate
  const profitAfterSalaryAndAga = Math.max(0, companyProfitBeforeSalary - salary - agaCost)
  const corporationTax = profitAfterSalaryAndAga * CORPORATION_TAX_RATE
  const availableForDividend = Math.max(0, profitAfterSalaryAndAga - corporationTax)

  const personalIncomeTax = salary > 0 ? calcPersonalIncomeTax(salary) : 0
  const netSalary = salary - personalIncomeTax

  // Dividend tax (simplified - ignoring shielding deduction for now)
  const taxableDividend = Math.max(0, availableForDividend - shieldingDeduction)
  const dividendTax = taxableDividend * DIVIDEND_TAX_RATE * DIVIDEND_UPSCALE_FACTOR
  const netDividend = availableForDividend - dividendTax

  const totalTax = agaCost + corporationTax + personalIncomeTax + dividendTax
  const netPrivate = netSalary + netDividend
  const totalCostToCompany = salary + agaCost + profitAfterSalaryAndAga // all money out of company
  const totalRevenue = companyProfitBeforeSalary
  const effectiveTaxRate = totalRevenue > 0 ? totalTax / totalRevenue : 0

  return {
    salary,
    dividend: availableForDividend,
    aga_cost: Math.round(agaCost),
    corporation_tax: Math.round(corporationTax),
    personal_income_tax: Math.round(personalIncomeTax),
    dividend_tax: Math.round(dividendTax),
    total_tax: Math.round(totalTax),
    net_private: Math.round(netPrivate),
    total_cost_to_company: Math.round(totalCostToCompany),
    effective_tax_rate: effectiveTaxRate,
  }
}

export function calculateSalaryDividend(input: SalaryDividendInput): SalaryDividendResult {
  const notes: string[] = []

  // Optimal: roughly salary around 7.1G for sykepenger-rettigheter (ca. 792 000 kr i 2025)
  // Practical: many owner-managers take ~600 000-700 000 in salary
  // Simple heuristic: salary = min(profit * 0.6, 700000)
  const optimalSalary = Math.min(
    Math.round(input.company_profit_before_owner_salary * 0.55 / 1000) * 1000,
    700000
  )

  const s0 = calcScenario(0, input.company_profit_before_owner_salary, input.aga_zone, input.shielding_deduction)
  const sCurrent = calcScenario(input.current_salary, input.company_profit_before_owner_salary, input.aga_zone, input.shielding_deduction)
  const sOptimal = calcScenario(optimalSalary, input.company_profit_before_owner_salary, input.aga_zone, input.shielding_deduction)
  const sMax = calcScenario(
    Math.max(0, input.company_profit_before_owner_salary / (1 + AGA_RATES[input.aga_zone])),
    input.company_profit_before_owner_salary,
    input.aga_zone,
    input.shielding_deduction
  )

  if (input.current_salary < 300000 && input.company_profit_before_owner_salary > 500000) {
    notes.push('Lav lønn reduserer pensjons- og sykepenger-grunnlag — vurder høyere lønn')
  }
  if (input.current_salary > 1000000) {
    notes.push('Høy lønn over toppskattgrense — utbytte kan gi bedre netto')
  }
  notes.push('Beregningen er en forenkling. Bruk alltid regnskapsfører for endelig beslutning.')
  notes.push('Skjermingsfradrag, fritaksmodell i holding og private pensjonsordninger er ikke hensyntatt.')

  const recommendation =
    sOptimal.net_private > sCurrent.net_private
      ? `En lønn på ca. ${optimalSalary.toLocaleString('nb-NO')} kr gir et estimert netto privat på ${sOptimal.net_private.toLocaleString('nb-NO')} kr — ${(sOptimal.net_private - sCurrent.net_private).toLocaleString('nb-NO')} kr bedre enn nåværende lønn.`
      : `Nåværende lønn på ${input.current_salary.toLocaleString('nb-NO')} kr ser rimelig optimalisert ut.`

  return {
    scenario_low_salary: s0,
    scenario_current: sCurrent,
    scenario_optimal: sOptimal,
    scenario_max_salary: sMax,
    recommendation,
    notes,
  }
}
