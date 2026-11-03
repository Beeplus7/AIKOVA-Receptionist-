-- Credit AKC wallet after Stripe Checkout (service_role / webhook)

CREATE OR REPLACE FUNCTION public.akc_credit_stripe_pack(
  p_user_id UUID,
  p_pack_key TEXT,
  p_stripe_session_id TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bid UUID;
  pack public.akc_packs%ROWTYPE;
  idem TEXT;
  res jsonb;
BEGIN
  IF p_user_id IS NULL OR p_pack_key IS NULL OR p_stripe_session_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'missing_args');
  END IF;

  SELECT id INTO bid
  FROM public.businesses
  WHERE user_id = p_user_id
  ORDER BY created_at ASC
  LIMIT 1;

  IF bid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'no_business');
  END IF;

  SELECT * INTO pack FROM public.akc_packs WHERE pack_key = p_pack_key AND active = true;
  IF pack.pack_key IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_pack');
  END IF;

  idem := 'stripe:' || p_stripe_session_id;
  res := public._akc_apply_credit(
    bid,
    pack.akc_amount,
    'stripe_pack',
    'stripe.pack.' || pack.pack_key,
    idem,
    jsonb_build_object(
      'pack_key', pack.pack_key,
      'stripe_session_id', p_stripe_session_id,
      'akc_amount', pack.akc_amount
    ),
    p_user_id
  );

  RETURN res || jsonb_build_object('business_id', bid, 'pack_key', pack.pack_key);
END;
$$;

-- Only service role should call this (webhook). Revoke from authenticated/anon.
REVOKE ALL ON FUNCTION public.akc_credit_stripe_pack(UUID, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.akc_credit_stripe_pack(UUID, TEXT, TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.akc_credit_stripe_pack(UUID, TEXT, TEXT) TO service_role;
