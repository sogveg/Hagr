-- Migration 007: Add unique constraint on customers.user_id
-- Required for upsert(onConflict: 'user_id') to work correctly.
-- First remove any duplicate rows (keep the oldest per user_id).

DELETE FROM customers
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM customers
  ORDER BY user_id, created_at ASC NULLS LAST
);

ALTER TABLE customers
  ADD CONSTRAINT customers_user_id_unique UNIQUE (user_id);
