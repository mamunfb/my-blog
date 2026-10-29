# Seed sample data guide

## PostgreSQL/Supabase status

The seed script `server/seedSamplePosts.mjs` now uses PostgreSQL (`pg`) and reads its connection URI from `DATABASE_URL`. It can be invoked directly from the repository root:

```bash
node server/seedSamplePosts.mjs
```

There is no package-level `seed` script, so `pnpm seed` and `npm run seed` are not supported. The script expects an existing admin user in the target database. It attempts to insert four sample web-development posts and skips a post when its slug already exists. It is not idempotent in the sense of updating existing records; it leaves them unchanged.

## Safe procedure

1. Apply and verify the active PostgreSQL migrations in `drizzle-postgres/` against the intended development/staging database.
2. Create an admin user in that database; the script exits if no admin user exists.
3. Set `DATABASE_URL` in the local process environment using the Supabase PostgreSQL URI. Keep it out of command text/history where possible, source control, docs, and client-exposed `VITE_*` settings.
4. Run `node server/seedSamplePosts.mjs` from the project root. Confirm it is pointed at the intended non-production database before execution.
5. Check logs and verify the posts using the application/database. Existing slugs are skipped. For production, use an approved content/data plan and a current backup first.

Do not write the actual Supabase URI into this guide. Its general format is `postgresql://<user>:<password>@<host>:5432/<database>`; all values shown are placeholders.

## Migration paths: active PostgreSQL vs archived MySQL

- **Active PostgreSQL migrations:** `drizzle-postgres/`, configured by `drizzle.config.ts`; current initial migration is `0000_great_mulholland_black.sql` with metadata under `drizzle-postgres/meta/`.
- **Archived MySQL migrations:** `drizzle-legacy-mysql/`, retained for historical reference. Never apply these files to Supabase PostgreSQL or copy them into Supabase SQL Editor.

Review migration SQL and validate against a development database before running the seed script. See [VERCEL_SUPABASE_DEPLOYMENT.md](./VERCEL_SUPABASE_DEPLOYMENT.md) for deployment and migration notes.
