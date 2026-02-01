# SandGuard - Transaction Firewall PWA
## Status: v0.2 — Netlify Deployment + SaaS Scaffolding ✅

### Domain
- **Production:** supersandguard.com (registered on Njalla)
- **Local dev:** http://localhost:3000 (frontend) / http://localhost:3001 (backend)

### What's Built

#### Backend API (Express + TypeScript)
- [x] GET /api/safe/:address/transactions — fetch pending txs from Safe TX Service
- [x] GET /api/safe/:address/info — fetch Safe config (owners, threshold, version)
- [x] POST /api/simulate — simulate tx (mock data, Tenderly-ready)
- [x] POST /api/decode — decode calldata (ethers.js + local ABIs + Etherscan V2)
- [x] POST /api/explain — human-readable Spanish explanation
- [x] POST /api/risk — risk scoring (green/yellow/red)
- [x] GET /api/health — health check
- [x] Express app exported for serverless wrapping
- [x] Safe TX Service URLs updated to new gateway format
- [x] Etherscan V2 API support

#### Frontend PWA (React + Vite + Tailwind)
- [x] **Landing page** — Marketing page with features, pricing, CTA
- [x] **Login page** — Auth scaffolding (email/password + wallet connect UI)
- [x] **Dashboard** — Real Safe info (address, threshold, chain, version)
- [x] **TX Queue** — Risk badges, empty state, refresh
- [x] **TX Detail** — Simulation, decode, explanation, risk, approve/reject
- [x] **Settings** — Safe config, policies, API keys
- [x] PWA installable (manifest + service worker)
- [x] Dark theme, mobile-first
- [x] Relative API paths (works with Netlify redirects)

#### Netlify Deployment
- [x] `netlify.toml` with build config + redirects + security headers
- [x] Netlify Function wrapping Express via `serverless-http`
- [x] `/api/*` → `/.netlify/functions/api/:splat` redirect
- [x] SPA fallback for client-side routing

#### SaaS Scaffolding
- [x] Landing page with pricing ($20/mo)
- [x] Login page with email + wallet connect (UI only, no auth yet)
- [x] Route structure: `/` (landing), `/login`, `/app/*` (dashboard)

### Route Structure
| Path | Component | Access |
|------|-----------|--------|
| `/` | Landing | Public |
| `/login` | Login | Public |
| `/app` | Dashboard | Authenticated* |
| `/app/queue` | TxQueue | Authenticated* |
| `/app/tx/:id` | TxDetail | Authenticated* |
| `/app/settings` | Settings | Authenticated* |

*Auth not yet implemented — all routes accessible

### Architecture
```
sand/
├── netlify.toml              # Netlify build + redirects config
├── package.json              # Root package.json
├── .env.example              # Environment variable template
├── .gitignore
├── README.md
├── STATUS.md
├── ARCHITECTURE.md
├── RESEARCH.md
├── netlify/
│   └── functions/
│       └── api.mts           # Serverless wrapper for Express app
├── frontend/                 # React PWA (Vite + Tailwind)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx   # Marketing page
│   │   │   ├── Login.tsx     # Auth scaffolding
│   │   │   ├── Dashboard.tsx
│   │   │   ├── TxQueue.tsx
│   │   │   ├── TxDetail.tsx
│   │   │   └── Settings.tsx
│   │   ├── components/
│   │   ├── context/
│   │   ├── App.tsx           # Routes
│   │   └── api.ts            # API client (relative paths)
│   └── package.json
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts          # Exports app + optional listen
│   └── package.json
└── scripts/
```

### Default Configuration
- **Safe Address:** `0x32B8057a9213C1060Bad443E43F33FaB9A7e9EC7`
- **Chain:** Ethereum Mainnet (1)
- **Threshold:** 2-of-3
- **Safe Version:** 1.4.1

### Changes in v0.2
1. **Netlify deployment:** `netlify.toml`, serverless function wrapper, redirects
2. **Backend refactored:** Express app exported for serverless; still runs standalone
3. **Frontend API:** Relative paths (works with Netlify redirects, no hardcoded localhost)
4. **Landing page:** Marketing page with features, pricing ($20/mo), CTAs
5. **Login page:** Auth scaffolding (email + wallet connect — UI only)
6. **Route restructure:** `/` → landing, `/app/*` → dashboard, `/login` → auth
7. **Branding cleanup:** All references now SandGuard (no legacy naming)
8. **Root package.json:** Build scripts, project metadata
9. **Git repo:** Initialized with .gitignore

### What's Next (v0.3)
- [ ] Auth implementation (magic link or wallet-based)
- [ ] Stripe integration ($20/mo subscription)
- [ ] Tenderly API integration for real simulation
- [ ] Push notifications for new pending txs
- [ ] Deploy to Netlify (connect supersandguard.com)
- [ ] Policy engine (auto-block unlimited approvals)
- [ ] Multi-Safe support

### Running Locally
```bash
# Backend
cd sand/backend && npx tsx src/index.ts

# Frontend (dev)
cd sand/frontend && VITE_API_URL=http://localhost:3001 npm run dev

# Frontend (production build)
cd sand/frontend && NODE_OPTIONS="--max-old-space-size=256" npx vite build

# Build backend (standalone)
cd sand/backend && npx esbuild src/index.ts --bundle --platform=node --outfile=dist/server.cjs --external:ethers --format=cjs
```

### Notes
- Backend must be built with `--format=cjs` (Express uses CommonJS)
- Pi has ~906MB RAM. Use `NODE_OPTIONS="--max-old-space-size=256"` for vite builds
- Domain: supersandguard.com (Njalla)
