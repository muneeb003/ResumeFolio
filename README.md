# ResumeFolio

**Full-stack AI-powered web application** that converts a resume PDF or DOCX into a live, deployed portfolio website in under 60 seconds — with zero configuration required from the user.

> Live demo: _coming soon_ · Built with Next.js 16, TypeScript, PostgreSQL, Google Gemini AI

---

## Overview

ResumeFolio is a production-grade SaaS tool that handles the full pipeline: document parsing → AI data extraction → interactive editor → template rendering → one-click deployment to GitHub Pages. Users sign in with GitHub OAuth once and the app handles everything — no API keys, no manual setup.

---

## Key Features

- **AI Resume Parsing** — Uploads a PDF or DOCX; Google Gemini 2.5 Flash extracts structured JSON (experience, projects, skills, education, contact) from raw text using a schema-constrained prompt
- **14 Portfolio Templates** — Developer, Minimal, Dark Dev, Bold, Editorial, Magazine, Corporate, Designer, Cinematic, Student, Freelancer, Glass, Neon, Brutalist — all generated as fully self-contained HTML with inlined CSS (no external dependencies, Lighthouse 95+)
- **AI Writing Tools** — Per-bullet rewrite assistant, GitHub README-to-project-description generator, ATS keyword gap analysis with suggestions
- **GitHub Pages Deployment** — Uses the GitHub OAuth token from the session to programmatically create a repo, push the HTML file, and enable GitHub Pages — the user never leaves the app
- **Live Template Preview** — Scaled iframe (1280×900 → scaled down) renders the actual generated HTML using real mock data, updated instantly on theme/color change
- **Drag-and-Drop Section Reorder** — dnd-kit sortable list; section order persisted per portfolio
- **Three Auth Methods** — GitHub OAuth, Google OAuth, Email magic link (via Resend/SMTP) with automatic cross-provider account linking
- **Rate Limiting** — Upstash Redis rate limiter on all AI and deploy endpoints
- **ZIP Export** — Download a self-contained HTML file as a ZIP for self-hosting
- **Output Security** — All generated HTML is hardened: user content HTML-escaped via OWASP-compliant `esc()`, URLs validated to `http(s)://` and `mailto:` only (`safeUrl()`), accent colors validated to hex only (`safeColor()`), JSON-LD structured data serialized with `JSON.stringify()` + `</script>` escape to prevent script tag breakout

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components, TypeScript) |
| Styling | Tailwind CSS |
| Authentication | NextAuth.js v4 — GitHub OAuth, Google OAuth, Email magic link |
| Database | Neon (serverless PostgreSQL) via `@neondatabase/serverless` + `pg` |
| ORM / Adapter | `@auth/pg-adapter` for NextAuth session storage |
| AI / LLM | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Document Parsing | `pdf-parse` (PDF), `mammoth` (DOCX) |
| Drag and Drop | `@dnd-kit/core`, `@dnd-kit/sortable` |
| Rate Limiting | Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`) |
| File Compression | `archiver` (ZIP generation) |
| Validation | `zod` — schema validation on all API inputs |
| Email | `nodemailer` via Resend SMTP |
| Deployment | Vercel (app) + GitHub Pages (generated portfolios) |

---

## Architecture

```
Browser
  │
  ├── Next.js App Router (RSC + Client Components)
  │     ├── /                  Landing page (SSR, session-aware)
  │     ├── /dashboard         Portfolio manager
  │     ├── /create            4-step wizard: Upload → Review → Design → Deploy
  │     └── /p/[id]            Public portfolio serving (self-hosted option)
  │
  └── API Routes
        ├── /api/auth/[...nextauth]   NextAuth — GitHub, Google, Email
        ├── /api/parse                PDF/DOCX → text → Gemini → ResumeData JSON
        ├── /api/ai/improve-bullet    Gemini bullet rewrite
        ├── /api/ai/describe-project  GitHub README → project description
        ├── /api/ai/ats-score         Keyword gap analysis
        ├── /api/deploy/github        GitHub API → create repo → push HTML → enable Pages
        ├── /api/deploy/download      Stream ZIP file to browser
        ├── /api/portfolio            CRUD (create, read, update, delete)
        └── /api/preview/[templateId] Unauthenticated — renders template with mock data (cached)

Database (Neon PostgreSQL)
  ├── users              (NextAuth standard + github_login column)
  ├── accounts           (OAuth provider links)
  ├── sessions           (JWT session storage)
  ├── verification_tokens (email magic link tokens)
  └── portfolios         (resume_data JSONB, template_id, accent_color, section_order, deployment_url)
```

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

### 3. Create a GitHub OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - **Application name**: ResumeFolio Dev
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy the **Client ID** and generate a **Client Secret**

### 4. Get a Gemini API key

Go to [aistudio.google.com](https://aistudio.google.com) → **Get API key** — free, no credit card required.

### 5. Configure environment variables

Create `.env.local` in the project root:

```env
# NextAuth
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth (required — also used for GitHub Pages deployment)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Neon PostgreSQL (required)
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# Google Gemini AI (required)
GOOGLE_AI_API_KEY=your_gemini_key

# Google OAuth (optional — enables "Continue with Google")
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email magic link (optional — enables email sign-in via Resend or any SMTP)
# Resend: smtp://resend:YOUR_RESEND_API_KEY@smtp.resend.com:465
EMAIL_SERVER=
EMAIL_FROM=ResumeFolio <noreply@yourdomain.com>

