-- ==========================================
-- ATHOS RUNNING STORE - DATABASE UPDATES
-- ==========================================

-- 1. ADD 'gallery' COLUMN TO 'events' TABLE
-- This fixes the error when uploading multiple photos for an event in the Admin Panel
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';


-- 2. MODIFY 'reviews' TABLE TO SUPPORT EVENTS
-- Currently, reviews point ONLY to products (product_id is NOT NULL). We need to change that.

-- Step A: Make product_id optional
ALTER TABLE public.reviews 
ALTER COLUMN product_id DROP NOT NULL;

-- Step B: Add event_id column
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE CASCADE;

-- Step C: Add a constraint to ensure a review belongs EITHER to a product OR an event
-- NOTE: If you already have data that violates this, you might need to clean it up first,
-- but since product_id was NOT NULL, all existing rows should be valid.
ALTER TABLE public.reviews
ADD CONSTRAINT check_review_target 
CHECK (
    (product_id IS NOT NULL AND event_id IS NULL) 
    OR 
    (product_id IS NULL AND event_id IS NOT NULL)
);

-- ==========================================
-- (Optional) If you haven't enabled RLS or need to ensure event reviews are readable:
-- The existing policies on 'reviews' should automatically apply to both, 
-- but you can re-run them just in case if needed.
-- ==========================================
