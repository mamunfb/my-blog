# Vercel + Supabase: quick readiness guide

**সম্পূর্ণ app live—এমন নিশ্চয়তা নেই।** Supabase project `my-blog` (Singapore, ref `mbwtfbpoefqjfbnxozbx`) ও 11-table baseline তৈরি হয়েছে; সব table-এ RLS বন্ধ। Anon key expose করার আগে policy decision জরুরি। Production credentials, API hosting ও end-to-end verification বাকি.

## প্রথমে যে বিষয়গুলো ঠিক করুন

1. **Supabase PostgreSQL:** project তৈরি হয়েছে; dashboard থেকে connection URI নিয়ে শুধু Express API runtime host-এ secret হিসেবে রাখুন। URI docs/source control-এ নয়.
2. **Migration sets:** `drizzle-postgres/` হলো active PostgreSQL path; `0000_great_mulholland_black.sql` নতুন Supabase project-এ apply ও schema-verified হয়েছে। `drizzle-legacy-mysql/` পুরোনো MySQL archive—PostgreSQL-এ চালাবেন না.
3. **API hosting:** Express/tRPC server চালাতে পারে এমন Node.js runtime host বাছুন, অথবা আলাদা adapter implement ও verify করুন। এই source-এ Vercel Functions/Express adapter নেই।
4. **Frontend/API routing:** API আলাদা host-এ হলে `/api/trpc`, OAuth callback, public app URL এবং proxy/rewrite routing configure ও test করুন।
5. **Storage/secrets:** Supabase Storage bucket/policy ও app integration values নির্দিষ্ট করুন। OAuth, owner identity, `JWT_SECRET` ও external API credentials নিরাপদে API runtime host-এ configure করুন। কোনো `VITE_*` client value-এ secret দেবেন না।

## PostgreSQL connection format

Supabase dashboard থেকে আসল URI নিন; নিচেরটি placeholder format:

```text
postgresql://<user>:<password>@<host>:5432/<database>
```

## বর্তমান database commands

Package scripts-এ `pnpm db:generate`, `pnpm db:migrate` ও `pnpm db:push` আছে। `db:migrate`-এর জন্য `DATABASE_URL` দরকার; `db:push` generation এবং migration চালায়। Generated SQL review করে intended database-এ চালান; production-এ আগে backup ও rollout plan রাখুন।

`pnpm seed` বা `npm run seed` package script নেই। `server/seedSamplePosts.mjs`-কে `node server/seedSamplePosts.mjs` দিয়ে সরাসরি চালানো যায়; এটি `DATABASE_URL` এবং আগে তৈরি admin user চায়। PostgreSQL seed details ও সতর্কতার জন্য [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md) দেখুন।

## Vercel ব্যবহার করলে

Vercel frontend host হতে পারে, তবে complete app-এর জন্য Express runtime এবং সঠিক API routing প্রয়োজন। Vercel frontend environment-এ `DATABASE_URL` যোগ করলেই Express server database-এ যুক্ত হয় না—database ও server secret যে host process চালায়, সেখানে values দিতে হবে।

## কখন deployment-ready বলবেন

শুধু তখনই deployment/launch সম্পন্ন বলুন যখন PostgreSQL migration intended database-এ সফল, Express runtime চালু, frontend API-তে পৌঁছায়, authentication, database read/write এবং storage upload পরীক্ষা করা হয়েছে, এবং production secrets runtime-এ সেট আছে। এই নথি কোনো production URL বা live site ঘোষণা করছে না।

আরও তথ্য: [VERCEL_SUPABASE_DEPLOYMENT.md](./VERCEL_SUPABASE_DEPLOYMENT.md) · [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) · [README.md](./README.md)
