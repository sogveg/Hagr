-- Migration 007: Utvidet selskapsinformasjon fra onboarding
-- Kjør i Supabase SQL Editor

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS uses_phone_for_work       BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS company_pays_phone        BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS works_from_home           BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS company_pays_internet     BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS has_company_car           BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS uses_private_car_for_biz  BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS has_cabin_boat            BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS holds_board_meetings      BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS holds_strategy_gatherings BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS has_client_entertainment  BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS approx_annual_profit      INTEGER,
  ADD COLUMN IF NOT EXISTS current_owner_salary      INTEGER,
  ADD COLUMN IF NOT EXISTS aga_zone                  TEXT DEFAULT 'zone1',
  ADD COLUMN IF NOT EXISTS onboarding_completed      BOOLEAN DEFAULT FALSE;
