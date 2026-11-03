-- AiKOVA Credits (AKC) — prepaid usage currency (VisaGuide VGC-inspired)
-- Anchor: 10,000 AKC ≈ $25 / €25 (Starter runway)
-- Wallets are business-scoped. Plans allot monthly AKC; overage settles in AKC.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Admins ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.akc_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.akc_admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_akc_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.akc_admins a WHERE a.user_id = auth.uid()
  );
$$;

DROP POLICY IF EXISTS akc_admins_self_read ON public.akc_admins;
CREATE POLICY akc_admins_self_read ON public.akc_admins
  FOR SELECT USING (auth.uid() = user_id OR public.is_akc_admin());

CREATE OR REPLACE FUNCTION public.akc_bootstrap_admin()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  cnt int;
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authenticated');
  END IF;
  SELECT count(*) INTO cnt FROM public.akc_admins;
  IF cnt > 0 AND NOT public.is_akc_admin() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'admins_exist');
  END IF;
  INSERT INTO public.akc_admins (user_id, note)
  VALUES (uid, 'bootstrap')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN jsonb_build_object('ok', true, 'user_id', uid);
END;
$$;

-- ── Wallets (per business) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.akc_wallets (
  business_id UUID PRIMARY KEY REFERENCES public.businesses(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  total_gifted INTEGER NOT NULL DEFAULT 0,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter','growth','scale','enterprise')),
  welcome_claimed BOOLEAN NOT NULL DEFAULT false,
  trial_ends_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.akc_wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS akc_wallets_owner ON public.akc_wallets;
CREATE POLICY akc_wallets_owner ON public.akc_wallets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
    OR public.is_akc_admin()
  );

-- ── Append-only ledger ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.akc_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL CHECK (entry_type IN (
    'welcome','trial','stripe_pack','mpesa_pack','spend','gift','sponsor',
    'influencer','voucher','adjust','refund','plan_allotment'
  )),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  service_id TEXT,
  idempotency_key TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (idempotency_key)
);

CREATE INDEX IF NOT EXISTS akc_ledger_biz_idx ON public.akc_ledger (business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS akc_ledger_type_idx ON public.akc_ledger (entry_type, created_at DESC);

ALTER TABLE public.akc_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS akc_ledger_owner_read ON public.akc_ledger;
CREATE POLICY akc_ledger_owner_read ON public.akc_ledger
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.user_id = auth.uid()
    )
    OR public.is_akc_admin()
  );

