# Vercel + Supabase: quick readiness guide

**সম্পূর্ণ app live—এমন নিশ্চয়তা নেই।** Supabase project `my-blog` ও baseline তৈরি হয়েছে; ১১টি table-এ RLS চালু এবং public content-এর জন্য সাতটি read-only `SELECT` policy live। Client write policy নেই। Policy SQL `supabase/manual/`-এ archived, তবে active Drizzle migration chain-এ নেই। Server DB connection, runtime credentials, API hosting ও full-stack validation বাকি.

## প্রথমে যে বিষয়গুলো ঠিক করুন

1. **Supabase PostgreSQL:** project তৈরি হয়েছে; dashboard থেকে connection URI নিয়ে শুধু Express API runtime host-এ secret হিসেবে রাখুন। URI docs/source control-এ নয়.
2. **Migration sets:** `drizzle-postgres/` হলো active PostgreSQL path; baseline এবং RLS-enable migration apply হয়েছে। Live public-read policy SQL `supabase/manual/applied_public_read_rls_2026-10-29.sql`-এ archived, Drizzle chain-এ নেই—fresh DB-তে reproduce করার আগে reviewed migration হিসেবে যোগ ও পরীক্ষা করুন। `drizzle-legacy-mysql/` archive PostgreSQL-এ চালাবেন না.
3. **API hosting:** Vercel Container Runtime (Beta) root `Dockerfile` চালিয়ে Express/tRPC ও frontend একই origin-এ host করতে পারে। Vercel framework detection Vite বেছে নিলে Container preset নির্বাচন করুন। শুধু static Vite deployment complete app নয়।
4. **Frontend/API routing:** একই Vercel container-এ client ও API থাকলে same-origin route যাচাই করুন; API আলাদা host-এ হলে `/api/trpc`, OAuth callback, public app URL এবং proxy/rewrite configure ও test করুন।
5. **Storage/secrets:** Supabase Storage bucket/policy ও app integration values নির্দিষ্ট করুন। OAuth, owner identity, `JWT_SECRET` ও external API credentials নিরাপদে API runtime host-এ configure করুন। কোনো `VITE_*` client value-এ secret দেবেন না। Server-side DB role RLS bypass করলে public routes-এ published/approved filtering test করুন।

## PostgreSQL connection format

Supabase dashboard থেকে আসল URI নিন; নিচেরটি placeholder format:

```text
postgresql://<user>:<password>@<host>:5432/<database>
```

## বর্তমান database commands

Package scripts-এ `pnpm db:generate`, `pnpm db:migrate` ও `pnpm db:push` আছে। `db:migrate`-এর জন্য `DATABASE_URL` দরকার; `db:push` generation এবং migration চালায়। Generated SQL review করে intended database-এ চালান; production-এ আগে backup ও rollout plan রাখুন।

`pnpm seed` বা `npm run seed` package script নেই। `server/seedSamplePosts.mjs`-কে `node server/seedSamplePosts.mjs` দিয়ে সরাসরি চালানো যায়; এটি `DATABASE_URL` এবং আগে তৈরি admin user চায়। PostgreSQL seed details ও সতর্কতার জন্য [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md) দেখুন।

## Vercel ব্যবহার করলে

Vercel Container Runtime-এ root `Dockerfile` দিয়ে full Express app চালানো সম্ভব; project framework Container হওয়া দরকার, static Vite preset নয়। Container Runtime Beta সব plan-এ আছে; Hobby-তে monthly allowance সীমা ছাড়ালে অধিকাংশ ক্ষেত্রে quota reset না হওয়া পর্যন্ত feature pause হয়। `DATABASE_URL` ও server secret runtime environment-এ দিতে হবে। Vercel team-এ এখনও project/deployment তৈরি হয়নি।

## কখন deployment-ready বলবেন

শুধু তখনই deployment/launch সম্পন্ন বলুন যখন PostgreSQL migration intended database-এ সফল, Express runtime চালু, frontend API-তে পৌঁছায়, authentication, database read/write এবং storage upload পরীক্ষা করা হয়েছে, এবং production secrets runtime-এ সেট আছে। এই নথি কোনো production URL বা live site ঘোষণা করছে না।

আরও তথ্য: [VERCEL_SUPABASE_DEPLOYMENT.md](./VERCEL_SUPABASE_DEPLOYMENT.md) · [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) · [README.md](./README.md)
