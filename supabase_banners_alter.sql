-- Correr este script en la consola SQL de Supabase para añadir los nuevos campos

ALTER TABLE public.banners
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS button_text TEXT;
