import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";

export default function AuthorProfile() {
  const [match, params] = useRoute("/author/:id");
  const [, navigate] = useLocation();
  const authorId = params?.id ? parseInt(params.id) : null;

  const { data: posts = [], isLoading } = trpc.blog.getPostsByAuthor.useQuery(
    { authorId: authorId || 0 },
    { enabled: !!authorId }
  );

  if (!match) {
    return null;
  }

  if (!authorId) {
    return (
      <div className="container py-12">
        <p className="text-foreground/70">Author not found</p>
      </div>
    );
  }

  // Get author info from first post or use placeholder
  const authorName = posts[0] ? "Author" : "Unknown Author";

  return (
    <div className="min-h-screen bg-background">
      {/* Author Header */}
      <div className="bg-gradient-to-b from-accent/10 to-background border-b border-border">
        <div className="container py-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-3xl font-bold">
              {authorName?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{authorName}</h1>
              <p className="text-foreground/70">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>

          <p className="text-lg text-foreground/80 max-w-2xl">Posts by this author</p>
        </div>
      </div>

      {/* Posts */}
      <div className="container py-12">
        <h2 className="text-3xl font-bold mb-8">Published Posts</h2>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <Skeleton className="h-6 mb-4 w-3/4" />
                <Skeleton className="h-4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  {post.categoryId && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                      Category
                    </span>
                  )}
                </div>

                {post.excerpt && (
                  <p className="text-foreground/70 mb-4 line-clamp-2">{post.excerpt}</p>
                )}

                <div className="flex items-center justify-between text-sm text-foreground/60">
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                  <Button variant="outline" size="sm">
                    Read More →
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-foreground/70 mb-4">No posts published yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
