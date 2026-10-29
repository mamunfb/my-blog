import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import ReadingTime from "@/components/ReadingTime";
import EnhancedSocialShare from "@/components/EnhancedSocialShare";
import PostRating from "@/components/PostRating";
import TableOfContents from "@/components/TableOfContents";
import PopularPosts from "@/components/PopularPosts";
import TagCloud from "@/components/TagCloud";
import {
  Calendar,
  User,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useLanguageTracking } from "@/hooks/useLanguageTracking";
import { useTranslation } from "@/contexts/TranslationContext";
import Breadcrumb from "@/components/Breadcrumb";
import CommentSection from "@/components/CommentSection";
import { getOptimizedImageUrl, setupLazyLoadingObserver } from "@/lib/imageOptimization";
import {
  setMetaTags,
  setHrefLangLinks,
  generateBlogPostSchema,
  setStructuredData,
  getLanguageKeywords,
} from "@/lib/seoUtils";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [commentText, setCommentText] = useState("");
  const { language } = useTranslation();
  useLanguageTracking(undefined); // Will be updated when post loads

  const { user, isAuthenticated } = useAuth();
  const { data: categories } = trpc.blog.getAllCategories.useQuery();
  const { data: post, isLoading: postLoading } = trpc.blog.getPostBySlug.useQuery(
    { slug: params?.slug || "" },
    { enabled: !!params?.slug }
  );
  const { data: comments, isLoading: commentsLoading } =
    trpc.blog.getPostComments.useQuery(
      { postId: post?.id || 0 },
      { enabled: !!post?.id }
    );
  const utils = trpc.useUtils();
  const trackEngagement = trpc.blog.trackEngagement.useMutation();
  const readingStartedAt = useRef<number | null>(null);
  const createCommentMutation = trpc.blog.createComment.useMutation({
    onSuccess: () => {
      toast.success("Comment submitted for moderation");
      setCommentText("");
      if (post?.id) {
        utils.blog.getPostComments.invalidate({ postId: post.id });
      }
    },
    onError: () => {
      toast.error("Failed to submit comment");
    },
  });

  useEffect(() => {
    if (!post?.id) return;
    readingStartedAt.current = Date.now();
    trackEngagement.mutate({
      postId: post.id,
      eventType: "view",
      language,
    });

    return () => {
      if (readingStartedAt.current) {
        const durationSeconds = Math.round((Date.now() - readingStartedAt.current) / 1000);
        if (durationSeconds > 0) {
          trackEngagement.mutate({
            postId: post.id,
            eventType: "read_time",
            language,
            durationSeconds,
          });
        }
      }
    };
  }, [post?.id, language]);

  // Set SEO meta tags when post loads
  useEffect(() => {
    if (!post) return;

    const baseUrl = `${window.location.origin}/blog/${post.slug}`;
    const keywords = getLanguageKeywords(language, [
      post.title,
    ]);

    setMetaTags({
      title: `${post.title} | My Blog`,
      description: post.excerpt || post.content?.substring(0, 160) || "",
      keywords,
      author: "My Blog",
      image: post.featuredImageUrl || undefined,
      url: baseUrl,
      type: "article",
      publishedDate: post.publishedAt?.toISOString(),
      modifiedDate: post.updatedAt?.toISOString(),
      language,
    });

    setHrefLangLinks(baseUrl);

    const schema = generateBlogPostSchema({
      title: post.title,
      description: post.excerpt || post.content?.substring(0, 160) || "",
      content: post.content,
      author: "My Blog",
      publishedDate: post.publishedAt?.toISOString() || new Date().toISOString(),
      modifiedDate: post.updatedAt?.toISOString(),
      image: post.featuredImageUrl || undefined,
      url: baseUrl,
      language,
    });
    setStructuredData(schema);
  }, [post, language]);

  if (!params?.slug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/20 dark:to-purple-950/20">
        <Navigation categories={categories} />
        <div className="container py-20 text-center">
          <p className="text-foreground/70">Post not found</p>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/blog/${post?.slug}`;
  const shareTitle = post?.title || "Check out this article";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-pink-950/40">
      <Navigation categories={categories} />

      {postLoading ? (
        <div className="container py-12">
          <Skeleton className="h-12 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-96 mb-8" />
          <Skeleton className="h-4 mb-2" />
          <Skeleton className="h-4 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : post ? (
        <>
          {/* Hero Section */}
          {post.featuredImageUrl && (
            <div className="w-full h-96 md:h-[500px] bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden relative">
              <img
                src={getOptimizedImageUrl(post.featuredImageUrl, { width: 1200, quality: 80 })}
                alt={post.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          )}

          {/* Breadcrumb Navigation */}
          <div className="container-narrow py-4">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title, current: true },
              ]}
            />
          </div>

          {/* Main Content */}
          <article className="container-narrow py-12 md:py-16">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">{post.title}</h1>

              {/* FEATURE 1: Author Info Card */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {post?.authorId ? String(post.authorId).charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">By Author</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Published {post?.publishedAt ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true }) : 'Recently'}</p>
                  </div>
                </div>
              </div>

              {/* FEATURE 2: Reading Time + Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm mb-6 pb-6 border-b-2 border-gradient-to-r from-blue-300 to-purple-300 dark:border-blue-700">
                <span className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 rounded-full text-amber-700 dark:text-amber-300 font-semibold">
                  <ReadingTime content={post.content} />
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/40 rounded-full text-green-700 dark:text-green-300 font-semibold">
                  <Calendar className="w-4 h-4" />
                  {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-pink-100 dark:bg-pink-900/40 rounded-full text-pink-700 dark:text-pink-300 font-semibold">
                  <User className="w-4 h-4" />
                  By Author
                </span>
              </div>
            </header>

            {/* Layout with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* FEATURE 3: Table of Contents */}
                {post.content && post.content.length > 2000 && (
                  <div className="mb-8 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border-2 border-amber-300 dark:border-amber-700 shadow-md">
                    <TableOfContents content={post.content} className="text-amber-900 dark:text-amber-100" />
                  </div>
                )}

                {/* Content */}
                <div className="prose dark:prose-invert max-w-none mb-12">
                  <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    className="prose dark:prose-invert"
                  />
                </div>

                {/* Social Share */}
                <div className="py-8 border-t-2 border-b-2 border-gradient-to-r from-pink-300 to-rose-300 dark:border-pink-700 mb-12 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    Share this article
                  </h3>
                  <EnhancedSocialShare postId={post.id} title={shareTitle} url={shareUrl} excerpt={post.excerpt || ''} />
                </div>

                {/* FEATURE 4: Post Rating */}
                <div className="mb-12 p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Did you find this helpful?
                  </h3>
                  <PostRating postId={post.id} initialLikes={0} />
                </div>

                {/* FEATURE 5: Comments Section */}
                <section className="mb-12 p-6 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 rounded-lg border-2 border-purple-300 dark:border-purple-700 shadow-md">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    Comments ({comments?.length || 0})
                  </h2>
                  <CommentSection
                    postId={post?.id || 0}
                    comments={(comments || []).map((c) => ({
                      id: c.id,
                      content: c.content,
                      authorName: "Anonymous",
                      rating: 5,
                      createdAt: c.createdAt,
                      approved: c.approved as "approved" | "pending" | "rejected",
                    }))}
                    isLoading={commentsLoading}
                    onCommentSubmit={async (content, rating) => {
                      if (post?.id && isAuthenticated) {
                        await new Promise((resolve) => {
                          createCommentMutation.mutate(
                            {
                              postId: post.id,
                              content,
                            },
                            {
                              onSuccess: () => {
                                setCommentText("");
                                resolve(undefined);
                              },
                            }
                          );
                        });
                      } else if (!isAuthenticated) {
                        window.location.href = getLoginUrl();
                      }
                    }}
                    onCommentDelete={async (commentId) => {
                      toast.error("Delete functionality coming soon");
                    }}
                  />
                </section>

                {/* FEATURE 6: Newsletter Subscription */}
                <section className="mb-12 p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 rounded-lg text-white shadow-xl border-2 border-indigo-400 dark:border-indigo-600">
                  <h2 className="text-2xl font-bold mb-4">📧 Subscribe to Our Newsletter</h2>
                  <p className="mb-6 text-indigo-100">Get the latest articles delivered to your inbox every week.</p>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-indigo-300 dark:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button className="bg-white text-indigo-600 hover:bg-indigo-50 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700 font-semibold px-6 border-2 border-white dark:border-gray-700">
                      Subscribe
                    </Button>
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1 space-y-6">
                {/* FEATURE 7: Popular Posts Widget */}
                <div className="bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40 border-2 border-cyan-300 dark:border-cyan-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    🔥 Popular Posts
                  </h3>
                  <PopularPosts limit={5} />
                </div>

                {/* FEATURE 8: Tag Cloud Widget */}
                <div className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 border-2 border-pink-300 dark:border-pink-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    🏷️ Popular Tags
                  </h3>
                  <TagCloud />
                </div>

                {/* Bonus: Quick Stats */}
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/40 dark:to-yellow-900/40 border-2 border-orange-300 dark:border-orange-700 rounded-lg p-6 shadow-lg">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">📊 Article Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Views</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">{post.viewCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Comments</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">{comments?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Reading Time</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">{Math.ceil((post.content?.length || 0) / 200)} min</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </article>
        </>
      ) : (
        <div className="container py-20 text-center">
          <p className="text-foreground/70 text-lg">Post not found</p>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 border-t-4 border-gradient-to-r from-blue-500 to-purple-500 py-12 mt-12">
        <div className="container text-center text-sm text-gray-300">
          <p>&copy; 2026 My Blog. All rights reserved. ✨</p>
        </div>
      </footer>
    </div>
  );
}
