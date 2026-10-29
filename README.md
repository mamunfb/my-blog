# Professional Multilingual Blog Platform

A React/Vite blog application with an Express and tRPC API, database-backed content, and admin features. **Supabase project `my-blog` (Singapore, ref `mbwtfbpoefqjfbnxozbx`) is created and the PostgreSQL baseline is applied. RLS is enabled on all 11 tables with zero policies; anon/authenticated table access is denied until policies are defined. The app itself is not deployed or production-validated.**

## Architecture and deployment status

- **Web client:** React 19 and Vite.
- **Application/API server:** Express 4 with tRPC 11. The server serves the built client and exposes routes such as `/api/trpc`.
- **Database target:** PostgreSQL hosted by Supabase. Supabase is for PostgreSQL and planned object storage, not the app's API server or a replacement for Express/tRPC.
- **Active PostgreSQL migrations:** `drizzle-postgres/` is the PostgreSQL output path configured by `drizzle.config.ts`; it contains `0000_great_mulholland_black.sql` (baseline) and `0001_enable_rls_on_app_tables.sql` (RLS enabled, no policies). Both are applied and verified on the new Supabase project; the private Drizzle migration ledger has matching hashes/timestamps. Review and test later migrations before production use.
- **Archived MySQL migrations:** `drizzle-legacy-mysql/` contains the old MySQL migration chain and snapshots. It is retained for reference only and must not be applied to Supabase PostgreSQL. The `drizzle/` directory holds the current schema/relations and is not the old migration archive.
- **Hosting caveat:** the source has no Vercel Functions or Express-to-Vercel adapter. Vercel may host the client, but a complete deployment also needs a compatible host for the Express server (or a separately implemented and validated adapter) and a working route from the client to that API. A static Vercel deployment alone is not the complete app.

Before deployment, decide whether any client-facing access policies are required, configure and test the Express server’s database role/connection, securely configure the Supabase PostgreSQL URI, confirm storage integration, select frontend-to-API routing, and set runtime secrets. The app has not been deployed. See [VERCEL_SUPABASE_DEPLOYMENT.md](./VERCEL_SUPABASE_DEPLOYMENT.md) and [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md).

## Features

### Multilingual and content management

- Language selection and right-to-left layout support
- Admin workflows for posts, drafts, categories, and tags
- Featured content and image upload flows
- Translation and content-generation integrations, subject to credentials and runtime configuration

### SEO and engagement

- Sitemap, robots, metadata, and structured-data features
- Comments, ratings, newsletter subscriptions, and social sharing
- Analytics and engagement tracking

Feature availability in a deployed environment depends on the API host, database connection, RLS/security configuration, storage setup, and external service configuration. The database project and baseline schema exist, but the app runtime and these integrations are not yet configured.

## Technology

- React, Vite, Tailwind CSS
- Express and tRPC
- Drizzle ORM
- PostgreSQL on the created Supabase project
- Manus OAuth and associated integrations where configured

## Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) — application setup notes
- [VERCEL_SUPABASE_DEPLOYMENT.md](./VERCEL_SUPABASE_DEPLOYMENT.md) — database target and hosting requirements
- [QUICK_START_VERCEL.md](./QUICK_START_VERCEL.md) — deployment readiness overview
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) — pre-deployment and validation checklist
- [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md) — seed command and compatibility notes
- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) — launch planning checklist

## Development commands

Run from the repository root with pnpm (the repository includes `pnpm-lock.yaml`):

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
pnpm start
```

The package currently defines these database commands:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:push
```

`db:push` runs generation followed by migration; `db:migrate` requires `DATABASE_URL`. The Supabase project's private Drizzle ledger is initialized for the baseline and RLS migrations, so these are not replayed. Review new SQL and point commands only at the intended database. The active PostgreSQL config writes to `drizzle-postgres/`; never use `drizzle-legacy-mysql/` for PostgreSQL.

There is no `seed` package script. The existing PostgreSQL seed file can be invoked directly with `node server/seedSamplePosts.mjs`; it requires `DATABASE_URL` and an existing admin user. See [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md). Use a non-production database first, and do not place credentials in source control or documentation.

## Environment and secrets

Set server-side secrets in the environment of the host that runs Express—not only in Vercel's static frontend build settings. `DATABASE_URL` must be the PostgreSQL connection URI supplied by the configured database provider. Configure OAuth, owner identity, and any required external API credentials in the same runtime environment. Client-exposed `VITE_*` settings are build-time values and must never contain secrets. Confirm the complete required variable list against the final implementation before launch.

Still to configure/confirm: client-facing access policies (if required), the secret PostgreSQL connection URI, Express API host and frontend routing, production OAuth/owner values, required external-service secrets, and Supabase Storage bucket/policy/integration settings. No production URL or live site is asserted here.
