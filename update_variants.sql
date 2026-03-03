-- ==========================================
-- ATHOS RUNNING STORE - VARIANTS MIGRATION
-- ==========================================
-- Run this script in the Supabase SQL Editor
-- to add the 'variants' JSONB column and clean up old fields.

-- 1. Add the new flexible variants column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- 2. (Optional) Drop the old static secondary color columns
-- If you already have products using these, you might want to manually 
-- migrate them first. Otherwise, it is safe to drop them to keep the DB clean.
ALTER TABLE public.products 
DROP COLUMN IF EXISTS secondary_color_name,
DROP COLUMN IF EXISTS secondary_color_image;
