-- Migration 017: Track when customer accepted rental agreement
alter table bookings
  add column if not exists agreement_accepted_at timestamptz;
