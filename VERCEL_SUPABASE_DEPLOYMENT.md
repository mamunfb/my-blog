# Vercel + Supabase ডিপ্লয়মেন্ট গাইড - সম্পূর্ণ সেটআপ

এই গাইডে আপনার ব্লগ Vercel এবং Supabase-এ ডিপ্লয় করার সম্পূর্ণ প্রক্রিয়া দেখানো হয়েছে।

---

## ধাপ 1: Supabase ডাটাবেস সেটআপ (10 মিনিট)

### 1.1 Supabase অ্যাকাউন্ট তৈরি করুন

1. যান: https://supabase.com
2. **Sign Up** ক্লিক করুন
3. GitHub অ্যাকাউন্ট দিয়ে সাইন আপ করুন (সবচেয়ে সহজ)
4. ইমেইল ভেরিফাই করুন

### 1.2 নতুন প্রজেক্ট তৈরি করুন

1. Supabase ড্যাশবোর্ডে যান
2. **New Project** ক্লিক করুন
3. প্রজেক্ট নাম দিন: `blog-website`
4. Password সেট করুন (নিরাপদ রাখুন)
5. Region নির্বাচন করুন (আপনার কাছাকাছি)
6. **Create new project** ক্লিক করুন
7. ৩-৫ মিনিট অপেক্ষা করুন

### 1.3 ডাটাবেস কানেকশন স্ট্রিং পান

1. Supabase ড্যাশবোর্ডে যান
2. বাম পাশে **Settings** ক্লিক করুন
3. **Database** নির্বাচন করুন
4. **Connection string** খুঁজুন
5. **URI** কপি করুন (এটি দেখতে এমন হবে):
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

**গুরুত্বপূর্ণ:** এই স্ট্রিং সংরক্ষণ করুন - পরে প্রয়োজন হবে!

---

## ধাপ 2: আপনার প্রজেক্ট প্রস্তুত করুন (5 মিনিট)

### 2.1 ZIP ফাইল আনজিপ করুন

```bash
unzip blog_website_complete.zip
cd blog_website
```

### 2.2 ডিপেন্ডেন্সি ইনস্টল করুন

```bash
npm install
# অথবা
pnpm install
```

### 2.3 .env.local ফাইল তৈরি করুন

প্রজেক্ট রুটে `.env.local` ফাইল তৈরি করুন:

```bash
cat > .env.local << 'EOF'
# Database
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@[YOUR_HOST]:5432/postgres

# JWT Secret (যেকোনো দীর্ঘ র্যান্ডম স্ট্রিং)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# OAuth (Vercel ডিপ্লয়মেন্টের পরে পাবেন)
VITE_APP_ID=your-app-id-here
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://app.manus.im

# Owner Info
OWNER_NAME=Your Name
OWNER_OPEN_ID=your-open-id

# API Keys (Vercel ডিপ্লয়মেন্টের পরে পাবেন)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
EOF
```

**গুরুত্বপূর্ণ:** `[YOUR_PASSWORD]` এবং `[YOUR_HOST]` Supabase থেকে পাওয়া স্ট্রিংয়ে রিপ্লেস করুন।

### 2.4 ডাটাবেস মাইগ্রেশন চালান

```bash
npm run db:push
# অথবা
pnpm db:push
```

এটি আপনার স্কিমা Supabase-এ তৈরি করবে।

---

## ধাপ 3: GitHub-এ পুশ করুন (5 মিনিট)

Vercel সহজেই GitHub থেকে ডিপ্লয় করতে পারে।

### 3.1 GitHub রেপোজিটরি তৈরি করুন

1. যান: https://github.com/new
2. রেপোজিটরি নাম: `blog-website`
3. **Public** নির্বাচন করুন
4. **Create repository** ক্লিক করুন

### 3.2 আপনার প্রজেক্ট পুশ করুন

```bash
cd blog_website

# Git ইনিশিয়ালাইজ করুন
git init
git add .
git commit -m "Initial commit: Blog website with Vercel + Supabase"

# GitHub রেপোজিটরি যোগ করুন
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blog-website.git
git push -u origin main
```

**নোট:** `YOUR_USERNAME` আপনার GitHub ইউজারনেম দিয়ে রিপ্লেস করুন।

---

## ধাপ 4: Vercel-এ ডিপ্লয় করুন (10 মিনিট)

### 4.1 Vercel অ্যাকাউন্ট তৈরি করুন

1. যান: https://vercel.com
2. **Sign Up** ক্লিক করুন
3. GitHub দিয়ে সাইন আপ করুন
4. অনুমতি দিন

### 4.2 নতুন প্রজেক্ট তৈরি করুন

1. Vercel ড্যাশবোর্ডে যান
2. **Add New** → **Project** ক্লিক করুন
3. আপনার `blog-website` রেপোজিটরি খুঁজুন
4. **Import** ক্লিক করুন

### 4.3 এনভায়রনমেন্ট ভেরিয়েবল সেট করুন

Vercel ডিপ্লয়মেন্ট পেজে:

