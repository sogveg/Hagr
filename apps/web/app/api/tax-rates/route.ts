// GET /api/tax-rates — returns current tax rates from Supabase
// Falls back to DEFAULT_TAX_RATES if DB is empty

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { DEFAULT_TAX_RATES, ratesFromRows } from '@/lib/shared/tax-rates'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tax_rates')
      .select('key, value, source_url, fetched_at, year')

    if (error || !data?.length) {
      return NextResponse.json(DEFAULT_TAX_RATES)
    }

    return NextResponse.json(ratesFromRows(data))
  } catch {
    return NextResponse.json(DEFAULT_TAX_RATES)
  }
}
