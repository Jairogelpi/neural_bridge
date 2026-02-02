-- MIGRATION: Fix Crystals Table Schema
-- This script adds the missing columns required by the Omega engine.

ALTER TABLE public.crystals 
ADD COLUMN IF NOT EXISTS domain text NOT NULL DEFAULT 'general',
ADD COLUMN IF NOT EXISTS rlm_stats jsonb DEFAULT '{"q_score": 0.5, "usage_count": 0, "volatility": 1.0}',
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS intent jsonb DEFAULT '{"primary": "unknown", "status": "active"}',
ADD COLUMN IF NOT EXISTS entities jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS constraints jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS verification jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_crystals_domain ON public.crystals(domain);
CREATE INDEX IF NOT EXISTS idx_crystals_tags ON public.crystals USING GIN (tags);

-- Fix primary key if not set (should be context_id)
-- ALTER TABLE public.crystals ADD PRIMARY KEY (context_id);
