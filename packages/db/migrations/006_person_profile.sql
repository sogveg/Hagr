-- Migration 006: Ansattprofil — ekstra felt på company_people
-- Kjør i Supabase SQL Editor

ALTER TABLE company_people
  ADD COLUMN IF NOT EXISTS phone                TEXT,
  ADD COLUMN IF NOT EXISTS birth_year           INT,
  ADD COLUMN IF NOT EXISTS address              TEXT,
  ADD COLUMN IF NOT EXISTS bank_account         TEXT,
  ADD COLUMN IF NOT EXISTS notes                TEXT;

-- gifts.recipient_id fk (brukes til å koble gaver til person via id, ikke bare navn)
ALTER TABLE gifts
  ADD COLUMN IF NOT EXISTS recipient_id UUID REFERENCES company_people(id) ON DELETE SET NULL;

-- phone_internet_benefits.employee_id (allerede i 003, men sikrer det)
ALTER TABLE phone_internet_benefits
  ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES company_people(id) ON DELETE SET NULL;

-- car_benefits og mileage_trips kobling
ALTER TABLE car_benefits
  ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES company_people(id) ON DELETE SET NULL;

ALTER TABLE mileage_trips
  ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES company_people(id) ON DELETE SET NULL;
