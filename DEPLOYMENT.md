# Codelearnify Deployment Guide

This app is a standalone Node.js/Express + React app (see `MIGRATION.md` for
the conversion away from Manus.im). It needs somewhere to *run* a persistent
Node process (not a static host, and not Cloudflare Pages/Workers on its own —
this isn't an edge-compatible app because of the MySQL connection and
Node-native dependencies).

Two supported paths below. Either works well with `codelearnify.com` on
Cloudflare — Cloudflare only needs to handle DNS (+ optional proxy/CDN) in
front of wherever the app actually runs.

## Pre-deployment checklist

- [x] Standalone auth (email/password + JWT) — done, tested
- [x] Password reset + email verification — done, tested
- [x] AI features wired to the Anthropic API directly
- [x] File storage wired to direct S3 (or R2/B2/Spaces/MinIO)
- [x] All 441 tests passing against a real MySQL database
- [x] Production build (`npm run build`) verified working
- [ ] Real `ANTHROPIC_API_KEY`, `S3_*`, and `SMTP_*` credentials (you'll add these at deploy time)
- [ ] Stripe keys, if you want live billing

---

## Option A: Railway (simplest — recommended to start)

Railway runs the Node app and gives you a managed MySQL with almost no setup.

1. **Push this repo** — already done: `github.com/wafmproject/cla-edu-platform`.
2. **Create a Railway project** → "Deploy from GitHub repo" → select `cla-edu-platform`.
3. **Add a MySQL database** in the same Railway project (Railway → New → Database → MySQL). It gives you a `DATABASE_URL` automatically — copy it.
4. **Set environment variables** on the app service (Railway → Variables), using `.env.example` as the checklist:
   - `JWT_SECRET` — generate with `openssl rand -base64 48`
   - `DATABASE_URL` — from step 3
   - `APP_URL` — `https://codelearnify.com` (used to build links in verification/reset emails)
   - `ANTHROPIC_API_KEY` — from console.anthropic.com
   - `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` (+ `S3_ENDPOINT`/`S3_REGION` if using R2/B2/Spaces instead of AWS)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `OWNER_EMAIL`
   - `NODE_ENV=production`
5. **Run the DB migration once**, from your machine (with Railway's `DATABASE_URL` set locally) or via Railway's shell:
   ```bash
   DATABASE_URL="<railway mysql url>" npm run db:push
   ```
6. **Custom domain**: Railway → Settings → Networking → "Custom Domain" → enter `codelearnify.com` (and/or `www.codelearnify.com`). Railway gives you a CNAME target.
7. **Cloudflare DNS**: in the Cloudflare dashboard for `codelearnify.com`:
   - Add a CNAME record: `codelearnify.com` (or `www`) → the Railway target Railway gave you.
   - SSL/TLS mode: set to **Full (strict)** (Railway terminates TLS with a valid cert, so strict works and is safest).
   - You can leave the record proxied (orange cloud) for Cloudflare's CDN/DDoS protection, or grey-cloud it (DNS only) if you'd rather Railway's cert be hit directly — both work; proxied is generally fine.
8. Visit `https://codelearnify.com` once DNS propagates (usually minutes).

Render and Fly.io both work the same way (git-based deploy + managed Postgres/MySQL add-on or an external managed DB + custom domain + Cloudflare CNAME) if you'd rather use one of those instead of Railway.

---

## Option B: Your own VPS with Docker + Cloudflare

Use this if you want full control (e.g. a Hetzner/DigitalOcean droplet) instead of a managed platform.

1. **Provision a small VPS** (2 vCPU / 4GB RAM is plenty to start) with Docker installed.
2. **Clone the repo** on the VPS:
   ```bash
   git clone https://github.com/wafmproject/cla-edu-platform.git
   cd cla-edu-platform
   cp .env.example .env   # fill in real values
   ```
3. **Use a managed MySQL** (recommended — PlanetScale, or your VPS provider's managed DB) rather than the bundled `db` service in `docker-compose.yml`, so backups/failover aren't your problem. If you do want a self-hosted DB, `docker-compose.yml` includes a `db` service — just change the default passwords first.
4. **Build and run**:
   ```bash
   docker compose up -d --build
   ```
   (Or without compose: `docker build -t codelearnify . && docker run -d -p 3000:3000 --env-file .env codelearnify`)
5. **Run the migration** against your database:
   ```bash
   DATABASE_URL="<your db url>" npm run db:push
   ```
6. **Put a reverse proxy in front** (Caddy or nginx) for TLS termination, or terminate TLS at Cloudflare instead:
   - **Simplest**: Cloudflare DNS record → your VPS IP, proxied (orange cloud) — Cloudflare handles public-facing TLS for you. Set Cloudflare SSL/TLS mode to **Flexible** only if your origin serves plain HTTP on port 3000 (fine to start, but for real security run Caddy with automatic HTTPS on the origin and switch Cloudflare to **Full (strict)**).
   - **More robust**: install [Caddy](https://caddyserver.com/) on the VPS as a reverse proxy in front of the Docker container — it gets you free auto-renewing certs — then set Cloudflare to **Full (strict)**.
7. Point DNS: Cloudflare → `codelearnify.com` → A record → your VPS's public IP.

---

## Environment variables reference

See `.env.example` in the repo root for the full list with comments. Required at minimum: `JWT_SECRET`, `DATABASE_URL`. Required for AI features: `ANTHROPIC_API_KEY`. Required for uploads: the `S3_*` vars. Required for verification/reset emails to actually send (rather than just log): the `SMTP_*` vars.

## Verifying after deploy

Quick smoke test once it's live:
```bash
curl -s https://codelearnify.com/api/auth/me
# expect: {"user":null}

curl -s -X POST https://codelearnify.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@codelearnify.com","password":"a-real-password","name":"Test"}'
# expect: {"user":{"id":...}} and a verification email in your inbox
```

## Not yet done (follow-up work)

- CI (GitHub Actions) to run `npm run check` + `npm test` on every push — not set up yet.
- Automated DB backups — depends on which managed DB you choose; most (PlanetScale, Railway, RDS) offer this built-in, just needs enabling.
- Rate limiting on `/api/auth/*` (register/login/reset) to slow down brute-force/abuse — not yet added.
