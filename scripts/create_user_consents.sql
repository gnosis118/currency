-- Supabase SQL: Create user_consents table with RLS
-- Run this in the Supabase SQL editor

create extension if not exists pgcrypto;

create table if not exists public.user_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  agree_to_terms boolean not null,
  agree_to_privacy boolean not null,
  consented_at timestamptz not null,
  provider text,
  recaptcha_score numeric,
  user_agent text,
  ip text,
  created_at timestamptz not null default now()
);

alter table public.user_consents enable row level security;

-- Policies: users can insert/select their own rows
create policy if not exists "insert_own_consent"
  on public.user_consents
  for insert
  with check (auth.uid() = user_id);

create policy if not exists "select_own_consent"
  on public.user_consents
  for select
  using (auth.uid() = user_id);

-- Optional: allow updates by owner
create policy if not exists "update_own_consent"
  on public.user_consents
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

