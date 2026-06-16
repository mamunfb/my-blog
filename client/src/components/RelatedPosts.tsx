import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: Date;
  categoryId: number | null;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  currentPostId: number;
}

export default function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
  const [, navigate] = useLocation();

  // Filter out current post and get first 3
  const relatedPosts = posts
    .filter((p) => p.id !== currentPostId)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h3 className="text-2xl font-bold mb-8">Related Articles</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <article
            key={post.id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate(`/blog/${post.slug}`)}
          >
            <h4 className="font-bold text-lg mb-3 group-hover:text-accent transition-colors line-clamp-2">
              {post.title}
            </h4>

            {post.excerpt && (
              <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-foreground/60">
              <span>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-accent hover:text-accent"
              >
                Read →
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
