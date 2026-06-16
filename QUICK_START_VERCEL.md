# দ্রুত শুরু - Vercel + Supabase (৩০ মিনিটে)

এই গাইড অনুসরণ করে ৩০ মিনিটে আপনার ব্লগ লাইভ করুন!

---

## 📋 প্রয়োজনীয় জিনিস

আগে এগুলো প্রস্তুত করুন:
- GitHub অ্যাকাউন্ট
- Vercel অ্যাকাউন্ট
- Supabase অ্যাকাউন্ট
- আপনার কম্পিউটারে Node.js ইনস্টল করা
- ZIP ফাইল ডাউনলোড করা

---

## ⏱️ ধাপ ১: Supabase ডাটাবেস (10 মিনিট)

### ১. Supabase-এ যান

```
https://supabase.com
```

### ২. Sign Up করুন

- **Sign Up** ক্লিক করুন
- GitHub দিয়ে সাইন আপ করুন
- ইমেইল ভেরিফাই করুন

### ৩. নতুন প্রজেক্ট তৈরি করুন

```
Dashboard → New Project
```

ফর্ম পূরণ করুন:
- **Project name:** `blog-website`
- **Password:** কোনো শক্তিশালী পাসওয়ার্ড (মনে রাখুন!)
- **Region:** আপনার কাছাকাছি (যেমন: Asia-Southeast1)

**Create new project** ক্লিক করুন এবং ৩-৫ মিনিট অপেক্ষা করুন।

### ৪. Connection String কপি করুন

প্রজেক্ট তৈরি হলে:

```
Settings → Database → Connection Strings → URI
```

এটি দেখতে এমন হবে:
```
postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres
```

**এটি কপি করুন এবং নিরাপদ জায়গায় রাখুন!**

---

## ⏱️ ধাপ ২: লোকাল সেটআপ (5 মিনিট)

### ১. ZIP ফাইল আনজিপ করুন

```bash
unzip blog_website_complete.zip
cd blog_website
```

### ২. ডিপেন্ডেন্সি ইনস্টল করুন

```bash
npm install
```

(অথবা `pnpm install` যদি pnpm ব্যবহার করেন)

### ৩. .env.local ফাইল তৈরি করুন

আপনার টেক্সট এডিটর খুলুন এবং নতুন ফাইল তৈরি করুন: `.env.local`

নিম্নলিখিত কন্টেন্ট যোগ করুন:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres
JWT_SECRET=my-super-secret-key-that-is-very-long-and-random-12345
VITE_APP_ID=test-app
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://app.manus.im
OWNER_NAME=Your Name
OWNER_OPEN_ID=test-id
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=test-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=test-key
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=test-id
```

**গুরুত্বপূর্ণ:** `YOUR_PASSWORD` এবং `YOUR_HOST` Supabase থেকে পাওয়া স্ট্রিংয়ে রিপ্লেস করুন।

এই ফাইল প্রজেক্ট রুটে রাখুন (blog_website ফোল্ডারে)।

### ৪. ডাটাবেস সেটআপ করুন

```bash
npm run db:push
```

এটি আপনার সব টেবিল Supabase-এ তৈরি করবে।

---

## ⏱️ ধাপ ৩: GitHub-এ পুশ করুন (5 মিনিট)

### ১. GitHub রেপোজিটরি তৈরি করুন

```
https://github.com/new
```

ফর্ম পূরণ করুন:
- **Repository name:** `blog-website`
- **Public** নির্বাচন করুন
- **Create repository** ক্লিক করুন

### ২. আপনার প্রজেক্ট পুশ করুন

টার্মিনালে (blog_website ফোল্ডারে):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blog-website.git
git push -u origin main
```

**নোট:** `YOUR_USERNAME` আপনার GitHub ইউজারনেম দিয়ে রিপ্লেস করুন।

---

## ⏱️ ধাপ ৪: Vercel-এ ডিপ্লয় করুন (10 মিনিট)

### ১. Vercel-এ যান

```
https://vercel.com
```

### ২. Sign Up করুন

