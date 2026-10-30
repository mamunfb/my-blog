import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  ArrowRight,
  CalendarClock,
  ChartNoAxesCombined,
  Clock3,
  FileText,
  Mail,
  MessageSquare,
  PenLine,
  RefreshCw,
} from "lucide-react";
import { useLocation } from "wouter";

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function postStatusLabel(status: "draft" | "published" | "archived", scheduled: boolean) {
  if (scheduled) return "নির্ধারিত";
  if (status === "published") return "প্রকাশিত";
  if (status === "archived") return "সংরক্ষিত";
  return "খসড়া";
}

function postStatusClass(status: "draft" | "published" | "archived", scheduled: boolean) {
  if (scheduled) return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200";
  if (status === "published") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200";
  if (status === "archived") return "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-200";
}

export default function AdminOverview() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const loginUrl = getLoginUrl();
  const isAdmin = user?.role === "admin";
  const { data, isLoading, isFetching, error, refetch } = trpc.blog.getAdminOverview.useQuery(undefined, {
    enabled: isAdmin,
    retry: false,
  });

  if (loading) {
    return (
      <main className="container py-10" aria-live="polite">
        <div className="mb-8 space-y-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-32 rounded-2xl" />)}
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="container py-12 text-center">
        <h1 className="mb-3 text-2xl font-bold">{loginUrl ? "প্রবেশাধিকার নেই" : "Preview-তে লগইন সেটআপ নেই"}</h1>
        <p className="mx-auto max-w-xl text-foreground/70">
          {loginUrl
            ? "এই পৃষ্ঠাটি শুধু অ্যাডমিন ব্যবহারকারীদের জন্য।"
            : "এই Preview deployment-এ OAuth environment variables সেট নেই। তাই অ্যাডমিন হিসেবে প্রবেশ করা যাচ্ছে না; Production-এর secrets Preview-তে কপি করা হয়নি।"}
        </p>
        {loginUrl && (
          <Button className="mt-6 mr-2" onClick={() => window.location.assign(loginUrl)}>সাইন ইন</Button>
        )}
        <Button className="mt-6" variant="outline" onClick={() => navigate("/")}>ব্লগে ফিরে যান</Button>
      </main>
    );
  }

  const stats = data ?? {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    scheduledPosts: 0,
    pendingComments: 0,
    recentPosts: [],
  };

  const metrics = [
    { label: "মোট পোস্ট", value: stats.totalPosts, icon: FileText, tone: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950/50" },
    { label: "প্রকাশিত", value: stats.publishedPosts, icon: PenLine, tone: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50" },
    { label: "খসড়া", value: stats.draftPosts, icon: Clock3, tone: "text-amber-700 bg-amber-100 dark:bg-amber-950/50" },
    { label: "নির্ধারিত", value: stats.scheduledPosts, icon: CalendarClock, tone: "text-sky-700 bg-sky-100 dark:bg-sky-950/50" },
    { label: "অপেক্ষমাণ মন্তব্য", value: stats.pendingComments, icon: MessageSquare, tone: "text-rose-700 bg-rose-100 dark:bg-rose-950/50" },
  ];

  const quickActions = [
    { label: "নতুন পোস্ট লিখুন", detail: "লিখুন, খসড়া রাখুন বা প্রকাশের সময় দিন", icon: PenLine, path: "/admin/posts" },
    { label: "সব পোস্ট দেখুন", detail: "পোস্টের অবস্থা ও পরিসংখ্যান দেখুন", icon: FileText, path: "/admin/posts#post-list" },
    { label: "অ্যানালিটিক্স", detail: "পাঠ ও engagement-এর সারাংশ দেখুন", icon: ChartNoAxesCombined, path: "/admin/analytics" },
    { label: "নিউজলেটার", detail: "সাবস্ক্রাইবার ও ইমেইল সেটিংস দেখুন", icon: Mail, path: "/admin/newsletter" },
  ];

  return (
    <main className="container space-y-8 py-8 md:py-10">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-700 p-6 text-white shadow-lg md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">My Blog · প্রকাশক কর্মক্ষেত্র</p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">অ্যাডমিন সারসংক্ষেপ</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">পোস্ট, নির্ধারিত প্রকাশনা ও পাঠকের প্রতিক্রিয়া এক নজরে দেখুন।</p>
          </div>
          <Button className="shrink-0 bg-white text-indigo-800 hover:bg-white/90" onClick={() => navigate("/admin/posts")}>
            <PenLine className="mr-2 h-4 w-4" /> নতুন পোস্ট
          </Button>
        </div>
      </section>

      {error && (
        <Card className="flex flex-col gap-3 border-destructive/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">সারসংক্ষেপ লোড করা যায়নি</h2>
            <p className="mt-1 text-sm text-foreground/65">{error.message || "আবার চেষ্টা করুন।"}</p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> আবার চেষ্টা করুন
          </Button>
        </Card>
      )}

      <section aria-label="ব্লগের সারসংক্ষেপ" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-foreground/65">{label}</p>
                {isLoading ? <Skeleton className="mt-3 h-8 w-16" /> : <p className="mt-2 text-3xl font-bold tabular-nums">{value.toLocaleString("bn-BD")}</p>}
              </div>
              <span className={`rounded-xl p-2.5 ${tone}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
            </div>
          </Card>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">দ্রুত কাজ</h2>
            <p className="mt-1 text-sm text-foreground/65">প্রায়ই ব্যবহৃত ব্যবস্থাপনা পাতায় সরাসরি যান।</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(({ label, detail, icon: Icon, path }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(path)}
              className="group flex min-h-28 items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-indigo-950/20"
            >
              <span className="rounded-xl bg-indigo-100 p-2.5 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 font-semibold">{label}<ArrowRight className="h-4 w-4 shrink-0 text-foreground/45 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                <span className="mt-1 block text-sm leading-5 text-foreground/60">{detail}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <Card className="overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div>
              <h2 className="text-xl font-bold">সাম্প্রতিক পোস্ট</h2>
              <p className="mt-1 text-sm text-foreground/65">সর্বশেষ আপডেট হওয়া পাঁচটি পোস্ট।</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/admin/posts#post-list")}>
              সব পোস্ট <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3 p-5 md:p-6" aria-live="polite">
              {[0, 1, 2].map((item) => <Skeleton key={item} className="h-12 w-full" />)}
            </div>
          ) : stats.recentPosts.length === 0 ? (
            <div className="px-5 py-12 text-center md:px-6">
              <FileText className="mx-auto h-9 w-9 text-foreground/40" aria-hidden="true" />
              <h3 className="mt-3 font-semibold">এখনও কোনো পোস্ট নেই</h3>
              <p className="mt-1 text-sm text-foreground/65">প্রথম পোস্টটি লিখে আপনার ব্লগ শুরু করুন।</p>
              <Button className="mt-5" onClick={() => navigate("/admin/posts")}><PenLine className="mr-2 h-4 w-4" /> নতুন পোস্ট লিখুন</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-foreground/55">
                  <tr>
                    <th className="px-5 py-3 font-medium md:px-6">পোস্ট</th>
                    <th className="px-5 py-3 font-medium">অবস্থা</th>
                    <th className="px-5 py-3 font-medium">সর্বশেষ আপডেট</th>
                    <th className="px-5 py-3 text-right font-medium md:px-6">লিংক</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentPosts.map((post) => {
                    const scheduled = Boolean(post.scheduledPublishDate);
                    return (
                      <tr key={post.id} className="border-t border-border">
                        <td className="max-w-[360px] px-5 py-4 md:px-6">
                          <p className="truncate font-semibold">{post.title}</p>
                          <p className="mt-0.5 truncate text-xs text-foreground/55">/{post.slug}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${postStatusClass(post.published, scheduled)}`}>
                            {postStatusLabel(post.published, scheduled)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-foreground/65">{formatDate(post.updatedAt)}</td>
                        <td className="px-5 py-4 text-right md:px-6">
                          <a href={`/blog/${encodeURIComponent(post.slug)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300">
                            দেখুন <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {isLoading && <span className="sr-only">সারসংক্ষেপ লোড হচ্ছে</span>}
        </Card>
      </section>
    </main>
  );
}
