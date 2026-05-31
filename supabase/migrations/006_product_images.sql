-- 006_product_images.sql
-- Adds multi-image support to products and ensures the storage bucket exists.

-- 1. Add images array column to products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';

-- Backfill: if image_url column exists, copy it into images[]
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image_url'
  ) THEN
    UPDATE products
    SET images = ARRAY[image_url::text]
    WHERE image_url IS NOT NULL
      AND images = '{}';
  END IF;
END $$;

-- 2. Create the product-images storage bucket (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS policies for product-images bucket
-- Drop first to make idempotent (CREATE POLICY has no IF NOT EXISTS)
DROP POLICY IF EXISTS "product-images public read"       ON storage.objects;
DROP POLICY IF EXISTS "product-images authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "product-images authenticated delete" ON storage.objects;

-- Allow public read
CREATE POLICY "product-images public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload (admin check is handled in the Server Action)
CREATE POLICY "product-images authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "product-images authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
