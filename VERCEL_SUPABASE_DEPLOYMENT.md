# Vercel + Supabase deployment planning guide

**This is a deployment plan, not a claim that the app is deployed or currently live.** The app API remains Express/tRPC. Supabase project `my-blog` (ref `mbwtfbpoefqjfbnxozbx`, Singapore) is healthy and the PostgreSQL baseline has been applied; 11 tables were verified with 0 rows. RLS is disabled on all 11 tables and needs an explicit security/policy decision before exposing an anon key. Runtime credentials, API hosting, routing, and full-stack validation remain pending.

## Architecture: responsibilities

- **Supabase:** PostgreSQL database and planned object storage only. Supabase does not replace this app's Express/tRPC API server.
- **Application API:** Express serves the client and exposes `/api/trpc`, OAuth/storage-related routes, sitemap, and scheduled endpoints. It needs a compatible Node.js runtime host.
- **Vercel:** may host the static Vite frontend. The repository contains no Vercel function entry points or Express adapter, so a Vercel frontend deployment alone is not a complete deployment. Either select a compatible Express host and configure frontend-to-API routing, or separately implement and validate an appropriate adapter before treating Vercel as the full-app host.

## 1. Provision Supabase PostgreSQL

1. **Completed:** project `my-blog` was created in Singapore (`ap-southeast-1`), ref `mbwtfbpoefqjfbnxozbx`. Obtain its PostgreSQL URI from the Supabase dashboard when configuring the server runtime.
2. Obtain a PostgreSQL connection URI from the Supabase dashboard. Its general shape is:

   ```text
   postgresql://<user>:<password>@<host>:5432/<database>
   ```

   This is a placeholder format, not a real credential. Store the actual URI only in a secret manager or the API host's protected environment settings. Select a direct or pooled connection appropriate to the runtime and confirm SSL/network requirements.
3. Provision a Storage bucket only after its app integration contract and access policy are confirmed. Bucket name, access mode, and any storage-specific values remain to be configured; do not infer them from this guide.

## 2. PostgreSQL migrations and archived MySQL migrations

The current repository has a distinct active PostgreSQL set and an archived MySQL set:

- **Active PostgreSQL path:** `drizzle.config.ts` uses the PostgreSQL dialect and writes migrations to `drizzle-postgres/`. The active baseline is `drizzle-postgres/0000_great_mulholland_black.sql`, with metadata under `drizzle-postgres/meta/`; it was applied to the new project and Supabase verified 11 empty tables. Test the application connection and later upgrade paths before production use.
- **Archived MySQL path:** `drizzle-legacy-mysql/` contains the former MySQL migration chain and snapshots, retained for historical reference. Do not run or copy these files into Supabase PostgreSQL.
- `drizzle/` contains the current schema and relations; it is not the archived migration set.

