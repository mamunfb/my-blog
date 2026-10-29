# Blog Website Setup Guide

এই গাইডটি অ্যাপের সেটআপ ও চালুর পরিকল্পনা বোঝায়। **Supabase project `my-blog` (Singapore, ref `mbwtfbpoefqjfbnxozbx`) তৈরি হয়েছে এবং baseline schema apply হয়েছে। RLS সব 11 table-এ বন্ধ; anon key expose করার আগে policy decision জরুরি। Runtime values, API hosting path এবং production validation এখনও configure/verify করতে হবে। App live—এমন দাবি নয়।**

## Database ও deployment অবস্থা

- অ্যাপের API হলো Express + tRPC। Supabase PostgreSQL এবং পরিকল্পিত object storage-এর জন্য; Supabase Express API server-এর বিকল্প নয়।
- `drizzle.config.ts` PostgreSQL dialect ব্যবহার করে এবং migration output `drizzle-postgres/`। `0000_great_mulholland_black.sql` নতুন project-এ apply হয়েছে; Supabase 11টি table ও 0 row দেখিয়েছে। App runtime connection/CRUD এখনও পরীক্ষা হয়নি।
- `drizzle-legacy-mysql/`-এ পুরোনো MySQL migration chain ও snapshots archive হিসেবে আছে; এগুলো Supabase PostgreSQL-এ চালাবেন না। `drizzle/`-এ বর্তমান schema/relations রাখা আছে।
- `pnpm db:generate`, `pnpm db:migrate` এবং `pnpm db:push` package scripts-এ আছে। `db:migrate`-এর জন্য `DATABASE_URL` আবশ্যক। Production database-এ command চালানোর আগে generated SQL review, target URI যাচাই এবং backup নিশ্চিত করুন।
- Source-এ Vercel Functions বা Express adapter নেই। Vercel-এ শুধু frontend build করলে `/api/trpc` এবং অন্য server route চলবে না। Express server-এর জন্য compatible Node.js runtime host এবং frontend-to-API routing আগে ঠিক করুন।

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
2. `drizzle-postgres/`-এর active PostgreSQL migration review করুন। `drizzle-legacy-mysql/` থেকে কিছু apply করবেন না।
3. `pnpm db:generate` কেবল schema change থেকে migration generate করতে ব্যবহার করুন; generated SQL review করুন।
4. `DATABASE_URL` সঠিক target-এ সেট করে `pnpm db:migrate` চালান। `pnpm db:push` generate ও migrate একসঙ্গে চালায়; production-এ না চালিয়ে reviewed migration rollout ব্যবহার করুন।
5. Tables/constraints যাচাই হয়েছে; runtime `DATABASE_URL` configure করার পর API read/write ও backup/restore পরীক্ষা করুন।

RLS বর্তমানে বন্ধ; Supabase anon key expose করার আগে access policy/RLS নির্ধারণ ও test করুন। Storage ব্যবহার করলে bucket, access policy এবং app integration-এর variable/configuration contract আলাদাভাবে নিশ্চিত করুন।

## ৩. Runtime environment ও secret

`DATABASE_URL`, `JWT_SECRET`, OAuth/application credential, owner identity এবং ব্যবহৃত external API credential server-side runtime host-এ দিন—শুধু frontend/Vercel build settings-এ নয়। Final code-এর required variable list যাচাই করুন। `VITE_*` মান client bundle-এ অন্তর্ভুক্ত হতে পারে; সেখানে secret দেবেন না। কোনো বাস্তব key/password commit বা docs-এ লিখবেন না।

## ৪. API hosting ও app workflow

Express process চালাতে সক্ষম Node.js host নির্বাচন করুন বা আলাদা adapter বাস্তবায়ন ও পরীক্ষা করুন। Frontend এবং API আলাদা host-এ হলে `/api/trpc`, OAuth callback ও অন্যান্য API request-এর routing/rewrite configure ও test করুন। API, database, authentication এবং storage সচল হওয়ার পর Admin, post, translation, newsletter ও upload workflow যাচাই করুন। কোনো live production URL ধরে নেবেন না।

## ৫. ডোমেইন ও SEO

পূর্ণ app deploy ও smoke test হওয়ার পরে custom domain, HTTPS, sitemap এবং Google Search Console configure করুন। Frontend এবং API-র public URL/route একে অপরের সঙ্গে সামঞ্জস্যপূর্ণ কি না নিশ্চিত করুন।

## সমস্যা সমাধান

- **PostgreSQL connection failure:** runtime host-এর `DATABASE_URL`, Supabase project status, connection mode, SSL/network setting ও credential যাচাই করুন; URI প্রকাশ করবেন না।
- **Migration/table সমস্যা:** `drizzle-postgres/` active migration path যাচাই করুন; archived `drizzle-legacy-mysql/` কখনো PostgreSQL-এ চালাবেন না।
- **`/api/trpc` কাজ করে না:** Express API host ও frontend-to-API routing configure হয়েছে কি না পরীক্ষা করুন। Vercel static frontend একা API চালায় না।
- **Seed data:** `server/seedSamplePosts.mjs` PostgreSQL ব্যবহার করে এবং `DATABASE_URL` চায়, কিন্তু এর জন্য package-level `seed` script নেই। [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md) দেখুন।

## সহায়তা ও সম্পর্কিত নথি

- [README.md](./README.md)
- [VERCEL_SUPABASE_DEPLOYMENT.md](./VERCEL_SUPABASE_DEPLOYMENT.md)
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md)
