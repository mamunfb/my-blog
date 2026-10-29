# Blog Website Setup Guide

এই গাইডটি অ্যাপের সেটআপ ও চালুর পরিকল্পনা বোঝায়। **Supabase project `my-blog` (Singapore, ref `mbwtfbpoefqjfbnxozbx`) তৈরি এবং baseline schema apply হয়েছে। ১১টি table-এ RLS enabled; public content-এর জন্য সাতটি `SELECT` policy apply হয়েছে, কোনো client write policy নেই। Policy SQL `supabase/manual/`-এ archive করা, কিন্তু active Drizzle migration chain-এ এখনও নেই। Runtime values, server DB role, hosting ও production validation বাকি; app live—এমন দাবি নয়।**

## Database ও deployment অবস্থা

- অ্যাপের API হলো Express + tRPC। Supabase PostgreSQL এবং পরিকল্পিত object storage-এর জন্য; Supabase Express API server-এর বিকল্প নয়।
- `drizzle.config.ts` PostgreSQL dialect ব্যবহার করে এবং migration output `drizzle-postgres/`। Baseline `0000_great_mulholland_black.sql` ও RLS-enable migration `0001_enable_rls_on_app_tables.sql` Supabase project-এ apply হয়েছে; live DB-তে সাতটি public-read policy-ও আছে। Policy SQL `supabase/manual/applied_public_read_rls_2026-10-29.sql`-এ archive করা, Drizzle chain-এ নেই; fresh DB-তে তা স্বয়ংক্রিয়ভাবে তৈরি হবে না। Runtime connection/CRUD এখনও পরীক্ষা হয়নি।
- `drizzle-legacy-mysql/`-এ পুরোনো MySQL migration chain ও snapshots archive হিসেবে আছে; এগুলো Supabase PostgreSQL-এ চালাবেন না। `drizzle/`-এ বর্তমান schema/relations রাখা আছে।
- `pnpm db:generate`, `pnpm db:migrate` এবং `pnpm db:push` package scripts-এ আছে। `db:migrate`-এর জন্য `DATABASE_URL` আবশ্যক। Production database-এ command চালানোর আগে generated SQL review, target URI যাচাই এবং backup নিশ্চিত করুন।
- Source-এর Express server process হিসেবে চলে; Vercel-এর Container Runtime (Beta) root `Dockerfile` চালাতে পারে। Vercel project-এ framework detection Vite বেছে নিলে Container preset নির্বাচন করতে হবে। শুধু static frontend deploy করলে `/api/trpc` চলবে না। [Vercel Container Runtime](https://vercel.com/docs/functions/runtimes/container)

## ১. লোকাল ডেভেলপমেন্ট

প্রজেক্ট root-এ:

```bash
pnpm install
pnpm dev
```

বিদ্যমান package scripts-এর মধ্যে `pnpm check`, `pnpm test`, `pnpm build`, `pnpm start`, `pnpm db:generate`, `pnpm db:migrate` এবং `pnpm db:push` রয়েছে। Database migration চালাতে `DATABASE_URL`-কে কেবল নির্দিষ্ট PostgreSQL development/staging database-এ নির্দেশ করুন।

## ২. Supabase PostgreSQL সেটআপ

তৈরি project `my-blog`-এর dashboard থেকে PostgreSQL connection URI নিন।

```text
postgresql://<user>:<password>@<host>:5432/<database>
```

এটি placeholder format, বাস্তব credential নয়। আসল URI কেবল server-side secret manager/runtime settings-এ রাখবেন; source control, documentation বা public client variable-এ নয়। Runtime অনুযায়ী direct/pooler connection এবং SSL/network settings যাচাই করুন।

Database setup:

1. বর্তমান project-এ baseline migration apply হয়েছে; অন্য dev/staging target ব্যবহার করলে সেটি আলাদাভাবে ঠিক করুন।
2. `drizzle-postgres/`-এর baseline ও RLS migration review করুন। `drizzle-legacy-mysql/` থেকে কিছু apply করবেন না।
3. `pnpm db:generate` কেবল schema change থেকে migration generate করতে ব্যবহার করুন; generated SQL review করুন।
4. `DATABASE_URL` সঠিক target-এ সেট করে `pnpm db:migrate` চালান। `pnpm db:push` generate ও migrate একসঙ্গে চালায়; production-এ না চালিয়ে reviewed migration rollout ব্যবহার করুন।
5. Tables/constraints যাচাই হয়েছে; runtime `DATABASE_URL` configure করার পর API read/write ও backup/restore পরীক্ষা করুন।

RLS সব ১১ table-এ enabled; categories, tags, published posts, তাদের approved comments/ratings ও public metrics-এর জন্য সাতটি read policy আছে। Direct client write policy নেই। Live policy SQL এখনও active Drizzle chain-এ নেই—fresh database rollout-এর আগে migration হিসেবে reconcile ও test করুন। Express server owner/BYPASSRLS database role ব্যবহার করলে RLS server API-কে নিজে থেকে সীমাবদ্ধ করে না; public query filter এবং DB role verify করুন।

## ৩. Runtime environment ও secret

`DATABASE_URL`, `JWT_SECRET`, OAuth/application credential, owner identity এবং ব্যবহৃত external API credential server-side runtime host-এ দিন—শুধু frontend/Vercel build settings-এ নয়। Final code-এর required variable list যাচাই করুন। `VITE_*` মান client bundle-এ অন্তর্ভুক্ত হতে পারে; সেখানে secret দেবেন না। কোনো বাস্তব key/password commit বা docs-এ লিখবেন না।

## ৪. API hosting ও app workflow

Vercel Container Runtime-এর Container preset দিয়ে Express process চালানো যায়; বিকল্পভাবে compatible Node.js host ব্যবহার করুন। Frontend/API একই container-এ থাকলে একই-origin `/api/trpc` ব্যবহার করুন। আলাদা host হলে proxy/rewrite ও OAuth callback configure/test করুন। API, database, authentication এবং storage সচল হওয়ার পর Admin, post, translation, newsletter ও upload workflow যাচাই করুন। কোনো live production URL ধরে নেবেন না।

## ৫. ডোমেইন ও SEO

পূর্ণ app deploy ও smoke test হওয়ার পরে custom domain, HTTPS, sitemap এবং Google Search Console configure করুন। Frontend এবং API-র public URL/route একে অপরের সঙ্গে সামঞ্জস্যপূর্ণ কি না নিশ্চিত করুন।

## সমস্যা সমাধান

- **PostgreSQL connection failure:** runtime host-এর `DATABASE_URL`, Supabase project status, connection mode, SSL/network setting ও credential যাচাই করুন; URI প্রকাশ করবেন না।
- **Migration/table সমস্যা:** `drizzle-postgres/` active migration path যাচাই করুন; archived `drizzle-legacy-mysql/` কখনো PostgreSQL-এ চালাবেন না।
- **`/api/trpc` কাজ করে না:** Express server process চলছে কি না পরীক্ষা করুন। Vercel-এ static Vite preset নয়, Container preset ও root `Dockerfile` ব্যবহার করুন; আলাদা API host হলে routing/rewrite-ও যাচাই করুন।
- **Seed data:** `server/seedSamplePosts.mjs` PostgreSQL ব্যবহার করে এবং `DATABASE_URL` চায়, কিন্তু এর জন্য package-level `seed` script নেই। [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md) দেখুন।

## সহায়তা ও সম্পর্কিত নথি

- [README.md](./README.md)
- [VERCEL_SUPABASE_DEPLOYMENT.md](./VERCEL_SUPABASE_DEPLOYMENT.md)
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md)