# Upstash Redis (optional — enables rate limiting on AI + deploy endpoints)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 6. Run the database migration

Run this SQL in your Neon project's SQL editor (or any PostgreSQL client):

```sql
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT,
  email           TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image           TEXT,
  github_login    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
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
  view_count       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- If you already created the portfolios table, run this migration:
-- ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
```

### 7. Start the dev server

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

GitHub only allows one callback URL per app, so dev and prod need separate apps.

### 2. Deploy

```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repo directly in the [Vercel dashboard](https://vercel.com/new).

### 3. Environment variables in Vercel

In **Settings → Environment Variables**, add all variables from `.env.local` with production values:

| Variable | Note |
|---|---|
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | From your **production** OAuth App |
| `DATABASE_URL` | Same Neon connection string |
| `GOOGLE_AI_API_KEY` | Same Gemini key |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Add prod redirect URI in Google Console |

---

## Optional: Google OAuth

1. [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services** → **Credentials** → **Create OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-app.vercel.app/api/auth/callback/google`
4. Copy **Client ID** and **Client Secret** into `.env.local`

---

## Optional: Email Sign-in via Resend

1. Sign up at [resend.com](https://resend.com) (free: 3,000 emails/month)
2. Add and verify your sending domain
3. Create an API key and set:
   ```env
   EMAIL_SERVER=smtp://resend:re_YOUR_API_KEY@smtp.resend.com:465
   EMAIL_FROM=ResumeFolio <noreply@yourdomain.com>
   ```

---

## Project Structure

```
app/
  page.tsx                      # Landing page (SSR, session-aware CTA)
  dashboard/page.tsx            # Portfolio list with sidebar layout
  create/
    page.tsx                    # Step 1: Upload resume (PDF/DOCX or manual form)
    review/page.tsx             # Step 2: Edit extracted data + AI tools
    design/page.tsx             # Step 3: Choose template + accent color
    deploy/page.tsx             # Step 4: Deploy to GitHub Pages or download ZIP
  portfolio/[id]/edit/          # Re-edit and redeploy existing portfolio
  p/[id]/route.ts               # Public self-hosted portfolio (HTML served directly)
  api/
    auth/[...nextauth]/         # NextAuth handler
    parse/                      # POST: file → text extraction → Gemini → ResumeData
    preview/[templateId]/       # GET: render template with mock data (public, cached)
    ai/improve-bullet/          # POST: rewrite a single bullet point
    ai/describe-project/        # POST: GitHub repo URL → project description
    ai/ats-score/               # POST: analyze keyword gaps
    deploy/github/              # POST: push HTML to GitHub, enable Pages
    deploy/download/            # GET: stream ZIP
    portfolio/                  # POST: create · GET/PUT/DELETE /[id]

components/
  ui/                           # Button, Input, Textarea, StepIndicator, ColorPicker, Toggle
  upload/                       # DropZone (react-dropzone), ManualEntryFallback
  review/                       # ExperienceEditor, ProjectEditor, SkillsEditor,
  |                             #   ImproveBulletButton, AtsPanel, DraggableSection
  design/                       # TemplateCard, TemplatePreview
  deploy/                       # DeployOptions, DeployProgress, SuccessCard
  dashboard/                    # PortfolioCard

lib/
  auth.ts                       # NextAuth config (GitHub + Google + Email)
  gemini.ts                     # Gemini client (server-side)
  github.ts                     # GitHub API — repo creation, file push, Pages enable
  zip.ts                        # archiver ZIP generator
  types.ts                      # ResumeData, TemplateId, PortfolioRecord
  db/portfolios.ts              # PostgreSQL CRUD helpers
  ai/                           # extractResume, improveBullet, describeProject, atsScore
  extractors/                   # pdfExtractor (pdf-parse), docxExtractor (mammoth)
  templates/                    # 14 HTML generators: minimal, darkDev, bold, editorial…
  ratelimit.ts                  # Upstash rate limiter instances
  validation/                   # Zod schemas: resumeSchema, deploySchema
```

---

## Scripts

```bash
npm run dev       # Start dev server on localhost:3000
npm run build     # Production build
npm run start     # Start production server
npx tsc --noEmit  # Type-check without emitting
npm run lint      # ESLint
```

---

## Security

### Output sanitization (generated HTML)

The generated portfolio HTML files are user-controlled content served publicly. All injection vectors are addressed in `lib/templates/shared.ts`:

| Risk | Function | What it does |
|---|---|---|
| XSS via text/attribute injection | `esc(str)` | Encodes `& < > " '` — applied to all user text fields |
| `javascript:` / `data:` URL injection | `safeUrl(url)` | Allow-lists `https?://` and `mailto:` only; returns `#` otherwise |
| CSS injection via accent color | `safeColor(color)` | Validates against `/^#[0-9a-fA-F]{3,8}$/`; falls back to `#4f46e5` |
| JSON-LD script tag breakout | `buildJsonLd(data)` | Uses `JSON.stringify()` (not `esc()`); escapes `</script>` → `<\/script>` |

### Application security

- All AI and deploy API routes require a valid session (NextAuth middleware)
- Upstash Redis rate limiting on all AI and deploy endpoints prevents abuse
- GitHub OAuth access tokens stored in encrypted JWT session cookies only — never persisted to the database
- Zod schema validation on all API request bodies
- `allowDangerousEmailAccountLinking` on Google OAuth is safe because Google verifies email ownership before issuing tokens
- `.env.local` is gitignored — never commit real credentials
