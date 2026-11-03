-- AiKOVA Full Combo Engine — Close the Gaps
-- One Engine Two Continents · Auth RLS · pgvector · Realtime · Storage
-- Regions: africa (af-south-1 / NDPR) · eurozone/uk (eu-central-1 / GDPR)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ---------------------------------------------------------------------------
-- Businesses — region adapter (Gap 1 Auth backbone)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('africa','eurozone','uk')),
  website_url TEXT,
  gbp_place_id TEXT,
  phone_africa TEXT,
  phone_eurozone TEXT,
  onboarding_step INT DEFAULT 1,
  onboarding_status TEXT DEFAULT 'in_progress',
  telephony_provider TEXT DEFAULT 'africas_talking'
    CHECK (telephony_provider IN ('africas_talking','twilio','vonage')),
  payment_provider TEXT DEFAULT 'm_pesa'
    CHECK (payment_provider IN ('m_pesa','flutterwave','paystack','stripe','stripe_sepa')),
  compliance TEXT DEFAULT 'ndpr'
    CHECK (compliance IN ('ndpr','gdpr','ai_act','uk_gdpr')),
  voice_id TEXT,
  voice_library TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  hours JSONB DEFAULT '{}'::jsonb,
  brand_voice TEXT,
  api_keys JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON public.businesses (user_id);
CREATE INDEX IF NOT EXISTS businesses_region_idx ON public.businesses (region);

-- ---------------------------------------------------------------------------
-- Knowledge — 815 vectors / business + Qdrant sync (Gap 3 knowledge)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  source_type TEXT CHECK (source_type IN ('website','gbp','docs','faq','playbook','service','hour')),
  title TEXT,
  content TEXT,
  url TEXT,
  embedding vector(1536),
  qdrant_id TEXT,
  token_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS knowledge_sources_business_idx ON public.knowledge_sources (business_id);
-- Create ivfflat after you have vectors (empty table can fail list build):
-- CREATE INDEX knowledge_sources_embedding_idx ON public.knowledge_sources
--   USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE TABLE IF NOT EXISTS public.playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  guardrails_on BOOLEAN DEFAULT TRUE,
  no_hallucination_outside_kb BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Gift Inbox UPRM
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  contact_name TEXT,
  contact_phone TEXT,
  contact_channel TEXT CHECK (contact_channel IN
    ('call','sms','whatsapp','instagram_dm','instagram_comment','facebook_dm','facebook_comment','web_chat','email')),
  region TEXT CHECK (region IN ('africa','eurozone','uk')),
  language TEXT,
  intent TEXT CHECK (intent IN ('booking','question','complaint','lead','payment','social_sale')),
  sentiment TEXT CHECK (sentiment IN ('positive','neutral','negative')),
  sentiment_score FLOAT,
  ai_confidence FLOAT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','open','closed')),
  preview TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS conversations_business_idx ON public.conversations (business_id);
CREATE INDEX IF NOT EXISTS conversations_status_idx ON public.conversations (business_id, status);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  from_role TEXT CHECK (from_role IN ('user','ai','human')),
  body TEXT NOT NULL,
  memory_note TEXT,
  accent_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_conversation_idx ON public.messages (conversation_id);

-- ---------------------------------------------------------------------------
-- Phase 3 tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  phone_from TEXT,
  phone_to TEXT,
  region TEXT CHECK (region IN ('africa','eurozone','uk')),
  provider TEXT CHECK (provider IN ('africas_talking','twilio','vonage')),
  status TEXT DEFAULT 'in_progress',
  duration_sec INT DEFAULT 0,
  recording_path TEXT,
  transcript TEXT,
  sentiment TEXT,
  sentiment_score FLOAT,
  missed BOOLEAN DEFAULT FALSE,
  saved_from_missed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS calls_business_idx ON public.calls (business_id);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  contact_name TEXT,
  contact_phone TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'Africa/Lagos',
  provider TEXT CHECK (provider IN ('google','outlook','calendly','internal')),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed','rescheduled','cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bookings_business_time_idx ON public.bookings (business_id, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS public.voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  region TEXT CHECK (region IN ('africa','eurozone','uk','full')),
  name TEXT NOT NULL,
  accent TEXT,
  provider TEXT CHECK (provider IN ('coqui','elevenlabs','clone')),
  language_code TEXT,
  accuracy FLOAT,
  mirroring_sec FLOAT DEFAULT 3,
  sample_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  platform TEXT CHECK (platform IN ('instagram','facebook')),
  trigger_type TEXT DEFAULT 'comment',
  trigger_text TEXT,
  auto_dm_sent BOOLEAN DEFAULT FALSE,
  auto_dm_at TIMESTAMPTZ,
  booked BOOLEAN DEFAULT FALSE,
  paid BOOLEAN DEFAULT FALSE,
  payment_provider TEXT,
  amount NUMERIC,
  currency TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  role TEXT DEFAULT 'agent',
  skills TEXT[] DEFAULT '{}',
  phone TEXT,
  emergency BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  waterfall_order INT DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  channel TEXT,
  region TEXT,
  language TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  value NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_events_business_idx ON public.analytics_events (business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON public.analytics_events (business_id, event_type);

CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  status TEXT DEFAULT 'connected' CHECK (status IN ('connected','disconnected','error')),
  config JSONB DEFAULT '{}'::jsonb,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (business_id, provider)
);

CREATE TABLE IF NOT EXISTS public.billing_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('starter','growth','scale','enterprise')),
  currency TEXT CHECK (currency IN ('USD','EUR','GBP','NGN','KES')),
  minutes NUMERIC DEFAULT 0,
  conversations INT DEFAULT 0,
  sms INT DEFAULT 0,
  amount NUMERIC DEFAULT 0,
  period_start DATE,
  period_end DATE,
  invoice_url TEXT,
  payment_provider TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- RLS — businesses.user_id = auth.uid()
