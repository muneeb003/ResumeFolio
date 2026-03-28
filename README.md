# ResumeFolio

Turn your resume into a live portfolio in 60 seconds. Upload a PDF or DOCX, let AI extract your data, pick a design, and deploy — all for free.

## Features

- **AI extraction** — Gemini 2.5 Flash parses any resume into structured data
- **14 portfolio templates** — Developer, Designer, Minimal, Dark Dev, Bold, Editorial, Cinematic, Corporate, Student, Freelancer, Glass, Neon, Brutalist, Magazine
- **AI tools** — improve bullet points, auto-describe GitHub projects, ATS score
- **Three auth options** — GitHub, Google, or email magic link
- **Two deploy options** — self-hosted (instant, on your ResumeFolio URL) or GitHub Pages (your own domain)
- **Profile photo** — upload and embed in any template
- **Zero user API keys** — everything runs on our keys

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Auth | NextAuth.js v4 |
| Database | Neon (PostgreSQL) via `@neondatabase/serverless` |
| AI | Google Gemini 2.5 Flash |
| File parsing | `pdf-parse`, `mammoth` |
| Drag & drop | `dnd-kit` |
| Rate limiting | Upstash Redis |
| ZIP export | `archiver` |

---

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd resume-to-portfolio
npm install
```

### 2. Create a Neon database

1. Sign up at [neon.tech](https://neon.tech) (free tier)
2. Create a new project
3. Copy the **Connection string** from the dashboard
4. Run the schema migration (see [Database Setup](#database-setup))

### 3. Create a GitHub OAuth App (for dev)

1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - **Application name**: ResumeFolio Dev
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy the **Client ID** and generate a **Client Secret**

### 4. Get a Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com) → **Get API key**
2. Create a key in a new project (free, no credit card)

### 5. Configure environment variables

Copy the template and fill in your values:

```bash
cp .env.local.example .env.local   # or create .env.local manually
```

```env
# NextAuth
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth (required)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Neon database (required)
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# Google Gemini AI (required)
GOOGLE_AI_API_KEY=your_gemini_key

# Google OAuth (optional — enables "Continue with Google")
# console.cloud.google.com → APIs & Services → Credentials → OAuth 2.0 Client
# Authorized redirect URI: http://localhost:3000/api/auth/callback/google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email magic link (optional — enables email sign-in)
# Use Resend (resend.com) for easiest setup:
#   EMAIL_SERVER=smtp://resend:YOUR_RESEND_API_KEY@smtp.resend.com:465
#   EMAIL_FROM=ResumeFolio <noreply@yourdomain.com>
# Or any SMTP provider:
#   EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_SERVER=
EMAIL_FROM=

# Upstash Redis (optional — enables rate limiting)
# upstash.com → Create database → REST API
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 6. Database setup

Run this SQL in your Neon project's SQL editor:

```sql
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT,
  email        TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image        TEXT,
  github_login TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                TEXT NOT NULL,
  provider            TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token       TEXT,
  access_token        TEXT,
  expires_at          INTEGER,
  token_type          TEXT,
  scope               TEXT,
  id_token            TEXT,
  session_state       TEXT,
  UNIQUE(provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId"       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires        TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token      TEXT UNIQUE NOT NULL,
  expires    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE IF NOT EXISTS portfolios (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  resume_data      JSONB NOT NULL,
  template_id      TEXT NOT NULL,
  accent_color     TEXT NOT NULL,
  section_order    TEXT[] NOT NULL,
  hidden_sections  TEXT[] DEFAULT '{}',
  github_repo      TEXT,
  deployment_url   TEXT,
  last_deployed_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Vercel Deployment

### 1. Create a production GitHub OAuth App

Create a **second** OAuth App at [github.com/settings/developers](https://github.com/settings/developers):
- **Homepage URL**: `https://your-app.vercel.app`
- **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`

(GitHub only allows one callback URL per app, so dev and prod need separate apps.)

### 2. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo in the [Vercel dashboard](https://vercel.com/new).

### 3. Add environment variables in Vercel

In your Vercel project → **Settings** → **Environment Variables**, add all the same variables from `.env.local` but with production values:

| Variable | Production value |
|---|---|
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | same secret (or regenerate) |
| `GITHUB_CLIENT_ID` | from your **production** OAuth App |
| `GITHUB_CLIENT_SECRET` | from your **production** OAuth App |
| `DATABASE_URL` | same Neon connection string |
| `GOOGLE_AI_API_KEY` | same Gemini key |
| `GOOGLE_CLIENT_ID` | add `https://your-app.vercel.app/api/auth/callback/google` as redirect URI |
| `GOOGLE_CLIENT_SECRET` | same |
| `EMAIL_SERVER` | same |
| `EMAIL_FROM` | same |

### 4. Redeploy

```bash
vercel --prod
```

---

## Optional: Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → **APIs & Services** → **Credentials** → **Create OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://your-app.vercel.app/api/auth/callback/google` (prod)
5. Copy **Client ID** and **Client Secret** into `.env.local`

---

## Optional: Email Magic Link Setup (via Resend)

1. Sign up at [resend.com](https://resend.com) (free: 3,000 emails/mo)
2. Add and verify your sending domain
3. Create an API key
4. Set in `.env.local`:
   ```env
   EMAIL_SERVER=smtp://resend:re_YOUR_API_KEY@smtp.resend.com:465
   EMAIL_FROM=ResumeFolio <noreply@yourdomain.com>
   ```

---

## Project Structure

```
app/
  page.tsx                    # Landing page
  dashboard/page.tsx          # Portfolio list
  create/
    page.tsx                  # Step 1: Upload resume
    review/page.tsx           # Step 2: Review + AI tools
    design/page.tsx           # Step 3: Pick template & colors
    deploy/page.tsx           # Step 4: Deploy
  portfolio/[id]/edit/        # Edit existing portfolio
  p/[id]/route.ts             # Public self-hosted portfolio serving
  api/
    auth/[...nextauth]/       # NextAuth handler
    parse/                    # Resume → AI → JSON
    ai/                       # improve-bullet, describe-project, ats-score
    deploy/                   # github, download (ZIP)
    portfolio/                # CRUD

components/
  ui/                         # Button, Input, StepIndicator, ColorPicker…
  upload/                     # DropZone, ManualEntryFallback
  review/                     # Section editors, AtsPanel, ImproveBulletButton
  design/                     # TemplateCard, TemplatePreview (iframe)
  deploy/                     # DeployOptions, DeployProgress, SuccessCard
  dashboard/                  # PortfolioCard

lib/
  auth.ts                     # NextAuth config
  gemini.ts                   # Gemini client
  github.ts                   # GitHub Pages deployment
  zip.ts                      # ZIP export
  types.ts                    # ResumeData, TemplateId
  db/portfolios.ts            # DB CRUD
  ai/                         # extractResume, improveBullet, atsScore…
  extractors/                 # pdfExtractor, docxExtractor
  templates/                  # 14 HTML template generators
```

---

## Available Scripts

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npx tsc --noEmit  # Type check without building
```
