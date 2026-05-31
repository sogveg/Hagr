-- 006_product_images.sql
-- Adds multi-image support to products and ensures the storage bucket exists.

-- 1. Add images array column to products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';

-- Backfill: if a product has image_url set and images is empty, put image_url into images[1]
UPDATE products
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND images = '{}';

-- 2. Create the product-images storage bucket (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS policies for product-images bucket
-- Allow public read
CREATE POLICY IF NOT EXISTS "product-images public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload (admin check is handled in the Server Action)
CREATE POLICY IF NOT EXISTS "product-images authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to delete their own uploads
CREATE POLICY IF NOT EXISTS "product-images authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
