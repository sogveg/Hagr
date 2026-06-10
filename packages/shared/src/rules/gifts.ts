export const GIFT_TAX_FREE_LIMIT_NOK = 5000

export interface GiftRuleInput {
  amount_nok: number
  is_cash_equivalent: boolean
  is_performance_related: boolean
  used_this_year_before_nok: number
}

export interface GiftRuleResult {
  tax_free_amount: number
  taxable_amount: number
  flags: string[]
}

export function evaluateGift(input: GiftRuleInput): GiftRuleResult {
  const flags: string[] = []

  if (input.is_cash_equivalent) {
    flags.push('Kontantekvivalent gave er ikke skattefri')
    return { tax_free_amount: 0, taxable_amount: input.amount_nok, flags }
  }

  if (input.is_performance_related) {
    flags.push('Prestasjonsgave kan klassifiseres som lønn/bonus')
  }

  const remaining = Math.max(0, GIFT_TAX_FREE_LIMIT_NOK - input.used_this_year_before_nok)
  const tax_free_amount = Math.min(input.amount_nok, remaining)
  const taxable_amount = input.amount_nok - tax_free_amount

  if (taxable_amount > 0) {
    flags.push(`${taxable_amount} NOK over skattefri grense (${GIFT_TAX_FREE_LIMIT_NOK} NOK/år)`)
  }

  return { tax_free_amount, taxable_amount, flags }
}

export function getRemainingGiftAllowance(usedThisYear: number): number {
  return Math.max(0, GIFT_TAX_FREE_LIMIT_NOK - usedThisYear)
}
