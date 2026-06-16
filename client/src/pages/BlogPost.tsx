import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Calendar,
  User,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [commentText, setCommentText] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  const readingTime = post
    ? Math.ceil(post.content.split(/\s+/).length / 200)
    : 0;

  const shareUrl = `${window.location.origin}/blog/${post?.slug}`;
  const shareTitle = post?.title || "Check out this article";

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    const shareLinks: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      copy: "",
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } else if (shareLinks[platform]) {
      window.open(shareLinks[platform], "_blank", "width=600,height=400");
    }
  };

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
                <span className="reading-time">{readingTime} min read</span>
              </div>
            </header>

            {/* Content */}
            <div className="prose mb-12">
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="prose"
              />
            </div>

            {/* Social Share */}
            <div className="py-8 border-t border-b border-border mb-12">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Share this article</span>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>

                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          handleShare("twitter");
                          setShowShareMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 border-b border-border"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </button>
                      <button
                        onClick={() => {
                          handleShare("facebook");
                          setShowShareMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 border-b border-border"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </button>
                      <button
                        onClick={() => {
                          handleShare("linkedin");
                          setShowShareMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 border-b border-border"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => {
                          handleShare("copy");
                          setShowShareMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