The package currently defines:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:push
```

`db:generate` generates migrations from the current schema. `db:migrate` requires `DATABASE_URL` and applies migrations using the configured PostgreSQL path. `db:push` chains generation and migration. Review generated changes and verify the target database before applying; prefer a reviewed migration rollout rather than unreviewed production schema changes.

## 3. Configure the Express API runtime

Choose the API runtime host before deploying the frontend. Configure its server-side environment with values required by the implementation, including:

- `DATABASE_URL`: Supabase PostgreSQL URI (secret)
- `JWT_SECRET`: generated secret (secret)
- `VITE_APP_ID`, `OAUTH_SERVER_URL`, and `OWNER_OPEN_ID`: valid OAuth/application configuration as required by the deployed app
- `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY`: if the integration is enabled; key is secret
- `VITE_APP_URL`, `OWNER_EMAIL`, and branding values where required by the implementation
- Storage-specific settings only after their exact names and access policy are confirmed

Set secrets in the **Express runtime host**, not only in Vercel's frontend build environment. `VITE_*` values may be compiled into client assets and must not contain secrets. Verify the final required environment-variable list against the runtime code before launch.

## 4. Build and host the frontend/API

The repository scripts include `pnpm install`, `pnpm build`, and `pnpm start`; `build` compiles the Vite frontend and bundles the Express entry point, while `start` runs the Node server bundle. This is a Node server process, not a Vercel function definition. Verify the chosen API host supports the generated output, Node version, process startup, `PORT`, request body size, and static asset serving.

If the frontend and API use separate domains, configure and test same-origin proxy/rewrite or client API routing for `/api/trpc` and other server routes. This repository does not provide a Vercel adapter or deployment rewrite configuration. Decide and test that route before publishing a frontend URL as the app URL.

## 5. PostgreSQL schema status and next validation

The baseline migration has already been applied to the newly created project `mbwtfbpoefqjfbnxozbx`; Supabase verified 11 public tables, 0 rows, and the expected enum/foreign-key structure. The application has not yet connected using a runtime `DATABASE_URL`, so API reads/writes remain untested. Keep `drizzle-legacy-mysql/` out of the PostgreSQL apply path.

**Security blocker:** RLS is disabled on all 11 tables. Do not expose a Supabase anon key until the owner chooses and tests access policies. Supabase supplied an RLS enablement script; see the SQL below and decide whether policy rules are needed for any client-facing access.

### Supabase RLS enablement option (not applied)

Supabase reports Row Level Security is disabled on all 11 application tables. Until access policies are chosen, do not expose a Supabase anon key: anyone with that key can access tables through the Supabase Data API. The following is Supabase's suggested RLS enablement SQL; it enables RLS but adds **no policies**. It has not been applied. Decide whether client-facing policies are needed, and verify the Express runtime's database role before running it because role permissions affect server-side access.

```sql
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."commentRatings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."languageAnalytics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."newsletter_subscribers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."postDrafts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."postTags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."socialSharingMetrics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
```

Supabase RLS documentation: https://supabase.com/docs/guides/database/postgres/row-level-security

## 6. Seed data (optional)

There is no package-level `seed` script. The existing PostgreSQL seed file can be invoked directly:

```bash
node server/seedSamplePosts.mjs
```

It requires `DATABASE_URL` and an existing admin user, and inserts four sample posts while skipping matching slugs. Use a development/staging database first; see [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md). Do not place credentials in command history, source control, or documentation.

## 7. Deploy only after the API path works

Before connecting a public domain, verify that the Express process starts on the selected host, database access works, frontend requests reach the API, OAuth callback URLs are correct, storage uploads work if configured, and secrets are available at runtime. A Vercel URL serving a static bundle is not proof that the complete application is operational. Do not announce or describe the app as live until full-stack smoke tests pass.

## Values still to configure or confirm

- RLS enablement and policy design for all 11 application tables
- PostgreSQL connection URI, direct/pooler choice, TLS/network settings, and server-side secret storage
- Application CRUD smoke test through the selected Express runtime
- API runtime host and process configuration
- Frontend-to-API routing, OAuth callback URLs, and public app URL
- Supabase Storage bucket, policies, and app integration contract
- Production OAuth/application identifiers, owner identity, and external integration credentials
- Runtime secrets, backup/restore, monitoring, and migration rollback procedures

Never add real keys, passwords, connection URIs, or tokens to this repository or documentation.

## Troubleshooting

- **Connection refused/authentication failure:** verify the API runtime's `DATABASE_URL`, network access, SSL, Supabase project status, and connection selection without exposing the URI.
- **Missing tables or SQL errors:** check that the active PostgreSQL migrations under `drizzle-postgres/` were applied. The `drizzle-legacy-mysql/` archive must not be used.
- **Frontend loads but API fails:** a static frontend host does not run Express. Check the API host's process/logs and configured client-to-API route.
- **Build succeeds but server does not start:** verify the API host starts the Node bundle with `pnpm start` or an equivalent command and provides required runtime values.

## Related documents

- [README.md](./README.md)
- [QUICK_START_VERCEL.md](./QUICK_START_VERCEL.md)
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md)
