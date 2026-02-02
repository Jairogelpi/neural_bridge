-- MIGRATION: Unify Experts and Authors
-- This script merges the Expert functionality into the Authors table.

-- 1. Add specialization fields to authors
ALTER TABLE public.authors 
ADD COLUMN IF NOT EXISTS domain text DEFAULT 'general',
ADD COLUMN IF NOT EXISTS specialization text[] DEFAULT '{}';

-- 2. Update jury_votes to link to authors instead of experts
-- First, check if jury_votes exists and what it references
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'jury_votes') THEN
        -- Alter column type and constraint if necessary
        ALTER TABLE public.jury_votes RENAME COLUMN expert_id TO author_id;
        ALTER TABLE public.jury_votes DROP CONSTRAINT IF EXISTS jury_votes_expert_id_fkey;
        ALTER TABLE public.jury_votes ADD CONSTRAINT jury_votes_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(author_id);
    END IF;
END $$;
