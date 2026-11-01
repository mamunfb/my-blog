# My Blog — Admin Dashboard / Post Management পরিকল্পনা

**অবস্থা:** Phase 1 (সারসংক্ষেপ ও দ্রুত কাজ) source code-এ বাস্তবায়ন ও যাচাই করা হয়েছে। পরিবর্তনগুলো এখনো commit/push/deploy করা হয়নি; database schema অপরিবর্তিত।

## 1. বর্তমান অবস্থার সংক্ষিপ্ত নিরীক্ষা

প্রজেক্টে অ্যাডমিন ফিচার একেবারে নতুন করে বানানোর দরকার নেই—বেশ কিছু অংশ ইতিমধ্যে আছে। `client/src/App.tsx`-এ `/admin` এবং `/admin/:tab` `AdminPanel`-এ যায়। `client/src/pages/AdminPanel.tsx`-এ পোস্ট তৈরি/সম্পাদনা, draft/publish/schedule, autosave, পোস্ট তালিকা, analytics, newsletter ও settings-এর ভিত্তি আছে। `PostListingTable.tsx`-এ search, status/schedule, engagement metrics, view/edit/delete action রয়েছে। `AdminDashboard.tsx`-এ আলাদা list/editor/comment flow আছে, কিন্তু বর্তমান route-এ এটি ব্যবহৃত হচ্ছে না। `AdminPanel`-এর Comments tab এখন মূলত তথ্যবার্তা দেখায়; অন্যদিকে `AdminDashboard` ইতিমধ্যে `AdminCommentModeration` component ব্যবহার করে।

API ও ডেটাবেসেও ভিত্তি প্রস্তুত: `server/routers.ts`-এ post CRUD, statistics, pending comment এবং moderation procedure আছে; `server/db.ts`-এ Drizzle-এর মাধ্যমে PostgreSQL কাজ করে; `drizzle/schema.ts`-এ `posts`, `categories`, `tags`, `postTags`, `comments` ও `postDrafts` আছে। Browser থেকে সরাসরি Supabase-এ write না করে Express/tRPC-তেই database operation থাকবে। বিদ্যমান RLS/TLS setup অপরিবর্তিত থাকবে।

**সুপারিশ:** আরেকটি স্বতন্ত্র, তৃতীয় admin interface না বানিয়ে বর্তমান `AdminPanel`-কে একটি একক Admin Workspace-এ সাজানো; unused `AdminDashboard` ও পুনরাবৃত্ত post-list/editor flow থেকে প্রয়োজনীয় অংশ বেছে নিয়ে একীভূত করা।

## 2. লক্ষ্য ও প্রথম সংস্করণের পরিধি

প্রশাসক যেন এক জায়গা থেকে পোস্টের অবস্থা বুঝতে, পোস্ট খুঁজে/ফিল্টার করতে, নতুন পোস্ট লিখতে, প্রকাশ বা schedule করতে এবং মন্তব্য moderate করতে পারেন। মোবাইলেও প্রধান কাজগুলো ব্যবহারযোগ্য থাকবে।

### Overview — `/admin`

- মোট পোস্ট, Published, Draft, Scheduled এবং pending comment-এর সারসংক্ষেপ কার্ড।
- সাম্প্রতিক/পরিবর্তিত পোস্টের সংক্ষিপ্ত তালিকা, status ও তারিখসহ।
- দ্রুত কাজ: “নতুন পোস্ট”, “সব পোস্ট”, “pending comments”।
- বিদ্যমান analytics ও newsletter অংশে যাওয়ার স্পষ্ট navigation; বর্তমান analytics feature বাদ যাবে না।

### Post Management — `/admin/posts`

- সার্চ (title/slug), status filter (সব/Draft/Published/Scheduled/Archived), sort এবং server-side pagination।
- প্রতিটি সারিতে শিরোনাম, status, updated/published/scheduled তারিখ, views ও actions। ছোট পর্দায় table-কে card/list view-এ রূপান্তর।
- Edit, live post preview, schedule পরিবর্তন এবং delete-এর আগে নিশ্চিতকরণ। MVP-তে bulk delete/publish নয়—ভুলের ঝুঁকি কমাতে এক পোস্ট করে action।
- শূন্য ফল, loading, API error এবং retry-এর স্পষ্ট state।

### Post Editor — `/admin/posts/new`, `/admin/posts/:id/edit`

- Title, slug, excerpt, body, featured image, category/tag, status ও scheduled time.
- শিরোনাম থেকে slug প্রস্তাব করা যাবে; তবে slug আগে থেকে থাকলে server-এর validation error সহজভাবে দেখাতে হবে।
- বর্তমান `RichTextEditor`, `ImageUpload` ও autosave hook পুনর্ব্যবহারযোগ্যতা যাচাই করে ব্যবহার। Publish/schedule করার আগে preview ও unsaved-changes সতর্কতা।
- বিদ্যমান `posts`, `categories`, `tags`, `postTags` schema-র বাইরে MVP-তে নতুন table নয়।

