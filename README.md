# Microstock Metadata Generator

AI-powered metadata generator for microstock contributors. Upload images and
instantly get optimized **titles, descriptions, keywords and categories**,
then copy or export them as platform-ready CSVs (Adobe Stock, Shutterstock,
Freepik/Magnific, Vecteezy, Dreamstime, 123RF, Depositphotos, Pond5).

**The whole site is admin-only.** Visitors cannot sign up or log in — only
authorized Google accounts (listed in `admin_users`) can enter the site and
use the generator or the Admin Panel.

Fork this repository, connect your own Supabase project + Vercel deployment,
and you have your own private, branded metadata tool.

## Highlights

- **Full CSV Tree Generator parity**: Metadata mode + Image-to-Prompt mode,
  per-platform tiles, title/keyword length sliders, prefix/suffix, negative
  words, prohibited words, single-word keywords, silhouette/transparent
  toggles, custom instructions, PNG auto-note, filename extension override,
  prompts .TXT/.CSV exports, batch stats with ETA, stop button and one
  automatic retry of failed images.
- **13-provider BYOK system**: add your own API keys (Groq, Gemini, OpenAI,
  OpenRouter, Mistral, Cloudflare, NVIDIA, GitHub Models, Cohere, Together,
  SambaNova, DeepInfra, Cerebras) from the in-app API Keys modal — with
  multi-key rotation, automatic cross-provider fallback, RPM throttling,
  cooldown/rehab badges and tutorial links. A server env key works as a
  fallback when no personal keys are configured.
