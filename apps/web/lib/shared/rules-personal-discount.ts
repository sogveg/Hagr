export const PERSONAL_DISCOUNT_TAX_FREE_LIMIT_NOK = 10000

export interface PersonalDiscountRuleInput {
  market_price_nok: number
  paid_price_nok: number
  used_this_year_before_nok: number
  relates_to_own_goods_services: boolean
}

export interface PersonalDiscountRuleResult {
  discount_value_nok: number
  tax_free_amount: number
  taxable_amount: number
  flags: string[]
}

export function evaluatePersonalDiscount(input: PersonalDiscountRuleInput): PersonalDiscountRuleResult {
  const flags: string[] = []

  if (!input.relates_to_own_goods_services) {
    flags.push('Personalrabatt bør knyttes til varer/tjenester selskapet produserer eller selger')
  }

  const discount_value_nok = Math.max(0, input.market_price_nok - input.paid_price_nok)
  const remaining = Math.max(0, PERSONAL_DISCOUNT_TAX_FREE_LIMIT_NOK - input.used_this_year_before_nok)
  const tax_free_amount = Math.min(discount_value_nok, remaining)
  const taxable_amount = discount_value_nok - tax_free_amount

  if (taxable_amount > 0) {
    flags.push(
      `${taxable_amount} NOK over skattefri grense (${PERSONAL_DISCOUNT_TAX_FREE_LIMIT_NOK} NOK/år)`
    )
  }

  return { discount_value_nok, tax_free_amount, taxable_amount, flags }
}
