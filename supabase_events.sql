-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    description TEXT,
    distances TEXT[] DEFAULT '{}',
    image TEXT,
    status TEXT DEFAULT 'upcoming',
    is_featured BOOLEAN DEFAULT false,
    max_participants INTEGER DEFAULT 0,
    current_participants INTEGER DEFAULT 0,
    organizer_id TEXT,
    photos_link TEXT,
    price INTEGER DEFAULT 0,
    duration TEXT,
    gradient_colors TEXT[] DEFAULT '{}',
    reward TEXT,
    days_left INTEGER,
    participants INTEGER,
    difficulty TEXT,
    type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to events"
ON public.events FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert/update/delete (in a real app this would check admin/organizer role)
CREATE POLICY "Allow authenticated users to insert events"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update events"
ON public.events FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete events"
ON public.events FOR DELETE
TO authenticated
USING (true);
