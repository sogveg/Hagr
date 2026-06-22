-- Migration 009: Odometer columns for mobile kjørebok
-- Run in Supabase SQL Editor

ALTER TABLE mileage_trips
  ADD COLUMN IF NOT EXISTS odometer_start      INT,
  ADD COLUMN IF NOT EXISTS odometer_end        INT,
  ADD COLUMN IF NOT EXISTS started_at          TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ended_at            TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS start_photo_url     TEXT,
  ADD COLUMN IF NOT EXISTS end_photo_url       TEXT;
