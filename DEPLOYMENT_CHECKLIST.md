# Vercel + Supabase ডিপ্লয়মেন্ট চেকলিস্ট

দ্রুত রেফারেন্সের জন্য এই চেকলিস্ট অনুসরণ করুন।

## ✅ প্রি-ডিপ্লয়মেন্ট চেকলিস্ট

### Supabase সেটআপ
- [ ] Supabase অ্যাকাউন্ট তৈরি করেছি
- [ ] নতুন প্রজেক্ট তৈরি করেছি (`blog-website`)
- [ ] Database password সেট করেছি
- [ ] Connection string কপি করেছি
- [ ] Connection string সংরক্ষণ করেছি

### লোকাল প্রস্তুতি
- [ ] ZIP ফাইল আনজিপ করেছি
- [ ] প্রজেক্ট ফোল্ডারে গেছি
- [ ] `npm install` অথবা `pnpm install` চালিয়েছি
- [ ] `.env.local` ফাইল তৈরি করেছি
- [ ] DATABASE_URL যোগ করেছি
- [ ] অন্যান্য environment variables যোগ করেছি
- [ ] `npm run db:push` চালিয়েছি

### GitHub সেটআপ
- [ ] GitHub অ্যাকাউন্ট আছে
- [ ] নতুন রেপোজিটরি তৈরি করেছি (`blog-website`)
- [ ] প্রজেক্ট GitHub-এ পুশ করেছি
- [ ] সব ফাইল আপলোড হয়েছে

---

## 🚀 ডিপ্লয়মেন্ট স্টেপস

### ধাপ ১: Supabase (10 মিনিট)
```bash
# 1. Supabase.com এ যান
# 2. Sign Up (GitHub দিয়ে)
# 3. নতুন প্রজেক্ট তৈরি করুন
# 4. Connection string কপি করুন
```

**আউটপুট:** `postgresql://postgres:PASSWORD@HOST:5432/postgres`

### ধাপ ২: লোকাল সেটআপ (5 মিনিট)
```bash
# ZIP আনজিপ করুন
unzip blog_website_complete.zip
cd blog_website

# ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# .env.local তৈরি করুন
nano .env.local  # অথবা আপনার এডিটর ব্যবহার করুন

# DATABASE_URL যোগ করুন এবং সেভ করুন
# অন্যান্য ভেরিয়েবলও যোগ করুন

# ডাটাবেস মাইগ্রেশন চালান
npm run db:push
```

### ধাপ ৩: GitHub (5 মিনিট)
```bash
# Git সেটআপ করুন
git init
git add .
git commit -m "Initial commit"

# রিমোট যোগ করুন
git remote add origin https://github.com/YOUR_USERNAME/blog-website.git
git branch -M main

# পুশ করুন
git push -u origin main
```

### ধাপ ৪: Vercel (10 মিনিট)
```bash
# 1. Vercel.com এ যান
# 2. Sign Up (GitHub দিয়ে)
# 3. Import Project
# 4. আপনার blog-website রেপোজিটরি নির্বাচন করুন
# 5. Environment Variables যোগ করুন:
#    - DATABASE_URL
#    - JWT_SECRET
#    - অন্যান্য সব ভেরিয়েবল
# 6. Deploy ক্লিক করুন
# 7. ডিপ্লয়মেন্ট সম্পন্ন হওয়ার জন্য অপেক্ষা করুন
```

**আউটপুট:** `https://blog-website-xxxxx.vercel.app`

---

## ✅ পোস্ট-ডিপ্লয়মেন্ট চেকলিস্ট

### সাইট পরীক্ষা
- [ ] হোমপেজ লোড হয় (`https://blog-website-xxxxx.vercel.app`)
- [ ] Admin Panel অ্যাক্সেসযোগ্য (`/admin`)
- [ ] লগইন কাজ করে
- [ ] পোস্ট তৈরি করা যায়
- [ ] ডাটাবেস সংযুক্ত আছে

### ডাটাবেস যাচাই
- [ ] Supabase ড্যাশবোর্ডে টেবিল দৃশ্যমান
- [ ] ডেটা সংরক্ষিত হচ্ছে
- [ ] কোনো ত্রুটি নেই

### নমুনা ডেটা (অপশনাল)
- [ ] নমুনা পোস্ট যোগ করেছি
- [ ] হোমপেজে দৃশ্যমান
- [ ] সব ভাষায় কাজ করে

### কাস্টম ডোমেইন (অপশনাল)
- [ ] ডোমেইন কিনেছি
- [ ] Vercel-এ যোগ করেছি
- [ ] DNS রেকর্ড কনফিগার করেছি
- [ ] কাস্টম ডোমেইনে কাজ করে

---

## 🔧 দ্রুত কমান্ড রেফারেন্স

```bash
# লোকাল ডেভেলপমেন্ট
npm run dev

# ডাটাবেস মাইগ্রেশন
npm run db:push

# নমুনা ডেটা যোগ করুন
npm run seed

# বিল্ড করুন
npm run build

# টেস্ট চালান
npm test

# লিন্ট চেক করুন
npm run lint
```

---

## 🐛 সাধারণ সমস্যা এবং সমাধান

| সমস্যা | সমাধান |
|--------|--------|
| DATABASE_URL ত্রুটি | Supabase connection string সঠিক কিনা চেক করুন |
| ডিপ্লয়মেন্ট ব্যর্থ | Vercel logs দেখুন, সব env vars সেট আছে কিনা চেক করুন |
| 404 ত্রুটি | ডিপ্লয়মেন্ট সম্পন্ন হওয়ার জন্য অপেক্ষা করুন |
| লগইন কাজ করে না | OAuth credentials সেট আছে কিনা চেক করুন |
| ডেটা সংরক্ষিত হয় না | ডাটাবেস সংযোগ চেক করুন, logs দেখুন |

---

## 📊 ডিপ্লয়মেন্ট সময়

| ধাপ | সময় |
|-----|------|
| Supabase সেটআপ | 10 মিনিট |
| লোকাল প্রস্তুতি | 5 মিনিট |
| GitHub সেটআপ | 5 মিনিট |
| Vercel ডিপ্লয়মেন্ট | 10 মিনিট |
| **মোট** | **30 মিনিট** |

---

## 🎯 পরবর্তী ধাপ

1. ✅ প্রথম পোস্ট তৈরি করুন
2. ✅ নিউজলেটার সেটআপ করুন
3. ✅ কাস্টম ডোমেইন যোগ করুন
4. ✅ Google Search Console সেটআপ করুন
5. ✅ সোশ্যাল মিডিয়ায় শেয়ার করুন

---

## 📞 সাহায্য প্রয়োজন?

- [Vercel ডকুমেন্টেশন](https://vercel.com/docs)
- [Supabase ডকুমেন্টেশন](https://supabase.com/docs)
- [GitHub সাপোর্ট](https://support.github.com)

---

**আপনার ব্লগ ডিপ্লয় করতে প্রস্তুত? শুরু করুন!** 🚀