- **Admin Panel**: dashboard, site settings, branding (logo/favicon/colors),
  theme, generator settings, AI status, admin management, usage logs.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Tech Stack](#3-tech-stack)
4. [Requirements](#4-requirements)
5. [GitHub Setup / Fork Instructions](#5-github-setup--fork-instructions)
6. [Local Installation](#6-local-installation)
7. [Environment Variables](#7-environment-variables)
8. [Supabase Project Creation](#8-supabase-project-creation)
9. [Supabase Database Setup (Migrations)](#9-supabase-database-setup-migrations)
10. [Supabase Storage](#10-supabase-storage)
11. [Google OAuth Setup](#11-google-oauth-setup)
12. [Admin Setup (First Admin)](#12-admin-setup-first-admin)
13. [AI API Setup](#13-ai-api-setup)
14. [Local Development](#14-local-development)
15. [Vercel Deployment](#15-vercel-deployment)
16. [Production Setup Checklist](#16-production-setup-checklist)
17. [Custom Domain](#17-custom-domain)
18. [Admin Panel Usage](#18-admin-panel-usage)
19. [Site Branding & Theme Configuration](#19-site-branding--theme-configuration)
20. [Updating the Project](#20-updating-the-project)
21. [Troubleshooting](#21-troubleshooting)
22. [Security Notes](#22-security-notes)

---

## 1. Project Overview

```
Official GitHub Repository
        ↓ Fork
User's GitHub Repository
        ↓
User's Supabase Project  (database + auth + storage)
        ↓
Vercel Deployment
        ↓
Your own Metadata Website
```

- Fully standalone — no dependency on any external production service.
- Public generator is open to everyone; no user registration exists at all.
- Admin-only authentication via **Google OAuth through Supabase Auth**.
- All branding/theme/settings live in your database, editable from `/admin`.
- Database changes ship as versioned SQL migrations for easy future updates.

## 2. Features

**Access**
- Entire site gated behind Google login (middleware-level redirect)
- Only `admin_users` rows with `status = 'active'` can enter
- No registration, no passwords — Google OAuth only

**Generator (admin-only, CSV Tree parity)**
- Two modes: **Metadata** and **Image-to-Prompt** (`?mode=img2prompt`)
- Metadata: title/description/keywords/category (+ Freepik prompt & base model)
- Controls: platform tiles (9 platforms), title length min/max sliders,
  keywords count min/max sliders, prefix/suffix, negative title words,
  negative keywords, negative prompt words, prohibited words,
  single-word keywords, silhouette, transparent background, white
  background, camera parameters, custom AI instructions
- PNG files automatically get "isolated on transparent background" phrasing
- Bulk queue with progress stats (done/total/success/failed + ETA),
  Stop button, and one automatic retry of failed images
- Deterministic enforcement: word-boundary truncation, banned-word
  stripping, prefix/suffix application, keyword dedupe/cap

**BYOK API keys (13 providers)**
- Add your own keys per browser; multi-key rotation per provider
- Automatic fallback across providers on failure/rate limit
- Client RPM throttling per provider limits
- Key health badges: READY / ACTIVE / retry-in-Xm cooldowns
- Tutorial links to every provider's key page + free-tier info

**Export**
- Platform templates: General, Adobe Stock, Shutterstock, Magnific (freepik),
  Vecteezy, 123RF, Dreamstime, Depositphotos, Pond5
- Filename extension override (eps/ai/svg/jpg/png/psd...)
- CSV / JSON / TXT exports; prompt mode adds all-prompts .TXT/.CSV
- Local browser history of recent generations

**Admin (`/admin`, Google login required)**
- Dashboard: total generations, last-24h generations, recent activity
- Site Settings: site name, description, footer text
- Branding: logo & favicon upload (Supabase Storage), primary/secondary color
- Theme: default light/dark/system, preset colors, custom HEX colors
- Generator Settings: title/description/keyword bounds, category list,
  language, extra AI instructions, batch size, hourly rate limit
  (0 = unlimited)
- AI Settings: read-only status of the server env fallback key
- Admins: add/disable/remove admin Google accounts from the UI
- Usage: system-level generation log (no personal data)

## 3. Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Framework | Next.js (App Router) + TypeScript   |
| Styling   | Tailwind CSS v4                     |
| Database  | Supabase PostgreSQL (+ RLS)         |
| Auth      | Supabase Auth (Google provider)     |
| Storage   | Supabase Storage (branding assets)  |
| Hosting   | Vercel                              |

## 4. Requirements

- A GitHub account
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free tier works)
- Node.js 20+ locally if you want to develop/run locally
- An API key from one supported AI provider:

| Provider       | `AI_PROVIDER` | Notes                                  |
| -------------- | ------------- | -------------------------------------- |
| Groq           | `groq`        | Default. Free tier, Llama vision model |
| OpenAI         | `openai`      | Paid                                   |
| Google Gemini  | `gemini`      | Free tier available                    |
| OpenRouter     | `openrouter`  | Free tier available                    |
| Mistral        | `mistral`     | Pixtral vision model                   |
| Custom         | `custom`      | Any OpenAI-compatible endpoint via `AI_BASE_URL` |

## 5. GitHub Setup / Fork Instructions

1. Open the official repository page on GitHub.
2. Click **Fork** → **Create fork**. You now have your own copy, e.g.
   `https://github.com/<your-username>/microstock-metadata-generator`.
3. Everything below uses *your* Supabase project and *your* keys.
   Never reuse anyone else's credentials.

> Keep your fork's visibility public or private as you prefer — just make
> sure you never commit real secrets (`.env*` files are git-ignored;
> `.env.example` documents what is needed).

## 6. Local Installation

```bash
git clone https://github.com/<your-username>/microstock-metadata-generator.git
cd microstock-metadata-generator
npm install
cp .env.example .env.local    # then edit .env.local (see next section)
```

## 7. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable                       | Where to find it                                |
| ------------------------------ | ----------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`     | Supabase → Project Settings → API               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Supabase → Project Settings → API               |
| `SUPABASE_SERVICE_ROLE_KEY`    | Supabase → Project Settings → API (server-only) |
| `AI_PROVIDER`                  | Your choice (see table above)                   |
| `AI_API_KEY`                   | Your AI provider's API key                      |
| `AI_MODEL` *(optional)*        | Override the default model                      |
| `ADMIN_EMAIL` *(optional)*     | Bootstrap allowlist for the first admin         |
| `NEXT_PUBLIC_APP_URL`          | e.g. `http://localhost:3000` locally            |

> `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security. It is used only
> inside server code (API routes / server components) and must never be
> exposed to the browser or committed to git.

## 8. Supabase Project Creation

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Choose a name, a strong database password, and a region near your users.
3. Wait for provisioning, then open **Project Settings → API** and copy the
   URL, anon key and service_role key into your environment variables.

## 9. Supabase Database Setup (Migrations)

All tables ship as SQL migrations in `supabase/migrations/`:

```
0001_admin_users.sql          - admin authorization table
0002_site_settings.sql        - branding/theme/site settings (single row)
0003_generator_settings.sql   - generator defaults (single row)
0004_usage_logs.sql           - system generation log
0005_rls.sql                  - Row Level Security policies
0006_storage.sql              - storage buckets + policies
```

**Option A — SQL Editor (easiest):**

1. In Supabase open **SQL Editor** → **New query**.
2. Open each migration file from this repo, paste its full contents and
   click **Run**, in order (`0001` → `0006`).
3. Verify under **Table Editor**: `admin_users`, `site_settings`,
   `generator_settings`, `usage_logs` exist.

**Option B — Supabase CLI:**

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Future updates will add new numbered migrations — run them the same way.

## 10. Supabase Storage

Migration `0006_storage.sql` creates two buckets automatically:

- `branding-assets` (**public**) — logo/favicon uploads from the Admin Panel.
- `generator-images` (private) — reserved for future features.

No manual step is needed after running the migration. Generator image
processing itself is transient (in-memory base64), so nothing piles up in
storage.

## 11. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create (or select) a project → **APIs & Services → Credentials**.
3. **Create Credentials → OAuth client ID → Web application**.
4. Under **Authorized redirect URIs** add BOTH:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
   The first lets Supabase complete the OAuth handshake; the second is used
   by this app during local development.
5. Copy the **Client ID** and **Client Secret**.
6. In Supabase: **Authentication → Providers → Google** → enable, paste the
   Client ID and Secret → Save.
7. In **Authentication → URL Configuration**, set:
   - Site URL: `http://localhost:3000` (local) or your production URL.
   - Additional redirect URLs: `http://localhost:3000/**`,
     `https://<your-domain>/**`.

This app intentionally supports **Google sign-in only** — there are no
email/password accounts anywhere.

## 12. Admin Setup (First Admin)

There is no user registration. The first admin must be created manually:

**Method A — bootstrap env var (recommended):**

1. Set `ADMIN_EMAIL=you@gmail.com` in `.env.local` (and later in Vercel).
2. Visit `/login` → **Continue with Google** using that exact account.
3. The app detects the matching email and creates an active row in
   `admin_users` automatically.
4. You now have access to `/admin`. You may remove `ADMIN_EMAIL` afterwards
   — authorization is database-driven once the row exists.

**Method B — via Supabase dashboard:**

1. Visit `/login` → **Continue with Google** (this creates the Auth user).
2. In Supabase go to **Authentication → Users** and copy the user's **UID**.
3. Open **SQL Editor** and run:
   ```sql
   insert into public.admin_users (user_id, email, status)
   values ('<paste-uid>', 'you@gmail.com', 'active');
   ```
4. Log in again at `/login` → you can now open `/admin`.

To revoke an admin later:

```sql
update public.admin_users set status = 'disabled' where email = 'someone@gmail.com';
```

## 13. AI API Setup

You have two options — use either or both:

**Option A: your own keys in the browser (BYOK, recommended)**

1. Sign in as admin and open the generator.
2. Click **API Keys** in the Controls panel.
3. Pick a provider, follow its docs link to create a free key
   (Groq is the default recommendation: <https://console.groq.com/keys>),
   paste it and press **Add**.
4. Repeat for any other providers you want as automatic fallbacks.

Keys are stored only in your browser (never on the server) and rotate
automatically with cross-provider fallback and RPM throttling.

**Option B: one server-side key via environment variables**

Set `AI_PROVIDER` + `AI_API_KEY` (see section 7). This key is used whenever
no personal keys are configured, entirely server-side.

Supported providers: `groq` (default), `openai`, `gemini`, `openrouter`,
`mistral`, `cloudflare`, `nvidia`, `github`, `cohere`, `together`,
`sambanova`, `deepinfra`, `cerebras`, or any OpenAI-compatible endpoint via
`AI_PROVIDER=custom` + `AI_BASE_URL`.

All generation requests flow through `/api/generate` which validates the
admin session, applies per-IP rate limits (optional - set
**Rate Limit / Hour = 0** in Admin → Generator Settings for unlimited
generation) and logs usage.

## 14. Local Development

```bash
npm install
cp .env.example .env.local   # fill values first
npm run dev                  # http://localhost:3000
```

Useful checks:

```bash
npm run lint     # ESLint
npx tsc --noEmit # TypeScript
npm run build    # production build
```

## 15. Vercel Deployment

1. Push your fork to GitHub (all commits on `main` deploy automatically).
2. In Vercel: **Add New → Project** → import your forked repository.
3. Framework preset is detected (Next.js). No build tweaks needed.
4. Open **Settings → Environment Variables** and add all variables from
   section 7 — including `SUPABASE_SERVICE_ROLE_KEY` and `AI_API_KEY`.
   Set `NEXT_PUBLIC_APP_URL` to your final production URL.
5. Click **Deploy**.
6. After the first deploy, update:
   - Supabase → Authentication → URL Configuration → Site URL =
     `https://<your-app>.vercel.app` (or your custom domain).
   - Google Cloud redirect URI already covers Supabase's callback; nothing
     else changes.

Every future `git push` to `main` triggers an automatic deployment.

## 16. Production Setup Checklist

- [ ] Migrations `0001`–`0006` executed in your Supabase project
- [ ] Google provider enabled in Supabase Auth with correct redirect URIs
- [ ] All env vars set in Vercel (including `SUPABASE_SERVICE_ROLE_KEY`,
      `AI_API_KEY`)
- [ ] First admin created (section 12)
- [ ] `/login` works and `/admin` opens for the admin only
- [ ] Generator produces metadata end-to-end
- [ ] Branding/theme changes reflect on the public site

## 17. Custom Domain

1. Vercel → your project → **Domains** → add your domain and follow the DNS
   instructions (A/CNAME records).
2. Update `NEXT_PUBLIC_APP_URL` to `https://yourdomain.com` and redeploy.
3. Update Supabase **Site URL** and additional redirect URLs to include
   `https://yourdomain.com/**`.

## 18. Admin Panel Usage

Open `/admin` (or click through `/login`). Sections:

| Section            | What it controls                                        |
| ------------------ | ------------------------------------------------------- |
| Dashboard          | Generation stats, recent activity, quick links          |
| Site Settings      | Site name, site description, footer text                |
| Branding           | Logo, favicon (upload → Supabase Storage), brand colors |
| Theme              | Light/Dark/System default, presets, custom HEX colors   |
| Generator Settings | Title/description/keyword bounds, category list, batch size, rate limit, extra instructions |
| AI Settings        | Read-only provider/model status                         |
| Usage              | System generation log                                   |

## 19. Site Branding & Theme Configuration

Nothing public is hard-coded: site name, description, logo, favicon,
colors, footer and theme mode all load from the `site_settings` table on
every request. Change them in the Admin Panel and they apply immediately —
no redeploy required. Visitors can additionally pick their own light/dark/
system preference from the header toggle (stored in their browser).

## 20. Updating the Project

The repository ships versioned migrations and a `version.json` so forks can
pull updates cleanly:

```bash
git remote add upstream https://github.com/<official-owner>/microstock-metadata-generator.git
git fetch upstream
git merge upstream/main     # resolve conflicts if you customized files
npm install                 # if package.json changed
```

If new files appear in `supabase/migrations/` (e.g. `0007_*.sql`), run them
in the Supabase SQL Editor / CLI exactly like the initial setup. Check
`version.json` to see which release you are on.

## 21. Troubleshooting

**Site only loads with a VPN (common on some ISPs, e.g. Bangladesh)**

Your ISP is intermittently blocking `*.vercel.app` domains - the app itself
is fine. Two fixes:

1. Quick: switch your device/router DNS to Cloudflare (`1.1.1.1`) and
   Google (`8.8.8.8`), then flush DNS (`ipconfig /flushdns` on Windows).
2. Permanent: attach a **custom domain** to the Vercel project
   (Settings → Domains). Add an `A` record to `76.76.21.21` or a `CNAME`
   to `cname.vercel-dns.com` at your registrar. Custom domains are not
   affected by vercel.app blocks. Remember to update `NEXT_PUBLIC_APP_URL`
   and the Supabase Auth Site URL afterwards.

**Login redirects back to `/login` or shows "Access Denied"**
Your Google account has no active row in `admin_users`. Follow section 12.

**"AI is not configured" error when generating**
`AI_PROVIDER` / `AI_API_KEY` are missing on the server. For local dev check
`.env.local` and restart `npm run dev`; for production set them in Vercel
and redeploy.

**Generation returns 429**
Hourly per-IP limit reached. Raise `Rate Limit / Hour` in Admin → Generator
Settings, or wait.

**OAuth error `redirect_uri_mismatch`**
The Supabase callback URL is missing in your Google OAuth client
(see section 11, step 4).

**Images fail to upload/generate in the browser**
Supported types are JPEG/PNG/WebP/GIF/BMP. Very large photos are downscaled
automatically; make sure the original file is under ~7 MB after scaling.

**Branding changes don't appear**
Hard-refresh the page (Ctrl+Shift+R). Favicon changes can be cached
aggressively by browsers - reopen the tab or append `?v=1`. If saving shows
an error mentioning a missing table/relation, run all migrations from
section 9 first (the app upserts settings rows automatically once tables
exist).

**Database errors mentioning missing tables/policies**
Run all migrations from section 9 in order.

## 22. Security Notes

- Only Google OAuth exists; there are no passwords to leak.
- The entire site is gated behind authentication at the middleware level;
  only active `admin_users` rows pass authorization on every page and API.
- Admin management (add/disable/remove) is done from the Admin Panel with a
  built-in guard that prevents removing the last active admin.
- RLS enabled everywhere: clients cannot write anything;
  `usage_logs` is server-only; clients can read only their own admin row.
- BYOK keys live in the browser's localStorage only — never in the database.
  They are forwarded per-request over HTTPS to your own server route, which
  uses them solely to call the chosen provider.
- `SUPABASE_SERVICE_ROLE_KEY` and the server env AI key are used exclusively
  in server-side code and never shipped to the browser.
- The generate API validates image type/size and applies a per-IP sliding
  window rate limit before calling any AI provider.
- Uploaded generator images stay in memory only — nothing is persisted.
- Usage logs store a salted IP hash, never raw IPs or personal data.

---

Made for microstock contributors. Fork it, brand it, deploy it.