-- ── Packs (reload runway) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.akc_packs (
  pack_key TEXT PRIMARY KEY,
  akc_amount INTEGER NOT NULL CHECK (akc_amount > 0),
  usd_cents INTEGER NOT NULL CHECK (usd_cents > 0),
  eur_cents INTEGER NOT NULL CHECK (eur_cents > 0),
  label TEXT NOT NULL,
  popular BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO public.akc_packs (pack_key, akc_amount, usd_cents, eur_cents, label, popular) VALUES
  ('akc_10k',  10000,  2500,  2500,  'Starter runway +10k', false),
  ('akc_35k',  35000,  7900,  7900,  'Growth runway +35k', true),
  ('akc_50k',  50000,  9900,  9900,  'Power +50k', false),
  ('akc_100k', 100000, 19900, 19900, 'Scale runway +100k', false),
  ('akc_150k', 150000, 27900, 27900, 'Max +150k', false)
ON CONFLICT (pack_key) DO UPDATE SET
  akc_amount = excluded.akc_amount,
  usd_cents = excluded.usd_cents,
  eur_cents = excluded.eur_cents,
  label = excluded.label,
  popular = excluded.popular,
  active = true;

ALTER TABLE public.akc_packs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS akc_packs_read ON public.akc_packs;
CREATE POLICY akc_packs_read ON public.akc_packs FOR SELECT USING (active = true);

-- ── Usage rates ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.akc_rates (
  service_id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  akc_cost INTEGER NOT NULL CHECK (akc_cost >= 0),
  unit TEXT NOT NULL DEFAULT 'each',
  active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.akc_rates (service_id, label, category, akc_cost, unit) VALUES
  ('voice.min',       'Voice call minute',     'telephony', 20,   'minute'),
  ('sms.out',         'Outbound SMS',          'messaging', 15,   'message'),
  ('conversation',    'Full conversation',     'messaging', 50,   'each'),
  ('tts.1k_chars',    'TTS 1k characters',     'voice',     10,   '1k_chars'),
  ('storage.gb_mo',   'Storage GB / month',    'storage',   100,  'gb_mo'),
  ('voice.clone',     'Custom voice clone',    'voice',     5000, 'each'),
  ('social.auto_dm',  'Social auto-DM close',  'social',    80,   'each')
ON CONFLICT (service_id) DO UPDATE SET
  label = excluded.label,
  category = excluded.category,
  akc_cost = excluded.akc_cost,
  unit = excluded.unit,
  active = true,
  updated_at = now();

ALTER TABLE public.akc_rates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS akc_rates_read ON public.akc_rates;
CREATE POLICY akc_rates_read ON public.akc_rates FOR SELECT USING (active = true);

-- ── Vouchers ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.akc_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  akc_amount INTEGER NOT NULL CHECK (akc_amount > 0),
  issued_limit INTEGER NOT NULL DEFAULT 0 CHECK (issued_limit >= 0),
  redeemed_count INTEGER NOT NULL DEFAULT 0 CHECK (redeemed_count >= 0),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  note TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS akc_vouchers_code_idx ON public.akc_vouchers (code);
ALTER TABLE public.akc_vouchers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS akc_vouchers_admin_all ON public.akc_vouchers;
CREATE POLICY akc_vouchers_admin_all ON public.akc_vouchers
  FOR ALL USING (public.is_akc_admin()) WITH CHECK (public.is_akc_admin());

-- ── Influencer / sponsor pools ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.akc_influencer_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT NOT NULL,
  pool_kind TEXT NOT NULL DEFAULT 'influencer' CHECK (pool_kind IN ('influencer','sponsor','partner')),
  pool_akc INTEGER NOT NULL CHECK (pool_akc >= 0),
  distributed_akc INTEGER NOT NULL DEFAULT 0 CHECK (distributed_akc >= 0),
  link_clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  commission_cents INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.akc_influencer_pools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS akc_influencer_pools_admin_all ON public.akc_influencer_pools;
CREATE POLICY akc_influencer_pools_admin_all ON public.akc_influencer_pools
  FOR ALL USING (public.is_akc_admin()) WITH CHECK (public.is_akc_admin());

-- ── Free trial allocations log ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.akc_trial_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  akc_amount INTEGER NOT NULL,
  days INTEGER NOT NULL DEFAULT 14,
  note TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.akc_trial_allocations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS akc_trials_admin_all ON public.akc_trial_allocations;
CREATE POLICY akc_trials_admin_all ON public.akc_trial_allocations
  FOR ALL USING (public.is_akc_admin()) WITH CHECK (public.is_akc_admin());

-- ── Core credit helper ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public._akc_apply_credit(
  p_business_id UUID,
  p_amount INTEGER,
  p_entry_type TEXT,
  p_service_id TEXT,
  p_idempotency_key TEXT,
  p_meta JSONB DEFAULT '{}'::jsonb,
  p_created_by UUID DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  w public.akc_wallets%ROWTYPE;
  new_bal INTEGER;
BEGIN
  IF p_amount = 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'zero_amount');
  END IF;

  INSERT INTO public.akc_wallets (business_id)
  VALUES (p_business_id)
  ON CONFLICT (business_id) DO NOTHING;

  SELECT * INTO w FROM public.akc_wallets WHERE business_id = p_business_id FOR UPDATE;

  -- idempotent
  IF EXISTS (SELECT 1 FROM public.akc_ledger WHERE idempotency_key = p_idempotency_key) THEN
    RETURN jsonb_build_object('ok', true, 'idempotent', true, 'balance', w.balance);
  END IF;

  new_bal := w.balance + p_amount;
  IF new_bal < 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'insufficient', 'balance', w.balance);
  END IF;

  UPDATE public.akc_wallets SET
    balance = new_bal,
    total_earned = total_earned + GREATEST(p_amount, 0),
    total_spent = total_spent + GREATEST(-p_amount, 0),
    total_gifted = total_gifted + CASE WHEN p_entry_type IN ('gift','sponsor','influencer','trial','welcome') AND p_amount > 0 THEN p_amount ELSE 0 END,
    updated_at = now()
  WHERE business_id = p_business_id;

  INSERT INTO public.akc_ledger (
    business_id, entry_type, amount, balance_after, service_id, idempotency_key, meta, created_by
  ) VALUES (
    p_business_id, p_entry_type, p_amount, new_bal, p_service_id, p_idempotency_key, COALESCE(p_meta, '{}'::jsonb), p_created_by
  );

  RETURN jsonb_build_object('ok', true, 'balance', new_bal, 'amount', p_amount);
END;
$$;

CREATE OR REPLACE FUNCTION public.akc_ensure_wallet(p_business_id UUID DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bid UUID := p_business_id;
BEGIN
  IF bid IS NULL THEN
    SELECT id INTO bid FROM public.businesses WHERE user_id = auth.uid() ORDER BY created_at ASC LIMIT 1;
  END IF;
  IF bid IS NULL THEN
    RAISE EXCEPTION 'no_business';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.businesses b WHERE b.id = bid AND (b.user_id = auth.uid() OR public.is_akc_admin())
  ) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  INSERT INTO public.akc_wallets (business_id) VALUES (bid) ON CONFLICT DO NOTHING;
  RETURN bid;
END;
$$;

CREATE OR REPLACE FUNCTION public.akc_get_wallet(p_business_id UUID DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bid UUID;
  w public.akc_wallets%ROWTYPE;
BEGIN
  bid := public.akc_ensure_wallet(p_business_id);
  SELECT * INTO w FROM public.akc_wallets WHERE business_id = bid;
  RETURN jsonb_build_object(
    'business_id', w.business_id,
    'balance', w.balance,
    'total_earned', w.total_earned,
    'total_spent', w.total_spent,
    'total_gifted', w.total_gifted,
    'plan', w.plan,
    'welcome_claimed', w.welcome_claimed,
    'trial_ends_at', w.trial_ends_at
  );
END;
$$;

-- Welcome / free trial: 5,000 AKC + 14 days
CREATE OR REPLACE FUNCTION public.akc_claim_welcome(p_business_id UUID DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bid UUID;
  w public.akc_wallets%ROWTYPE;
  res jsonb;
BEGIN
  bid := public.akc_ensure_wallet(p_business_id);
  SELECT * INTO w FROM public.akc_wallets WHERE business_id = bid FOR UPDATE;
  IF w.welcome_claimed THEN
    RETURN jsonb_build_object('ok', true, 'already', true, 'balance', w.balance);
  END IF;
  res := public._akc_apply_credit(
    bid, 5000, 'welcome', 'trial.welcome',
    'welcome:' || bid::text,
    jsonb_build_object('days', 14),
    auth.uid()
  );
  UPDATE public.akc_wallets SET
    welcome_claimed = true,
    trial_ends_at = now() + interval '14 days',
    updated_at = now()
  WHERE business_id = bid;
  INSERT INTO public.akc_trial_allocations (business_id, akc_amount, days, note, created_by)
  VALUES (bid, 5000, 14, 'auto welcome trial', auth.uid());
  RETURN res || jsonb_build_object('trial_akc', 5000, 'trial_days', 14);
END;
$$;

CREATE OR REPLACE FUNCTION public.akc_spend(
  p_service_id TEXT,
  p_units NUMERIC DEFAULT 1,
  p_idempotency_key TEXT DEFAULT NULL,
  p_business_id UUID DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bid UUID;
  rate public.akc_rates%ROWTYPE;
  cost INTEGER;
  key TEXT;
BEGIN
  bid := public.akc_ensure_wallet(p_business_id);
  SELECT * INTO rate FROM public.akc_rates WHERE service_id = p_service_id AND active;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'unknown_service');
  END IF;
  cost := CEIL(rate.akc_cost * GREATEST(p_units, 0))::integer;
  IF cost <= 0 THEN
    RETURN jsonb_build_object('ok', true, 'amount', 0);
  END IF;
  key := COALESCE(p_idempotency_key, 'spend:' || bid::text || ':' || p_service_id || ':' || gen_random_uuid()::text);
  RETURN public._akc_apply_credit(
    bid, -cost, 'spend', p_service_id, key,
    jsonb_build_object('units', p_units, 'unit', rate.unit),
    auth.uid()
  );
END;
$$;

-- Admin gift by business id or owner email
CREATE OR REPLACE FUNCTION public.akc_admin_gift(
  p_amount INTEGER,
  p_note TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_business_id UUID DEFAULT NULL,
  p_entry_type TEXT DEFAULT 'gift'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bid UUID := p_business_id;
  uid UUID;
  res jsonb;
  etype TEXT := COALESCE(p_entry_type, 'gift');
BEGIN
  IF NOT public.is_akc_admin() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'forbidden');
  END IF;
  IF p_amount IS NULL OR p_amount < 1 OR p_amount > 500000 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_amount');
  END IF;
  IF etype NOT IN ('gift','sponsor','influencer','trial','adjust') THEN
    etype := 'gift';
  END IF;

  IF bid IS NULL AND p_email IS NOT NULL THEN
    SELECT u.id INTO uid FROM auth.users u WHERE lower(u.email) = lower(p_email) LIMIT 1;
    IF uid IS NULL THEN
      RETURN jsonb_build_object('ok', false, 'error', 'user_not_found');
    END IF;
    SELECT id INTO bid FROM public.businesses WHERE user_id = uid ORDER BY created_at ASC LIMIT 1;
  END IF;

  IF bid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'business_not_found');
  END IF;

  res := public._akc_apply_credit(
    bid, p_amount, etype, 'admin.' || etype,
    'admin:' || etype || ':' || bid::text || ':' || gen_random_uuid()::text,
    jsonb_build_object('note', p_note, 'email', p_email),
    auth.uid()
  );

  IF etype = 'trial' THEN
    INSERT INTO public.akc_trial_allocations (business_id, akc_amount, days, note, created_by)
    VALUES (bid, p_amount, 14, p_note, auth.uid());
    UPDATE public.akc_wallets SET trial_ends_at = GREATEST(COALESCE(trial_ends_at, now()), now()) + interval '14 days'
    WHERE business_id = bid;
  END IF;

  RETURN res || jsonb_build_object('business_id', bid, 'email', p_email, 'entry_type', etype);
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_akc_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.akc_bootstrap_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.akc_ensure_wallet(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.akc_get_wallet(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.akc_claim_welcome(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.akc_spend(TEXT, NUMERIC, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.akc_admin_gift(INTEGER, TEXT, TEXT, UUID, TEXT) TO authenticated;
