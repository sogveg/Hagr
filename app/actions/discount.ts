'use server'

import { createServiceClient } from '@/lib/supabase-server'

export type DiscountResult =
  | { valid: true;  id: string; type: 'percent' | 'fixed'; value: number; discount: number; label: string }
  | { valid: false; error: string }

export async function validateDiscountCode(
  code: string,
  rentalSubtotal: number,
): Promise<DiscountResult> {
  if (!code.trim()) return { valid: false, error: 'Skriv inn en rabattkode' }

  const supabase = createServiceClient()
  const { data } = await (supabase.from as any)('discount_codes')
    .select('id, code, type, value, max_uses, uses, expires_at, active')
    .eq('code', code.toUpperCase().trim())
    .maybeSingle()

  if (!data)        return { valid: false, error: 'Ugyldig rabattkode' }
  if (!data.active) return { valid: false, error: 'Rabattkoden er ikke aktiv' }
  if (data.expires_at && new Date(data.expires_at) < new Date())
    return { valid: false, error: 'Rabattkoden har utløpt' }
  if (data.max_uses != null && data.uses >= data.max_uses)
    return { valid: false, error: 'Rabattkoden er brukt opp' }

  const discount =
    data.type === 'percent'
      ? Math.round(rentalSubtotal * (data.value / 100))
      : data.value

  const cappedDiscount = Math.min(discount, rentalSubtotal)
  const label =
    data.type === 'percent'
      ? `${data.value}% rabatt`
      : `${data.value} kr rabatt`

  return {
    valid:    true,
    id:       data.id,
    type:     data.type,
    value:    data.value,
    discount: cappedDiscount,
    label,
  }
}