### Comment Moderation — `/admin/comments`

- Pending comment-কে post/title, লেখক, content ও সময়সহ দেখানো।
- Approve এবং reject action-এর পর তালিকা refresh ও success/error feedback।
- বিদ্যমান `AdminCommentModeration` ও `getPendingComments`/`approveComment`/`rejectComment` ব্যবহার; placeholder text সরিয়ে কার্যকর UI যুক্ত করা।

### বিদ্যমান ফিচার রাখা

Newsletter, Analytics, Social Sharing Metrics ও Settings বর্তমান সুবিধা হিসেবে থাকবে; Admin Workspace navigation থেকে তাদের নির্দিষ্ট route/tab-এ পৌঁছানো যাবে। কোন ফিচার সরানো হবে না।

## 3. Route ও UI কাঠামো

Wouter route-গুলো নির্দিষ্ট ও nested path-এর জন্য সাজাতে হবে, যাতে সাধারণ `/admin/:tab` route `/admin/posts/new`-এর সঙ্গে সংঘর্ষ না করে। প্রস্তাবিত route: `/admin`, `/admin/posts`, `/admin/posts/new`, `/admin/posts/:id/edit`, `/admin/comments`, `/admin/analytics`, `/admin/newsletter`, `/admin/settings`। Route-গুলো সুনির্দিষ্ট থেকে সাধারণ ক্রমে নিবন্ধন করতে হবে। Tab নির্বাচন URL-এ প্রতিফলিত হবে; back/forward navigation-ও একই view ফিরিয়ে আনবে।

### সম্ভাব্য component বিভাজন

```text
client/src/
├── App.tsx                         # নির্দিষ্ট admin route-গুলো নিবন্ধন
├── pages/
│   ├── AdminPanel.tsx              # Admin Workspace shell; অথবা নতুন AdminLayout
│   ├── AdminOverview.tsx            # সারসংক্ষেপ ও quick actions
│   ├── AdminPostsPage.tsx           # তালিকা/ফিল্টার/pagination
│   └── AdminPostEditorPage.tsx      # নতুন/সম্পাদনা form
└── components/admin/
    ├── AdminSidebar.tsx             # desktop sidebar + mobile drawer
    ├── AdminKpiCards.tsx            # overview metrics
    ├── AdminPostTable.tsx           # responsive post list
    ├── AdminPostFilters.tsx         # search/status/sort
    └── AdminCommentQueue.tsx        # moderation list

server/
├── routers.ts                       # validated admin-only tRPC procedures
└── db.ts                            # paginated/filterable Drizzle queries

drizzle/
└── schema.ts                        # নতুন field/table কেবল প্রয়োজন প্রমাণিত হলে
```

নামের এই বিভাজন প্রস্তাব; implementation-এর সময় বিদ্যমান `PostListingTable.tsx`, `AdminPostEditor.tsx`, `AdminCommentModeration.tsx` ও `AdminPanel.tsx`-কে সরাসরি refactor/reuse করা হবে। `AdminDashboard.tsx`-কে নতুন route-এ অনির্দিষ্টভাবে রেখে দুটো সমান্তরাল admin UI চালু রাখা হবে না।

## 4. API, authorization ও data-handling

- `useAuth` ও Manus OAuth session ব্যবহার করে UI-তে admin-only screen দেখানো; loading অবস্থায় content flash না করা এবং unauthenticated/non-admin হলে নিরাপদ redirect বা access-denied state।
- এটি শুধু UX স্তর। প্রত্যেক list/read/write admin procedure-এ server-side `adminProcedure` বা সমমানের role guard আবশ্যক; browser-এর `user.role`-কে একমাত্র নিরাপত্তা ধরে নেওয়া যাবে না। `createPost`, `updatePost`, `deletePost`, statistics ও moderation-সহ বিদ্যমান endpoint-গুলোর guard একরূপ করা হবে।
- `getAllPosts` বর্তমানে সব পোস্ট ফেরায়; তালিকার জন্য input validation-সহ paginated query যোগ করা—যেমন `status`, bounded `limit`, `offset`/cursor, `search`, `sort`। count ও overview summary আলাদা, ছোট query থেকে আনা হবে; পুরো table browser-এ টেনে filtering নয়।
- Category/tag edit UI করার আগে বর্তমান router input ও DB persistence মিলিয়ে নেওয়া; schema-তে relation আছে, তবে category/tag options-এর admin query এবং update behavior ধারাবাহিক করতে হবে।
- Post update/delete এবং tag relation change-এ প্রয়োজনমতো transaction ব্যবহার; delete irreversible হওয়ায় confirmation বজায় রাখা। slug uniqueness এবং future schedule validation server-এও করতে হবে।
- কোনো Supabase service-role key বা database credential frontend-এ যাবে না। Express/tRPC হবে একমাত্র write path; TLS `verify-full` ও CA certificate-সহ বর্তমান deployment configuration থাকবে। MVP-তে RLS policy পরিবর্তন নয়।

