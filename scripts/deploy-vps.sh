#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${VPS_HOST:-87.106.103.43}"
USER="${VPS_USER:-root}"
REMOTE="${VPS_DEPLOY_PATH:-/var/www/ai-receptionist}"
SSH_KEY="${VPS_SSH_KEY_PATH:-$HOME/.ssh/aikova_receptionist_deploy}"
SSH_OPTS=(-i "$SSH_KEY" -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new)

cd "$ROOT"

if [[ ! -f "$ROOT/.env" ]]; then
  echo "Missing $ROOT/.env — copy from .env.example first." >&2
  exit 1
fi

echo "==> Building web"
(cd apps/web && npm run build)

echo "==> Syncing to ${USER}@${HOST}:${REMOTE}"
ssh "${SSH_OPTS[@]}" "${USER}@${HOST}" "mkdir -p '${REMOTE}/web' '${REMOTE}/server'"

rsync -az --delete -e "ssh ${SSH_OPTS[*]}" \
  apps/web/dist/ "${USER}@${HOST}:${REMOTE}/web/"

rsync -az -e "ssh ${SSH_OPTS[*]}" \
  --exclude node_modules \
  --exclude data \
  server/ "${USER}@${HOST}:${REMOTE}/server/"

scp "${SSH_OPTS[@]}" "$ROOT/.env" "${USER}@${HOST}:${REMOTE}/server/.env"
scp "${SSH_OPTS[@]}" "$ROOT/deploy/nginx-ai-receptionist.conf" "${USER}@${HOST}:/etc/nginx/sites-available/ai-receptionist"

ssh "${SSH_OPTS[@]}" "${USER}@${HOST}" bash -s <<REMOTE
set -euo pipefail
cd ${REMOTE}/server
npm install --omit=dev
pm2 delete aikova-receptionist-api >/dev/null 2>&1 || true
pm2 start index.js --name aikova-receptionist-api --cwd ${REMOTE}/server
pm2 save
ln -sfn /etc/nginx/sites-available/ai-receptionist /etc/nginx/sites-enabled/ai-receptionist
nginx -t
systemctl reload nginx
REMOTE

echo "==> Deployed to https://ai-receptionist.aikova.co.uk"
