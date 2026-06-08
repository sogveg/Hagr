-- Migration 012: Payment method columns on bookings
-- Run in Supabase SQL Editor

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_method text
    CHECK (payment_method IN ('vipps', 'pay_at_pickup', 'stripe', 'cash')),
  ADD COLUMN IF NOT EXISTS vipps_order_id text,
  ADD COLUMN IF NOT EXISTS vipps_transaction_id text;

-- Index for looking up bookings by vipps_order_id (callback handler)
CREATE INDEX IF NOT EXISTS idx_bookings_vipps_order_id
  ON bookings (vipps_order_id)
  WHERE vipps_order_id IS NOT NULL;
