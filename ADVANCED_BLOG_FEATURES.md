# Advanced Blog Features

এই সংস্করণে তিনটি requested feature production-ready করা হয়েছে।

## 1. Post scheduling

Admin Panel → **Create & Schedule** থেকে `Schedule publication`-এ ভবিষ্যতের তারিখ ও সময় নির্বাচন করুন। সময় API layer-এ UTC timestamp হিসেবে রাখা হয়। Scheduled post `draft` থাকে এবং নির্ধারিত সময় হলে Heartbeat cron endpoint সেটিকে `published` করে।

Heartbeat job-এর উদাহরণ:

```bash
manus-heartbeat create \
  --name blog-scheduled-publisher \
  --cron "0 */5 * * * *" \
  --path /api/scheduled/publish-posts
```

এটি প্রতি ৫ মিনিটে due পোস্ট publish করবে। Newsletter job আলাদা রাখতে হবে:

```bash
manus-heartbeat create \
  --name newsletter-email-notification \
  --cron "0 0 9 * * *" \
  --path /api/scheduled/newsletter-email
```

## 2. Branded newsletter email

Email handler `server/newsletterEmailHandler.ts` একটি responsive HTML template তৈরি করে। Template-এ logo, gradient header, CTA, blog link এবং unsubscribe footer থাকে। LLM শুধু ছোট email copy তৈরি করে; layout এবং brand wrapper server-side controlled থাকে।

Vercel বা production environment-এ এগুলো যোগ করুন:

```env
BLOG_BRAND_NAME=My Blog
BLOG_LOGO_URL=https://your-cdn.example.com/logo.png
BLOG_PRIMARY_COLOR=#4f46e5
BLOG_ACCENT_COLOR=#ec4899
VITE_APP_URL=https://your-domain.example
OWNER_EMAIL=hello@your-domain.example
```

`BLOG_LOGO_URL` না দিলে template text mark ব্যবহার করবে।

## 3. Detailed post statistics

প্রতিটি পোস্টের জন্য database-এ নিচের ইভেন্ট track হয়:

- `view`: article খুললে `posts.viewCount` বাড়ে
- `share`: Facebook, X/Twitter, LinkedIn, WhatsApp, Telegram, Email/Copy share
- `comment`: engagement event schema-তে available; comment count comments table থেকে aggregate হয়
- `read_time`: article page ছাড়ার সময় tracked seconds সংরক্ষিত হয়

Admin Panel → **Analytics** এবং **Create & Schedule**-এর post table-এ views, shares, comments, average read time এবং schedule status দেখা যায়।

## Database migration

নতুন migration:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

বর্তমান migration `drizzle/0005_steady_xorn.sql`-এ `posts.scheduledPublishDate` যোগ করা হয়েছে।

## Verification

```bash
pnpm check
pnpm test
pnpm build
```

সবগুলো command ZIP তৈরির আগে সফলভাবে চালানো হয়েছে।
