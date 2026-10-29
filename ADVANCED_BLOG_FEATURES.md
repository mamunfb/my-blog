# Advanced Blog Features

এই নথিতে app-এর feature ও setup notes রয়েছে। Database/deployment status সম্পর্কে README এবং deployment guide-এর সতর্কতাগুলো প্রযোজ্য: active PostgreSQL migration path `drizzle-postgres/`; পুরোনো MySQL migration chain `drizzle-legacy-mysql/` archive হিসেবে রাখা হয়েছে। Supabase project `my-blog` ও baseline schema তৈরি/apply হয়েছে; RLS policy, runtime credentials, API hosting এবং production setup এখনও configure/verify করতে হবে।

## 1. Post scheduling

Admin Panel → **Create & Schedule** থেকে `Schedule publication`-এ ভবিষ্যতের তারিখ ও সময় নির্বাচন করুন। সময় API layer-এ UTC timestamp হিসেবে রাখা হয়। Scheduled post `draft` থাকে এবং নির্ধারিত সময় হলে Heartbeat cron endpoint সেটিকে `published` করে। Endpoint ও scheduled job ব্যবহার করার আগে API runtime host এবং callback access configure ও পরীক্ষা করুন।

Heartbeat job-এর উদাহরণ (শুধু সংশ্লিষ্ট Manus runtime/Heartbeat deployment সমর্থিত হলে):

```bash
manus-heartbeat create \
  --name blog-scheduled-publisher \
  --cron "0 */5 * * * *" \
  --path /api/scheduled/publish-posts
```

Newsletter job আলাদা রাখতে হবে:

```bash
manus-heartbeat create \
  --name newsletter-email-notification \
  --cron "0 0 9 * * *" \
  --path /api/scheduled/newsletter-email
```

## 2. Branded newsletter email

Email handler `server/newsletterEmailHandler.ts` branded HTML email template তৈরি করে। Template configuration server-side environment-এ দিন; বাস্তব values বা credentials source control-এ দেবেন না।

```env
BLOG_BRAND_NAME=<your-blog-name>
BLOG_LOGO_URL=<public-logo-url>
BLOG_PRIMARY_COLOR=<hex-color>
BLOG_ACCENT_COLOR=<hex-color>
VITE_APP_URL=<public-app-url>
OWNER_EMAIL=<owner-email>
```

`BLOG_LOGO_URL` না দিলে template text mark ব্যবহার করতে পারে। Email ও external service behavior runtime host-এ configure ও test করুন।

## 3. Detailed post statistics

Post analytics-এর database schema এবং API behavior deployment-এর database implementation ও migrations-এর সঙ্গে সামঞ্জস্যপূর্ণ হতে হবে। Production-এ চালুর আগে database query, event recording এবং admin display test করুন।

## Database migration status

`drizzle.config.ts` বর্তমানে PostgreSQL dialect ব্যবহার করে এবং migration output `drizzle-postgres/`-এ দেয়। Active PostgreSQL migration set-এর প্রথম ফাইল `drizzle-postgres/0000_great_mulholland_black.sql`; migration changes production-এ apply করার আগে review এবং non-production database-এ validate করুন.

`drizzle-legacy-mysql/`-এ পূর্ববর্তী MySQL migrations ও snapshots archive হিসেবে আছে। এগুলো PostgreSQL/Supabase-এ প্রয়োগ করবেন না। Current schema/relations `drizzle/`-এ।

বর্তমান package scripts:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:push
```

`db:migrate`-এর জন্য `DATABASE_URL` দরকার; `db:push` generation ও migration একসাথে চালায়। Target যাচাই ও generated SQL review করে তবেই চালান।

## Verification commands

Package scripts-এ বর্তমানে আছে:

```bash
pnpm check
pnpm test
pnpm build
```

Successful typecheck/build একাই Supabase database, production host বা full-stack readiness প্রমাণ করে না।
