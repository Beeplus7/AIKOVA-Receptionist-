-- AiKOVA — close no-secret engine gaps
-- Global voice library seed · realtime for social/team · playbook helper

-- Seed global Voice Mesh rows (business_id null = shared library)
INSERT INTO public.voices (business_id, region, name, accent, provider, language_code, accuracy, mirroring_sec)
SELECT v.business_id, v.region, v.name, v.accent, v.provider, v.language_code, v.accuracy, v.mirroring_sec
FROM (VALUES
  (NULL::uuid, 'africa'::text, 'Lagos Warm'::text, 'Nigerian English'::text, 'coqui'::text, 'en-NG'::text, 0.94::float, 3::float),
  (NULL, 'africa', 'Accra Smooth', 'Ghanaian English', 'coqui', 'en-GH', 0.93, 3),
  (NULL, 'africa', 'Nairobi Clear', 'Kenyan English', 'coqui', 'en-KE', 0.92, 3),
  (NULL, 'eurozone', 'Paris Soft', 'French', 'elevenlabs', 'fr-FR', 0.96, 3),
  (NULL, 'eurozone', 'Berlin Precise', 'German', 'elevenlabs', 'de-DE', 0.95, 3),
  (NULL, 'uk', 'London Neutral', 'British English', 'elevenlabs', 'en-GB', 0.97, 3)
) AS v(business_id, region, name, accent, provider, language_code, accuracy, mirroring_sec)
WHERE NOT EXISTS (
  SELECT 1 FROM public.voices x WHERE x.business_id IS NULL AND x.name = v.name
);

-- Realtime for modules that ModulePage / handoff use
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.social_conversions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.team_members;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.integrations;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.knowledge_sources;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Helper: mark onboarding complete (callable from SPA)
CREATE OR REPLACE FUNCTION public.mark_onboarding_complete(p_region text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  bid uuid;
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authenticated');
  END IF;
  SELECT id INTO bid FROM public.businesses WHERE user_id = uid ORDER BY created_at ASC LIMIT 1;
  IF bid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'no_business');
  END IF;
  UPDATE public.businesses SET
    onboarding_status = 'complete',
    onboarding_step = 8,
    region = COALESCE(NULLIF(p_region, ''), region),
    updated_at = NOW()
  WHERE id = bid;
  RETURN jsonb_build_object('ok', true, 'business_id', bid);
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_onboarding_complete(text) TO authenticated;
