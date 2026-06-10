-- Migration 004: Bil/kjørebok, Hytte/båt, Velferdstiltak
-- Run in Supabase SQL Editor

-- ─── Firmabilfordel ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS car_benefits (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id         UUID REFERENCES company_people(id) ON DELETE SET NULL,
  description         TEXT NOT NULL,
  list_price_nok      NUMERIC(12,2) NOT NULL,
  car_age_years       INT NOT NULL DEFAULT 0,
  is_electric         BOOLEAN NOT NULL DEFAULT false,
  annual_business_km  INT NOT NULL DEFAULT 0,
  months_available    INT NOT NULL DEFAULT 12,
  annual_benefit_nok  NUMERIC(12,2) NOT NULL,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE car_benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "car_benefits_company_access" ON car_benefits
  USING (
    company_id IN (
      SELECT company_id FROM company_access WHERE user_id = auth.uid()
    )
  );

-- ─── Kjørebok (mileage log) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mileage_trips (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id             UUID REFERENCES company_people(id) ON DELETE SET NULL,
  trip_date               DATE NOT NULL,
  from_location           TEXT NOT NULL,
  to_location             TEXT NOT NULL,
  purpose                 TEXT NOT NULL,
  km                      NUMERIC(8,1) NOT NULL,
  is_home_to_work         BOOLEAN NOT NULL DEFAULT false,
  reimbursement_nok       NUMERIC(10,2),
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mileage_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mileage_trips_company_access" ON mileage_trips
  USING (
    company_id IN (
      SELECT company_id FROM company_access WHERE user_id = auth.uid()
    )
  );

-- ─── Hytte/båt bruk ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cabin_boat_usage (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id            UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id           UUID REFERENCES company_people(id) ON DELETE SET NULL,
  asset_type            TEXT NOT NULL CHECK (asset_type IN ('cabin', 'boat', 'other_leisure')),
  asset_description     TEXT NOT NULL,
  usage_start           DATE NOT NULL,
  usage_end             DATE NOT NULL,
  days_used             INT NOT NULL,
  is_peak_season        BOOLEAN NOT NULL DEFAULT true,
  has_business_element  BOOLEAN NOT NULL DEFAULT false,
  employee_paid_nok     NUMERIC(10,2) NOT NULL DEFAULT 0,
  gross_benefit_nok     NUMERIC(10,2) NOT NULL,
  net_taxable_nok       NUMERIC(10,2) NOT NULL,
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cabin_boat_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cabin_boat_usage_company_access" ON cabin_boat_usage
  USING (
    company_id IN (
      SELECT company_id FROM company_access WHERE user_id = auth.uid()
    )
  );

-- ─── Velferdstiltak ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS welfare_measures (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  welfare_type                TEXT NOT NULL,
  description                 TEXT NOT NULL,
  event_date                  DATE NOT NULL,
  total_cost_nok              NUMERIC(12,2) NOT NULL,
  employee_count              INT NOT NULL,
  spouses_included            BOOLEAN NOT NULL DEFAULT false,
  is_for_all_employees        BOOLEAN NOT NULL DEFAULT true,
  has_substantial_private_element BOOLEAN NOT NULL DEFAULT false,
  cost_per_employee_nok       NUMERIC(10,2) NOT NULL,
  risk_level                  TEXT NOT NULL CHECK (risk_level IN ('green', 'yellow', 'red')),
  notes                       TEXT,
  created_at                  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE welfare_measures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "welfare_measures_company_access" ON welfare_measures
  USING (
    company_id IN (
      SELECT company_id FROM company_access WHERE user_id = auth.uid()
    )
  );
