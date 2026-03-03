-- ==========================================
-- ATHOS RUNNING STORE - PRODUCTS SCHEMA
-- ==========================================
-- Run this script in the Supabase SQL Editor
-- to enable persistent products and variants.

-- 1. Create the products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    rating NUMERIC DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    description TEXT,
    specs JSONB,
    tags TEXT[] DEFAULT '{}',
    is_customizable BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 0,
    sku TEXT,
    secondary_color_name TEXT,
    secondary_color_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (everyone can see products)
CREATE POLICY "Enable read access for all users"
    ON public.products FOR SELECT
    USING (true);

-- Allow admins to insert/update/delete products
CREATE POLICY "Enable insert for authenticated users"
    ON public.products FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
    ON public.products FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users"
    ON public.products FOR DELETE
    USING (auth.role() = 'authenticated');

-- 2. Create the Storage Bucket for Product Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS is usually enabled by default on storage.objects by Supabase

-- Allow public read access to product images
CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
