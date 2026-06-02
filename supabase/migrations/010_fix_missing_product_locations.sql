-- =============================================================
-- TinyRent — Migration 010: Fix missing product_locations rows
-- =============================================================
-- Products created via the admin panel before this fix had
-- a silent insert error (unknown column category_id), which
-- meant no product_locations row was ever created for them.
-- This migration inserts the missing rows, defaulting to Bergen.
-- =============================================================

INSERT INTO product_locations (product_id, location_id)
SELECT
  p.id        AS product_id,
  l.id        AS location_id
FROM products p
CROSS JOIN locations l
WHERE l.slug = 'bergen'
  AND NOT EXISTS (
    SELECT 1
    FROM product_locations pl
    WHERE pl.product_id = p.id
  )
ON CONFLICT DO NOTHING;
