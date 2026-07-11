# Standalone Migration Notes

This codebase started as `edu-platform-3`, scaffolded on the Manus.im platform.
It has been converted to run standalone — no Manus infrastructure required —
so it can be deployed anywhere (Railway, Render, a VPS, Docker, etc.).

## What changed

| Area | Before (Manus) | Now (standalone) |
|---|---|---|
| **Auth** | OAuth handoff to Manus's auth server (`server/_core/oauth.ts`, `sdk.ts` calling `webdev.v1.WebDevAuthPublicService`) | Email + password auth with bcrypt hashing + JWT sessions, fully self-contained. New endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`. |
| **AI calls** (tutor, copilot, error checker, content generation) | Proxied through `forge.manus.im/v1/chat/completions` | Direct calls to `api.anthropic.com/v1/messages`. The `invokeLLM()` function signature is unchanged, so every router that calls it needed no changes. |
| **File storage** (course media, avatars, certificates) | Presigned URLs from Manus's forge storage proxy (`/manus-storage/*`) | Direct S3 (or any S3-compatible provider — Cloudflare R2, Backblaze B2, DigitalOcean Spaces, MinIO). Routes now under `/storage/*`. Public interface (`storagePut`, `storageGet`, `storageGetSignedUrl`) is unchanged. |
| **Owner notifications** | Manus's internal Notification Service | Plain email via the app's existing `smtpService`. |
| **Dev tooling** | `@builder.io/vite-plugin-jsx-loc`, `vite-plugin-manus-runtime`, Manus debug-log collector, Manus-only `allowedHosts` in `vite.config.ts` | Removed — plain Vite + React + Tailwind config. |
| **Unused Manus template files** | `heartbeat.ts`, `map.ts`, `imageGeneration.ts`, `dataApi.ts`, `voiceTranscription.ts` in `server/_core/` — none were actually imported by any real feature router | Deleted. |

## Schema change

Added two columns to `users` (`drizzle/schema.ts`):
- `passwordHash varchar(255)` — bcrypt hash for standalone login
- `emailVerified boolean` — reserved for a future email-verification flow

Run `npm run db:push` (or your existing Drizzle migration command) against your
database after pulling this change.

## Required environment variables

See `.env.example` for the full list. At minimum, to run locally:
- `JWT_SECRET`
- `DATABASE_URL` (MySQL)

To enable AI features: `ANTHROPIC_API_KEY`.
To enable file uploads: `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` (+ `S3_ENDPOINT`/`S3_REGION` if not using plain AWS S3).

## Verified

- `npx tsc --noEmit` — passes clean, zero errors.
- `npx vitest run` — 436/441 tests pass. The 5 failures are pre-existing
  `advanced-features.test.ts` cases that need a live database connection
  (no MySQL instance in the build sandbox) — unrelated to this migration.
- Server boots standalone (`npx tsx server/_core/index.ts`) with no Manus
  dependency errors, and the new `/api/auth/*` routes respond correctly.

## Not yet done (follow-up work)

- **Frontend UI polish for email verification state**: there's no "please verify your email" banner shown yet for logged-in-but-unverified users (the `resendVerificationEmail` tRPC mutation exists and works — just isn't surfaced in the UI yet).
- **CI** (GitHub Actions) to run `npm run check` + `npm test` on every push — not set up yet.

## Update: password reset, email verification, and rate limiting (complete)

Since the initial migration above, the following were added and fully tested:

- **Email verification**: `sendVerificationEmail()` fires automatically on
  registration. New endpoints: `POST /api/auth/verify-email` (REST) and
  `auth.verifyEmail` (tRPC), plus `auth.resendVerificationEmail` for logged-in
  users. New page: `/verify-email?token=...`.
- **Password reset**: `POST /api/auth/request-password-reset` +
  `POST /api/auth/reset-password` (REST), and `auth.requestPasswordReset` +
  `auth.resetPassword` (tRPC). New pages: `/forgot-password` and
  `/reset-password?token=...`. Reset requests never reveal whether an email
  is registered (always returns success).
- Both flows use single-use, SHA-256-hashed, 1-hour-expiry tokens (see
  `server/_core/email-auth.ts`). When SMTP isn't configured (e.g. local dev),
  the email content and link are logged to the console instead of failing
  silently, so the flow stays testable without real credentials.
- **Rate limiting** added to `register`, `login`, `requestPasswordReset`, and
  `resetPassword` — both the REST routes (`express-rate-limit`) and the tRPC
  mutations (a lightweight in-memory sliding-window limiter in
  `server/_core/trpc.ts`, keyed by IP, 20 requests / 15 minutes). Fine for a
  single instance; move to a shared store (Redis) if you scale horizontally.
- **Rebranding**: all "LearnCode" / "learncode.com" references replaced with
  "Codelearnify" / "codelearnify.com" (UI text, email templates, share links,
  PWA manifest, page `<title>`). Also removed a leftover `{{project_title}}`
  template placeholder and a broken Manus analytics `<script>` tag from
  `client/index.html` that pointed at a Manus-only endpoint.
- **Deployment artifacts added**: `Dockerfile`, `.dockerignore`,
  `docker-compose.yml`, and a rewritten `DEPLOYMENT.md` with concrete Railway
  and VPS+Docker paths, plus exact Cloudflare DNS/SSL steps for
  `codelearnify.com`.

### Verified (this update)

- `npx tsc --noEmit` — clean.
- `npx vitest run` — 441/441 pass against a real MySQL database.
- `npm run build` then `node dist/index.js` — production build boots and
  serves correctly (verified homepage title, `/api/auth/*` all work).
- Manually tested end-to-end against a real MySQL database: register → email
  verification (valid token, reused token rejected, invalid token rejected) →
  password reset request → reset with real extracted token → login fails
  with old password → login succeeds with new password → reused reset token
  rejected → reset request for a non-existent email still returns success
  (no enumeration leak).
- Rate limiter confirmed: 21st login attempt within 15 minutes returns
  `429 Too Many Requests`.
