-- =============================================================
-- TinyRent — Migration 003: Fixes + Cleaning log + Seasonal prices
-- =============================================================

-- ── Fix: add missing columns to damage_reports ────────────────
-- Run this even if the table exists (002 may have skipped it)
ALTER TABLE damage_reports
  ADD COLUMN IF NOT EXISTS reported_by text NOT NULL DEFAULT 'admin'
    CHECK (reported_by IN ('admin', 'customer'));

ALTER TABLE damage_reports
  ADD COLUMN IF NOT EXISTS severity text
    CHECK (severity IN ('minor', 'moderate', 'severe'));

ALTER TABLE damage_reports
  ADD COLUMN IF NOT EXISTS description text;

ALTER TABLE damage_reports
  ADD COLUMN IF NOT EXISTS photo_url text;

ALTER TABLE damage_reports
  ADD COLUMN IF NOT EXISTS amount_charged numeric(10,2);

-- ── cleaning_logs ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cleaning_logs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id uuid NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  cleaned_by        text NOT NULL DEFAULT 'TinyRent',
  cleaned_at        timestamptz NOT NULL DEFAULT now(),
  notes             text,
  created_at        timestamptz DEFAULT now()
);

ALTER TABLE cleaning_logs ENABLE ROW LEVEL SECURITY;
-- Service role only (admin-managed)

-- ── seasonal_prices ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seasonal_prices (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name        text NOT NULL,          -- e.g. "Sommer", "Jul"
  start_month int NOT NULL CHECK (start_month BETWEEN 1 AND 12),
  start_day   int NOT NULL CHECK (start_day BETWEEN 1 AND 31),
  end_month   int NOT NULL CHECK (end_month BETWEEN 1 AND 12),
  end_day     int NOT NULL CHECK (end_day BETWEEN 1 AND 31),
  price_day   numeric(10,2),
  price_week  numeric(10,2),
  price_month numeric(10,2),
  active      boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE seasonal_prices ENABLE ROW LEVEL SECURITY;
-- Service role only (admin-managed)

-- Public can read active seasonal prices (for booking panel display)
CREATE POLICY "public_read_seasonal_prices" ON seasonal_prices
  FOR SELECT USING (active = true);
