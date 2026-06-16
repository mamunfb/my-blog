import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { Search, Calendar, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BlogListing() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
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

    // Sort posts
    const sorted = [...posts];
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "popular") {
      sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    }

    return sorted;
  }, [searchQuery, selectedCategory, latestPosts, searchResults, sortBy]);

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

            {/* Category Filter and Sort */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-wrap gap-2 flex-1">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Button>
                {categories?.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container py-12">
        {isLoading_ ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <Skeleton className="h-6 mb-4 w-3/4" />
                <Skeleton className="h-4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : displayPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-foreground/60">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.viewCount || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4">
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
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70 text-lg">
              No articles found. Try adjusting your search or filters.
            </p>
          </div>
        )}
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
