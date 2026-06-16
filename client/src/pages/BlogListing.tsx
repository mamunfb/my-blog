import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { Search, Calendar, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function BlogListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const { data: categories } = trpc.blog.getAllCategories.useQuery();
  const { data: latestPosts, isLoading } = trpc.blog.getLatestPosts.useQuery({
    limit: 12,
    offset: page * 12,
  });
  const { data: searchResults, isLoading: searchLoading } =
    trpc.blog.searchPosts.useQuery(
      { query: searchQuery, limit: 50 },
      { enabled: searchQuery.length > 0 }
    );

  const displayPosts = useMemo(() => {
    let posts = searchQuery.length > 0 ? searchResults : latestPosts;

    if (!posts) return [];

    if (selectedCategory) {
      posts = posts.filter((p) => p.categoryId === selectedCategory);
    }

    return posts;
  }, [searchQuery, selectedCategory, latestPosts, searchResults]);

  const isLoading_ = searchQuery.length > 0 ? searchLoading : isLoading;

  return (
    <div className="min-h-screen bg-background">
      <Navigation categories={categories} />

      {/* Header */}
      <section className="bg-gradient-to-br from-card to-muted/50 border-b border-border py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Articles</h1>
          <p className="text-foreground/70 text-lg">
            Discover our complete collection of articles, guides, and stories
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-card border-b border-border sticky top-16 z-40">
        <div className="container py-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="container">
          {isLoading_ ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="post-card">
                  <Skeleton className="h-6 mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : displayPosts && displayPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayPosts.map((post) => (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="post-card group flex flex-col"
                  >
                    {post.featuredImageUrl && (
                      <div className="mb-4 h-40 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={post.featuredImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-foreground/70 text-sm mb-4 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-foreground/60 pt-4 border-t border-border">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.viewCount}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {/* Pagination */}
              {!searchQuery && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-foreground/70">Page {page + 1}</span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={!latestPosts || latestPosts.length < 12}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/70 text-lg">
                No articles found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container text-center text-sm text-foreground/60">
          <p>&copy; 2026 My Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