## 5. Design সিদ্ধান্ত

- **দিকনির্দেশ:** বিদ্যমান My Blog-এর Tailwind/shadcn ও indigo/purple accent পুনর্ব্যবহার করে পরিচ্ছন্ন editorial control room; public blog-এর চেয়ে বেশি compact, কাজ-কেন্দ্রিক admin UI।
- **মূলনীতি:** দ্রুত স্ক্যান করা যায়; destructive action স্পষ্ট; form autosave/status দৃশ্যমান; mobile-এও primary action সহজে পাওয়া যায়।
- **রং/টাইপোগ্রাফি:** বর্তমান theme tokens ও font hierarchy বজায়; neutral surface-এ indigo primary action, amber schedule, green published, red destructive/error—রঙের পাশাপাশি text label-ও থাকবে।
- **Layout:** desktop-এ স্থির/সংকুচিত sidebar ও content area; mobile-এ drawer navigation, stacked cards এবং full-width controls। নতুন decorative image নয়।
- **Interaction:** tabs/routes সরাসরি deep-linkable; pending/saving state, toast feedback, skeleton, empty state; subtle transition, অতিরিক্ত animation নয়। Keyboard focus, label, dialog semantics ও contrast বজায়।
- **Brand voice:** সংক্ষিপ্ত, স্পষ্ট, কাজ নির্দেশ করে—যেমন “নতুন পোস্ট লিখুন”, “খসড়া সংরক্ষিত”, “প্রকাশের সময় নির্ধারণ করুন”।

## 6. বাস্তবায়নের অগ্রাধিকার

1. Admin route/layout ও role-gated navigation একীভূত করা; বিদ্যমান duplicated/unused admin page সিদ্ধান্তসহ সরল করা।
2. Posts list-কে filterable, paginated management view করা; overview summary ও quick actions যোগ করা।
3. Editor-কে categories/tags, preview, autosave feedback ও validation-সহ সম্পূর্ণ করা; server validation নিশ্চিত করা।
4. AdminPanel-এর Comments placeholder-কে কার্যকর moderation queue দিয়ে প্রতিস্থাপন করা; newsletter/analytics/settings-কে বিদ্যমান capability হিসেবে নির্দিষ্ট route-এ রাখা।
5. Implementation-এর সময় বিদ্যমান code checks ও নিরাপদ read-only validation ব্যবহার; live database-এ test data write নয়। প্রকাশের আগে preview deployment-এ admin login, non-admin denial এবং প্রধান management flow যাচাই করে তারপর Production deploy।

## 7. সীমা ও অনুমান

- প্রথম সংস্করণে একটি `admin` role-ই থাকবে; editor/moderator-সহ বহু role, audit log ও bulk action আলাদা ভবিষ্যৎ scope।
- বর্তমান PostgreSQL/Supabase ও Vercel Container deployment-ই বজায় থাকবে; dashboard-এর জন্য নতুন hosting বা managed service প্রয়োজন নেই।
- Database migration কেবল প্রকৃত প্রয়োজন দেখা দিলে হবে; আগে বিদ্যমান schema, endpoint ও auth contract পুনর্ব্যবহার।

## 8. Phase 1 বাস্তবায়ন অবস্থা

- `/admin` এখন Bengali overview দেখায়: মোট, প্রকাশিত, খসড়া, নির্ধারিত পোস্ট ও অপেক্ষমাণ মন্তব্যের সংখ্যা; সঙ্গে সর্বশেষ আপডেট হওয়া সর্বোচ্চ পাঁচটি পোস্ট।
- দ্রুত কাজের link-গুলো বিদ্যমান পোস্ট, অ্যানালিটিক্স ও নিউজলেটার পৃষ্ঠায় যায়। Existing `/admin/:tab` flow রাখা হয়েছে এবং tab নির্বাচন URL-এর সঙ্গে যুক্ত।
- সারাংশটি `adminProcedure` দ্বারা সুরক্ষিত tRPC endpoint থেকে আসে। Database query aggregate count ব্যবহার করে এবং কেবল পাঁচটি সাম্প্রতিক post summary ফেরায়; কোনো schema migration বা production data write হয়নি।
- `pnpm check`, `pnpm test` (৫টি test pass) এবং `pnpm build` সফল হয়েছে। Build-এ analytics environment placeholder ও bundle-size সংক্রান্ত সতর্কতা রয়ে গেছে।
- পরিবর্তনগুলো local working copy-তে আছে; GitHub push ও Production deploy পরবর্তী স্পষ্ট অনুমোদন/ধাপের অপেক্ষায়।
