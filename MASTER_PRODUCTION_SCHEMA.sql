-- ==========================================
-- NEURAL BRIDGE OMEGA: MASTER PRODUCTION SCHEMA
-- ==========================================
-- This file contains the complete, unified database structure.
-- It merges the existing multi-tenant architecture with 
-- the decentralized "Omega" logic (Crystals, Jury, Vaccines, Sentinel).

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. FOUNDATION TABLES
CREATE TABLE IF NOT EXISTS public.tenants (
  tenant_id uuid NOT NULL,
  plan text NOT NULL DEFAULT 'free'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tenants_pkey PRIMARY KEY (tenant_id)
);

CREATE TABLE IF NOT EXISTS public.authors (
  author_id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  handle text NOT NULL UNIQUE,
  tier text NOT NULL DEFAULT 'community'::text,
  reputation double precision NOT NULL DEFAULT 0.5,
  public_key text NOT NULL,
  verified_credentials jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT authors_pkey PRIMARY KEY (author_id)
);

CREATE TABLE IF NOT EXISTS public.devices (
  device_id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES public.tenants(tenant_id),
  install_id text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_seen_at timestamp with time zone NOT NULL DEFAULT now(),
  risk_score double precision NOT NULL DEFAULT 0,
  CONSTRAINT devices_pkey PRIMARY KEY (device_id)
);

-- 2. KNOWLEDGE BASE (EVOLVED)
-- Merged: Current Schema + Omega Logic Columns
CREATE TABLE IF NOT EXISTS public.crystals (
  context_id uuid NOT NULL,
  tenant_id uuid NOT NULL REFERENCES public.tenants(tenant_id),
  device_id uuid NOT NULL REFERENCES public.devices(device_id),
  author_id uuid REFERENCES public.authors(author_id),
  
  -- Omega Metadata
  domain text NOT NULL DEFAULT 'general',
  scp_version text NOT NULL DEFAULT '1.0',
  version text NOT NULL DEFAULT '1.0.0',
  tier text NOT NULL DEFAULT 'community',
  
  -- The Core Container (Full JSON backup)
  crystal_jsonb jsonb NOT NULL,
  
  -- Indexed fields for O(1) Search/Ranking
  canonical_hash text NOT NULL,
  quality_score double precision NOT NULL DEFAULT 0,
  compiler_version text NOT NULL DEFAULT 'omega-v1',
  rlm_stats jsonb DEFAULT '{"q_score": 0.5, "usage_count": 0, "volatility": 1.0}',
  tags text[] DEFAULT '{}',
  
  -- Intent & Entities (for direct SQL filtering if needed)
  intent jsonb DEFAULT '{"primary": "unknown", "status": "active"}',
  entities jsonb DEFAULT '[]',
  constraints jsonb DEFAULT '[]',
  verification jsonb DEFAULT '{}',
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT crystals_pkey PRIMARY KEY (context_id)
);

CREATE INDEX IF NOT EXISTS idx_crystals_domain ON public.crystals(domain);
CREATE INDEX IF NOT EXISTS idx_crystals_tags ON public.crystals USING GIN (tags);

-- 3. SEMANTIC IMMUNITY (VACCINES)
CREATE TABLE IF NOT EXISTS public.vaccines (
    vaccine_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    fallacy_type text NOT NULL,
    meta_invariant jsonb NOT NULL,
    error_signature_hash text UNIQUE,
    context_domain text,
    severity integer DEFAULT 1,
    potency integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

CREATE OR REPLACE FUNCTION increment_vaccine_potency(vid uuid)
RETURNS void AS $$
BEGIN
    UPDATE vaccines 
    SET potency = potency + 1, severity = severity + 1
    WHERE vaccine_id = vid;
END;
$$ LANGUAGE plpgsql;

-- 4. ASSOCIATIVE MEMORY & UTILITY
CREATE TABLE IF NOT EXISTS public.kv_store (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.idempotency (
  tenant_id uuid NOT NULL REFERENCES public.tenants(tenant_id),
  device_id uuid NOT NULL REFERENCES public.devices(device_id),
  idem_key text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  response_json jsonb NOT NULL,
  CONSTRAINT idempotency_pkey PRIMARY KEY (tenant_id, device_id, idem_key)
);

-- 5. TELEMETRY & LEDGERS
CREATE TABLE IF NOT EXISTS public.bridge_runs (
  run_id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(tenant_id),
  device_id uuid NOT NULL REFERENCES public.devices(device_id),
  context_id uuid NOT NULL REFERENCES public.crystals(context_id),
  target_host text NOT NULL,
  decision text NOT NULL,
  score double precision NOT NULL DEFAULT 0,
  ladder_last_level text,
  provider text,
  model text,
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  cost_usd_est double precision NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  ladder_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  extension_version text
);

CREATE TABLE IF NOT EXISTS public.provider_cost_ledger (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(tenant_id),
  device_id uuid NOT NULL REFERENCES public.devices(device_id),
  context_id uuid REFERENCES public.crystals(context_id),
  provider text NOT NULL,
  model text NOT NULL,
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  cost_usd_est double precision NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reputation_ledger (
  id bigserial PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES public.authors(author_id),
  run_id bigint NOT NULL REFERENCES public.bridge_runs(run_id),
  delta double precision NOT NULL,
  new_reputation double precision NOT NULL,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 6. HUMAN JURY (DECENTRALIZED ORACLE)
CREATE TABLE IF NOT EXISTS public.experts (
    expert_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    public_key text UNIQUE NOT NULL,
    domain text NOT NULL,
    reputation float DEFAULT 0.5
);

CREATE TABLE IF NOT EXISTS public.jury_cases (
    case_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    context_id uuid REFERENCES public.crystals(context_id),
    status text DEFAULT 'pending',
    issue_description text,
    consensus_score_ai float,
    final_decision text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.jury_votes (
    vote_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id uuid REFERENCES public.jury_cases(case_id),
    expert_id uuid REFERENCES public.experts(expert_id),
    decision text NOT NULL,
    signature text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 7. OBSERVABILITY (SENTINEL)
CREATE TABLE IF NOT EXISTS public.sentinel_logs (
    log_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    type text NOT NULL,
    severity text NOT NULL,
    message text NOT NULL,
    details jsonb DEFAULT '{}',
    timestamp timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- 8. SECURITY & SESSIONS
CREATE TABLE IF NOT EXISTS public.sessions (
  session_id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(tenant_id),
  device_id uuid NOT NULL REFERENCES public.devices(device_id),
  session_token_hash text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  revoked_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.verify_telemetry (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(tenant_id),
  device_id uuid NOT NULL REFERENCES public.devices(device_id),
  context_id uuid NOT NULL REFERENCES public.crystals(context_id),
  target_host text NOT NULL,
  decision text NOT NULL,
  score double precision NOT NULL,
  ladder_steps jsonb NOT NULL,
  extension_version text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 9. BOOTSTRAP (INITIAL STATE)
INSERT INTO public.experts (name, public_key, domain, reputation)
VALUES ('Genesis Oracle', 'NB_SIG_GENESIS_GATEWAY_O1', 'logic', 1.0)
ON CONFLICT (public_key) DO NOTHING;

-- LIQUIDATION: Wipe Mocks (Run at your own risk)
-- DELETE FROM kv_store WHERE key LIKE 'nb_cc_%';
