# AIKOVA Receptionist

Marketing site + React Native (Expo) + CRM API for **AIKOVA Receptionist**.

Live domain: [ai-receptionist.aikova.co.uk](https://ai-receptionist.aikova.co.uk)

## Structure

```
aikova-receptionist/
├── apps/web/       # Vite + React marketing (11 pages)
├── apps/mobile/    # Expo mobile client
├── server/         # Express CRM API (Supabase auth)
├── deploy/         # nginx config
├── docs/           # Architecture / brand artefacts
└── scripts/        # deploy-vps.sh
```

## Marketing routes

| Path | Page |
|------|------|
| `/` | Hero Home |
| `/features` | Features |
| `/solutions` | Solutions |
| `/languages` | Languages |
| `/how-it-works` | How It Works |
| `/pricing` | Pricing |
| `/business` | Business / Revenue |
| `/customers` | Customers |
| `/resources` | Resources |
| `/company` | Company |
| `/get-started` | Final / Get Started |

## Setup

```bash
cp .env.example .env   # fill Supabase keys
cd apps/web && npm install
cd ../mobile && npm install
cd ../../server && npm install
```

## Run

```bash
npm run web          # http://localhost:5173
npm run mobile       # Expo
npm run server       # API on :3016
npm run deploy       # build + rsync to VPS
```

## Backend

- Supabase project ref: `heaqcfmphxwfzkqtatrt`
- API port: `3016` (pm2: `aikova-receptionist-api`)
- Deploy path: `/var/www/ai-receptionist`
- Live readiness JSON: `GET https://ai-receptionist.aikova.co.uk/api/readiness`
- UI: [/readiness](https://ai-receptionist.aikova.co.uk/readiness)
- Trial templates: [/trials](https://ai-receptionist.aikova.co.uk/trials)

## Production host note (not Vercel)

`ai-receptionist.aikova.co.uk` runs on **VPS + nginx + pm2**. There is a `vercel.json` for optional preview only.
Do **not** expect `vercel env add` to affect production. Put secrets in:

1. **VPS** `/var/www/ai-receptionist/server/.env` (synced from local `.env` on `npm run deploy`)
2. **Supabase Edge** secrets (`supabase secrets set …`) for edge functions

## Rotate API keys without a full rebuild

```bash
# 1) Local .env — never commit
# OPENAI_API_KEY=...
# ELEVENLABS_API_KEY=...   # or COQUI_TTS_URL=...
# AFRICAS_TALKING_USERNAME=...
# AFRICAS_TALKING_API_KEY=...
# AFRICAS_TALKING_FROM=...

# 2) Push edge secrets (no web rebuild required)
supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY"
supabase secrets set ELEVENLABS_API_KEY="$ELEVENLABS_API_KEY"   # optional if using Coqui
# supabase secrets set COQUI_TTS_URL="$COQUI_TTS_URL"
supabase secrets set AFRICAS_TALKING_USERNAME="$AFRICAS_TALKING_USERNAME"
supabase secrets set AFRICAS_TALKING_API_KEY="$AFRICAS_TALKING_API_KEY"
supabase secrets set AFRICAS_TALKING_FROM="$AFRICAS_TALKING_FROM"

# 3) Restart API only (reads VPS .env)
scp .env root@VPS:/var/www/ai-receptionist/server/.env
ssh root@VPS 'pm2 restart aikova-receptionist-api'

# 4) Confirm
curl -sS https://ai-receptionist.aikova.co.uk/api/readiness | jq .
```

Missing keys return: `API key not configured - check /readiness`.

## Trial category pages

| Path | Category |
|------|----------|
| `/trials` | Index of 5 cards |
| `/trials/estate-agents` | UK Estate Agents |
| `/trials/trades` | Plumbers / Electricians / Builders |
| `/trials/clinics` | Dental / GP / Private |
| `/trials/restaurants` | Restaurants / Takeaways |
| `/trials/salons` | Salons / Barbers / Beauty |

Forms post to `POST /api/trial-request`. Voice demo reuses `instant-try-call`.
