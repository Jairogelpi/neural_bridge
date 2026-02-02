-- MIGRATION: Add Authentication Fields to Authors
-- This script adds email and password_hash to the authors table.

ALTER TABLE public.authors 
ADD COLUMN IF NOT EXISTS email text UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash text;

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_authors_email ON public.authors(email);
