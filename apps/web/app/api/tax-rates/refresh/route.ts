// POST /api/tax-rates/refresh
// Fetches official Norwegian tax rates from government sources and stores in Supabase
//
// Sources:
//   G (grunnbeløp):    SSB API — data.ssb.no (Tabell 03013, maskinlesbar JSON)
//   Trinnskatt:        Skatteetaten.no satser-side (HTML-scrape)
//   Minstefradrag:     Skatteetaten.no satser-side (HTML-scrape)
//   Personfradrag:     Skatteetaten.no satser-side (HTML-scrape)
//   Trygdeavgift:      Skatteetaten.no satser-side (HTML-scrape)
//   AGA-satser:        Skatteetaten.no satser-side (HTML-scrape)

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'


// ─── Types ────────────────────────────────────────────────────────────────────
interface FetchedRate {
  key: string
  value: number
  description: string
  source_url: string
  year: number
  fetched_at: string
}

interface FetchResult {
  rates: FetchedRate[]
  errors: string[]
}

const NOW = new Date().toISOString()
const CURRENT_YEAR = new Date().getFullYear()

// ─── SSB: Grunnbeløpet ───────────────────────────────────────────────────────
// SSB Tabell 03013 — Grunnbeløp og pensjonspoeng i folketrygden
// Dokumentasjon: https://www.ssb.no/statbank/table/03013
async function fetchGFromSSB(): Promise<FetchResult> {
  const url = 'https://data.ssb.no/api/v0/no/table/03013'
  const errors: string[] = []
  const rates: FetchedRate[] = []

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: [
          {
            code: 'ContentsCode',
            selection: { filter: 'item', values: ['Grunnbelop'] },
          },
          {
            code: 'Tid',
            selection: { filter: 'top', values: ['1'] },
          },
        ],
        response: { format: 'json-stat2' },
      }),
      next: { revalidate: 0 },
    })

    if (!res.ok) throw new Error(`SSB responded ${res.status}`)

    const data = await res.json()

    // json-stat2 format: values are in data.value array
    const rawValue = Array.isArray(data.value) ? data.value[0] : null
    if (rawValue == null) throw new Error('SSB: no value in response')

    const gValue = Number(rawValue)
    if (isNaN(gValue) || gValue < 50000) throw new Error(`SSB: unexpected G value ${rawValue}`)

    rates.push({
      key: 'g_value',
      value: gValue,
      description: `Grunnbeløpet i folketrygden ${CURRENT_YEAR}`,
      source_url: 'https://www.nav.no/grunnbelopet',
      year: CURRENT_YEAR,
      fetched_at: NOW,
    })
  } catch (e) {
    errors.push(`G (SSB): ${e instanceof Error ? e.message : String(e)}`)
  }

  return { rates, errors }
}

