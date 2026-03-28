// Run this SQL in your Neon SQL editor to set up the database
// Dashboard → SQL Editor → paste and run

export const MIGRATION_SQL = `
-- NextAuth required tables (standard pg adapter schema)
CREATE TABLE IF NOT EXISTS accounts (
  id                   TEXT      NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "userId"             TEXT      NOT NULL,
  type                 TEXT      NOT NULL,
  provider             TEXT      NOT NULL,
  "providerAccountId"  TEXT      NOT NULL,
  refresh_token        TEXT,
  access_token         TEXT,
  expires_at           BIGINT,
  token_type           TEXT,
  scope                TEXT,
  id_token             TEXT,
  session_state        TEXT,
  UNIQUE(provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS sessions (
  id             TEXT        NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  "sessionToken" TEXT        NOT NULL UNIQUE,
  "userId"       TEXT        NOT NULL,
  expires        TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id              TEXT        NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  name            TEXT,
  email           TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image           TEXT
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT        NOT NULL,
  token      TEXT        NOT NULL UNIQUE,
  expires    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Foreign keys
ALTER TABLE accounts ADD CONSTRAINT fk_accounts_user
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE sessions ADD CONSTRAINT fk_sessions_user
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- App table
CREATE TABLE IF NOT EXISTS portfolios (
  id               TEXT        NOT NULL DEFAULT gen_random_uuid()::text PRIMARY KEY,
  user_id          TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name             TEXT        NOT NULL,
  resume_data      JSONB       NOT NULL,
  template_id      TEXT        NOT NULL DEFAULT 'minimal',
  accent_color     TEXT        NOT NULL DEFAULT '#4f46e5',
  section_order    TEXT[]      NOT NULL DEFAULT ARRAY['experience','projects','skills','education','contact'],
  hidden_sections  TEXT[]      NOT NULL DEFAULT '{}',
  github_repo      TEXT,
  deployment_url   TEXT,
  last_deployed_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`
