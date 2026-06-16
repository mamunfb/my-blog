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
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguageTracking } from "@/hooks/useLanguageTracking";
import { useTranslation } from "@/contexts/TranslationContext";
import Breadcrumb from "@/components/Breadcrumb";
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
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background">
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
            <div className="w-full h-96 md:h-[500px] bg-muted overflow-hidden">
              <img
                src={post.featuredImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
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
              <h1 className="text-5xl font-bold mb-4">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-foreground/70 mb-6 pb-6 border-b border-border">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  By Author
                </span>
                <ReadingTime content={post.content} />
              </div>
            </header>

            {/* Layout with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Table of Contents */}
                {post.content && post.content.length > 2000 && (
                  <TableOfContents content={post.content} className="mb-8" />
                )}

                {/* Content */}
                <div className="prose dark:prose-invert max-w-none mb-12">
                  <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    className="prose dark:prose-invert"
                  />
                </div>

                {/* Social Share */}
                <div className="py-8 border-t border-b border-border mb-12">
                  <EnhancedSocialShare title={shareTitle} url={shareUrl} excerpt={post.excerpt || ''} />
                </div>

                {/* Post Rating */}
                <div className="mb-12">
                  <PostRating postId={post.id} initialLikes={0} />
                </div>

                {/* Comments Section */}
                <section className="mb-12">
                  <h2 className="text-3xl font-bold mb-8">Comments</h2>

                  {isAuthenticated ? (
                    <div className="bg-card border border-border rounded-lg p-6 mb-8">
                      <h3 className="font-semibold mb-4">Leave a comment</h3>
                      <Textarea
                        placeholder="Share your thoughts..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="mb-4"
                        rows={4}
                      />
                      <Button
                        disabled={!commentText.trim() || createCommentMutation.isPending}
                        onClick={() => {
                          if (post?.id) {
                            createCommentMutation.mutate({
                              postId: post.id,
                              content: commentText,
                            });
                          }
                        }}
                      >
                        {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-muted border border-border rounded-lg p-6 mb-8 text-center">
                      <p className="text-foreground/70 mb-4">
                        Sign in to leave a comment
                      </p>
                      <a href={getLoginUrl()}>
                        <Button>Login to Comment</Button>
                      </a>
                    </div>
                  )}

                  {/* Comments List */}
                  <div className="space-y-6">
                    {commentsLoading ? (
                      <Skeleton className="h-24" />
                    ) : comments && comments.length > 0 ? (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-card border border-border rounded-lg p-6"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold">Anonymous</span>
                            <span className="text-sm text-foreground/60">
                              {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="text-foreground/80">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-foreground/70 text-center py-8">
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    )}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                {/* Popular Posts Widget */}
                <div className="bg-card border border-border rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4">Popular Posts</h3>
                  <PopularPosts limit={5} />
                </div>

                {/* Tag Cloud */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Tags</h3>
                  <TagCloud />
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
      <footer className="bg-card border-t border-border py-12 mt-12">
        <div className="container text-center text-sm text-foreground/60">
          <p>&copy; 2026 My Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
