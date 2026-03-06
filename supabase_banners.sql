-- Create banners table for Home Page Hero
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    subtitle TEXT,
    image TEXT NOT NULL,
    gradient_colors TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to banners"
ON public.banners FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert/update/delete 
CREATE POLICY "Allow authenticated users to insert banners"
ON public.banners FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update banners"
ON public.banners FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete banners"
ON public.banners FOR DELETE
TO authenticated
USING (true);
