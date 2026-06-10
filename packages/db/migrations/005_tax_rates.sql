-- Migration 005: Dynamiske skattesatser
-- Kjør i Supabase SQL Editor

CREATE TABLE IF NOT EXISTS tax_rates (
  key         TEXT PRIMARY KEY,
  value       NUMERIC NOT NULL,
  description TEXT,
  source_url  TEXT,
  year        INT,
  fetched_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tax_rates_read_authenticated" ON tax_rates
  FOR SELECT USING (auth.role() = 'authenticated');

-- Seed med 2026-verdier (gjeldende skatteår per juni 2026)
-- Kilde: Skatteetaten.no + Smarte Penger
INSERT INTO tax_rates (key, value, description, source_url, year) VALUES

  -- Grunnbeløp (G)
  ('g_value',              130656, 'Grunnbeløpet i folketrygden per 1. mai 2026',
   'https://www.nav.no/grunnbelopet', 2026),
  ('pension_max_g',        7.1,    'Maks inntekt for pensjonsopptjening (antall G)',
   'https://www.nav.no/alderspensjon', 2026),
  ('sick_pay_max_g',       6.0,    'Maks inntekt for sykepenger/foreldrepenger (antall G)',
   'https://www.nav.no/sykepenger', 2026),
  ('min_benefits_g',       0.5,    'Minste inntekt for rett til sykepenger/dagpenger (antall G)',
   'https://www.nav.no/sykepenger', 2026),

  -- Personlige fradrag 2026
  ('personfradrag',        114540, 'Personfradrag 2026',
   'https://www.skatteetaten.no/satser/personfradrag/', 2026),
  ('minstefradrag_rate',   0.46,   'Minstefradragssats lønn 2026',
   'https://www.skatteetaten.no/satser/minstefradrag/', 2026),
  ('minstefradrag_max',    95700,  'Maks minstefradrag lønn 2026',
   'https://www.skatteetaten.no/satser/minstefradrag/', 2026),

  -- Skattesatser 2026
  ('trygdeavgift_rate',    0.076,  'Trygdeavgift lønn 2026 (ned fra 7,7% i 2025)',
   'https://www.skatteetaten.no/satser/trygdeavgift/', 2026),
  ('corporation_tax_rate', 0.22,   'Selskapsskattesats 2026',
   'https://www.skatteetaten.no/satser/selskapsskatt/', 2026),
  ('dividend_upscale',     1.72,   'Oppjusteringsfaktor utbytte 2026',
   'https://www.skatteetaten.no/satser/utbytte/', 2026),
  ('dividend_tax_rate',    0.22,   'Skattesats utbytte (alminnelig inntekt) 2026',
   'https://www.skatteetaten.no/satser/utbytte/', 2026),
  ('flat_tax_rate',        0.22,   'Alminnelig inntektsskatt 2026',
   'https://www.skatteetaten.no/satser/', 2026),

  -- Arbeidsgiveravgift
  ('aga_zone1',            0.141,  'AGA sone I (Oslo, Bergen m.fl.)',
   'https://www.skatteetaten.no/satser/arbeidsgiveravgift/', 2026),
  ('aga_zone2',            0.106,  'AGA sone II',
   'https://www.skatteetaten.no/satser/arbeidsgiveravgift/', 2026),
  ('aga_zone3',            0.064,  'AGA sone III',
   'https://www.skatteetaten.no/satser/arbeidsgiveravgift/', 2026),
  ('aga_zone4',            0.051,  'AGA sone IV',
   'https://www.skatteetaten.no/satser/arbeidsgiveravgift/', 2026),
  ('aga_zone5',            0.000,  'AGA sone V (Finnmark m.fl.)',
   'https://www.skatteetaten.no/satser/arbeidsgiveravgift/', 2026),

  -- Trinnskatt 2026 (kilde: Skatteetaten.no/satser/trinnskatt)
  -- Skattemessig kryssingspunkt sone I: 980 100 kr
  -- Marginal ved trinn 4 (980 100+): 22 + 7,6 + 16,8 = 46,4% > breakeven 44,7%
  -- Marginal ved trinn 3 (725 050-980 100): 22 + 7,6 + 13,7 = 43,3% < breakeven
  ('bracket_1_from',       226100, 'Trinnskatt trinn 1 fra-grense 2026',
   'https://www.skatteetaten.no/satser/trinnskatt/', 2026),
  ('bracket_1_rate',       0.017,  'Trinnskatt trinn 1 sats 2026 (1,7%)',
   'https://www.skatteetaten.no/satser/trinnskatt/', 2026),
  ('bracket_2_from',       318300, 'Trinnskatt trinn 2 fra-grense 2026',
   'https://www.skatteetaten.no/satser/trinnskatt/', 2026),
  ('bracket_2_rate',       0.040,  'Trinnskatt trinn 2 sats 2026 (4,0%)',
   'https://www.skatteetaten.no/satser/trinnskatt/', 2026),
  ('bracket_3_from',       725050, 'Trinnskatt trinn 3 fra-grense 2026',
   'https://www.skatteetaten.no/satser/trinnskatt/', 2026),
  ('bracket_3_rate',       0.137,  'Trinnskatt trinn 3 sats 2026 (13,7%)',
   'https://www.skatteetaten.no/satser/trinnskatt/', 2026),
  ('bracket_4_from',       980100, 'Trinnskatt trinn 4 fra-grense 2026 — skattemessig kryssingspunkt',
   'https://www.skatteetaten.no/satser/trinnskatt/', 2026),
  ('bracket_4_rate',       0.168,  'Trinnskatt trinn 4 sats 2026 (16,8%)',
   'https://www.skatteetaten.no/satser/trinnskatt/', 2026),
  ('bracket_5_from',       1467200,'Trinnskatt trinn 5 fra-grense 2026',
   'https://www.skatteetaten.no/satser/trinnskatt/', 2026),
  ('bracket_5_rate',       0.178,  'Trinnskatt trinn 5 sats 2026 (17,8%)',
   'https://www.skatteetaten.no/satser/trinnskatt/', 2026)

ON CONFLICT (key) DO UPDATE SET
  value      = EXCLUDED.value,
  year       = EXCLUDED.year,
  updated_at = NOW();
