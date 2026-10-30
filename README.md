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
