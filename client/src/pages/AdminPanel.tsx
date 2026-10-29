import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import PostListingTable from "@/components/PostListingTable";
import ImageUpload from "@/components/ImageUpload";
import SocialSharingMetricsDashboard from "@/components/SocialSharingMetricsDashboard";
import { useAutoSaveDraft } from "@/hooks/useAutoSaveDraft";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  MessageSquare,
  Palette,
  Send,
  Share2,
  Timer,
} from "lucide-react";

type FormData = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured: boolean;
  featuredImageUrl: string;
  status: "draft" | "published" | "archived";
  scheduledPublishDate: string;
};

const EMPTY_FORM: FormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  featured: false,
  featuredImageUrl: "",
  status: "draft",
  scheduledPublishDate: "",
};

function dateForInput(value?: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function formatDate(value?: Date | string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function AdminPanel() {
  const { user, loading } = useAuth();
  const [, params] = useRoute("/admin/:tab");
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const isAdmin = user?.role === "admin";
  const { data: posts = [], refetch: refetchPosts } = trpc.blog.getAllPosts.useQuery(undefined, {
    enabled: isAdmin,
  });
  const { data: postStats = [], refetch: refetchStats } = trpc.blog.getPostStatistics.useQuery(undefined, {
    enabled: isAdmin,
  });
  const { data: newsletterStats } = trpc.newsletter.getStats.useQuery(undefined, {
    enabled: isAdmin,
  });
  const newsletterSubscribe = trpc.newsletter.subscribe.useMutation();
  const utils = trpc.useUtils();

  const { loadDraft, deleteDraft } = useAutoSaveDraft(formData, {
    postId: editingPostId || undefined,
    saveInterval: 30000,
    onSave: async () => undefined,
  });

  const resetForm = () => {
    setEditingPostId(null);
    setFormData({ ...EMPTY_FORM });
  };

  const refreshPostData = async () => {
    await Promise.all([refetchPosts(), refetchStats()]);
  };

  const createPostMutation = trpc.blog.createPost.useMutation({
    onSuccess: async () => {
      toast.success(formData.scheduledPublishDate ? "Post scheduled successfully!" : "Blog post created successfully!");
      resetForm();
      deleteDraft();
      await refreshPostData();
    },
    onError: (error) => toast.error(error.message || "Failed to create blog post"),
  });

  const updatePostMutation = trpc.blog.updatePost.useMutation({
    onSuccess: async () => {
      toast.success(formData.scheduledPublishDate ? "Post schedule updated!" : "Blog post updated successfully!");
      resetForm();
      deleteDraft();
      await refreshPostData();
    },
    onError: (error) => toast.error(error.message || "Failed to update blog post"),
  });

  const deletePostMutation = trpc.blog.deletePost.useMutation({
    onSuccess: refreshPostData,
    onError: (error) => toast.error(error.message || "Failed to delete blog post"),
  });

  useEffect(() => {
    const draft = loadDraft();
    if (draft && (draft.title || draft.content || draft.scheduledPublishDate)) {
      setFormData((previous) => ({
        ...previous,
        title: draft.title || previous.title,
        slug: draft.slug || previous.slug,
        content: draft.content || previous.content,
        excerpt: draft.excerpt || previous.excerpt,
        featuredImageUrl: draft.featuredImageUrl || previous.featuredImageUrl,
        scheduledPublishDate: draft.scheduledPublishDate || previous.scheduledPublishDate,
        status: draft.status || previous.status,
      }));
      toast.info("Draft loaded from your previous session");
    }
  }, [loadDraft]);

  const statsByPostId = useMemo(
    () => new Map(postStats.map((stat) => [stat.postId, stat])),
    [postStats],
  );
  const postsWithStats = useMemo(
    () => posts.map((post) => ({ ...post, statistics: statsByPostId.get(post.id) })),
    [posts, statsByPostId],
  );
  const totalStats = useMemo(
    () => postStats.reduce(
      (totals, stat) => ({
        views: totals.views + stat.views,
        shares: totals.shares + stat.shares,
        comments: totals.comments + stat.comments,
        readTime: totals.readTime + stat.averageReadTimeSeconds,
      }),
      { views: 0, shares: 0, comments: 0, readTime: 0 },
    ),
    [postStats],
  );

  if (loading) {
    return <div className="container py-12 text-center"><p>Loading admin panel...</p></div>;
  }

  if (!isAdmin) {
    return (
      <div className="container py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
        <p className="text-foreground/70">You do not have permission to access this page.</p>
      </div>
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      toast.error("Please fill in the title, slug, and content");
      return;
    }

    const scheduledDate = formData.scheduledPublishDate
      ? new Date(formData.scheduledPublishDate)
      : null;
    if (scheduledDate && scheduledDate <= new Date()) {
      toast.error("Choose a future date and time for scheduled publishing");
      return;
    }

    setIsSubmitting(true);
    try {
      const status = scheduledDate ? "draft" : formData.status;
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        content: formData.content,
        status,
        featuredImageUrl: formData.featuredImageUrl || undefined,
        scheduledPublishDate: scheduledDate,
      };

      if (editingPostId) {
        await updatePostMutation.mutateAsync({ id: editingPostId, ...payload });
      } else {
        await createPostMutation.mutateAsync(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: any) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      featured: false,
      featuredImageUrl: post.featuredImageUrl || "",
      status: post.published,
      scheduledPublishDate: dateForInput(post.scheduledPublishDate),
    });
    setEditingPostId(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (postId: number) => {
    await deletePostMutation.mutateAsync({ id: postId });
  };

  const handleImageUpload = (url: string) => {
    setFormData((previous) => ({ ...previous, featuredImageUrl: url }));
  };

  const handleNewsletterSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newsletterEmail) return toast.error("Please enter an email address");
    setIsSubscribing(true);
    try {
      await newsletterSubscribe.mutateAsync({ email: newsletterEmail });
      toast.success("Subscriber added successfully");
      setNewsletterEmail("");
      await utils.newsletter.getStats.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Subscription failed");
    } finally {
      setIsSubscribing(false);
    }
  };

  const tab = params?.tab || "posts";

  return (
    <div className="container py-8">
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/75">Publisher workspace</p>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="mt-2 text-white/80">Plan, publish, measure, and grow your multilingual blog.</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-white/80"><CalendarClock className="h-4 w-4" /> Scheduled publishing ready</div>
            <p className="mt-1 text-xs text-white/65">Times are saved in UTC by the API.</p>
          </div>
        </div>
      </div>

      <Tabs value={tab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1 md:grid-cols-5">
          <TabsTrigger value="posts">Create & Schedule</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <Card className="p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{editingPostId ? "Edit Post" : "Create New Post"}</h2>
                <p className="mt-1 text-sm text-foreground/65">Publish now, save a draft, or choose a future date and time.</p>
              </div>
              {formData.scheduledPublishDate && (
                <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  <Clock3 className="h-4 w-4" /> Scheduled for {formatDate(formData.scheduledPublishDate)}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Title *</label>
                  <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter post title" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Slug *</label>
                  <Input name="slug" value={formData.slug} onChange={handleInputChange} placeholder="url-friendly-slug" required />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Excerpt</label>
                <Textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} placeholder="Brief summary of the post" rows={2} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Content *</label>
                <Textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Post content (HTML supported)" rows={10} required />
              </div>

              <div className="grid gap-5 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-800 dark:bg-indigo-950/25 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold"><CalendarClock className="h-4 w-4 text-indigo-600" /> Schedule publication</label>
                  <Input name="scheduledPublishDate" type="datetime-local" value={formData.scheduledPublishDate} onChange={handleInputChange} min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)} />
                  <p className="mt-2 text-xs text-foreground/60">Leave empty to use the status below. The scheduled post remains a draft until the publishing cron runs.</p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Publication status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Publish immediately</option>
                    <option value="archived">Archived</option>
                  </select>
                  <p className="mt-2 text-xs text-foreground/60">A schedule always takes priority and converts the post to a draft until its due time.</p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Featured Image</label>
                <ImageUpload onImageUpload={handleImageUpload} />
                {formData.featuredImageUrl && <img src={formData.featuredImageUrl} alt="Featured" className="mt-3 max-w-xs rounded-xl shadow" />}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  {isSubmitting ? "Saving..." : formData.scheduledPublishDate ? "Schedule Post" : editingPostId ? "Update Post" : "Create Post"}
                </Button>
                {editingPostId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
              </div>
            </form>

            <div className="mt-8 border-t pt-8">
              <PostListingTable posts={postsWithStats} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card className="p-6">
            <h2 className="text-xl font-bold">Comment Moderation</h2>
            <p className="mt-2 text-foreground/70">Comments remain pending until an administrator approves them. The detailed comment count is included in post statistics.</p>
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-8 text-center dark:from-blue-950/30 dark:to-purple-950/30">
              <MessageSquare className="mx-auto mb-3 h-10 w-10 text-indigo-600" />
              <p className="font-semibold">Moderation workflow is active</p>
              <p className="mt-2 text-sm text-foreground/65">Use the existing moderation actions when pending reader comments arrive.</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 text-white">
                <div className="flex items-center gap-3"><Mail className="h-8 w-8" /><div><h2 className="text-xl font-bold">Newsletter automation</h2><p className="text-sm text-white/80">Branded email delivery for every new story.</p></div></div>
              </div>
              <div className="p-6">
                <form onSubmit={handleNewsletterSubscribe} className="flex flex-col gap-3 sm:flex-row">
                  <Input type="email" placeholder="Add a subscriber email" value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} className="flex-1" />
                  <Button type="submit" disabled={isSubscribing} className="bg-emerald-600 hover:bg-emerald-700"><Send className="mr-2 h-4 w-4" />{isSubscribing ? "Adding..." : "Add subscriber"}</Button>
                </form>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-950/30"><p className="text-2xl font-bold text-emerald-600">{newsletterStats?.active ?? 0}</p><p className="text-xs text-foreground/65">Active</p></div>
                  <div className="rounded-xl bg-cyan-50 p-4 text-center dark:bg-cyan-950/30"><p className="text-2xl font-bold text-cyan-600">{newsletterStats?.total ?? 0}</p><p className="text-xs text-foreground/65">Total</p></div>
                  <div className="rounded-xl bg-purple-50 p-4 text-center dark:bg-purple-950/30"><p className="text-2xl font-bold text-purple-600">Auto</p><p className="text-xs text-foreground/65">Delivery</p></div>
                </div>
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm dark:border-emerald-800 dark:bg-emerald-950/20"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><p>Brand settings are controlled with <code>BLOG_BRAND_NAME</code>, <code>BLOG_LOGO_URL</code>, <code>BLOG_PRIMARY_COLOR</code>, and <code>BLOG_ACCENT_COLOR</code>.</p></div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="flex items-center gap-2 border-b px-6 py-4"><Palette className="h-5 w-5 text-pink-600" /><h3 className="font-bold">Branded email preview</h3></div>
              <div className="bg-slate-100 p-5 dark:bg-slate-900">
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slate-800">
                  <div className="bg-gradient-to-r from-indigo-600 to-pink-500 p-6 text-center text-white"><div className="mb-3 text-3xl">✦</div><p className="text-xs uppercase tracking-[0.2em] text-white/80">My Blog</p><h4 className="mt-3 text-2xl font-bold">A fresh story is waiting for you</h4></div>
                  <div className="p-6"><p className="text-xs font-bold uppercase tracking-[0.15em] text-pink-600">New on the blog</p><h4 className="mt-2 text-xl font-bold">Your next inspiring read</h4><p className="mt-3 text-sm leading-6 text-slate-600">The server template adds your logo, gradient colors, CTA button, responsive layout, and unsubscribe footer to every newsletter.</p><div className="mt-5 text-center"><span className="inline-block rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 px-5 py-3 text-sm font-bold text-white">Read the full post →</span></div></div>
                  <div className="border-t bg-slate-50 p-4 text-center text-xs text-slate-500">You received this because you subscribed · Unsubscribe</div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 dark:from-blue-950/30 dark:to-cyan-950/30"><Eye className="mb-3 h-5 w-5 text-blue-600" /><p className="text-3xl font-bold">{totalStats.views.toLocaleString()}</p><p className="text-sm text-foreground/65">Total views</p></Card>
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 p-5 dark:from-pink-950/30 dark:to-rose-950/30"><Share2 className="mb-3 h-5 w-5 text-pink-600" /><p className="text-3xl font-bold">{totalStats.shares.toLocaleString()}</p><p className="text-sm text-foreground/65">Total shares</p></Card>
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 dark:from-purple-950/30 dark:to-indigo-950/30"><MessageSquare className="mb-3 h-5 w-5 text-purple-600" /><p className="text-3xl font-bold">{totalStats.comments.toLocaleString()}</p><p className="text-sm text-foreground/65">Total comments</p></Card>
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:from-amber-950/30 dark:to-orange-950/30"><Timer className="mb-3 h-5 w-5 text-amber-600" /><p className="text-3xl font-bold">{Math.round(totalStats.readTime / Math.max(postStats.length, 1))}s</p><p className="text-sm text-foreground/65">Avg read time</p></Card>
          </div>

          <Card className="p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Detailed post statistics</h2><p className="text-sm text-foreground/65">Views, shares, comments, and average tracked reading time for every post.</p></div><div className="flex items-center gap-2 text-xs text-foreground/60"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Live from database</div></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b text-xs uppercase tracking-wide text-foreground/55"><th className="px-3 py-3">Post</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Views</th><th className="px-3 py-3">Shares</th><th className="px-3 py-3">Comments</th><th className="px-3 py-3">Avg. read time</th></tr></thead><tbody>{postsWithStats.map((post) => { const stat = post.statistics; return <tr key={post.id} className="border-b last:border-0"><td className="max-w-[280px] px-3 py-4"><p className="truncate font-semibold">{post.title}</p><p className="truncate text-xs text-foreground/55">/{post.slug}</p></td><td className="px-3 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold dark:bg-slate-800">{post.scheduledPublishDate ? "scheduled" : post.published}</span></td><td className="px-3 py-4 font-semibold">{stat?.views ?? post.viewCount ?? 0}</td><td className="px-3 py-4 font-semibold">{stat?.shares ?? 0}</td><td className="px-3 py-4 font-semibold">{stat?.comments ?? 0}</td><td className="px-3 py-4 font-semibold">{stat?.averageReadTimeSeconds ?? 0}s</td></tr>; })}</tbody></table></div>
          </Card>
          <Card className="p-6"><AnalyticsDashboard /><div className="mt-8 border-t pt-8"><SocialSharingMetricsDashboard /></div></Card>
        </TabsContent>

        <TabsContent value="settings"><Card className="p-6"><h2 className="text-xl font-bold">Blog Settings</h2><p className="mt-2 text-foreground/70">Use the deployment guide to configure your public URL, Heartbeat schedules, and email brand environment variables.</p></Card></TabsContent>
      </Tabs>
    </div>
  );
}