1. **Environment Variables** সেকশন খুঁজুন
2. নিম্নলিখিত ভেরিয়েবল যোগ করুন:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
JWT_SECRET = your-super-secret-jwt-key-here
VITE_APP_ID = your-app-id
OAUTH_SERVER_URL = https://api.manus.im
VITE_OAUTH_PORTAL_URL = https://app.manus.im
OWNER_NAME = Your Name
OWNER_OPEN_ID = your-open-id
BUILT_IN_FORGE_API_URL = https://api.manus.im
BUILT_IN_FORGE_API_KEY = your-api-key
VITE_FRONTEND_FORGE_API_URL = https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY = your-frontend-key
VITE_ANALYTICS_ENDPOINT = https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID = your-website-id
```

### 4.4 ডিপ্লয় করুন

1. সব ভেরিয়েবল যোগ করার পর **Deploy** ক্লিক করুন
2. ডিপ্লয়মেন্ট সম্পন্ন হওয়ার জন্য অপেক্ষা করুন (২-৫ মিনিট)
3. সফল হলে আপনি একটি URL পাবেন: `https://blog-website-xxxxx.vercel.app`

---

## ধাপ 5: ডাটাবেস সেটআপ সম্পন্ন করুন (5 মিনিট)

### 5.1 Supabase-এ টেবিল তৈরি করুন

1. Supabase ড্যাশবোর্ডে যান
2. **SQL Editor** খুঁজুন
3. নতুন কোয়েরি তৈরি করুন
4. আপনার প্রজেক্টের `drizzle/` ফোল্ডার থেকে SQL ফাইল কপি করুন
5. Supabase SQL Editor-এ পেস্ট করুন এবং চালান

**অথবা** আরও সহজ উপায়:

```bash
# আপনার লোকাল মেশিনে
npm run db:push
```

এটি সব টেবিল তৈরি করবে।

---

## ধাপ 6: আপনার সাইট পরীক্ষা করুন

### 6.1 সাইট ভিজিট করুন

```
https://blog-website-xxxxx.vercel.app
```

আপনার ব্লগ হোমপেজ দেখতে পাবেন!

### 6.2 Admin Panel অ্যাক্সেস করুন

```
https://blog-website-xxxxx.vercel.app/admin
```

লগইন করুন এবং প্রথম পোস্ট তৈরি করুন।

### 6.3 নমুনা ডেটা যোগ করুন (অপশনাল)

```bash
# লোকাল মেশিনে
npm run seed
```

এটি ৪টি নমুনা পোস্ট যোগ করবে।

---

## ধাপ 7: কাস্টম ডোমেইন সংযুক্ত করুন (অপশনাল)

### 7.1 Vercel-এ ডোমেইন যোগ করুন

1. Vercel প্রজেক্ট সেটিংস খুঁজুন
2. **Domains** সেকশন খুঁজুন
3. আপনার ডোমেইন যোগ করুন
4. DNS রেকর্ড কনফিগার করুন (Vercel নির্দেশনা অনুসরণ করুন)

### 7.2 DNS সেটআপ

আপনার ডোমেইন প্রোভাইডারে (GoDaddy, Namecheap, etc.):

1. CNAME রেকর্ড যোগ করুন:
   - Name: `www`
   - Value: `cname.vercel-dns.com`

2. A রেকর্ড যোগ করুন (রুট ডোমেইনের জন্য):
   - Name: `@`
   - Value: `76.76.19.165`

---

## সমস্যা সমাধান

### ডাটাবেস কানেকশন ব্যর্থ

**সমস্যা:** `Connection refused` অথবা `ECONNREFUSED`

**সমাধান:**
1. DATABASE_URL সঠিক কিনা চেক করুন
2. Supabase প্রজেক্ট চালু আছে কিনা চেক করুন
3. পাসওয়ার্ড সঠিক কিনা চেক করুন

### ডিপ্লয়মেন্ট ব্যর্থ

**সমস্যা:** Build error অথবা deployment failed

**সমাধান:**
1. Vercel logs দেখুন
2. সব environment variables সেট আছে কিনা চেক করুন
3. GitHub রেপোজিটরি সঠিক কিনা চেক করুন

### সাইট খোলা যাচ্ছে না

**সমস্যা:** 404 অথবা blank page

**সমাধান:**
1. ডিপ্লয়মেন্ট সম্পন্ন হয়েছে কিনা অপেক্ষা করুন
2. ব্রাউজার ক্যাশ ক্লিয়ার করুন (Ctrl+Shift+Delete)
3. Vercel logs দেখুন

---

## পরবর্তী ধাপ

এখন আপনার ব্লগ লাইভ আছে! 🎉

1. **প্রথম পোস্ট তৈরি করুন** - Admin Panel-এ যান এবং পোস্ট তৈরি করুন
2. **নিউজলেটার সেটআপ করুন** - সাবস্ক্রাইবার সংগ্রহ করুন
3. **কাস্টম ডোমেইন যোগ করুন** - আপনার নিজস্ব ডোমেইন ব্যবহার করুন
4. **Google Search Console সেটআপ করুন** - SEO এর জন্য

---

## দরকারি লিঙ্ক

- [Vercel ড্যাশবোর্ড](https://vercel.com/dashboard)
- [Supabase ড্যাশবোর্ড](https://app.supabase.com)
- [GitHub রেপোজিটরি](https://github.com)
- [আপনার সাইট](https://blog-website-xxxxx.vercel.app)

---

## সাপোর্ট

কোনো সমস্যা হলে:
1. Vercel logs দেখুন
2. Supabase logs দেখুন
3. GitHub Issues খুলুন
4. আমাদের সাথে যোগাযোগ করুন

---

**অভিনন্দন! আপনার ব্লগ এখন লাইভ!** 🚀
