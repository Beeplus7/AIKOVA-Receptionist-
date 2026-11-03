#!/usr/bin/env bash
# AiKOVA Full Combo — Supabase wire: schema push + edge functions
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

PROJECT_REF="${SUPABASE_PROJECT_REF:-heaqcfmphxwfzkqtatrt}"

echo "==> Linking project $PROJECT_REF"
supabase link --project-ref "$PROJECT_REF" || true

echo "==> Pushing migrations (pgvector + RLS + Realtime + Storage)"
supabase db push

echo "==> Deploying 12 edge functions (webhooks: verify_jwt=false)"
for fn in \
  telephony-webhook-africa \
  telephony-webhook-eurozone \
  stt-whisper \
  tts-coqui-elevenlabs \
  brain-rag \
  knowledge-embed \
  booking-calendar \
  social-webhook-instagram \
  social-webhook-facebook \
  social-auto-dm \
  handoff-waterfall \
  billing-usage \
  instant-try-call \
  readiness-check
do
  echo "--- $fn"
  supabase functions deploy "$fn" --no-verify-jwt
done

echo "==> Done. Test:"
echo "curl -sS -X POST \"\$VITE_SUPABASE_URL/functions/v1/telephony-webhook-africa\" -H \"Authorization: Bearer \$VITE_SUPABASE_ANON_KEY\" -H 'content-type: application/json' -d '{\"phone\":\"+2348012345678\",\"region\":\"africa\"}'"
echo "curl -sS -X POST \"\$VITE_SUPABASE_URL/functions/v1/telephony-webhook-eurozone\" -H \"Authorization: Bearer \$VITE_SUPABASE_ANON_KEY\" -H 'content-type: application/json' -d '{\"phone\":\"+44 7700 900123\",\"region\":\"eurozone\"}'"
