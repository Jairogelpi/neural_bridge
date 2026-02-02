-- Tenants (minimal)
create table if not exists tenants (
  tenant_id uuid primary key,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

create table if not exists devices (
  device_id uuid primary key,
  tenant_id uuid not null references tenants(tenant_id),
  install_id text not null unique,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  risk_score double precision not null default 0
);

-- Authors Table (The Identity Layer)
create table if not exists authors (
  author_id uuid primary key default gen_random_uuid(),
  name text not null,
  handle text not null unique, -- e.g., @sarah_chen_med
  tier text not null default 'community', -- community | verified | certified | trusted
  reputation double precision not null default 0.5,
  public_key text not null, -- ECDSA P-256 Public Key for verifying Crystal signatures
  verified_credentials jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Bridge runs (must exist before reputation_ledger)
create table if not exists bridge_runs (
  run_id bigserial primary key,
  tenant_id uuid not null references tenants(tenant_id),
  device_id uuid not null references devices(device_id),
  context_id uuid, -- Link to crystal if applicable
  target_host text not null,
  decision text not null, -- ACCEPT|FAIL
  score double precision not null default 0,
  ladder_last_level text null,
  provider text null,
  model text null,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  cost_usd_est double precision not null default 0,
  extension_version text null,
  created_at timestamptz not null default now(),
  ladder_steps jsonb not null default '[]'::jsonb,
  receipt jsonb null
);

-- 🛡️ Fix for existing deployments: Add missing Phase 6 columns
alter table bridge_runs add column if not exists extension_version text null;
alter table bridge_runs add column if not exists receipt jsonb null;

-- Crystals Table
create table if not exists crystals (
  context_id uuid primary key,
  tenant_id uuid not null references tenants(tenant_id),
  device_id uuid not null references devices(device_id),
  author_id uuid references authors(author_id),
  scp_version text not null,
  version text not null default '1.0.0',
  tier text not null default 'community',
  created_at timestamptz not null default now(),
  canonical_hash text not null,
  quality_score double precision not null default 0,
  compiler_version text not null,
  crystal_jsonb jsonb not null
);

-- 🛡️ Fix for existing deployments: Add missing Phase 6 columns
alter table crystals add column if not exists author_id uuid references authors(author_id);
alter table crystals add column if not exists version text not null default '1.0.0';
alter table crystals add column if not exists tier text not null default 'community';

-- Reputation Ledger (The Economic Layer)
create table if not exists reputation_ledger (
  id bigserial primary key,
  author_id uuid not null references authors(author_id),
  run_id bigint not null references bridge_runs(run_id),
  delta double precision not null,
  new_reputation double precision not null,
  reason text null,
  created_at timestamptz not null default now()
);

-- Key-Value Store for Poly-Storage Fallback
create table if not exists kv_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table kv_store enable row level security;

-- Allow access (Adjust policy as needed for your specific security model)
create policy "Allow all access to authenticated users"
on kv_store for all
to authenticated
using (true)
with check (true);

create policy "Allow all access to service role"
on kv_store for all
to service_role
using (true)
with check (true);

-- Indices
create index if not exists crystals_author_idx on crystals(author_id);
create index if not exists reputation_ledger_author_idx on reputation_ledger(author_id, created_at desc);
create index if not exists bridge_runs_tenant_created_idx on bridge_runs (tenant_id, created_at desc);

