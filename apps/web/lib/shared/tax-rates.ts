// Dynamic tax rates — loaded from Supabase (fetched from gov sources)
// Falls back to hardcoded 2025 values if unavailable

export interface DynamicTaxRates {
  // Grunnbeløp
  g_value: number
  pension_max_g: number
  sick_pay_max_g: number
  min_benefits_g: number

  // Derived G-based limits (computed)
  pension_max_nok: number
  sick_pay_max_nok: number
  min_benefits_nok: number

  // Fradrag
  personfradrag: number
  minstefradrag_rate: number
  minstefradrag_max: number

  // Rates
  trygdeavgift_rate: number
  corporation_tax_rate: number
  dividend_upscale: number
  dividend_tax_rate: number
  flat_tax_rate: number

  // AGA
  aga_zone1: number
  aga_zone2: number
  aga_zone3: number
  aga_zone4: number
  aga_zone5: number

  // Trinnskatt
  bracket_1_from: number; bracket_1_rate: number
  bracket_2_from: number; bracket_2_rate: number
  bracket_3_from: number; bracket_3_rate: number
  bracket_4_from: number; bracket_4_rate: number
  bracket_5_from: number; bracket_5_rate: number

  // Metadata
  fetched_at?: string
  year?: number
  sources?: { key: string; url: string }[]
}

// ─── 2026 (gjeldende skatteår) ────────────────────────────────────────────────
// Kilder:
//   Skatteetaten.no/satser/trinnskatt      → brackets
//   Skatteetaten.no/satser/personfradrag   → 114 540 kr
//   Skatteetaten.no/satser/minstefradrag   → 46%, maks 95 700 kr
//   Smarte Penger (2026-kolonne)           → trygdeavgift 7,6%
//   Skattemessig kryssingspunkt (sone I):  → 980 100 kr
//     Marginal lønnsskatt trinn 5 = 22 + 7,6 + 16,8 = 46,4% > breakeven 44,7%
//     Marginal lønnsskatt trinn 4 = 22 + 7,6 + 13,7 = 43,3% < breakeven 44,7%
export const DEFAULT_TAX_RATES: DynamicTaxRates = {
  g_value: 130656,           // G 2026 (fastsatt 1. mai 2026)
  pension_max_g: 7.1,
  sick_pay_max_g: 6.0,
  min_benefits_g: 0.5,
  pension_max_nok: Math.round(130656 * 7.1),   // 927 658
  sick_pay_max_nok: Math.round(130656 * 6.0),  // 783 936
  min_benefits_nok: Math.round(130656 * 0.5),  // 65 328

  personfradrag: 114540,
  minstefradrag_rate: 0.46,
  minstefradrag_max: 95700,

  trygdeavgift_rate: 0.076,       // 7,6% i 2026 (ned fra 7,7% i 2025)
  corporation_tax_rate: 0.22,
  dividend_upscale: 1.72,
  dividend_tax_rate: 0.22,
  flat_tax_rate: 0.22,

  aga_zone1: 0.141,
  aga_zone2: 0.106,
  aga_zone3: 0.064,
  aga_zone4: 0.051,
  aga_zone5: 0.000,

  // 2026-trinnskatt (kilde: Skatteetaten.no)
  bracket_1_from: 226100,  bracket_1_rate: 0.017,
  bracket_2_from: 318300,  bracket_2_rate: 0.040,
  bracket_3_from: 725050,  bracket_3_rate: 0.137,
  bracket_4_from: 980100,  bracket_4_rate: 0.168,
  bracket_5_from: 1467200, bracket_5_rate: 0.178,

  year: 2026,
  fetched_at: undefined,
}

// ─── 2025-satser (for referanse / historiske beregninger) ─────────────────────
export const TAX_RATES_2025: DynamicTaxRates = {
  g_value: 124028,
  pension_max_g: 7.1,
  sick_pay_max_g: 6.0,
  min_benefits_g: 0.5,
  pension_max_nok: Math.round(124028 * 7.1),   // 881 599
  sick_pay_max_nok: Math.round(124028 * 6.0),  // 744 168
  min_benefits_nok: Math.round(124028 * 0.5),  // 62 014

  personfradrag: 114540,
  minstefradrag_rate: 0.46,
  minstefradrag_max: 92000,

  trygdeavgift_rate: 0.077,       // 7,7% i 2025
  corporation_tax_rate: 0.22,
  dividend_upscale: 1.72,
  dividend_tax_rate: 0.22,
  flat_tax_rate: 0.22,

  aga_zone1: 0.141,
  aga_zone2: 0.106,
  aga_zone3: 0.064,
  aga_zone4: 0.051,
  aga_zone5: 0.000,

  // 2025-trinnskatt (kilde: Smarte Penger)
  bracket_1_from: 217400,  bracket_1_rate: 0.017,
  bracket_2_from: 306050,  bracket_2_rate: 0.040,
  bracket_3_from: 697150,  bracket_3_rate: 0.137,
  bracket_4_from: 942400,  bracket_4_rate: 0.167,
  bracket_5_from: 1410750, bracket_5_rate: 0.177,

  year: 2025,
  fetched_at: undefined,
}

/** Convert flat Supabase rows → DynamicTaxRates */
export function ratesFromRows(
  rows: { key: string; value: number; source_url?: string; fetched_at?: string; year?: number }[]
): DynamicTaxRates {
  const map: Record<string, number> = {}
  const sources: { key: string; url: string }[] = []
  let fetched_at: string | undefined
  let year: number | undefined

  for (const row of rows) {
    map[row.key] = Number(row.value)
    if (row.source_url) sources.push({ key: row.key, url: row.source_url })
    if (row.fetched_at) fetched_at = row.fetched_at
    if (row.year) year = row.year
  }

  const g = map['g_value'] ?? DEFAULT_TAX_RATES.g_value
  const pension_max_g = map['pension_max_g'] ?? DEFAULT_TAX_RATES.pension_max_g
  const sick_pay_max_g = map['sick_pay_max_g'] ?? DEFAULT_TAX_RATES.sick_pay_max_g
  const min_benefits_g = map['min_benefits_g'] ?? DEFAULT_TAX_RATES.min_benefits_g

  return {
    ...DEFAULT_TAX_RATES,
    ...Object.fromEntries(
      Object.entries(map).filter(([k]) => k in DEFAULT_TAX_RATES)
    ),
    g_value: g,
    pension_max_g,
    sick_pay_max_g,
    min_benefits_g,
    pension_max_nok: Math.round(g * pension_max_g),
    sick_pay_max_nok: Math.round(g * sick_pay_max_g),
    min_benefits_nok: Math.round(g * min_benefits_g),
    fetched_at,
    year,
    sources,
  } as DynamicTaxRates
}
