# Blog launch checklist

**Status: planning checklist. This file does not indicate that the app has been deployed or is live.** Complete infrastructure and validation tasks before a public launch.

## Phase 0: Application and database readiness

- [x] Supabase PostgreSQL project `my-blog` তৈরি, Singapore অঞ্চল; baseline schema apply ও 11 table verify করা হয়েছে.
- [ ] Connection mode, TLS/network access ও runtime secret storage configure করুন.
- [x] RLS সব 11 table-এ enabled; policy নেই.
- [ ] Client-facing access লাগলে least-privilege policy design/test করুন; Express server database role/privileges যাচাই করুন.
- [x] Initial PostgreSQL baseline under `drizzle-postgres/` নতুন project-এ apply হয়েছে.
- [ ] Runtime credentials দিয়ে app connection ও migration upgrade test করুন.
- [ ] Migration upgrade path tested; production backup and rollback process prepared.
- [ ] Archived MySQL chain under `drizzle-legacy-mysql/` excluded from the PostgreSQL migration apply path.
- [ ] Storage bucket, access policy and app integration tested, if storage is enabled.
- [ ] Express/tRPC API has a compatible Node.js runtime host, or a separately implemented and verified deployment adapter.
- [ ] Frontend-to-API routing for `/api/trpc` and other server routes is configured and tested.
- [ ] Runtime environment variables/secrets are set on the host that runs Express.
- [ ] Logs, monitoring, operational ownership and backup/restore plan are in place.

**Vercel note:** the repository has no Vercel Functions or Express adapter. Vercel can be considered for the frontend, but a static Vercel deployment alone is not a complete app deployment.

## Phase 1: Pre-launch verification

After Phase 0 is complete:

- [ ] Express process starts on the chosen API host and serves the built client.
- [ ] PostgreSQL API read/write works against the intended database.
- [ ] Authentication, OAuth callbacks, admin authorization and session handling work.
- [ ] Post creation/editing, draft handling, publishing and public routes work.
- [ ] Image upload/download works with the configured storage integration.
- [ ] Sitemap, robots, metadata and public URLs use the correct production origin.
- [ ] Newsletter, scheduled jobs, external APIs and analytics are tested if enabled.
- [ ] Client/API errors are reviewed; no secrets appear in client assets or logs.
- [ ] Mobile/browser smoke tests pass.

## Phase 2: Content and sample data

- [ ] Decide whether to use real initial posts or sample content.
- [ ] If using the existing PostgreSQL seed file, confirm `DATABASE_URL` points to a non-production target and that an admin user already exists.
- [ ] Invoke the existing script directly with `node server/seedSamplePosts.mjs`; there is no `pnpm seed` or `npm run seed` package script.
- [ ] Verify the four sample posts; existing matching slugs are skipped, not updated.
- [ ] Proofread posts, metadata, image rights, links and publication status.

See [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md) for prerequisites and details.

## Phase 3: Domain and public launch

- [ ] Confirm a successful full-stack staging deployment before setting a public launch date.
- [ ] Configure DNS, HTTPS, canonical origin and required OAuth callback URLs.
- [ ] Confirm frontend and API routing work on the production domain.
- [ ] Run a production smoke test covering public pages, API, authentication, database and storage.
- [ ] Verify backup/restore and incident contacts.
- [ ] Only after checks pass, announce launch and refer to the site as live.

## Ongoing operations after launch

- [ ] Monitor runtime/API and database errors, uptime, resource usage and storage.
- [ ] Keep backups and test restoration regularly.
- [ ] Review migrations before rollout and preserve a rollback plan.
- [ ] Monitor OAuth, email, scheduled tasks and external API use where enabled.
- [ ] Review content, SEO and analytics according to project needs.

## Reference

- [README.md](./README.md)
- [VERCEL_SUPABASE_DEPLOYMENT.md](./VERCEL_SUPABASE_DEPLOYMENT.md)
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- [QUICK_START_VERCEL.md](./QUICK_START_VERCEL.md)
- [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md)
