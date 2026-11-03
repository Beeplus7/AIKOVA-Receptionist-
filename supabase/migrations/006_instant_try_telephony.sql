-- Instant-try real calling config + rate limits (no signup)

create table if not exists public.telephony_config (
  id text primary key default 'default',
  twilio_from text,
  provider text default 'twilio',
  updated_at timestamptz not null default now()
);

insert into public.telephony_config (id, provider)
values ('default', 'twilio')
on conflict (id) do nothing;

create table if not exists public.instant_try_calls (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  region text not null default 'eurozone',
  lang text not null default 'en',
  provider text not null default 'twilio',
  provider_call_id text,
  status text not null default 'queued',
  mode text not null default 'live',
  error text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists instant_try_calls_phone_created_idx
  on public.instant_try_calls (phone, created_at desc);

alter table public.telephony_config enable row level security;
alter table public.instant_try_calls enable row level security;

-- service role only (edge functions); no public policies
