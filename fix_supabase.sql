-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- This creates the missing table that is causing the error.

create table if not exists kv_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS) if you want strict security, 
-- or leave it open for the service role if that's what you are using.
alter table kv_store enable row level security;

-- Allow access ( Adjust policy as needed for your specific security model)
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
