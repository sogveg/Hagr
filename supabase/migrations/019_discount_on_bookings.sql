-- Add discount support to bookings
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS discount_code_id uuid,
  ADD COLUMN IF NOT EXISTS discount_amount  integer NOT NULL DEFAULT 0;