// ─── Skatteetaten: scrape hjelpefunksjon ─────────────────────────────────────
async function fetchSkePage(path: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.skatteetaten.no${path}`, {
      headers: { 'Accept-Language': 'nb', 'User-Agent': 'SkatteSmart/1.0' },
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    return res.text()
  } catch {
    return null
  }
}

/** Finn et tall i HTML ved å lete etter tekst i nærheten */
function extractNumber(html: string, ...patterns: RegExp[]): number | null {
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) {
      const raw = match[1].replace(/\s/g, '').replace(',', '.')
      const n = parseFloat(raw)
      if (!isNaN(n)) return n
    }
  }
  return null
}

// ─── Trinnskatt ──────────────────────────────────────────────────────────────
async function fetchTrinnskatt(): Promise<FetchResult> {
  const errors: string[] = []
  const rates: FetchedRate[] = []
  const url = '/satser/trinnskatt/'
  const html = await fetchSkePage(url)

  if (!html) {
    errors.push('Trinnskatt: kunne ikke hente side')
    return { rates, errors }
  }

  const SOURCE = `https://www.skatteetaten.no${url}`

  // Trinnskatt-siden har tabeller med innslagspunkt og sats
  // Prøver ulike mønstre ettersom Skatteetaten endrer HTML-struktur
  // Mønster: "208 050" ... "1,7" eller lignende
  const bracketPatterns: [string, RegExp, RegExp][] = [
    ['bracket_1', /208\s*0[45]\d[^<]*?(\d[\d\s]*)\s*kr/i, /trinn\s*1[^>]*>[\s\S]{0,300}?([\d,]+)\s*%/i],
    ['bracket_2', /292\s*8[45]\d[^<]*?(\d[\d\s]*)\s*kr/i, /trinn\s*2[^>]*>[\s\S]{0,300}?([\d,]+)\s*%/i],
    ['bracket_3', /670\s*000[^<]*?(\d[\d\s]*)\s*kr/i, /trinn\s*3[^>]*>[\s\S]{0,300}?([\d,]+)\s*%/i],
    ['bracket_4', /937\s*9\d\d[^<]*?(\d[\d\s]*)\s*kr/i, /trinn\s*4[^>]*>[\s\S]{0,300}?([\d,]+)\s*%/i],
    ['bracket_5', /1\s*350\s*000[^<]*?(\d[\d\s]*)\s*kr/i, /trinn\s*5[^>]*>[\s\S]{0,300}?([\d,]+)\s*%/i],
  ]

  // Fallback: extract all "NNN NNN kr" followed by "N,N %" pairs from table rows
  // This regex matches Norwegian number format in table cells
  const tableRowPattern = /([\d\s]{6,})\s*kr[\s\S]{1,200}?([\d]+[,.][\d]+)\s*%/gi
  const allMatches = [...html.matchAll(tableRowPattern)]

  const validBrackets = allMatches
    .map(m => ({
      from: parseInt(m[1].replace(/\s/g, '')),
      rate: parseFloat(m[2].replace(',', '.')) / 100,
    }))
    .filter(b => b.from > 100000 && b.from < 5000000 && b.rate > 0 && b.rate < 0.3)
    .sort((a, b) => a.from - b.from)

  if (validBrackets.length >= 4) {
    validBrackets.slice(0, 5).forEach((b, i) => {
      rates.push({
        key: `bracket_${i + 1}_from`,
        value: b.from,
        description: `Trinnskatt trinn ${i + 1} innslagspunkt ${CURRENT_YEAR}`,
        source_url: SOURCE,
        year: CURRENT_YEAR,
        fetched_at: NOW,
      })
      rates.push({
        key: `bracket_${i + 1}_rate`,
        value: b.rate,
        description: `Trinnskatt trinn ${i + 1} sats ${CURRENT_YEAR}`,
        source_url: SOURCE,
        year: CURRENT_YEAR,
        fetched_at: NOW,
      })
    })
  } else {
    errors.push(`Trinnskatt: fant bare ${validBrackets.length} trinn (forventet ≥4) — beholder lagrede verdier`)
  }

  return { rates, errors }
}

// ─── Personfradrag ───────────────────────────────────────────────────────────
async function fetchPersonfradrag(): Promise<FetchResult> {
  const errors: string[] = []
  const rates: FetchedRate[] = []
  const url = '/satser/personfradrag/'
  const html = await fetchSkePage(url)
  const SOURCE = `https://www.skatteetaten.no${url}`

  if (!html) { errors.push('Personfradrag: kunne ikke hente side'); return { rates, errors } }

  const val = extractNumber(html,
    /personfradrag[\s\S]{0,500}?([\d\s]{5,7})\s*kr/i,
    /(1[01]\d\s*\d{3})\s*kr/i,
  )
  if (val && val > 50000 && val < 200000) {
    rates.push({ key: 'personfradrag', value: val, description: `Personfradrag ${CURRENT_YEAR}`, source_url: SOURCE, year: CURRENT_YEAR, fetched_at: NOW })
  } else {
    errors.push(`Personfradrag: fant ikke verdi (hentet "${val}")`)
  }

  return { rates, errors }
}

// ─── Minstefradrag ───────────────────────────────────────────────────────────
async function fetchMinstefradrag(): Promise<FetchResult> {
  const errors: string[] = []
  const rates: FetchedRate[] = []
  const url = '/satser/minstefradrag/'
  const html = await fetchSkePage(url)
  const SOURCE = `https://www.skatteetaten.no${url}`

  if (!html) { errors.push('Minstefradrag: kunne ikke hente side'); return { rates, errors } }

  const rateVal = extractNumber(html,
    /l[øo]nn[\s\S]{0,200}?(\d{2})\s*%/i,
    /46\s*%/i,
  )
  const maxVal = extractNumber(html,
    /maks[\s\S]{0,200}?([\d\s]{5,6})\s*kr/i,
    /(10[45]\s*\d{3})\s*kr/i,
  )

  if (rateVal && rateVal >= 40 && rateVal <= 55) {
    rates.push({ key: 'minstefradrag_rate', value: rateVal / 100, description: `Minstefradragssats lønn ${CURRENT_YEAR}`, source_url: SOURCE, year: CURRENT_YEAR, fetched_at: NOW })
  } else {
    errors.push(`Minstefradrag sats: fant ikke verdi`)
  }
  if (maxVal && maxVal > 80000 && maxVal < 200000) {
    rates.push({ key: 'minstefradrag_max', value: maxVal, description: `Maks minstefradrag lønn ${CURRENT_YEAR}`, source_url: SOURCE, year: CURRENT_YEAR, fetched_at: NOW })
  } else {
    errors.push(`Minstefradrag maks: fant ikke verdi`)
  }

  return { rates, errors }
}

