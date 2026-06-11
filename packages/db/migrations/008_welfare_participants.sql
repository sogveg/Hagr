-- Migration 008: Deltakerliste og alkohol-type på velferdstiltak
-- Kjør i Supabase SQL Editor

ALTER TABLE welfare_measures
  ADD COLUMN IF NOT EXISTS event_name            TEXT,
  ADD COLUMN IF NOT EXISTS food_cost_per_person  NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS alcohol_served        TEXT DEFAULT 'none'
    CHECK (alcohol_served IN ('none', 'beer_wine', 'spirits')),
  ADD COLUMN IF NOT EXISTS participants          TEXT[],   -- liste av navn
  ADD COLUMN IF NOT EXISTS participant_count     INT,
  ADD COLUMN IF NOT EXISTS venue                 TEXT,
  ADD COLUMN IF NOT EXISTS is_tax_free           BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS is_deductible         BOOLEAN DEFAULT TRUE;

-- Indeks for oppslag per selskap + år
CREATE INDEX IF NOT EXISTS welfare_measures_company_date
  ON welfare_measures(company_id, event_date);
