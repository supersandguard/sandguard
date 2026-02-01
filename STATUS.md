# SandGuard — Status

## v0.3.0 (2026-02-01)

### What's Live
- **Frontend:** https://sandguard.netlify.app ✅
- **Domain:** supersandguard.com (DNS propagating)
- **Backend:** Running on Pi, port 3001 (Tailscale accessible)
- **Language:** All English ✅
- **PWA:** Installable, offline-capable ✅

### Architecture
```
User Browser → sandguard.netlify.app (static frontend)
                    ↓ (API calls)
              User's Clawdbot:3001 (backend)
                    ↓
              Safe Transaction Service API
              Tenderly (simulation)
              Etherscan/Basescan (contract info)
```

### Features
- [x] Landing page (pricing, features, CTA)
- [x] Login page (wallet connect scaffold, ETH payment info)
- [x] Dashboard (Safe info, risk summary, pending tx list)
- [x] Transaction detail (decode, simulate, risk, explain)
- [x] Transaction queue
- [x] Settings (Safe address, API URL, API keys)
- [x] Payment API endpoints (info, verify, status)
- [x] Configurable API URL (each user points to their Clawdbot)
- [x] Clawdbot Skill (SKILL.md for other Clawdbots)
- [x] Dark theme, mobile-first
- [x] Auto-refresh every 30s

### Payment System
- Wallet: `0xCc75959A8Fa6ed76F64172925c0799ad94ab0B84`
- Chain: Base (ETH)
- Price: $20/month
- Flow: Send ETH → POST /api/payments/verify → Get API key

### Pending
- [ ] DNS propagation (72→75 fix)
- [ ] GitHub repo + Netlify CI/CD
- [ ] Auth persistence (JWT/sessions)
- [ ] SQLite for subscriptions (currently in-memory)
- [ ] Push notifications (webhooks to Clawdbot)
- [ ] Multi-Safe support per account
- [ ] Historical transaction log
- [ ] USDC payment option

### Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Express + TypeScript + esbuild
- Hosting: Netlify (frontend) + Pi/Clawdbot (backend)
- Chain: Ethereum mainnet, Base, Optimism, Arbitrum
