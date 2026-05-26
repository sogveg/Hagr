-- Legg til image_url-kolonnen i products-tabellen
-- Kjør dette i Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Oppdater eksisterende produkter med placeholder-bilder basert på slug
UPDATE products SET image_url = '/images/products/soving.jpg'    WHERE slug = 'moonboon-hengekøye';
UPDATE products SET image_url = '/images/products/soving.jpg'    WHERE slug = 'snuzpod-4';
UPDATE products SET image_url = '/images/products/vogner.jpg'    WHERE slug = 'babyzen-yoyo2';
UPDATE products SET image_url = '/images/products/babyutstyr.jpg' WHERE slug = 'babybjorn-balansevipp';
UPDATE products SET image_url = '/images/products/babyutstyr.jpg' WHERE slug = 'stokke-tripp-trapp';
UPDATE products SET image_url = '/images/products/vogner.jpg'    WHERE slug = 'cybex-cloud-z2';