-- ---------------------------------------------------------------------------
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_usage ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_business_owner(bid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = bid AND b.user_id = auth.uid()
  );
$$;

DROP POLICY IF EXISTS "owners manage businesses" ON public.businesses;
CREATE POLICY "owners manage businesses" ON public.businesses
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "owners manage knowledge" ON public.knowledge_sources;
CREATE POLICY "owners manage knowledge" ON public.knowledge_sources
  FOR ALL TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

DROP POLICY IF EXISTS "owners manage playbooks" ON public.playbooks;
CREATE POLICY "owners manage playbooks" ON public.playbooks
  FOR ALL TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

DROP POLICY IF EXISTS "owners manage conversations" ON public.conversations;
CREATE POLICY "owners manage conversations" ON public.conversations
  FOR ALL TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

DROP POLICY IF EXISTS "owners manage messages" ON public.messages;
CREATE POLICY "owners manage messages" ON public.messages
  FOR ALL TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

DROP POLICY IF EXISTS "owners manage calls" ON public.calls;
CREATE POLICY "owners manage calls" ON public.calls
  FOR ALL TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

DROP POLICY IF EXISTS "owners manage bookings" ON public.bookings;
CREATE POLICY "owners manage bookings" ON public.bookings
  FOR ALL TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

DROP POLICY IF EXISTS "owners manage voices" ON public.voices;
CREATE POLICY "owners manage voices" ON public.voices
  FOR ALL TO authenticated
  USING (business_id IS NULL OR public.is_business_owner(business_id))
  WITH CHECK (business_id IS NULL OR public.is_business_owner(business_id));

DROP POLICY IF EXISTS "owners manage social" ON public.social_conversions;
CREATE POLICY "owners manage social" ON public.social_conversions
  FOR ALL TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

DROP POLICY IF EXISTS "owners manage team" ON public.team_members;
CREATE POLICY "owners manage team" ON public.team_members
  FOR ALL TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

DROP POLICY IF EXISTS "owners manage analytics" ON public.analytics_events;
CREATE POLICY "owners manage analytics" ON public.analytics_events
  FOR ALL TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

DROP POLICY IF EXISTS "owners manage integrations" ON public.integrations;
CREATE POLICY "owners manage integrations" ON public.integrations
  FOR ALL TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

DROP POLICY IF EXISTS "owners manage billing" ON public.billing_usage;
CREATE POLICY "owners manage billing" ON public.billing_usage
  FOR ALL TO authenticated
  USING (public.is_business_owner(business_id))
  WITH CHECK (public.is_business_owner(business_id));

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_events;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.calls;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Storage — aikova-recordings (GDPR 30-day retention policy note in docs)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'aikova-recordings',
  'aikova-recordings',
  false,
  52428800,
  ARRAY['audio/mpeg','audio/wav','audio/ogg','audio/webm','application/json']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "owners read recordings" ON storage.objects;
CREATE POLICY "owners read recordings" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'aikova-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "owners upload recordings" ON storage.objects;
CREATE POLICY "owners upload recordings" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'aikova-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "owners update recordings" ON storage.objects;
CREATE POLICY "owners update recordings" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'aikova-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "owners delete recordings" ON storage.objects;
CREATE POLICY "owners delete recordings" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'aikova-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
