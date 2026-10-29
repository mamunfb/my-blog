# PostgreSQL/Supabase deployment readiness checklist

এই checklist পরিকল্পনা ও যাচাইয়ের জন্য। **App live বা production-ready—এমন দাবি নয়।** Supabase project ও baseline schema তৈরি/প্রয়োগ হয়েছে; RLS policy, runtime values, API host, routing ও full-stack validation বাকি.

## Deployment-এর আগে আবশ্যক

- [x] Supabase PostgreSQL project `my-blog` Singapore region-এ তৈরি হয়েছে.
- [ ] Connection mode, TLS/network access ও runtime secret storage configure/test করুন.
- [x] `drizzle-postgres/` baseline নতুন project-এ apply হয়েছে; 11 table যাচাই হয়েছে.
- [ ] App connection/CRUD, upgrade path ও backup/restore পরীক্ষা করুন.
- [x] `drizzle-legacy-mysql/`-এর archived MySQL migrations PostgreSQL apply path থেকে বাদ রাখা হয়েছে.
- [x] নতুন Supabase project-এ baseline schema apply ও table-structure verification সম্পন্ন।
- [ ] Migration upgrade path এবং production backup/rollback plan পরীক্ষা করুন।
- [ ] Supabase Storage bucket, policy ও app integration/settings configure এবং upload/download পরীক্ষা করা হয়েছে, যদি ব্যবহৃত হয়।
- [ ] Express/tRPC API চালানোর জন্য compatible Node.js runtime host নির্বাচন ও পরীক্ষা করা হয়েছে, অথবা Vercel adapter আলাদাভাবে implement ও verify হয়েছে।
- [ ] Frontend-to-API routing, `/api/trpc`, OAuth callback ও public app URL পরীক্ষা করা হয়েছে।
- [ ] Runtime host-এ PostgreSQL `DATABASE_URL` ও প্রয়োজনীয় server-side secret নিরাপদে সেট।

## বর্তমান repository facts

- App API হলো Express + tRPC; source-এ Vercel Functions/Express adapter নেই।
- Supabase-এর ভূমিকা PostgreSQL এবং পরিকল্পিত Storage; এটি API server নয়।
- `drizzle.config.ts` PostgreSQL dialect ব্যবহার করে এবং output path `drizzle-postgres/`; বর্তমানে সেখানে `0000_great_mulholland_black.sql` ও metadata রয়েছে।
- `drizzle-legacy-mysql/` পুরোনো MySQL chain/snapshots-এর archive; PostgreSQL-এ চালাবেন না। `drizzle/`-এ schema/relations আছে।
- Package scripts: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`; `db:migrate`-এর জন্য `DATABASE_URL` দরকার। `db:push` generate+migrate চালায়।
- `pnpm seed`/`npm run seed` package script নেই; PostgreSQL seed file `node server/seedSamplePosts.mjs` দিয়ে সরাসরি চালানো যায় এবং `DATABASE_URL` ও existing admin user চায়।

## Supabase ও database যাচাই

- [ ] URI শুধু API runtime host-এর secret manager-এ; git/docs-এ নেই।
- [ ] RLS enablement ও access policy নির্ধারণ/test করুন (বর্তমানে সব 11 table-এ বন্ধ)।
- [x] Reviewed baseline apply; 11 table, 12 FK ও 3 enum যাচাই।
- [ ] API read/write, indexes, backup/restore ও production migration upgrade path পরীক্ষা করুন।

## API runtime ও frontend যাচাই

- [ ] API host Express process, required Node version, `PORT`, static assets ও request behavior সমর্থন করে।
- [ ] Runtime host-এ final implementation-এর বাধ্যতামূলক environment variable-গুলো আছে।
- [ ] `DATABASE_URL`, `JWT_SECRET`, OAuth/application values, owner identity ও external API keys নিরাপদে configure করা হয়েছে।
- [ ] `VITE_*` client build values-এ secret নেই।
- [ ] Client `/api/trpc` ও অন্যান্য server route-এ API host-এর মাধ্যমে পৌঁছায়।
- [ ] OAuth, database read/write, post workflow, image upload, logs ও health checks পরীক্ষা হয়েছে।
- [ ] Vercel কেবল frontend host হলে সেটিকে complete app deployment বলা হয়নি।

## Release readiness

- [ ] Production smoke test সম্পন্ন; public URL/functionality যাচাই।
- [ ] Error logs, uptime/monitoring ও operational contact প্রস্তুত।
- [ ] এই verification শেষ হলেই launch/live status ঘোষণা করা হবে।

## বর্তমান package commands

```bash
pnpm install
pnpm check
pnpm test
pnpm build
pnpm start
pnpm db:generate
pnpm db:migrate
pnpm db:push
```

Migration commands চালানোর আগে `DATABASE_URL`-এর target যাচাই করুন এবং generated SQL review করুন। Seed details: [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md)। `pnpm seed`, `npm run lint` বা অন্য অনির্ধারিত package script এখানে সুপারিশ করা হচ্ছে না।

## Related guides

- [VERCEL_SUPABASE_DEPLOYMENT.md](./VERCEL_SUPABASE_DEPLOYMENT.md)
- [QUICK_START_VERCEL.md](./QUICK_START_VERCEL.md)
- [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md)
- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)
