-- Per-product dates and amounts on booking_items
ALTER TABLE booking_items ADD COLUMN IF NOT EXISTS start_date   date;
ALTER TABLE booking_items ADD COLUMN IF NOT EXISTS end_date     date;
ALTER TABLE booking_items ADD COLUMN IF NOT EXISTS rental_amount integer;
ALTER TABLE booking_items ADD COLUMN IF NOT EXISTS deposit_amount integer;

-- Which product a damage report concerns (optional)
ALTER TABLE damage_reports ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES products(id) ON DELETE SET NULL;
