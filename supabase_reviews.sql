-- ==========================================
-- ATHOS RUNNING STORE - REVIEWS SCHEMA
-- ==========================================

-- Requires the pg_crypto extension for uuid_generate_v4() if not enabled.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access (everyone can see reviews)
CREATE POLICY "Enable read access for all users"
    ON public.reviews FOR SELECT
    USING (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Enable insert for authenticated users"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Allow admins to delete or update reviews if necessary
CREATE POLICY "Enable delete for authenticated users"
    ON public.reviews FOR DELETE
    USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- 2. Create the Storage Bucket for Review Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage
CREATE POLICY "Review Images Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'review-images');

CREATE POLICY "Review Images Authenticated users can upload"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'review-images' AND auth.role() = 'authenticated');