- **Sign Up** ক্লিক করুন
- GitHub দিয়ে সাইন আপ করুন
- অনুমতি দিন

### ৩. প্রজেক্ট ইমপোর্ট করুন

```
Add New → Project
```

আপনার `blog-website` রেপোজিটরি খুঁজুন এবং **Import** ক্লিক করুন।

### ৪. Environment Variables যোগ করুন

**Environment Variables** সেকশনে যান এবং নিম্নলিখিত যোগ করুন:

```
DATABASE_URL = postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres
JWT_SECRET = my-super-secret-key-that-is-very-long-and-random-12345
VITE_APP_ID = test-app
OAUTH_SERVER_URL = https://api.manus.im
VITE_OAUTH_PORTAL_URL = https://app.manus.im
OWNER_NAME = Your Name
OWNER_OPEN_ID = test-id
BUILT_IN_FORGE_API_URL = https://api.manus.im
BUILT_IN_FORGE_API_KEY = test-key
VITE_FRONTEND_FORGE_API_URL = https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY = test-key
VITE_ANALYTICS_ENDPOINT = https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID = test-id
```

### ৫. ডিপ্লয় করুন

**Deploy** ক্লিক করুন এবং ২-৫ মিনিট অপেক্ষা করুন।

সফল হলে আপনি পাবেন:
```
https://blog-website-xxxxx.vercel.app
```

---

## ✅ সাইট পরীক্ষা করুন

### ১. হোমপেজ ভিজিট করুন

```
https://blog-website-xxxxx.vercel.app
```

আপনার ব্লগ হোমপেজ দেখতে পাবেন!

### ২. Admin Panel অ্যাক্সেস করুন

```
https://blog-website-xxxxx.vercel.app/admin
```

লগইন করুন এবং প্রথম পোস্ট তৈরি করুন।

### ৩. পোস্ট তৈরি করুন

Admin Panel-এ:
1. **Create Post** ট্যাবে যান
2. টাইটেল লিখুন (যেমন: "আমার প্রথম পোস্ট")
3. কন্টেন্ট লিখুন
4. **Create Post** ক্লিক করুন

হোমপেজে আপনার পোস্ট দেখতে পাবেন!

---

## 🎉 সম্পন্ন!

আপনার ব্লগ এখন লাইভ! 🚀

**এখন আপনি করতে পারেন:**

1. আরও পোস্ট তৈরি করুন
2. নিউজলেটার সেটআপ করুন
3. কাস্টম ডোমেইন যোগ করুন
4. সোশ্যাল মিডিয়ায় শেয়ার করুন

---

## 🆘 সমস্যা হলে

### ডাটাবেস কানেকশন ত্রুটি

```
Error: Connection refused
```

**সমাধান:**
1. DATABASE_URL সঠিক কিনা চেক করুন
2. পাসওয়ার্ড সঠিক কিনা চেক করুন
3. Supabase প্রজেক্ট চালু আছে কিনা চেক করুন

### ডিপ্লয়মেন্ট ব্যর্থ

```
Build failed
```

**সমাধান:**
1. Vercel logs দেখুন (Deployments → ক্লিক করুন)
2. সব environment variables সেট আছে কিনা চেক করুন
3. GitHub রেপোজিটরি সঠিক কিনা চেক করুন

### সাইট খোলা যাচ্ছে না

```
404 Not Found
```

**সমাধান:**
1. ডিপ্লয়মেন্ট সম্পন্ন হওয়ার জন্য অপেক্ষা করুন
2. ব্রাউজার ক্যাশ ক্লিয়ার করুন (Ctrl+Shift+Delete)
3. কয়েক মিনিট অপেক্ষা করুন এবং রিফ্রেশ করুন

---

## 📚 আরও তথ্য

- [VERCEL_SUPABASE_DEPLOYMENT.md](./VERCEL_SUPABASE_DEPLOYMENT.md) - বিস্তারিত গাইড
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - চেকলিস্ট
- [README.md](./README.md) - ফিচার ওভারভিউ

---

**আপনার ব্লগ এখন লাইভ! অভিনন্দন!** 🎊