// ─── Trygdeavgift ─────────────────────────────────────────────────────────────
async function fetchTrygdeavgift(): Promise<FetchResult> {
  const errors: string[] = []
  const rates: FetchedRate[] = []
  const url = '/satser/trygdeavgift/'
  const html = await fetchSkePage(url)
  const SOURCE = `https://www.skatteetaten.no${url}`

  if (!html) { errors.push('Trygdeavgift: kunne ikke hente side'); return { rates, errors } }

  const val = extractNumber(html,
    /l[øo]nn[\s\S]{0,200}?(7[,.]?\d)\s*%/i,
    /(7[,.]8)\s*%/i,
  )
  if (val && val >= 5 && val <= 12) {
    rates.push({ key: 'trygdeavgift_rate', value: val / 100, description: `Trygdeavgift lønn ${CURRENT_YEAR}`, source_url: SOURCE, year: CURRENT_YEAR, fetched_at: NOW })
  } else {
    errors.push(`Trygdeavgift: fant ikke verdi`)
  }

  return { rates, errors }
}

// ─── AGA-satser ──────────────────────────────────────────────────────────────
async function fetchAGA(): Promise<FetchResult> {
  const errors: string[] = []
  const rates: FetchedRate[] = []
  const url = '/satser/arbeidsgiveravgift/'
  const html = await fetchSkePage(url)
  const SOURCE = `https://www.skatteetaten.no${url}`

  if (!html) { errors.push('AGA: kunne ikke hente side'); return { rates, errors } }

  // Sone I: 14,1%  Sone II: 10,6%  osv.
  const sonerPattern = /sone\s*([IViv]+)[\s\S]{0,200}?([\d]+[,.][\d]+)\s*%/gi
  const matches = [...html.matchAll(sonerPattern)]
  const sonerMap: Record<string, number> = {}

  const romanToArabic: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5 }

  for (const m of matches) {
    const roman = m[1].toUpperCase()
    const arabicNum = romanToArabic[roman]
    if (!arabicNum) continue
    const rate = parseFloat(m[2].replace(',', '.')) / 100
    if (rate >= 0 && rate <= 0.2) {
      sonerMap[`zone${arabicNum}`] = rate
    }
  }

  // Expect at least zone1 (14.1%) and zone5 (0%)
  const zone1 = sonerMap['zone1']
  if (zone1 && zone1 >= 0.13 && zone1 <= 0.16) {
    for (const [zone, rate] of Object.entries(sonerMap)) {
      rates.push({
        key: `aga_${zone}`,
        value: rate,
        description: `AGA ${zone} ${CURRENT_YEAR}`,
        source_url: SOURCE,
        year: CURRENT_YEAR,
        fetched_at: NOW,
      })
    }
  } else {
    errors.push(`AGA: fant ikke sone I (hentet zone1=${zone1}) — beholder lagrede verdier`)
  }

  return { rates, errors }
}

// ─── Upsert to Supabase ───────────────────────────────────────────────────────
async function upsertRates(rates: FetchedRate[]) {
  if (!rates.length) return
  const { error } = await supabase
    .from('tax_rates')
    .upsert(rates, { onConflict: 'key' })
  if (error) throw error
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // Simple auth: require service role header or CRON_SECRET
  const secret = req.headers.get('x-cron-secret') ?? req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET && secret !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const allRates: FetchedRate[] = []
  const allErrors: string[] = []

  const results = await Promise.allSettled([
    fetchGFromSSB(),
    fetchTrinnskatt(),
    fetchPersonfradrag(),
    fetchMinstefradrag(),
    fetchTrygdeavgift(),
    fetchAGA(),
  ])

  for (const r of results) {
    if (r.status === 'fulfilled') {
      allRates.push(...r.value.rates)
      allErrors.push(...r.value.errors)
    } else {
      allErrors.push(`Uventet feil: ${r.reason}`)
    }
  }

  try {
    await upsertRates(allRates)
  } catch (e) {
    return NextResponse.json({
      success: false,
      fetched: allRates.length,
      errors: [...allErrors, `DB upsert feilet: ${e}`],
    }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    fetched: allRates.length,
    updated_keys: allRates.map(r => r.key),
    errors: allErrors,
    timestamp: NOW,
  })
}
