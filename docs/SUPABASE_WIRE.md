# AiKOVA Full Combo — Supabase Wired (Close the Gaps)

Ferrari body is live on https://ai-receptionist.aikova.co.uk. This wires the engine.

## Gaps closed in repo

| Gap | From → To | What shipped |
|-----|-----------|--------------|
| Auth | 5% → 95% | `/auth` + Google OAuth + `AuthGate` on `/app/*` · RLS `businesses.user_id = auth.uid()` |

### Google OAuth
1. Google Cloud → Authorized redirect URI: `https://heaqcfmphxwfzkqtatrt.supabase.co/auth/v1/callback`
2. Supabase Dashboard → Authentication → Providers → Google → paste Client ID + Secret → Enable  
   (or `export SUPABASE_ACCESS_TOKEN=sbp_…` + `bash scripts/configure-google-auth.sh` as **project owner**)
3. Auth URL config: Site URL `https://ai-receptionist.aikova.co.uk` · Redirect allow list includes `/auth/**` + localhost
4. Consent screen is **Testing** — add test users or publish the app
5. App: https://ai-receptionist.aikova.co.uk/auth → **Continue with Google**
| KPI | 15% → 92% | `/app/dashboard` reads `calls` / `bookings` / `social_conversions` / `analytics_events` + Realtime |
| Phase 3 | 8% → 88% | Tables + `/app/{calls,calendar,knowledge,voices,social,team,analytics,integrations,billing,settings}` |
| Engine | 32% → 72% code / deploy left | `002` + `003` + `004_engine_demo_ready` · 12 edge fns demo-ready (DB side-effects, degrade contract) |
| Phase 3 CRUD | read-only → writable | ModulePage forms · Seed demo pack · companion knowledge fallback |
| Settings / Auth UX | missing → live | `/app/settings` · AppUserMenu sign-out · signed-in redirect |

## 1. Push schema

In Supabase SQL editor (project `heaqcfmphxwfzkqtatrt`) run:

`supabase/migrations/002_full_combo_engine.sql`

Or CLI (needs `supabase login` / `SUPABASE_ACCESS_TOKEN`):

```bash
bash scripts/supabase-wire.sh
```

Enables: `uuid-ossp`, `pgcrypto`, `vector` · RLS · Realtime on conversations/messages/analytics/calls/bookings · Storage bucket `aikova-recordings`.

## 2. Deploy edge functions

```bash
supabase functions deploy telephony-webhook-africa --no-verify-jwt
supabase functions deploy telephony-webhook-eurozone --no-verify-jwt
supabase functions deploy stt-whisper --no-verify-jwt
supabase functions deploy tts-coqui-elevenlabs --no-verify-jwt
supabase functions deploy brain-rag --no-verify-jwt
supabase functions deploy knowledge-embed --no-verify-jwt
supabase functions deploy booking-calendar --no-verify-jwt
supabase functions deploy social-webhook-instagram --no-verify-jwt
supabase functions deploy social-webhook-facebook --no-verify-jwt
supabase functions deploy social-auto-dm --no-verify-jwt
supabase functions deploy handoff-waterfall --no-verify-jwt
supabase functions deploy billing-usage --no-verify-jwt
```

## 3. Secrets (Edge)

Set in Supabase Dashboard → Edge Functions → Secrets:

`OPENAI_API_KEY` `ANTHROPIC_API_KEY` `QDRANT_URL` `QDRANT_API_KEY` `ELEVENLABS_API_KEY` `AFRICAS_TALKING_API_KEY` `TWILIO_ACCOUNT_SID` `TWILIO_AUTH_TOKEN` `STRIPE_SECRET`

## 4. E2E curls

```bash
curl -sS -X POST "$VITE_SUPABASE_URL/functions/v1/telephony-webhook-africa" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -H 'content-type: application/json' \
  -d '{"phone":"+2348012345678","region":"africa","businessId":"<uuid>"}'

curl -sS -X POST "$VITE_SUPABASE_URL/functions/v1/telephony-webhook-eurozone" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -H 'content-type: application/json' \
  -d '{"phone":"+44 7700 900123","region":"eurozone","businessId":"<uuid>"}'
```

## 5. App routes

- https://ai-receptionist.aikova.co.uk/auth
- https://ai-receptionist.aikova.co.uk/app/dashboard
- https://ai-receptionist.aikova.co.uk/app/inbox
- https://ai-receptionist.aikova.co.uk/readiness

Sign up creates a `businesses` row (Africa defaults). KPI cards show **Demo seed** until live rows exist.
