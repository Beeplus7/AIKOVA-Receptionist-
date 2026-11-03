#!/usr/bin/env bash
# Enable Google provider on Supabase Auth for AiKOVA.
# Requires project OWNER Personal Access Token:
#   https://supabase.com/dashboard/account/tokens
# Usage:
#   export SUPABASE_ACCESS_TOKEN=sbp_...
#   bash scripts/configure-google-auth.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck disable=SC1091
set -a; [ -f "$ROOT/.env" ] && . "$ROOT/.env"; set +a

REF="${SUPABASE_PROJECT_REF:-heaqcfmphxwfzkqtatrt}"
CLIENT_ID="${GOOGLE_OAUTH_CLIENT_ID:?Set GOOGLE_OAUTH_CLIENT_ID in .env}"
CLIENT_SECRET="${GOOGLE_OAUTH_CLIENT_SECRET:?Set GOOGLE_OAUTH_CLIENT_SECRET in .env}"
TOKEN="${SUPABASE_ACCESS_TOKEN:?export SUPABASE_ACCESS_TOKEN=sbp_... (owner of project $REF)}"

SITE_URL="${VITE_APP_URL:-https://ai-receptionist.aikova.co.uk}"

echo "==> Patching Auth config for project $REF"
HTTP=$(curl -sS -o /tmp/aikova-auth-config.json -w '%{http_code}' \
  -X PATCH "https://api.supabase.com/v1/projects/${REF}/config/auth" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "site_url": "${SITE_URL}",
  "uri_allow_list": "${SITE_URL}/**,http://localhost:5173/**,http://127.0.0.1:5173/**",
  "external_google_enabled": true,
  "external_google_client_id": "${CLIENT_ID}",
  "external_google_secret": "${CLIENT_SECRET}"
}
EOF
)")

echo "HTTP $HTTP"
head -c 800 /tmp/aikova-auth-config.json; echo
if [ "$HTTP" != "200" ] && [ "$HTTP" != "201" ]; then
  echo "Failed — use an ACCESS TOKEN from the account that owns project $REF"
  exit 1
fi

echo ""
echo "Google Console checklist:"
echo "  Authorized redirect URI:"
echo "    https://${REF}.supabase.co/auth/v1/callback"
echo "  Authorized JavaScript origins:"
echo "    ${SITE_URL}"
echo "    http://localhost:5173"
echo "Done. Test: ${SITE_URL}/auth → Continue with Google"
